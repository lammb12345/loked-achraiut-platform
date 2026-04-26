import { Link } from 'react-router-dom'
import { ArrowRight, Users, BookOpen, Calendar, MessageCircle, FileText, Heart } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const BENEFITS = [
  {
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    title: 'תכנים בלעדיים',
    desc: 'מאמרים, מדריכים ומשאבים מקצועיים לחינוך ילדים בעידן הדיגיטלי',
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary" />,
    title: 'אירועים חודשיים',
    desc: 'וובינרים, הרצאות ומפגשים עם מומחים בתחום החינוך וההורות',
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: 'קהילה תומכת',
    desc: 'קבוצת הורים שמתמודדים עם אותן שאלות ומשתפים חוויות',
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-primary" />,
    title: 'ייעוץ אישי',
    desc: 'שאל את המומחים שלנו שאלות ישירות בפורום הפרטי של המועדון',
  },
]

const RESOURCES = [
  { title: 'מדריך להגבלת זמן מסך בגיל 6-12', type: 'PDF', tag: 'חדש' },
  { title: 'שיחה פתוחה על אינטרנט עם ילדים', type: 'וובינר', tag: '' },
  { title: 'כיצד לזהות bullying דיגיטלי', type: 'מאמר', tag: '' },
  { title: 'כלים להגנה על פרטיות הילד ברשת', type: 'PDF', tag: '' },
  { title: 'שגרת לילה בריאה בעידן הסמארטפון', type: 'מאמר', tag: 'פופולרי' },
]

export default function MemberClub() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/member" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <span className="text-primary-foreground/60 text-sm">חזרה ללוח הבקרה</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/15 flex items-center justify-center">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">מועדון ההורים</h1>
              <p className="text-primary-foreground/70 text-sm mt-0.5">חינוך דיגיטלי חכם ומודע</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Benefits */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-4">מה כלול במועדון</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl p-5 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-4">ספריית תכנים</h2>
          <div className="bg-white border border-border rounded-2xl divide-y divide-border">
            {RESOURCES.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary/60" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-primary">{r.title}</span>
                    {r.tag && (
                      <span className="mr-2 text-xs bg-bright/15 text-bright px-1.5 py-0.5 rounded-full">
                        {r.tag}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 rounded-full shrink-0">
                  {r.type}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            תכנים נוספים מתווספים מדי חודש
          </p>
        </section>

        {/* Upcoming event */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-4">האירוע הקרוב</h2>
          <div className="bg-white border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                <span className="text-xs text-primary font-medium">מאי</span>
                <span className="text-xl font-bold text-primary">15</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-primary mb-1">וובינר: גבולות בריאים עם מסכים</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  איך מציבים גבולות שהילדים מכבדים — בלי מריבות ובלי להרגיש "הורה רע"
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>20:00 — 21:30</span>
                  <span>זום</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <a
                href="mailto:info@lokchimachrayut.org.il?subject=הרשמה לוובינר"
                className={cn(buttonVariants({ size: 'sm' }), 'gap-2')}
              >
                הרשמה לאירוע
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-accent rounded-2xl p-6 text-center">
          <Users className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-primary mb-2">צריכים עזרה?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            הצוות שלנו זמין לכל שאלה בנושא חינוך דיגיטלי
          </p>
          <a href="mailto:info@lokchimachrayut.org.il" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            צרו קשר
          </a>
        </section>
      </div>
    </div>
  )
}
