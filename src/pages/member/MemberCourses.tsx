import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, BookOpen, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Enrollment {
  unique_link: string | null
  enrolled_at: string
  course: {
    id: string
    title: string
    description: string | null
    image_url: string | null
    teacher_name: string | null
  }
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-sm font-medium text-muted-foreground w-10 text-left">{pct}%</span>
    </div>
  )
}

export default function MemberCourses() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, { completed: number; total: number }>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const db = supabase as any

  useEffect(() => {
    if (!user?.email) return
    load()
  }, [user?.email])

  async function load() {
    try {
      // Find student record by email
      const { data: student } = await db
        .from('students')
        .select('id')
        .eq('email', user!.email!.toLowerCase())
        .single()

      if (!student) {
        setEnrollments([])
        setLoading(false)
        return
      }

      // Get enrollments with course info
      const { data: enrData, error: enrErr } = await db
        .from('enrollments')
        .select(`
          unique_link,
          enrolled_at,
          course:courses(id, title, description, image_url, teacher_name)
        `)
        .eq('student_id', student.id)

      if (enrErr) throw enrErr
      setEnrollments(enrData ?? [])

      // Get lesson progress per course
      const courseIds = (enrData ?? []).map((e: Enrollment) => e.course.id)
      if (courseIds.length > 0) {
        const progressData: Record<string, { completed: number; total: number }> = {}

        for (const courseId of courseIds) {
          const { count: total } = await db
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', courseId)

          const { count: completed } = await db
            .from('lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', student.id)
            .in('lesson_id', await db
              .from('lessons')
              .select('id')
              .eq('course_id', courseId)
              .then((r: any) => (r.data ?? []).map((l: any) => l.id))
            )

          progressData[courseId] = {
            completed: completed ?? 0,
            total: total ?? 0,
          }
        }
        setProgressMap(progressData)
      }
    } catch (e: any) {
      setError('שגיאה בטעינת הקורסים')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/member" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-primary">הקורסים שלי</h1>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-border rounded-2xl p-6 animate-pulse h-28" />
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
          <div className="bg-white border border-border rounded-2xl p-8 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">לא נמצאו קורסים רשומים</p>
            <p className="text-sm text-muted-foreground mt-1">אם נרשמת לקורס, פנה אלינו</p>
          </div>
        )}

        {!loading && !error && enrollments.length > 0 && (
          <div className="space-y-3">
            {enrollments.map((enr, idx) => {
              const prog = progressMap[enr.course.id]
              const pct = prog && prog.total > 0
                ? Math.round((prog.completed / prog.total) * 100)
                : 0

              return (
                <div key={idx} className="bg-white border border-border rounded-2xl p-6 hover:shadow-soft transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-primary text-lg leading-snug">{enr.course.title}</h3>
                      {enr.course.teacher_name && (
                        <p className="text-sm text-muted-foreground mt-0.5">{enr.course.teacher_name}</p>
                      )}
                    </div>
                    {pct === 100 && (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        הושלם
                      </span>
                    )}
                  </div>

                  {prog && prog.total > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-muted-foreground mb-1.5">
                        <span>התקדמות</span>
                        <span>{prog.completed} / {prog.total} שיעורים</span>
                      </div>
                      <ProgressBar pct={pct} />
                    </div>
                  )}

                  {enr.unique_link && (
                    <a
                      href={enr.unique_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ size: 'sm' }), 'gap-2')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      כניסה לקורס
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
