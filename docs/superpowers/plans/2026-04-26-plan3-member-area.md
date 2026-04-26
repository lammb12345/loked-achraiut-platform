# Plan 3: Member Area — לוקחים אחריות

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full member area — enhanced courses pages + full club dashboard with videos, events, Q&A.

**Architecture:** Courses pages keep existing data-fetching logic, upgrade UI only. Club page is rebuilt from scratch with 3 new Supabase tables (club_videos, club_events, club_questions) and a tabbed layout using Shadcn Tabs.

**Tech Stack:** React 19, TypeScript, Tailwind v3, Shadcn v4 (base-ui), Supabase JS v2, lucide-react, RTL (dir="rtl")

**Important constraints:**
- No `asChild` on Button — use `buttonVariants()` + `<a>` or `<Link>`
- No Accordion `type="single"` — existing custom toggle pattern is fine
- `supabase as any` pattern for new tables (types.ts not regenerated)
- All UI is RTL
- No gamification DB tables — show progress stats from existing `lesson_progress` table
- Push command: `TOKEN=$(gh auth token) && git push "https://lammb12345:${TOKEN}@github.com/lammb12345/loked-achraiut-platform.git" master:main`

---

## File Map

| Status | File | Change |
|--------|------|--------|
| Create | `src/pages/member/MemberClub.tsx` | Full rebuild — tabbed: videos, events, Q&A |
| Modify | `src/pages/member/MemberCourses.tsx` | Visual polish — keep all logic |
| Modify | `src/pages/member/MemberCourseCurriculum.tsx` | Visual polish — keep all logic |
| Migration | Supabase SQL | club_videos, club_events, club_questions tables |

---

## Task 1: Supabase Migration — club tables

**Files:**
- Migration via Supabase MCP (`mcp__supabase__execute_sql`)

- [ ] **Step 1: Run SQL migration**

Use `mcp__supabase__execute_sql` with project_id `cnauteihwxwqmpwraxpv`:

```sql
-- club_videos
CREATE TABLE IF NOT EXISTS club_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  category text NOT NULL DEFAULT 'weekly',
  guest_name text,
  duration_minutes integer,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE club_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "club_videos_select" ON club_videos
  FOR SELECT USING (
    is_published = true AND (
      EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND role IN ('club_member', 'admin')
      )
    )
  );

CREATE POLICY "club_videos_admin" ON club_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- club_events
CREATE TABLE IF NOT EXISTS club_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  meeting_link text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE club_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "club_events_select" ON club_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('club_member', 'admin')
    )
  );

CREATE POLICY "club_events_admin" ON club_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- club_questions
CREATE TABLE IF NOT EXISTS club_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  answer_text text,
  is_answered boolean NOT NULL DEFAULT false,
  is_anonymous boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE club_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "club_questions_own" ON club_questions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "club_questions_insert" ON club_questions
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('club_member', 'admin')
    )
  );

CREATE POLICY "club_questions_admin" ON club_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

- [ ] **Step 2: Verify tables created**

Run via `mcp__supabase__execute_sql`:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('club_videos', 'club_events', 'club_questions');
```

Expected: 3 rows returned.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "הוסף טבלאות club_videos, club_events, club_questions עם RLS"
```

---

## Task 2: Enhance MemberCourses.tsx

**Files:**
- Modify: `src/pages/member/MemberCourses.tsx`

Keep all existing data-fetching logic (getStudentId, load, progressMap). Replace only the JSX card rendering with upgraded visuals.

- [ ] **Step 1: Replace MemberCourses.tsx**

Full file content — identical logic, upgraded UI:

```tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BookOpen, ExternalLink, AlertCircle, CheckCircle2, PlayCircle, ArrowLeft } from 'lucide-react'
import MemberLayout from '@/components/member/MemberLayout'

interface CourseProgress {
  completed: number
  total: number
}

interface EnrollmentRow {
  id: string
  course_id: string
  unique_link: string | null
  courses: {
    id: string
    title: string
    teacher_name: string | null
    image_url: string | null
    status: string | null
  } | null
}

