import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import {
  fetchCourses,
  fetchCourseStudents,
  fetchCourseLessons,
  searchStudent,
  resetStudentIp,
  resendAccess,
  type SchoolerCourse,
  type SchoolerStudent,
  type SchoolerLesson,
} from '@/lib/schooler'
import {
  BookOpen,
  Users,
  Search,
  ArrowRight,
  ChevronLeft,
  RefreshCw,
  Send,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertCircle,
  Layers,
  ExternalLink,
  Home,
  LogOut,
} from 'lucide-react'

// ── helpers ────────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-500',
    published: 'bg-blue-100 text-blue-700',
    draft: 'bg-yellow-100 text-yellow-700',
  }
  const labels: Record<string, string> = {
    active: 'פעיל',
    inactive: 'לא פעיל',
    published: 'פורסם',
    draft: 'טיוטה',
  }
  const cls = map[status] ?? 'bg-gray-100 text-gray-500'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {labels[status] ?? status}
    </span>
  )
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8 text-left">{pct}%</span>
    </div>
  )
}

// ── Course card ────────────────────────────────────────────────────────────

function CourseCard({ course, onClick }: { course: SchoolerCourse; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-right w-full bg-white border border-border rounded-2xl p-5 hover:shadow-soft hover:border-primary/20 transition-all duration-200 group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          {statusBadge(course.course_status)}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-foreground/70">
            {course.course_type === 'paid' ? `₪${course.price}` : 'חינם'}
          </span>
        </div>
        <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
      </div>
      <h3 className="font-bold text-primary text-base leading-snug mb-1 line-clamp-2">
        {course.course_name}
      </h3>
      <p className="text-xs text-muted-foreground">{course.teacher_name}</p>
    </button>
  )
}

// ── Lessons panel ──────────────────────────────────────────────────────────

