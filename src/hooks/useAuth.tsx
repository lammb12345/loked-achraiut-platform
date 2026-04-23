import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

type UserRole = 'admin' | 'club_member' | 'course_member'

interface AuthContextType {
  user: User | null
  loading: boolean
  roles: UserRole[]
  hasRole: (role: UserRole, courseId?: string) => boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [roles, setRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchRoles(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchRoles(session.user.id)
      else { setRoles([]); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchRoles(userId: string) {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
    setRoles((data ?? []).map(r => r.role as UserRole))
    setLoading(false)
  }

  function hasRole(role: UserRole, _courseId?: string): boolean {
    if (roles.includes('admin')) return true
    return roles.includes(role)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, roles, hasRole, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