export default function MemberCourses() {
  const { user } = useAuth()
  const db = supabase as any
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    load()
  }, [user?.id])

  async function getStudentId(): Promise<string | null> {
    const { data: s1 } = await db
      .from('students')
      .select('id')
      .eq('auth_user_id', user!.id)
      .single()
    if (s1?.id) return s1.id

    const { data: s2 } = await db
      .from('students')
      .select('id')
      .eq('email', user!.email!.toLowerCase())
      .single()
    return s2?.id ?? null
  }

  async function load() {
    try {
      const studentId = await getStudentId()
      if (!studentId) {
        setEnrollments([])
        setLoading(false)
        return
      }

      const { data: enrData, error: enrErr } = await db
        .from('enrollments')
        .select('id, course_id, unique_link, courses(id, title, teacher_name, image_url, status)')
        .eq('student_id', studentId)

      if (enrErr) throw enrErr
      const rows: EnrollmentRow[] = enrData ?? []
      setEnrollments(rows)

      const progressData: Record<string, CourseProgress> = {}
      for (const row of rows) {
        const courseId = row.course_id
        const { data: lessonIds } = await db
          .from('lessons')
          .select('id')
          .eq('course_id', courseId)

        const ids = (lessonIds ?? []).map((l: any) => l.id)
        const total = ids.length

        let completed = 0
        if (ids.length > 0) {
          const { data: prog } = await db
            .from('lesson_progress')
            .select('id')
            .eq('student_id', studentId)
            .in('lesson_id', ids)
          completed = (prog ?? []).length
        }

        progressData[courseId] = { completed, total }
      }
      setProgressMap(progressData)
    } catch {
      setError('שגיאה בטעינת הקורסים')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MemberLayout>
      <div className="p-6" dir="rtl">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">הקורסים שלי</h1>
            <p className="text-muted-foreground mt-1 text-sm">כל הקורסים שרשומים עבורך</p>
          </div>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-36 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-2 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {!loading && !error && enrollments.length === 0 && (
            <div className="bg-white border border-border rounded-2xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">לא נמצאו קורסים רשומים</p>
              <p className="text-sm text-muted-foreground mt-1">אם נרשמת לקורס, פנה אלינו</p>
            </div>
          )}

          {!loading && !error && enrollments.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrollments.map((enr, idx) => {
                const course = enr.courses
                if (!course) return null
                const prog = progressMap[enr.course_id]
                const pct = prog && prog.total > 0
                  ? Math.round((prog.completed / prog.total) * 100)
                  : 0
                const isComplete = pct === 100 && prog?.total > 0

                return (
                  <div
                    key={enr.id}
                    className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    {/* Image / Gradient header */}
                    <div className="relative h-36 bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center overflow-hidden">
                      {course.image_url ? (
                        <img
                          src={course.image_url}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <BookOpen className="w-12 h-12 text-primary/40" />
                      )}
                      {isComplete && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                          <CheckCircle2 className="w-3 h-3" />
                          הושלם
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div>
                        <h3 className="font-bold text-primary text-lg leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        {course.teacher_name && (
                          <p className="text-sm text-muted-foreground mt-0.5">{course.teacher_name}</p>
                        )}
                      </div>

                      {prog && prog.total > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{prog.completed} / {prog.total} שיעורים</span>
                            <span className="font-medium">{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                isComplete
                                  ? 'bg-green-500'
                                  : 'bg-gradient-to-r from-primary to-secondary'
                              )}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-2 mt-auto pt-1">
                        <Link
                          to={`/member/course/${course.id}`}
                          className={cn(
                            buttonVariants({ size: 'sm' }),
                            'w-full justify-center gap-2'
                          )}
                        >
                          <PlayCircle className="w-4 h-4" />
                          {pct > 0 ? 'המשך לקורס' : 'כניסה לקורס'}
                        </Link>
                        {enr.unique_link && (
                          <a
                            href={enr.unique_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({ variant: 'outline', size: 'sm' }),
                              'w-full justify-center gap-1.5'
                            )}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            כניסה ישירה
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </MemberLayout>
  )
}
```

- [ ] **Step 2: Build and verify no errors**

```bash
cd "C:\Users\saarj\Downloads\loked-achraiut-platform" && npm run build 2>&1 | tail -20
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/member/MemberCourses.tsx
git commit -m "שיפור UI דף הקורסים - אנימציות, כרטיסים משופרים, progress bar"
```

---

## Task 3: Enhance MemberCourseCurriculum.tsx

**Files:**
- Modify: `src/pages/member/MemberCourseCurriculum.tsx`

Keep all existing data-fetching and marking logic (getStudentId, load, markComplete, toggleChapter, openChapters). Upgrade chapter header to include mini progress bar. Upgrade lesson cards with cleaner layout.

- [ ] **Step 1: Replace MemberCourseCurriculum.tsx**

```tsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'
import { CheckCircle, PlayCircle, ChevronDown, ChevronUp, AlertCircle, ArrowRight } from 'lucide-react'
import MemberLayout from '@/components/member/MemberLayout'

interface Course {
  id: string
  title: string
  teacher_name: string | null
  image_url: string | null
}

interface Chapter {
  id: string
  title: string
  order_index: number
}

interface Lesson {
  id: string
  chapter_id: string
  title: string
  lesson_link: string | null
  order_index: number
}

const chapterGradients = [
  'from-blue-500/10 to-blue-600/5 border-blue-500/20',
  'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
  'from-amber-500/10 to-amber-600/5 border-amber-500/20',
  'from-purple-500/10 to-purple-600/5 border-purple-500/20',
  'from-rose-500/10 to-rose-600/5 border-rose-500/20',
  'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20',
]

const chapterAccents = [
  'text-blue-700 bg-blue-500/15',
  'text-emerald-700 bg-emerald-500/15',
  'text-amber-700 bg-amber-500/15',
  'text-purple-700 bg-purple-500/15',
  'text-rose-700 bg-rose-500/15',
  'text-cyan-700 bg-cyan-500/15',
]

export default function MemberCourseCurriculum() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user } = useAuth()
  const db = supabase as any

  const [course, setCourse] = useState<Course | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [studentId, setStudentId] = useState<string | null>(null)
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !courseId) return
    load()
  }, [user?.id, courseId])

  async function getStudentId(): Promise<string | null> {
    const { data: s1 } = await db
      .from('students')
      .select('id')
      .eq('auth_user_id', user!.id)
      .single()
    if (s1?.id) return s1.id

    const { data: s2 } = await db
      .from('students')
      .select('id')
      .eq('email', user!.email!.toLowerCase())
      .single()
    return s2?.id ?? null
  }

  async function load() {
    try {
      const sid = await getStudentId()
      setStudentId(sid)

      const [courseRes, chaptersRes, lessonsRes] = await Promise.all([
        db.from('courses').select('id, title, teacher_name, image_url').eq('id', courseId).single(),
        db.from('chapters').select('*').eq('course_id', courseId).order('order_index'),
        db.from('lessons').select('*').eq('course_id', courseId).order('chapter_id').order('order_index'),
      ])

      if (courseRes.error) throw courseRes.error
      setCourse(courseRes.data)
      setChapters(chaptersRes.data ?? [])
      const lessonList: Lesson[] = lessonsRes.data ?? []
      setLessons(lessonList)

      if (sid && lessonList.length > 0) {
        const { data: prog } = await db
          .from('lesson_progress')
          .select('lesson_id')
          .eq('student_id', sid)
        const ids = new Set<string>((prog ?? []).map((p: any) => p.lesson_id))
        setCompletedIds(ids)

        const chapterList: Chapter[] = chaptersRes.data ?? []
        for (const ch of chapterList) {
          const chLessons = lessonList.filter(l => l.chapter_id === ch.id)
          const allDone = chLessons.every(l => ids.has(l.id))
          if (!allDone || chLessons.length === 0) {
            setOpenChapters(new Set([ch.id]))
            break
          }
        }
      } else if ((chaptersRes.data ?? []).length > 0) {
        setOpenChapters(new Set([(chaptersRes.data[0] as Chapter).id]))
      }
    } catch {
      setError('שגיאה בטעינת הקורס')
    } finally {
      setLoading(false)
    }
  }

  async function markComplete(lessonId: string) {
    if (!studentId || completedIds.has(lessonId)) return
    await db.from('lesson_progress').upsert(
      { student_id: studentId, lesson_id: lessonId, completed_at: new Date().toISOString() },
      { onConflict: 'student_id,lesson_id' }
    )
    setCompletedIds(prev => new Set([...prev, lessonId]))
  }

  function toggleChapter(chapterId: string) {
    setOpenChapters(prev => {
      const next = new Set(prev)
      if (next.has(chapterId)) next.delete(chapterId)
      else next.add(chapterId)
      return next
    })
  }

  const totalLessons = lessons.length
  const completedCount = lessons.filter(l => completedIds.has(l.id)).length
  const overallPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <MemberLayout>
      <div className="p-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/member/courses"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לקורסים
          </Link>

          {loading && (
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-64" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-40" />
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {!loading && !error && course && (
            <>
              {/* Course header */}
              <div className="mb-8">
                <div className="flex items-start gap-4">
                  {course.image_url && (
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-primary">{course.title}</h1>
                    {course.teacher_name && (
                      <p className="text-muted-foreground mt-0.5">{course.teacher_name}</p>
                    )}
                  </div>
                </div>

                {totalLessons > 0 && (
                  <div className="mt-5 bg-white border border-border rounded-2xl p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{completedCount} / {totalLessons} שיעורים הושלמו</span>
                      <span className="font-semibold text-primary">{overallPct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          overallPct === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-primary to-secondary'
                        )}
                        style={{ width: `${overallPct}%` }}
                      />
                    </div>
                    {overallPct === 100 && (
                      <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        כל הכבוד! סיימת את הקורס
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Chapters */}
              <div className="space-y-4">
                {chapters.map((chapter, idx) => {
                  const chLessons = lessons.filter(l => l.chapter_id === chapter.id)
                  const chCompleted = chLessons.filter(l => completedIds.has(l.id)).length
                  const chPct = chLessons.length > 0 ? Math.round((chCompleted / chLessons.length) * 100) : 0
                  const isOpen = openChapters.has(chapter.id)
                  const isChDone = chLessons.length > 0 && chCompleted === chLessons.length
                  const gradient = chapterGradients[idx % chapterGradients.length]
                  const accent = chapterAccents[idx % chapterAccents.length]

                  return (
                    <div
                      key={chapter.id}
                      className={cn('rounded-2xl border bg-gradient-to-br overflow-hidden', gradient)}
                    >
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="w-full flex items-center gap-3 p-4 text-right hover:bg-black/5 transition-colors"
                      >
                        {/* Chapter number / done badge */}
                        <span className={cn(
                          'w-9 h-9 rounded-xl text-sm font-bold flex items-center justify-center shrink-0 border',
                          isChDone
                            ? 'bg-green-500 text-white border-green-500'
                            : cn(accent, 'border-current/30')
                        )}>
                          {isChDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </span>

                        <div className="flex-1 min-w-0 text-right">
                          <span className="font-semibold text-primary leading-snug block">{chapter.title}</span>
                          {chLessons.length > 0 && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 max-w-32 h-1.5 bg-black/10 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all',
                                    isChDone ? 'bg-green-500' : 'bg-primary/60'
                                  )}
                                  style={{ width: `${chPct}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{chCompleted}/{chLessons.length}</span>
                            </div>
                          )}
                        </div>

                        {isOpen
                          ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0 transition-transform" />
                          : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 transition-transform" />
                        }
                      </button>

                      {isOpen && chLessons.length > 0 && (
                        <div className="px-4 pb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {chLessons.map((lesson, lessonIdx) => {
                            const done = completedIds.has(lesson.id)
                            const hasLink = !!lesson.lesson_link

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => {
                                  if (hasLink) {
                                    window.open(lesson.lesson_link!, '_blank', 'noopener,noreferrer')
                                  }
                                  markComplete(lesson.id)
                                }}
                                style={{ animationDelay: `${lessonIdx * 40}ms` }}
                                className={cn(
                                  'bg-white rounded-xl p-4 flex flex-col gap-2 border transition-all duration-200',
                                  done
                                    ? 'border-green-500/40 bg-green-500/5'
                                    : 'border-border',
                                  hasLink
                                    ? 'cursor-pointer hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5'
                                    : 'cursor-default'
                                )}
                              >
                                <div className="flex items-start gap-2.5">
                                  {done
                                    ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    : <PlayCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                  }
                                  <span className="text-sm font-medium text-primary leading-snug">{lesson.title}</span>
                                </div>
                                {done && (
                                  <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full w-fit">
                                    הושלם ✓
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}

                {chapters.length === 0 && (
                  <div className="bg-white border border-border rounded-2xl p-8 text-center text-muted-foreground">
                    אין תכנים זמינים עדיין
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </MemberLayout>
  )
}
```

- [ ] **Step 2: Build**

```bash
cd "C:\Users\saarj\Downloads\loked-achraiut-platform" && npm run build 2>&1 | tail -20
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/member/MemberCourseCurriculum.tsx
git commit -m "שיפור UI דף קורס - כותרות פרק עם progress bar, כרטיסי שיעור משופרים"
```

---

## Task 4: Rebuild MemberClub.tsx

**Files:**
- Modify: `src/pages/member/MemberClub.tsx`

Full rebuild with 3 tabs: הקלטות (videos with search/filter + modal player), לוח מפגשים (events list), שאל שאלה (Q&A submit + my questions). Stats card shows lesson progress data.

- [ ] **Step 1: Replace MemberClub.tsx**

```tsx
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Video, Calendar, HelpCircle, Play, Clock, Search,
  CheckCircle2, Loader2, Send, BookOpen, X, ChevronLeft, ChevronRight,
} from 'lucide-react'
import MemberLayout from '@/components/member/MemberLayout'

const db = supabase as any

// --- Types ---

interface ClubVideo {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  category: string
  guest_name: string | null
  duration_minutes: number | null
  sort_order: number
  created_at: string
}

interface ClubEvent {
  id: string
  title: string
  description: string | null
  event_date: string
  duration_minutes: number
  meeting_link: string | null
}

interface ClubQuestion {
  id: string
  question_text: string
  answer_text: string | null
  is_answered: boolean
  created_at: string
}

interface Stats {
  enrolled: number
  lessonsCompleted: number
  totalLessons: number
}

// --- Helper ---

function formatDate(iso: string) {
  const d = new Date(iso)
  return {
    day: d.getDate(),
    weekday: d.toLocaleDateString('he-IL', { weekday: 'long' }),
    time: d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    full: d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
}

function getEmbedUrl(url: string): string {
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  const fileId = m ? m[1] : url
  return `https://drive.google.com/file/d/${fileId}/preview`
}

// --- Tab types ---

type Tab = 'videos' | 'events' | 'qa'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'videos', label: 'הקלטות', icon: <Video className="w-4 h-4" /> },
  { id: 'events', label: 'לוח מפגשים', icon: <Calendar className="w-4 h-4" /> },
  { id: 'qa', label: 'שאל שאלה', icon: <HelpCircle className="w-4 h-4" /> },
]

const VIDEO_CATEGORIES = [
  { id: 'all', label: 'הכל' },
  { id: 'weekly', label: 'לייבים שבועיים' },
  { id: 'guest', label: 'אורחים מיוחדים' },
  { id: 'mini', label: 'מיני-הדרכות' },
  { id: 'bonus', label: 'בונוסים' },
]

// --- Main component ---

export default function MemberClub() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'הורה יקר'

  const [tab, setTab] = useState<Tab>('videos')
  const [stats, setStats] = useState<Stats>({ enrolled: 0, lessonsCompleted: 0, totalLessons: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  // Videos state
  const [videos, setVideos] = useState<ClubVideo[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [videoSearch, setVideoSearch] = useState('')
  const [videoCategory, setVideoCategory] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState<ClubVideo | null>(null)

  // Events state
  const [events, setEvents] = useState<ClubEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsMonth, setEventsMonth] = useState(new Date())

  // Q&A state
  const [questions, setQuestions] = useState<ClubQuestion[]>([])
  const [qaLoading, setQaLoading] = useState(true)
  const [newQuestion, setNewQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return
    loadStats()
    loadVideos()
    loadEvents()
    loadQuestions()
  }, [user?.id])

  // ---- Loaders ----

  async function loadStats() {
    try {
      // student id
      const { data: s1 } = await db.from('students').select('id').eq('auth_user_id', user!.id).single()
      const { data: s2 } = s1?.id ? { data: null } : await db.from('students').select('id').eq('email', user!.email!.toLowerCase()).single()
      const studentId = s1?.id ?? s2?.id

      if (!studentId) return

      const { data: enr } = await db.from('enrollments').select('course_id').eq('student_id', studentId)
      const courseIds: string[] = (enr ?? []).map((e: any) => e.course_id)
      const enrolled = courseIds.length

      let totalLessons = 0
      let lessonsCompleted = 0

      if (courseIds.length > 0) {
        const { data: lessonIds } = await db.from('lessons').select('id').in('course_id', courseIds)
        const ids = (lessonIds ?? []).map((l: any) => l.id)
        totalLessons = ids.length

        if (ids.length > 0) {
          const { data: prog } = await db
            .from('lesson_progress')
            .select('id')
            .eq('student_id', studentId)
            .in('lesson_id', ids)
          lessonsCompleted = (prog ?? []).length
        }
      }

      setStats({ enrolled, lessonsCompleted, totalLessons })
    } finally {
      setStatsLoading(false)
    }
  }

  async function loadVideos() {
    try {
      const { data } = await db
        .from('club_videos')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
      setVideos(data ?? [])
    } finally {
      setVideosLoading(false)
    }
  }

  async function loadEvents() {
    try {
      const { data } = await db
        .from('club_events')
        .select('*')
        .order('event_date', { ascending: true })
      setEvents(data ?? [])
    } finally {
      setEventsLoading(false)
    }
  }

  async function loadQuestions() {
    try {
      const { data } = await db
        .from('club_questions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      setQuestions(data ?? [])
    } finally {
      setQaLoading(false)
    }
  }

  async function submitQuestion() {
    if (!newQuestion.trim() || !user) return
    setSubmitting(true)
    try {
      const { error } = await db.from('club_questions').insert({
        user_id: user.id,
        question_text: newQuestion.trim(),
      })
      if (error) throw error
      setNewQuestion('')
      toast.success('השאלה נשלחה בהצלחה! נענה בהקדם.')
      loadQuestions()
    } catch {
      toast.error('שגיאה בשליחת השאלה')
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Filtered videos ----

  const filteredVideos = videos.filter(v => {
    const matchSearch = v.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
      (v.description ?? '').toLowerCase().includes(videoSearch.toLowerCase()) ||
      (v.guest_name ?? '').toLowerCase().includes(videoSearch.toLowerCase())
    const matchCat = videoCategory === 'all' || v.category === videoCategory
    return matchSearch && matchCat
  })

  // ---- Events for selected month ----

  const monthEvents = events.filter(e => {
    const d = new Date(e.event_date)
    return d.getMonth() === eventsMonth.getMonth() && d.getFullYear() === eventsMonth.getFullYear()
  })
  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date())

  const navigateMonth = (dir: number) => {
    setEventsMonth(prev => {
      const d = new Date(prev)
      d.setMonth(d.getMonth() + dir)
      return d
    })
  }

  // ---- Stats card ----

  const progressPct = stats.totalLessons > 0
    ? Math.round((stats.lessonsCompleted / stats.totalLessons) * 100)
    : 0

  return (
    <MemberLayout>
      <div className="p-6" dir="rtl">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Welcome header */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-amber-900 mb-1">
              שלום {firstName}! ברוך הבא למועדון ההורים
            </h1>
            <p className="text-amber-700 text-sm">כאן תמצא הרצאות, מפגשים, ותמיכה של קהילה חמה</p>
          </div>

          {/* Stats cards */}
          {!statsLoading && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-border rounded-2xl p-4 text-center">
                <BookOpen className="w-6 h-6 text-primary mx-auto mb-1" />
                <div className="text-2xl font-bold text-primary">{stats.enrolled}</div>
                <div className="text-xs text-muted-foreground">קורסים רשומים</div>
              </div>
              <div className="bg-white border border-border rounded-2xl p-4 text-center">
                <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-green-600">{stats.lessonsCompleted}</div>
                <div className="text-xs text-muted-foreground">שיעורים הושלמו</div>
              </div>
              <div className="bg-white border border-border rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-secondary">{progressPct}%</div>
                <div className="text-xs text-muted-foreground mb-2">התקדמות כוללת</div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-border">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors',
                    tab === t.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-primary hover:bg-gray-50'
                  )}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-5">

              {/* === VIDEOS TAB === */}
              {tab === 'videos' && (
                <div className="space-y-5">
                  {/* Search + category filter */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="חיפוש הקלטה..."
                        value={videoSearch}
                        onChange={e => setVideoSearch(e.target.value)}
                        className="pr-9"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {VIDEO_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setVideoCategory(cat.id)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap',
                            videoCategory === cat.id
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border text-muted-foreground hover:border-primary/40'
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {videosLoading && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="rounded-xl overflow-hidden border border-border animate-pulse">
                          <div className="h-36 bg-gray-200" />
                          <div className="p-3 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!videosLoading && filteredVideos.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Video className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p className="font-medium">
                        {videos.length === 0 ? 'אין הקלטות זמינות עדיין' : 'לא נמצאו תוצאות'}
                      </p>
                    </div>
                  )}

                  {!videosLoading && filteredVideos.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredVideos.map(video => (
                        <div
                          key={video.id}
                          onClick={() => setSelectedVideo(video)}
                          className="group bg-white border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-200"
                        >
                          <div className="relative h-36 bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center overflow-hidden">
                            {video.thumbnail_url ? (
                              <img
                                src={video.thumbnail_url}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <Video className="w-10 h-10 text-primary/40" />
                            )}
                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                <Play className="w-5 h-5 text-primary fill-primary mr-[-2px]" />
                              </div>
                            </div>
                            {video.category !== 'weekly' && (
                              <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                                {VIDEO_CATEGORIES.find(c => c.id === video.category)?.label ?? video.category}
                              </span>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm text-primary line-clamp-2 group-hover:text-secondary transition-colors">
                              {video.title}
                            </h3>
                            {video.guest_name && (
                              <p className="text-xs text-muted-foreground mt-0.5">עם {video.guest_name}</p>
                            )}
                            {video.duration_minutes && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Clock className="w-3 h-3" />
                                {video.duration_minutes} דקות
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* === EVENTS TAB === */}
              {tab === 'events' && (
                <div className="space-y-6">
                  {/* Upcoming */}
                  {upcomingEvents.length > 0 && (
                    <div>
                      <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        אירועים קרובים
                      </h2>
                      <div className="space-y-3">
                        {upcomingEvents.slice(0, 5).map(ev => {
                          const d = formatDate(ev.event_date)
                          const isToday = new Date(ev.event_date).toDateString() === new Date().toDateString()
                          return (
                            <div
                              key={ev.id}
                              className={cn(
                                'bg-card rounded-xl border p-4 flex gap-4 transition-all hover:shadow-sm',
                                isToday ? 'border-primary bg-primary/5' : 'border-border'
                              )}
                            >
                              <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-primary">{d.day}</span>
                                <span className="text-xs text-muted-foreground">{d.weekday.slice(0, 3)}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-bold text-sm">{ev.title}</h3>
                                  {isToday && (
                                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full shrink-0">
                                      היום!
                                    </span>
                                  )}
                                </div>
                                {ev.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{ev.description}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{d.time}
                                  </span>
                                  <span>{ev.duration_minutes} דקות</span>
                                </div>
                                {ev.meeting_link && (
                                  <a
                                    href={ev.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                      buttonVariants({ size: 'sm' }),
                                      'mt-2 text-xs h-7 px-3'
                                    )}
                                  >
                                    הצטרף לפגישה
                                  </a>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Monthly navigation */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-lg">תצוגת חודש</h2>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateMonth(-1)}
                          className="p-1.5 rounded-lg border border-border hover:bg-gray-50 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium min-w-[100px] text-center">
                          {eventsMonth.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                          onClick={() => navigateMonth(1)}
                          className="p-1.5 rounded-lg border border-border hover:bg-gray-50 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {eventsLoading ? (
                      <div className="space-y-2">
                        {[1,2].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                      </div>
                    ) : monthEvents.length > 0 ? (
                      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
                        {monthEvents.map(ev => {
                          const d = formatDate(ev.event_date)
                          return (
                            <div key={ev.id} className="p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                                <span className="text-base font-bold text-primary leading-none">{d.day}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{ev.title}</p>
                                <p className="text-xs text-muted-foreground">{d.weekday}, {d.time}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="bg-card border border-border rounded-2xl p-8 text-center">
                        <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">אין אירועים בחודש זה</p>
                      </div>
                    )}
                  </div>

                  {events.length === 0 && !eventsLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p>לוח המפגשים יעודכן בקרוב</p>
                    </div>
                  )}
                </div>
              )}

              {/* === Q&A TAB === */}
              {tab === 'qa' && (
                <div className="space-y-6 max-w-2xl">
                  {/* Submit question */}
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">שלח שאלה</h3>
                        <p className="text-xs text-muted-foreground">נענה בלייב הקרוב או ישירות</p>
                      </div>
                    </div>
                    <Textarea
                      value={newQuestion}
                      onChange={e => setNewQuestion(e.target.value)}
                      placeholder="כתוב כאן את השאלה שלך..."
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={submitQuestion}
                        disabled={!newQuestion.trim() || submitting}
                        className="gap-2"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        שלח שאלה
                      </Button>
                    </div>
                  </div>

                  {/* My questions */}
                  {qaLoading ? (
                    <div className="space-y-3">
                      {[1,2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                  ) : questions.length > 0 ? (
                    <div>
                      <h3 className="font-bold mb-3">השאלות שלי</h3>
                      <div className="space-y-3">
                        {questions.map(q => (
                          <div key={q.id} className="bg-white border border-border rounded-xl p-4 space-y-2">
                            <p className="text-sm font-medium">{q.question_text}</p>
                            {q.is_answered && q.answer_text && (
                              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-2">
                                <p className="text-xs text-primary font-medium mb-1">תשובה:</p>
                                <p className="text-sm text-foreground">{q.answer_text}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              {q.is_answered ? (
                                <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  נענה
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
                                  ממתין לתשובה
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(q.created_at).toLocaleDateString('he-IL')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="aspect-video flex-shrink-0 bg-black">
              <iframe
                src={getEmbedUrl(selectedVideo.video_url)}
                className="w-full h-full"
                allow="autoplay"
                allowFullScreen
              />
            </div>
            <div className="p-4 flex items-start justify-between gap-4 flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg leading-snug">{selectedVideo.title}</h2>
                {selectedVideo.description && (
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{selectedVideo.description}</p>
                )}
                {selectedVideo.guest_name && (
                  <p className="text-primary text-sm mt-1">עם {selectedVideo.guest_name}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  )
}
```

- [ ] **Step 2: Build**

```bash
cd "C:\Users\saarj\Downloads\loked-achraiut-platform" && npm run build 2>&1 | tail -20
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/member/MemberClub.tsx
git commit -m "בנייה מחדש של אזור המועדון - הקלטות, מפגשים, שאל שאלה, נתוני התקדמות"
```

---

## Task 5: Push to GitHub Pages

- [ ] **Step 1: Final build check**

```bash
cd "C:\Users\saarj\Downloads\loked-achraiut-platform" && npm run build 2>&1 | tail -5
```

Expected: `built in X.Xs` with no errors.

- [ ] **Step 2: Push**

```bash
cd "C:\Users\saarj\Downloads\loked-achraiut-platform"
TOKEN=$(gh auth token)
git push "https://lammb12345:${TOKEN}@github.com/lammb12345/loked-achraiut-platform.git" master:main
```

Expected: Push succeeds. GitHub Pages auto-deploys within ~2 minutes.

- [ ] **Step 3: Verify live site**

After ~2 minutes, visit: https://lammb12345.github.io/loked-achraiut-platform/member/courses

Check:
- Course cards show with hover animation
- No console errors
- Navigation to curriculum page works
- Lesson mark-as-complete works

---

## Self-Review Checklist

### Spec coverage:
- [x] `/member/courses` — grid with progress ✓
- [x] `/member/course/:courseId` — chapter accordion + lesson cards ✓
- [x] Lesson mark complete → `lesson_progress` ✓
- [x] Lesson click → `lesson_link` opens in new tab ✓
- [x] `/member/club` — dashboard with tabs ✓
- [x] סרטונים (videos) with search/filter + modal player ✓
- [x] לוח מפגשים (events calendar) ✓
- [x] Q&A submit + my questions ✓
- [x] Gamification stats (lesson progress data) ✓
- [x] DB tables: `club_videos`, `club_events`, `club_questions` ✓
- [x] Sidebar (via existing `MemberLayout`) ✓
- [x] Mobile hamburger (via existing `MemberLayout`) ✓
- [x] RTL throughout ✓

### Notes:
- `supabase as any` used for new tables — no regeneration needed
- No `asChild` — uses `buttonVariants()` pattern
- Gamification is simplified (lesson progress stats) — no complex points/streaks DB infrastructure needed
- Video embed uses Google Drive preview URL pattern from reference site
