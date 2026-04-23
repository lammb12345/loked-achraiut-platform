const BASE_URL = 'https://api.schooler.biz'

interface TokenCache {
  access_token: string
  refresh_token: string
  expires_at: number
}

let tokenCache: TokenCache | null = null

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expires_at - 60_000) {
    return tokenCache.access_token
  }

  const body = tokenCache
    ? {
        grant_type: 'refresh_token',
        client_id: import.meta.env.VITE_SCHOOLER_CLIENT_ID,
        client_secret: import.meta.env.VITE_SCHOOLER_CLIENT_SECRET,
        refresh_token: tokenCache.refresh_token,
      }
    : {
        grant_type: 'password',
        client_id: import.meta.env.VITE_SCHOOLER_CLIENT_ID,
        client_secret: import.meta.env.VITE_SCHOOLER_CLIENT_SECRET,
        user_id: import.meta.env.VITE_SCHOOLER_USER_ID,
        user_secret: import.meta.env.VITE_SCHOOLER_USER_SECRET,
      }

  const res = await fetch(`${BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    tokenCache = null
    throw new Error(`Schooler auth failed: ${res.status}`)
  }

  const data = await res.json()
  tokenCache = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }
  return tokenCache.access_token
}

async function apiFetch<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const token = await getToken()
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Schooler API error: ${res.status} ${path}`)
  return res.json()
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface SchoolerCourse {
  id: number
  course_name: string
  course_status: string
  course_type: string
  course_language: string
  price: number
  course_link: string
  course_description: string
  teacher_name: string
  part_of_a_school: boolean
}

export interface SchoolerLesson {
  lesson_id: number
  lesson_name: string
  chapter_name: string
  chapter_id: number
  free_lesson: boolean
  type_of_lesson: string
  lesson_link: string
  lesson_notes: string
}

export interface SchoolerStudent {
  student_id: number
  student_name: string
  student_email: string
  student_phone: string
  student_join_date: string
  unique_link: string
  status_in_course: string
  last_login_date: string
  lessons_complete: number
  lesson_complete_percentage: number
  total_number_of_lessons: number
}

export interface CourseStudentsData {
  total: number
  course_name: string
  course_id: number
  course_status: string
  total_number_of_lessons: number
  students: SchoolerStudent[]
}

export interface CourseLessonsData {
  course_name: string
  course_id: number
  total_number_of_lessons: number
  total_number_of_chapters: number
  lessons: SchoolerLesson[]
}

// ── API calls ────────────────────────────────────────────────────────────────

export async function fetchCourses(page = 1, perPage = 100): Promise<SchoolerCourse[]> {
  const res = await apiFetch<{ data: SchoolerCourse[] }>('/api/v1/courses', { page, per_page: perPage })
  return res.data
}

export async function fetchCourseStudents(
  courseId: number,
  page = 1,
  perPage = 200
): Promise<CourseStudentsData> {
  const res = await apiFetch<{ data: CourseStudentsData }>(`/api/v1/courses/${courseId}/students`, {
    page,
    per_page: perPage,
  })
  return res.data
}

export async function fetchCourseLessons(courseId: number): Promise<CourseLessonsData> {
  const res = await apiFetch<{ data: CourseLessonsData }>(`/api/v1/courses/${courseId}/lessons`, {
    per_page: 500,
  })
  return res.data
}

export async function searchStudent(query: { email?: string; phone?: string; id?: number }) {
  const params: Record<string, string | number> = {}
  if (query.email) params.email = query.email
  if (query.phone) params.phone = query.phone
  if (query.id) params.id = query.id
  const res = await apiFetch<{ data: unknown[] }>('/api/v1/students/search', params)
  return res.data
}

export async function resetStudentIp(studentId: number) {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}/api/v1/students/reset_ip`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId }),
  })
  if (!res.ok) throw new Error(`reset_ip failed: ${res.status}`)
  return res.json()
}

export async function resendAccess(studentId: number) {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}/api/v1/students/resend_access`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId }),
  })
  if (!res.ok) throw new Error(`resend_access failed: ${res.status}`)
  return res.json()
}
