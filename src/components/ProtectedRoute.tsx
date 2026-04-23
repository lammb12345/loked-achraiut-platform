import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'club_member' | 'course_member'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, hasRole } = useAuth()

  if (loading) return <div className="flex items-center justify-center min-h-screen">טוען...</div>
  if (!user) return <Navigate to="/auth" replace />
  if (requiredRole && !hasRole(requiredRole)) return <Navigate to="/member" replace />

  return <>{children}</>
}
