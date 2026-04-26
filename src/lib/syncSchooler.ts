import { supabase } from '@/integrations/supabase/client'
import {
  fetchCourses,
  fetchCourseStudents,
  fetchCourseLessons,
  type SchoolerCourse,
} from './schooler'

export interface SyncProgress {
  stage: string
  done: number
  total: number
  errors: string[]
}

export async function syncSchoolerToSupabase(
  onProgress: (p: SyncProgress) => void
): Promise<{ courses: number; students: number; lessons: number; enrollments: number }> {
  const db = supabase as any
  const errors: string[] = []
  let coursesCount = 0
  let studentsCount = 0
  let lessonsCount = 0
  let enrollmentsCount = 0

  // ── 1. Fetch all courses from Schooler ──────────────────────────────────
  onProgress({ stage: 'מושך קורסים מ-Schooler...', done: 0, total: 0, errors })
  const schoolerCourses: SchoolerCourse[] = await fetchCourses(1, 200)

  // ── 2. Upsert courses into Supabase ─────────────────────────────────────
  onProgress({ stage: 'שומר קורסים...', done: 0, total: schoolerCourses.length, errors })

  for (let i = 0; i < schoolerCourses.length; i++) {
    const sc = schoolerCourses[i]
    onProgress({ stage: 'שומר קורסים...', done: i, total: schoolerCourses.length, errors })

    const { error } = await db.from('courses').upsert({
      schooler_id: sc.id,
      title: sc.course_name,
      description: sc.course_description || null,
      status: sc.course_status === 'published' ? 'published' : 'draft',
      price: sc.price ?? 0,
      teacher_name: sc.teacher_name || null,
      course_link: sc.course_link || null,
    }, { onConflict: 'schooler_id' })

    if (error) {
      errors.push(`קורס ${sc.course_name}: ${error.message}`)
    } else {
      coursesCount++
    }
  }

  // ── 3. For each course: fetch lessons + students ─────────────────────────
  for (let i = 0; i < schoolerCourses.length; i++) {
    const sc = schoolerCourses[i]
    onProgress({
      stage: `מושך שיעורים ותלמידים: ${sc.course_name}`,
      done: i + 1,
      total: schoolerCourses.length,
      errors,
    })

    // Get course UUID from Supabase
    const { data: courseRows } = await db
      .from('courses')
      .select('id')
      .eq('schooler_id', sc.id)
      .single()

    if (!courseRows) continue
    const courseId = courseRows.id

    // ── Lessons ────────────────────────────────────────────────────────────
    try {
      const lessonsData = await fetchCourseLessons(sc.id)
      const lessons = lessonsData.lessons ?? []

      // Collect unique chapters
      const chaptersMap = new Map<number, string>()
      for (const lesson of lessons) {
        if (lesson.chapter_id && !chaptersMap.has(lesson.chapter_id)) {
          // Upsert chapter
          const { data: chRow } = await db.from('chapters').upsert({
            schooler_id: lesson.chapter_id,
            course_id: courseId,
            title: lesson.chapter_name || `פרק ${lesson.chapter_id}`,
            order_index: lesson.chapter_id,
          }, { onConflict: 'schooler_id' }).select('id').single()

          if (chRow) chaptersMap.set(lesson.chapter_id, chRow.id)
        }
      }

      // Upsert lessons
      for (const lesson of lessons) {
        const chapterId = lesson.chapter_id ? chaptersMap.get(lesson.chapter_id) : null

        const { error: lErr } = await db.from('lessons').upsert({
          schooler_id: lesson.lesson_id,
          course_id: courseId,
          chapter_id: chapterId ?? null,
          title: lesson.lesson_name,
          lesson_link: lesson.lesson_link || null,
          content: lesson.lesson_notes || null,
          type: lesson.type_of_lesson || 'video',
          is_free: lesson.free_lesson ?? false,
          order_index: lesson.lesson_id,
        }, { onConflict: 'schooler_id' })

        if (lErr) {
          errors.push(`שיעור ${lesson.lesson_name}: ${lErr.message}`)
        } else {
          lessonsCount++
        }
      }
    } catch (e: any) {
      errors.push(`שיעורים ${sc.course_name}: ${e.message}`)
    }

    // ── Students + Enrollments ─────────────────────────────────────────────
    try {
      const studData = await fetchCourseStudents(sc.id, 1, 500)
      const students = studData.students ?? []

      for (const st of students) {
        if (!st.student_email) continue

        // Upsert student
        const { data: stRow, error: stErr } = await db.from('students').upsert({
          schooler_id: st.student_id,
          full_name: st.student_name || '',
          email: st.student_email.toLowerCase().trim(),
          phone: st.student_phone || null,
        }, { onConflict: 'schooler_id' }).select('id').single()

        if (stErr || !stRow) {
          // Try by email (student might exist without schooler_id)
          const { data: existing } = await db
            .from('students')
            .select('id')
            .eq('email', st.student_email.toLowerCase().trim())
            .single()

          if (existing) {
            // Update schooler_id if missing
            await db.from('students')
              .update({ schooler_id: st.student_id, phone: st.student_phone || null })
              .eq('id', existing.id)

            // Upsert enrollment
            await db.from('enrollments').upsert({
              student_id: existing.id,
              course_id: courseId,
              unique_link: st.unique_link || null,
            }, { onConflict: 'student_id,course_id' })
            enrollmentsCount++
          } else {
            errors.push(`תלמיד ${st.student_email}: ${stErr?.message}`)
          }
          continue
        }

        studentsCount++

        // Upsert enrollment
        const { error: enErr } = await db.from('enrollments').upsert({
          student_id: stRow.id,
          course_id: courseId,
          unique_link: st.unique_link || null,
        }, { onConflict: 'student_id,course_id' })

        if (!enErr) enrollmentsCount++
      }
    } catch (e: any) {
      errors.push(`תלמידים ${sc.course_name}: ${e.message}`)
    }
  }

  onProgress({ stage: 'סנכרון הושלם', done: schoolerCourses.length, total: schoolerCourses.length, errors })

  return { courses: coursesCount, students: studentsCount, lessons: lessonsCount, enrollments: enrollmentsCount }
}
