import { useAuth } from '@/hooks/useAuth'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Video, Calendar, MessageCircle, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import MemberLayout from '@/components/member/MemberLayout'

export default function MemberClub() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'הורה יקר'

  const quickLinks = [
    {
      label: 'הקלטות',
      icon: <Video className="w-7 h-7" />,
      onClick: () => toast.info('בקרוב! ההקלטות יהיו זמינות כאן'),
    },
    {
      label: 'לוח מפגשים',
      icon: <Calendar className="w-7 h-7" />,
      onClick: () => toast.info('לוח המפגשים בהכנה'),
    },
    {
      label: 'קהילה',
      icon: <MessageCircle className="w-7 h-7" />,
      href: '#',
      external: true,
    },
    {
      label: 'שאל שאלה',
      icon: <HelpCircle className="w-7 h-7" />,
      href: 'mailto:info@lokim.org.il',
    },
  ]

  return (
    <MemberLayout>
      <div className="p-6" dir="rtl">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Welcome */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-amber-900 mb-1">
              שלום {firstName}! ברוך הבא למועדון הורים 💛
            </h1>
            <p className="text-amber-700">
              כאן תמצא הרצאות, מפגשים, ותמיכה של קהילה חמה
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">מה יש כאן</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickLinks.map((item, i) => {
                const inner = (
                  <div className="bg-white border border-border rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                    <div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-primary">{item.label}</span>
                  </div>
                )

                if (item.onClick) {
                  return (
                    <button key={i} onClick={item.onClick} className="text-right">
                      {inner}
                    </button>
                  )
                }

                if (item.href) {
                  return (
                    <a
                      key={i}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                    >
                      {inner}
                    </a>
                  )
                }

                return <div key={i}>{inner}</div>
              })}
            </div>
          </div>

          {/* Coming soon */}
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="font-bold text-primary mb-1">המועדון בהקמה</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  אנחנו בונים עבורך חוויה מלאה — הרצאות מוקלטות, לוח מפגשים חי, ופורום קהילתי.
                  הכל יהיה זמין בקרוב!
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">בינתיים, צרו קשר ב-WhatsApp</p>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: 'sm' }), 'gap-2')}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp קהילה
              </a>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  )
}
