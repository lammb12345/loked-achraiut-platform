import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function MemberDashboard() {
  const { hasRole, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">שלום</h1>
          <Button variant="outline" onClick={signOut}>יציאה</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(hasRole('club_member') || hasRole('admin')) && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader><CardTitle>מועדון הורים</CardTitle></CardHeader>
              <CardContent>
                <Link to="/member/club" className={cn(buttonVariants(), 'w-full')}>
                  כניסה למועדון
                </Link>
              </CardContent>
            </Card>
          )}

          {(hasRole('course_member') || hasRole('admin')) && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader><CardTitle>הקורסים שלי</CardTitle></CardHeader>
              <CardContent>
                <Link to="/member/courses" className={cn(buttonVariants(), 'w-full')}>
                  לקורסים
                </Link>
              </CardContent>
            </Card>
          )}

          {hasRole('admin') && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-orange-200">
              <CardHeader><CardTitle>ניהול</CardTitle></CardHeader>
              <CardContent>
                <Link to="/admin" className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
                  פאנל אדמין
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
