import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { BookOpen, Heart, Settings, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { hasRole, signOut, user } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: 'לוח הבקרה', href: '/member', icon: <LayoutDashboard className="w-5 h-5" /> },
    ...(hasRole('course_member') || hasRole('admin')
      ? [{ label: 'הקורסים שלי', href: '/member/courses', icon: <BookOpen className="w-5 h-5" /> }]
      : []),
    ...(hasRole('club_member') || hasRole('admin')
      ? [{ label: 'מועדון הורים', href: '/member/club', icon: <Heart className="w-5 h-5" /> }]
      : []),
    ...(hasRole('admin')
      ? [{ label: 'ניהול', href: '/admin', icon: <Settings className="w-5 h-5" /> }]
      : []),
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-border">
        <p className="text-xs text-muted-foreground">שלום,</p>
        <p className="font-semibold text-primary truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-primary'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          יציאה
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Desktop sidebar — fixed on RIGHT */}
      <aside className="hidden md:flex fixed top-0 right-0 h-full w-64 bg-white border-l border-border flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 right-0 left-0 h-14 bg-white border-b border-border flex items-center justify-between px-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-semibold text-primary text-sm">אזור חברים</span>
        <div className="w-9" />
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 bg-white h-full mr-auto flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <span className="font-semibold text-primary">תפריט</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="md:mr-64 pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
