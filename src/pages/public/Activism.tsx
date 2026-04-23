import { Megaphone, Calendar, TrendingUp } from "lucide-react";
import { PublicLayout } from '@/components/public/PublicLayout'
import { CTASection } from '@/components/public/CTASection'
import ActivityGallery from "@/components/public/activism/ActivityGallery";

const Activism = () => {
  return (
    <PublicLayout>
      <main>
        {/* Refined Hero Section with Gradient Background */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary">
          {/* Floating Accents */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-56 h-56 bg-bright/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl" />
            <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10 pt-28 pb-16">
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <span className="inline-block bg-bright/90 text-primary font-bold px-4 py-1.5 rounded-full text-sm tracking-wide">
                משנים את המציאות
              </span>

              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
                אקטיביזם
                <span className="text-bright"> שמשנה עולמות</span>
              </h1>

              <p className="text-base md:text-lg text-primary-foreground/90 leading-relaxed max-w-lg mx-auto">
                לא רק מדברים – <span className="text-bright font-semibold">פועלים!</span> קמפיינים ציבוריים, מפגשי כנסת, עצומות ותמיכה קהילתית.
              </p>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full">
              <path d="M0 60L60 52C120 44 240 28 360 22C480 16 600 16 720 20C840 24 960 32 1080 36C1200 40 1320 40 1380 40L1440 40V60H0Z" fill="white"/>
            </svg>
          </div>
        </section>

        {/* Activity Gallery */}
        <ActivityGallery />

        {/* Activities */}
        <section className="py-20 bg-gradient-to-b from-accent/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <span className="inline-block bg-secondary/20 text-secondary font-bold px-4 py-2 rounded-full text-sm">איך אנחנו פועלים</span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary">הדרכים שלנו להשפיע</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-premium transition-smooth group">
                  <div className="inline-block p-4 bg-bright/10 rounded-2xl mb-6 group-hover:bg-bright/20 transition-smooth">
                    <Calendar className="w-12 h-12 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">אירועים ציבוריים</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    כנסים, מפגשי הורים, הרצאות ציבוריות ואירועי מודעות בכיכרות ובמרכזים קהילתיים
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-premium transition-smooth group">
                  <div className="inline-block p-4 bg-bright/10 rounded-2xl mb-6 group-hover:bg-bright/20 transition-smooth">
                    <Megaphone className="w-12 h-12 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">קמפיינים תקשורתיים</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    פעילות במדיה החברתית, ראיונות בתקשורת, מאמרי דעה וסרטוני וידאו ויראליים
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-premium transition-smooth group">
                  <div className="inline-block p-4 bg-bright/10 rounded-2xl mb-6 group-hover:bg-bright/20 transition-smooth">
                    <TrendingUp className="w-12 h-12 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">השפעה מדינית</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    פגישות עם חברי כנסת, משרדי ממשלה ורשויות מקומיות לקידום שינוי מדיניות
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Media Coverage */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <span className="inline-block bg-bright/20 text-secondary font-bold px-4 py-2 rounded-full text-sm">בתקשורת</span>
              <h2 className="text-4xl font-bold text-primary">הסיפור שלנו בכותרות</h2>
              <p className="text-xl text-foreground/70">
                התנועה שלנו זוכה לסיקור נרחב בתקשורת הישראלית
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {['ערוץ 12', 'ערוץ 13', 'גלי צה"ל', 'הארץ', 'ידיעות אחרונות', 'כלכליסט', 'וואלה', 'ynet'].map((media, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-soft flex items-center justify-center hover:shadow-premium transition-smooth">
                    <span className="font-bold text-primary">{media}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA Section */}
        <CTASection />
      </main>
    </PublicLayout>
  );
};

export default Activism;