function LessonsPanel({ courseId }: { courseId: number }) {
  const [data, setData] = useState<{ lessons: SchoolerLesson[]; chapters: number; total: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseLessons(courseId)
      .then(d => setData({ lessons: d.lessons, chapters: d.total_number_of_chapters, total: d.total_number_of_lessons }))
      .finally(() => setLoading(false))
  }, [courseId])

  if (loading) return <div className="py-8 text-center text-muted-foreground text-sm">טוען שיעורים...</div>
  if (!data) return null

  const byChapter = data.lessons.reduce<Record<string, SchoolerLesson[]>>((acc, l) => {
    const ch = l.chapter_name || 'ללא פרק'
    acc[ch] = [...(acc[ch] ?? []), l]
    return acc
  }, {})

  return (
    <div>
      <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Layers className="w-4 h-4" /> {data.chapters} פרקים</span>
        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {data.total} שיעורים</span>
      </div>
      <div className="space-y-4">
        {Object.entries(byChapter).map(([chapter, lessons]) => (
          <div key={chapter}>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{chapter}</h4>
            <div className="space-y-1">
              {lessons.map(l => (
                <div key={l.lesson_id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20 truncate">{l.type_of_lesson}</span>
                    <span className="text-sm text-foreground">{l.lesson_name}</span>
                    {l.free_lesson && <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded">חינם</span>}
                  </div>
                  {l.lesson_link && (
                    <a href={l.lesson_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Students panel ─────────────────────────────────────────────────────────

function StudentsPanel({ courseId }: { courseId: number }) {
  const [data, setData] = useState<{ students: SchoolerStudent[]; total: number; courseName: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetchCourseStudents(courseId)
      .then(d => setData({ students: d.students, total: d.total, courseName: d.course_name }))
      .finally(() => setLoading(false))
  }, [courseId])

  useEffect(() => { load() }, [load])

  const filtered = data?.students.filter(s =>
    !search || s.student_name.includes(search) || s.student_email.includes(search) || s.student_phone?.includes(search)
  ) ?? []

  async function handleResetIp(studentId: number) {
    setActionLoading(studentId)
    setActionMsg(null)
    try {
      await resetStudentIp(studentId)
      setActionMsg(`אופס הוסר בהצלחה לתלמיד #${studentId}`)
    } catch {
      setActionMsg('שגיאה בביצוע הפעולה')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleResendAccess(studentId: number) {
    setActionLoading(studentId)
    setActionMsg(null)
    try {
      await resendAccess(studentId)
      setActionMsg(`פרטי כניסה נשלחו לתלמיד #${studentId}`)
    } catch {
      setActionMsg('שגיאה בשליחת פרטי כניסה')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="py-8 text-center text-muted-foreground text-sm">טוען תלמידים...</div>
  if (!data) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <p className="text-sm text-muted-foreground">{data.total} תלמידים</p>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש שם / אימייל / טלפון"
            className="pr-9 text-sm"
          />
        </div>
      </div>

      {actionMsg && (
        <div className="mb-3 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">
          {actionMsg}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-right">
              <th className="pb-2 pr-2 text-xs text-muted-foreground font-medium">שם</th>
              <th className="pb-2 px-2 text-xs text-muted-foreground font-medium">אימייל</th>
              <th className="pb-2 px-2 text-xs text-muted-foreground font-medium">סטטוס</th>
              <th className="pb-2 px-2 text-xs text-muted-foreground font-medium">התקדמות</th>
              <th className="pb-2 px-2 text-xs text-muted-foreground font-medium">כניסה אחרונה</th>
              <th className="pb-2 pl-2 text-xs text-muted-foreground font-medium">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.student_id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                <td className="py-2.5 pr-2">
                  <div>
                    <p className="font-medium text-foreground">{s.student_name}</p>
                    <p className="text-xs text-muted-foreground">{s.student_phone}</p>
                  </div>
                </td>
                <td className="py-2.5 px-2 text-muted-foreground text-xs">{s.student_email}</td>
                <td className="py-2.5 px-2">{statusBadge(s.status_in_course)}</td>
                <td className="py-2.5 px-2 w-32">
                  <ProgressBar pct={s.lesson_complete_percentage} />
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.lessons_complete}/{s.total_number_of_lessons} שיעורים
                  </p>
                </td>
                <td className="py-2.5 px-2 text-xs text-muted-foreground">
                  {s.last_login_date || '—'}
                </td>
                <td className="py-2.5 pl-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleResetIp(s.student_id)}
                      disabled={actionLoading === s.student_id}
                      title="איפוס IP"
                      className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
                    >
                      {actionLoading === s.student_id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <WifiOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleResendAccess(s.student_id)}
                      disabled={actionLoading === s.student_id}
                      title="שלח פרטי כניסה"
                      className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={s.unique_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="קישור אישי"
                      className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">לא נמצאו תלמידים</p>
        )}
      </div>
    </div>
  )
}

// ── Course detail view ─────────────────────────────────────────────────────

type CourseTab = 'students' | 'lessons'

function CourseDetail({ course, onBack }: { course: SchoolerCourse; onBack: () => void }) {
  const [tab, setTab] = useState<CourseTab>('students')

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-5 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        חזרה לרשימת קורסים
      </button>

      <div className="bg-white border border-border rounded-2xl p-6 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex gap-2 mb-2">
              {statusBadge(course.course_status)}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-foreground/70">
                {course.course_type === 'paid' ? `₪${course.price}` : 'חינם'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-primary mb-1">{course.course_name}</h2>
            <p className="text-sm text-muted-foreground">{course.teacher_name}</p>
          </div>
          <a
            href={course.course_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-primary hover:underline shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            פתח בסקולר
          </a>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab('students')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium transition-colors ${
              tab === 'students'
                ? 'text-primary border-b-2 border-primary bg-accent/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4" />
            תלמידים
          </button>
          <button
            onClick={() => setTab('lessons')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium transition-colors ${
              tab === 'lessons'
                ? 'text-primary border-b-2 border-primary bg-accent/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            שיעורים
          </button>
        </div>
        <div className="p-5">
          {tab === 'students' && <StudentsPanel courseId={course.id} />}
          {tab === 'lessons' && <LessonsPanel courseId={course.id} />}
        </div>
      </div>
    </div>
  )
}

// ── Student search ─────────────────────────────────────────────────────────

function StudentSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<unknown[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const isEmail = query.includes('@')
      const isPhone = /^0\d+$/.test(query.trim())
      const isId = /^\d+$/.test(query.trim()) && !isPhone
      const res = await searchStudent({
        email: isEmail ? query.trim() : undefined,
        phone: isPhone ? query.trim() : undefined,
        id: isId ? Number(query.trim()) : undefined,
      })
      setResults(res)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-white border border-border rounded-2xl p-5 mb-5">
        <h3 className="font-bold text-primary mb-3">חיפוש תלמיד</h3>
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="אימייל / טלפון / מזהה תלמיד"
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">חפש לפי אימייל, מספר טלפון (0501234567) או מזהה תלמיד</p>
      </div>

      {searched && results.length === 0 && !loading && (
        <div className="bg-white border border-border rounded-2xl p-10 text-center text-muted-foreground">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
          לא נמצאו תוצאות
        </div>
      )}

      {results.map((r: any, i) => (
        <div key={i} className="bg-white border border-border rounded-2xl p-5 mb-3">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-bold text-primary">{r.student_name}</p>
              <p className="text-sm text-muted-foreground">{r.student_email}</p>
              <p className="text-sm text-muted-foreground">{r.student_phone}</p>
            </div>
            <div className="text-left text-xs text-muted-foreground">
              <p>{r.member_in_courses} קורסים</p>
              <p>{r.member_in_schools} בתי ספר</p>
            </div>
          </div>
          {r.courses?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">קורסים:</p>
              <div className="space-y-2">
                {r.courses.map((c: any) => (
                  <div key={c.course_id} className="flex items-center justify-between bg-accent/40 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.course_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.lessons_complete}/{c.lessons_in_course} שיעורים · {c.lesson_complete_percentage}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(c.status_in_course)}
                      <a href={c.unique_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main AdminDashboard ────────────────────────────────────────────────────

type View = 'courses' | 'search'

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const [view, setView] = useState<View>('courses')
  const [courses, setCourses] = useState<SchoolerCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<SchoolerCourse | null>(null)

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch(() => setError('שגיאה בטעינת קורסים מ-Schooler'))
      .finally(() => setLoading(false))
  }, [])

  const published = courses.filter(c => c.course_status === 'published').length
  const paid = courses.filter(c => c.course_type === 'paid').length

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-56 bg-primary text-primary-foreground flex flex-col">
        <div className="p-5 border-b border-primary-foreground/10">
          <p className="text-xs text-primary-foreground/50 mb-1">לוקחים אחריות</p>
          <p className="font-bold text-lg">ניהול LMS</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => { setView('courses'); setSelectedCourse(null) }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-right ${
              view === 'courses'
                ? 'bg-primary-foreground/15 text-primary-foreground'
                : 'text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            קורסים
          </button>
          <button
            onClick={() => { setView('search'); setSelectedCourse(null) }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-right ${
              view === 'search'
                ? 'bg-primary-foreground/15 text-primary-foreground'
                : 'text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground'
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            חיפוש תלמיד
          </button>
        </nav>

        <div className="p-3 border-t border-primary-foreground/10 space-y-1">
          <Link
            to="/member"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
          >
            <Home className="w-4 h-4 shrink-0" />
            לוח בקרה
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            יציאה
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="mr-56 p-8">
        {view === 'courses' && !selectedCourse && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: <BookOpen className="w-5 h-5 text-primary" />, value: courses.length, label: 'סה"כ קורסים', bg: 'bg-primary/5' },
                { icon: <CheckCircle2 className="w-5 h-5 text-green-600" />, value: published, label: 'פורסמו', bg: 'bg-green-50' },
                { icon: <Wifi className="w-5 h-5 text-blue-600" />, value: paid, label: 'קורסים בתשלום', bg: 'bg-blue-50' },
              ].map((s, i) => (
                <div key={i} className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>{s.icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{loading ? '—' : s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-bold text-primary mb-4">כל הקורסים</h2>

            {loading && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white border border-border rounded-2xl p-5 animate-pulse h-28" />
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {courses.map(c => (
                  <CourseCard key={c.id} course={c} onClick={() => setSelectedCourse(c)} />
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'courses' && selectedCourse && (
          <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />
        )}

        {view === 'search' && <StudentSearch />}
      </div>
    </div>
  )
}
