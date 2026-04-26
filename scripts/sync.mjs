// Schooler → Supabase sync script (Node.js, no bundler needed)
const SCHOOLER_BASE = 'https://api.schooler.biz'
const SUPABASE_URL = 'https://cnauteihwxwqmpwraxpv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuYXV0ZWlod3h3cW1wd3JheHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDAzMTIsImV4cCI6MjA5MjUxNjMxMn0.GJiD608kTVrw_4orGn8dQq-pEmJ6g8nyudY4g2Q58Uc'

const SCHOOLER_CREDS = {
  grant_type: 'password',
  client_id: '-22zSjJdNpbMvte6AKADrACPhxFx7lDA1mlZ3YWdQnQ',
  client_secret: 'HWfkxWiLR9Bh6Tid9Xh-IrHgqDyhpcZyHIZjeUNuSf4',
  user_id: 'achrayut@outlook.co.il',
  user_secret: 'c1eca983f4e669d0a5ed5eeee709f1b4',
}

// ── Auth ────────────────────────────────────────────────────────────────────
async function getSchoolerToken() {
  const res = await fetch(`${SCHOOLER_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(SCHOOLER_CREDS),
  })
  const d = await res.json()
  if (!d.access_token) throw new Error('Schooler auth failed: ' + JSON.stringify(d))
  return d.access_token
}

async function schoolerGet(token, path, params = {}) {
  const url = new URL(`${SCHOOLER_BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Schooler ${path}: ${res.status}`)
  return res.json()
}

// ── Supabase REST ────────────────────────────────────────────────────────────
async function sbUpsert(table, rows, onConflict) {
  if (!rows.length) return { count: 0 }
  const url = `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase upsert ${table}: ${err}`)
  }
  const data = await res.json()
  return { count: data.length, data }
}

async function sbSelect(table, filter) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  Object.entries(filter).forEach(([k, v]) => url.searchParams.set(k, `eq.${v}`))
  url.searchParams.set('select', 'id')
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  })
  const data = await res.json()
  return data[0] || null
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔑 Getting Schooler token...')
  const token = await getSchoolerToken()
  console.log('✓ Token OK\n')

  // 1. Courses
  console.log('📚 Fetching courses...')
  const { data: schoolerCourses } = await schoolerGet(token, '/api/v1/courses', { page: 1, per_page: 200 })
  console.log(`  Found ${schoolerCourses.length} courses`)

  const courseRows = schoolerCourses.map(c => ({
    schooler_id: c.id,
    title: c.course_name,
    description: c.course_description || null,
    status: c.course_status === 'published' ? 'published' : 'draft',
    price: c.price ?? 0,
    teacher_name: c.teacher_name || null,
    course_link: c.course_link || null,
  }))

  const { count: cCount } = await sbUpsert('courses', courseRows, 'schooler_id')
  console.log(`  ✓ Upserted ${cCount} courses\n`)

  let totalLessons = 0
  let totalStudents = 0
  let totalEnrollments = 0
  let totalChapters = 0

  for (let i = 0; i < schoolerCourses.length; i++) {
    const sc = schoolerCourses[i]
    process.stdout.write(`[${i + 1}/${schoolerCourses.length}] ${sc.course_name}\n`)

    const courseRow = await sbSelect('courses', { schooler_id: sc.id })
    if (!courseRow) { console.log('  ⚠ course not found in DB, skipping'); continue }
    const courseId = courseRow.id

    // 2. Lessons
    try {
      const { data: lessonsData } = await schoolerGet(token, `/api/v1/courses/${sc.id}/lessons`, { per_page: 500 })
      const lessons = lessonsData?.lessons ?? []

      // Chapters
      const chapterMap = {}
      const seenChapters = new Set()
      const uniqueChapters = []
      for (const l of lessons) {
        if (l.chapter_id && !seenChapters.has(l.chapter_id)) {
          seenChapters.add(l.chapter_id)
          uniqueChapters.push({
            schooler_id: l.chapter_id,
            course_id: courseId,
            title: l.chapter_name || `פרק ${l.chapter_id}`,
            order_index: l.chapter_id,
          })
        }
      }
      if (uniqueChapters.length) {
        const { data: chRows } = await sbUpsert('chapters', uniqueChapters, 'schooler_id')
        for (const ch of chRows) chapterMap[ch.schooler_id] = ch.id
        totalChapters += chRows.length
      }

      const lessonRows = lessons.map(l => ({
        schooler_id: l.lesson_id,
        course_id: courseId,
        chapter_id: l.chapter_id ? chapterMap[l.chapter_id] : null,
        title: l.lesson_name,
        lesson_link: l.lesson_link || null,
        content: l.lesson_notes || null,
        type: l.type_of_lesson || 'video',
        is_free: l.free_lesson ?? false,
        order_index: l.lesson_id,
      }))

      if (lessonRows.length) {
        const { count: lCount } = await sbUpsert('lessons', lessonRows, 'schooler_id')
        totalLessons += lCount
        process.stdout.write(`  ✓ ${lCount} lessons`)
      }
    } catch (e) {
      process.stdout.write(`  ⚠ lessons error: ${e.message}`)
    }

    // 3. Students + Enrollments
    try {
      const { data: studData } = await schoolerGet(token, `/api/v1/courses/${sc.id}/students`, { page: 1, per_page: 500 })
      const students = studData?.students ?? []

      // Dedup by email (same student might appear twice in Schooler data)
      const seenEmails = new Set()
      const studentRows = []
      for (const s of students) {
        if (!s.student_email) continue
        const email = s.student_email.toLowerCase().trim()
        if (seenEmails.has(email)) continue
        seenEmails.add(email)
        studentRows.push({
          schooler_id: s.student_id,
          full_name: s.student_name || '',
          email,
          phone: s.student_phone || null,
        })
      }

      // Upsert by email (handles cross-course duplicates)
      let insertedStudents = []
      if (studentRows.length) {
        const { data } = await sbUpsert('students', studentRows, 'email')
        insertedStudents = data || []
        totalStudents += insertedStudents.length
      }

      // Build enrollment rows using email→id map
      const emailToId = {}
      for (const s of insertedStudents) emailToId[s.email] = s.id

      const enrollmentRows = students
        .filter(s => s.student_email && emailToId[s.student_email.toLowerCase().trim()])
        .map(s => ({
          student_id: emailToId[s.student_email.toLowerCase().trim()],
          course_id: courseId,
          unique_link: s.unique_link || null,
        }))
        .filter((e, i, arr) => arr.findIndex(x => x.student_id === e.student_id) === i) // dedup

      if (enrollmentRows.length) {
        const { count: eCount } = await sbUpsert('enrollments', enrollmentRows, 'student_id,course_id')
        totalEnrollments += eCount
        process.stdout.write(`, ${insertedStudents.length} students, ${eCount} enrollments\n`)
      } else {
        process.stdout.write('\n')
      }
    } catch (e) {
      process.stdout.write(`  ⚠ students error: ${e.message}\n`)
    }
  }

  console.log('\n═══════════════════════════════')
  console.log(`✅ Sync complete!`)
  console.log(`   Courses:     ${cCount}`)
  console.log(`   Chapters:    ${totalChapters}`)
  console.log(`   Lessons:     ${totalLessons}`)
  console.log(`   Students:    ${totalStudents}`)
  console.log(`   Enrollments: ${totalEnrollments}`)
  console.log('═══════════════════════════════')
}

main().catch(e => { console.error('FATAL:', e); process.exit(1) })
