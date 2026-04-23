import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Auth() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<'login' | 'signup'>('login')

  if (loading) return <div className="flex items-center justify-center min-h-screen">טוען...</div>
  if (user) return <Navigate to="/member" replace />

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">לוקחים אחריות</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={v => setTab(v as 'login' | 'signup')}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="login" className="flex-1">כניסה</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">הרשמה</TabsTrigger>
            </TabsList>
            <TabsContent value="login"><LoginForm /></TabsContent>
            <TabsContent value="signup">
              <SignupForm onSuccess={() => setTab('login')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
