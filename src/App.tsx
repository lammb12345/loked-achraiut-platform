import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/ProtectedRoute'

// Public pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import MokedOr from './pages/public/MokedOr'
import Institutions from './pages/public/Institutions'
import Activism from './pages/public/Activism'
import Contact from './pages/public/Contact'
import Terms from './pages/public/Terms'
import Privacy from './pages/public/Privacy'
import News from './pages/public/News'
import Article from './pages/public/Article'
import MediaCoaches from './pages/public/MediaCoaches'
import MediaCoachesThankYou from './pages/public/MediaCoachesThankYou'

// Auth + Member
import Auth from './pages/Auth'
import MemberDashboard from './pages/member/MemberDashboard'
import MemberCourses from './pages/member/MemberCourses'
import MemberClub from './pages/member/MemberClub'
import MemberCourseCurriculum from './pages/member/MemberCourseCurriculum'
import AdminDashboard from './pages/admin/AdminDashboard'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-center" />
        <BrowserRouter basename={import.meta.env.VITE_BASE?.replace(/\/$/, '') || ''}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/moked-or" element={<MokedOr />} />
            <Route path="/institutions" element={<Institutions />} />
            <Route path="/activism" element={<Activism />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/news" element={<News />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/meamnim" element={<MediaCoaches />} />
            <Route path="/meamnim/thank-you" element={<MediaCoachesThankYou />} />

            {/* Auth */}
            <Route path="/auth" element={<Auth />} />

            {/* Member */}
            <Route path="/member" element={
              <ProtectedRoute><MemberDashboard /></ProtectedRoute>
            } />
            <Route path="/member/courses" element={
              <ProtectedRoute requiredRole="course_member"><MemberCourses /></ProtectedRoute>
            } />
            <Route path="/member/club" element={
              <ProtectedRoute requiredRole="club_member"><MemberClub /></ProtectedRoute>
            } />

            {/* Member curriculum */}
            <Route path="/member/course/:courseId" element={
              <ProtectedRoute><MemberCourseCurriculum /></ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
