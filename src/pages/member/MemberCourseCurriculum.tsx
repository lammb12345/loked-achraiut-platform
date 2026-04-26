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
                          ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                          : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
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
