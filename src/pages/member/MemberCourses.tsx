import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BookOpen, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react'
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
          <h1 className="text-2xl font-bold text-primary mb-6">הקורסים שלי</h1>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-border rounded-2xl p-6 animate-pulse h-48" />
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enr) => {
                const course = enr.courses
                if (!course) return null
                const prog = progressMap[enr.course_id]
                const pct = prog && prog.total > 0
                  ? Math.round((prog.completed / prog.total) * 100)
                  : 0

                return (
                  <div
                    key={enr.id}
                    className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-all"
                  >
                    {course.image_url && (
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                    )}

                    <div>
                      <h3 className="font-bold text-primary text-lg leading-snug">{course.title}</h3>
                      {course.teacher_name && (
                        <p className="text-sm text-muted-foreground mt-0.5">{course.teacher_name}</p>
                      )}
                    </div>

                    {prog && prog.total > 0 && (
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                          <span>{prog.completed} / {prog.total} שיעורים</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        {pct === 100 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            הושלם
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col gap-2 mt-auto">
                      <Link
                        to={`/member/course/${course.id}`}
                        className={cn(buttonVariants({ size: 'sm' }), 'w-full justify-center')}
                      >
                        כניסה לקורס
                      </Link>
                      {enr.unique_link && (
                        <a
                          href={enr.unique_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full justify-center gap-1.5')}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          כניסה ישירה
                        </a>
                      )}
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
