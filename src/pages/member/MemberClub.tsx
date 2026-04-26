import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import MemberLayout from '@/components/member/MemberLayout'
import {
  Video,
  Calendar,
  HelpCircle,
  Search,
  Play,
  X,
  ChevronRight,
  ChevronLeft,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'

type ClubVideo = {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  category: string | null
  guest_name: string | null
  duration_minutes: number | null
  sort_order: number | null
  is_published: boolean
  created_at: string
}

type ClubEvent = {
  id: string
  title: string
  description: string | null
  event_date: string
  duration_minutes: number | null
  meeting_link: string | null
  created_at: string
}

type ClubQuestion = {
  id: string
  user_id: string
  question_text: string
  answer_text: string | null
  is_answered: boolean
  is_anonymous: boolean
  created_at: string
}

const CATEGORIES = [
  { value: 'all', label: 'הכל' },
  { value: 'weekly', label: 'מפגש שבועי' },
  { value: 'guest', label: 'מומחה אורח' },
  { value: 'mini', label: 'מיני־הרצאה' },
  { value: 'bonus', label: 'בונוס' },
]

function extractDriveId(url: string): string | null {
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  return m ? m[1] : null
}

function toEmbedUrl(url: string): string {
  const id = extractDriveId(url)
  if (id) return `https://drive.google.com/file/d/${id}/preview`
  return url
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function MemberClub() {
  const { user } = useAuth()
  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ??
    user?.email?.split('@')[0] ??
    'הורה יקר'

  const [tab, setTab] = useState<'videos' | 'events' | 'qa'>('videos')

  // Stats
  const [, setStudentId] = useState<string | null>(null)
  const [enrolledCount, setEnrolledCount] = useState(0)
  const [completedLessons, setCompletedLessons] = useState(0)
  const [totalLessons, setTotalLessons] = useState(0)
  const [statsLoading, setStatsLoading] = useState(true)

  // Videos
  const [videos, setVideos] = useState<ClubVideo[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [videoSearch, setVideoSearch] = useState('')
  const [videoCategory, setVideoCategory] = useState('all')
  const [activeVideo, setActiveVideo] = useState<ClubVideo | null>(null)

  // Events
  const [events, setEvents] = useState<ClubEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [monthOffset, setMonthOffset] = useState(0)

  // Q&A
  const [questionText, setQuestionText] = useState('')
  const [submittingQuestion, setSubmittingQuestion] = useState(false)
  const [questions, setQuestions] = useState<ClubQuestion[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(true)

  // Load student id + stats
  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function loadStats() {
      setStatsLoading(true)
      try {
        // Try auth_user_id first
        let sid: string | null = null
        const { data: byAuth } = await (supabase as any)
          .from('students')
          .select('id')
          .eq('auth_user_id', user!.id)
          .maybeSingle()
        if (byAuth?.id) {
          sid = byAuth.id as string
        } else if (user!.email) {
          const { data: byEmail } = await (supabase as any)
            .from('students')
            .select('id')
            .eq('email', user!.email)
            .maybeSingle()
          if (byEmail?.id) sid = byEmail.id as string
        }
        if (cancelled) return
        setStudentId(sid)

        if (!sid) {
          setStatsLoading(false)
          return
        }

        // Enrollments
        const { data: enrollments } = await (supabase as any)
          .from('enrollments')
          .select('id, course_id')
          .eq('student_id', sid)
        if (cancelled) return
        const courseIds = (enrollments ?? []).map((e: any) => e.course_id).filter(Boolean)
        setEnrolledCount(courseIds.length)

        // Total lessons across enrolled courses
        let total = 0
        if (courseIds.length > 0) {
          const { count } = await (supabase as any)
            .from('lessons')
            .select('id', { count: 'exact', head: true })
            .in('course_id', courseIds)
          total = count ?? 0
        }
        if (cancelled) return
        setTotalLessons(total)

        // Completed lessons
        const { count: completed } = await (supabase as any)
          .from('lesson_progress')
          .select('id', { count: 'exact', head: true })
          .eq('student_id', sid)
        if (cancelled) return
        setCompletedLessons(completed ?? 0)
      } catch (err) {
        console.error('stats error', err)
      } finally {
        if (!cancelled) setStatsLoading(false)
      }
    }

    loadStats()
    return () => {
      cancelled = true
    }
  }, [user])

  // Load videos
  useEffect(() => {
    let cancelled = false
    async function load() {
      setVideosLoading(true)
      try {
        const { data, error } = await (supabase as any)
          .from('club_videos')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
        if (cancelled) return
        if (error) throw error
        setVideos((data as ClubVideo[]) ?? [])
      } catch (err) {
        console.error('videos error', err)
      } finally {
        if (!cancelled) setVideosLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Load events
  useEffect(() => {
    let cancelled = false
    async function load() {
      setEventsLoading(true)
      try {
        const { data, error } = await (supabase as any)
          .from('club_events')
          .select('*')
          .order('event_date', { ascending: true })
        if (cancelled) return
        if (error) throw error
        setEvents((data as ClubEvent[]) ?? [])
      } catch (err) {
        console.error('events error', err)
      } finally {
        if (!cancelled) setEventsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Load user's questions
  useEffect(() => {
    if (!user) return
    let cancelled = false
    async function load() {
      setQuestionsLoading(true)
      try {
        const { data, error } = await (supabase as any)
          .from('club_questions')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false })
        if (cancelled) return
        if (error) throw error
        setQuestions((data as ClubQuestion[]) ?? [])
      } catch (err) {
        console.error('questions error', err)
      } finally {
        if (!cancelled) setQuestionsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user])

  const filteredVideos = useMemo(() => {
    const q = videoSearch.trim().toLowerCase()
    return videos.filter((v) => {
      if (videoCategory !== 'all' && v.category !== videoCategory) return false
      if (!q) return true
      return (
        v.title?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.guest_name?.toLowerCase().includes(q)
      )
    })
  }, [videos, videoSearch, videoCategory])

  const now = new Date()
  const upcomingEvents = useMemo(
    () => events.filter((e) => new Date(e.event_date) >= now).slice(0, 5),
    [events],
  )

  const targetMonth = useMemo(() => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() + monthOffset)
    return d
  }, [monthOffset])

  const monthEvents = useMemo(() => {
    return events.filter((e) => {
      const d = new Date(e.event_date)
      return (
        d.getFullYear() === targetMonth.getFullYear() &&
        d.getMonth() === targetMonth.getMonth()
      )
    })
  }, [events, targetMonth])

  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  async function submitQuestion() {
    if (!user) return
    const text = questionText.trim()
    if (!text) {
      toast.error('נא לכתוב שאלה')
      return
    }
    setSubmittingQuestion(true)
    try {
      const { error } = await (supabase as any).from('club_questions').insert({
        user_id: user.id,
        question_text: text,
        is_answered: false,
        is_anonymous: false,
      })
      if (error) throw error
      toast.success('השאלה נשלחה! נחזור אליך בהקדם')
      setQuestionText('')
      // reload
      const { data } = await (supabase as any)
        .from('club_questions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setQuestions((data as ClubQuestion[]) ?? [])
    } catch (err) {
      console.error(err)
      toast.error('שליחת השאלה נכשלה. נסו שוב')
    } finally {
      setSubmittingQuestion(false)
    }
  }

  return (
    <MemberLayout>
      <div className="p-4 md:p-6" dir="rtl">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-1">
              שלום {firstName}! ברוך הבא למועדון ההורים
            </h1>
            <p className="text-amber-800/80">
              כאן תמצא הרצאות, מפגשים, ותמיכה של קהילה חמה
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">קורסים שלי</div>
                <div className="text-2xl font-bold text-primary">
                  {statsLoading ? '—' : enrolledCount}
                </div>
              </div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">שיעורים שהושלמו</div>
                <div className="text-2xl font-bold text-primary">
                  {statsLoading ? '—' : completedLessons}
                </div>
              </div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">התקדמות כללית</div>
                  <div className="text-2xl font-bold text-primary">
                    {statsLoading ? '—' : `${progressPct}%`}
                  </div>
                </div>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            {[
              { key: 'videos', label: 'הקלטות', icon: <Video className="w-4 h-4" /> },
              { key: 'events', label: 'לוח מפגשים', icon: <Calendar className="w-4 h-4" /> },
              { key: 'qa', label: 'שאל שאלה', icon: <HelpCircle className="w-4 h-4" /> },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as any)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
                  tab === t.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-primary',
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Videos tab */}
          {tab === 'videos' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    placeholder="חיפוש לפי כותרת, תיאור או מרצה"
                    className="pr-9"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setVideoCategory(c.value)}
                      className={cn(
                        'px-3 py-1.5 text-sm rounded-full border transition-colors',
                        videoCategory === c.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-white border-border text-muted-foreground hover:border-primary/40',
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {videosLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : filteredVideos.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-10 text-center text-muted-foreground">
                  לא נמצאו הקלטות
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVideos.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVideo(v)}
                      className="group bg-white border border-border rounded-2xl overflow-hidden text-right hover:shadow-md hover:border-primary/30 transition-all"
                    >
                      <div className="relative h-36 bg-gradient-to-br from-amber-200 to-yellow-300 overflow-hidden">
                        {v.thumbnail_url ? (
                          <img
                            src={v.thumbnail_url}
                            alt={v.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-10 h-10 text-amber-700/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-5 h-5 text-primary fill-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-primary line-clamp-2">{v.title}</h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{v.guest_name ?? ''}</span>
                          {v.duration_minutes ? (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {v.duration_minutes} דק׳
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events tab */}
          {tab === 'events' && (
            <div className="space-y-6">
              {eventsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Upcoming */}
                  <div>
                    <h2 className="text-lg font-bold text-primary mb-3">מפגשים קרובים</h2>
                    {upcomingEvents.length === 0 ? (
                      <div className="bg-white border border-border rounded-2xl p-8 text-center text-muted-foreground">
                        אין מפגשים מתוכננים כרגע
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcomingEvents.map((e) => (
                          <div
                            key={e.id}
                            className="bg-white border border-border rounded-2xl p-5 flex flex-col md:flex-row gap-4 md:items-center"
                          >
                            <Badge variant="secondary" className="self-start">
                              {formatDate(e.event_date)}
                            </Badge>
                            <div className="flex-1 space-y-1">
                              <h3 className="font-bold text-primary">{e.title}</h3>
                              {e.description && (
                                <p className="text-sm text-muted-foreground">{e.description}</p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(e.event_date)}
                                </span>
                                {e.duration_minutes && <span>· {e.duration_minutes} דק׳</span>}
                              </div>
                            </div>
                            {e.meeting_link && (
                              <a
                                href={e.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(buttonVariants({ size: 'sm' }), 'gap-2')}
                              >
                                <ExternalLink className="w-4 h-4" />
                                כניסה למפגש
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Monthly nav */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-bold text-primary">לפי חודש</h2>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setMonthOffset((m) => m - 1)}
                          className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                          aria-label="חודש קודם"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="text-sm font-medium min-w-[120px] text-center">
                          {targetMonth.toLocaleDateString('he-IL', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                        <button
                          onClick={() => setMonthOffset((m) => m + 1)}
                          className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                          aria-label="חודש הבא"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {monthEvents.length === 0 ? (
                      <div className="bg-white border border-border rounded-2xl p-8 text-center text-muted-foreground">
                        אין מפגשים בחודש זה
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {monthEvents.map((e) => (
                          <div
                            key={e.id}
                            className="bg-white border border-border rounded-xl p-4 flex items-center gap-3"
                          >
                            <div className="text-center min-w-[56px]">
                              <div className="text-2xl font-bold text-primary">
                                {new Date(e.event_date).getDate()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatTime(e.event_date)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-primary">{e.title}</div>
                              {e.description && (
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {e.description}
                                </div>
                              )}
                            </div>
                            {e.meeting_link && (
                              <a
                                href={e.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
                              >
                                כניסה
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Q&A tab */}
          {tab === 'qa' && (
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
                <h2 className="font-bold text-primary">שאל שאלה</h2>
                <p className="text-sm text-muted-foreground">
                  כתבו שאלה לצוות המועדון ונחזור אליכם עם תשובה.
                </p>
                <Textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="מה תרצו לשאול?"
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={submitQuestion}
                    disabled={submittingQuestion || !questionText.trim()}
                    className="gap-2"
                  >
                    {submittingQuestion ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    שליחה
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-primary mb-3">השאלות שלי</h2>
                {questionsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : questions.length === 0 ? (
                  <div className="bg-white border border-border rounded-2xl p-8 text-center text-muted-foreground">
                    עדיין לא שאלת שאלה
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questions.map((q) => (
                      <div
                        key={q.id}
                        className="bg-white border border-border rounded-2xl p-5 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mb-1">
                              {formatDate(q.created_at)}
                            </div>
                            <div className="text-primary">{q.question_text}</div>
                          </div>
                          {q.is_answered ? (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              נענתה
                            </Badge>
                          ) : (
                            <Badge variant="secondary">ממתינה לתשובה</Badge>
                          )}
                        </div>
                        {q.is_answered && q.answer_text && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900">
                            <div className="font-bold mb-1">תשובה:</div>
                            {q.answer_text}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Video modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="bg-black rounded-2xl overflow-hidden w-full max-w-4xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                aria-label="סגור"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
              <div className="aspect-video bg-black">
                <iframe
                  src={toEmbedUrl(activeVideo.video_url)}
                  className="w-full h-full"
                  allow="autoplay"
                  allowFullScreen
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-primary">{activeVideo.title}</h3>
                {activeVideo.description && (
                  <p className="text-sm text-muted-foreground mt-1">{activeVideo.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  )
}
