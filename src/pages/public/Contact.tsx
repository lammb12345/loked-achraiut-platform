import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import { CTASection } from '@/components/public/CTASection'
import { PublicLayout } from '@/components/public/PublicLayout'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";

const Contact = () => {
  const ravpageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ravpageRef.current) {
      const script = document.createElement('script');
      script.src = '//js.ravpages.co.il/xsite_resources/js/static/cached/xsites/formoutput/122025/v2_xsites__formoutput__567e89139da0a999a1db58ee1f505f7f_a9400e332f8b92f25620695c49483c46_1766058787.js?rxc=1705555703';
      script.async = true;
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '//css.ravpages.co.il/xsite_resources/js/static/cached/xsites/formoutput/122025/v2_xsites__formoutput__07a9da45f5b499f233368ac326869fcd_5b76840b89cab0794bf7af70e2a49765_1766058787_secure.css?rxc=1705555703';
      document.head.appendChild(link);

      return () => {
        document.body.removeChild(script);
        document.head.removeChild(link);
      };
    }
  }, []);

  return (
    <PublicLayout>
      <main>
        {/* Refined Hero Section with Gradient Background */}
        <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary">
          {/* Floating Accents */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-48 h-48 bg-bright/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10 pt-28 pb-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="inline-block bg-bright/90 text-primary font-bold px-4 py-1.5 rounded-full text-sm tracking-wide animate-fade-in">
                נשמח לשמוע מכם
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                צרו איתנו
                <span className="text-bright"> קשר</span>
              </h1>

              <p className="text-base text-primary-foreground/90 leading-relaxed max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                יש לכם שאלה? רעיון? רוצים להצטרף? <span className="text-bright font-semibold">אנחנו כאן!</span>
              </p>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 50" fill="none" className="w-full">
              <path d="M0 50L60 44C120 38 240 26 360 22C480 18 600 18 720 21C840 24 960 30 1080 33C1200 36 1320 36 1380 36L1440 36V50H0Z" fill="white"/>
            </svg>
          </div>
        </section>

        {/* Contact Options Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white rounded-3xl p-8 shadow-soft text-center hover:shadow-premium transition-smooth group">
                  <div className="inline-block p-4 bg-bright/10 rounded-2xl mb-6 group-hover:bg-bright/20 transition-smooth">
                    <Phone className="w-12 h-12 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">מוקד אור</h3>
                  <p className="text-foreground/70 mb-6">
                    ייעוץ טכנולוגי אישי להורים
                  </p>
                  <div className="space-y-2">
                    <p className="font-bold text-primary text-xl">1-800-123-456</p>
                    <p className="text-sm text-foreground/60">ימים א'-ה' 9:00-21:00</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-soft text-center hover:shadow-premium transition-smooth group">
                  <div className="inline-block p-4 bg-bright/10 rounded-2xl mb-6 group-hover:bg-bright/20 transition-smooth">
                    <Mail className="w-12 h-12 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">אימייל</h3>
                  <p className="text-foreground/70 mb-6">
                    נחזור אליכם תוך 24 שעות
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium text-primary break-all">info@lokchim-achrayut.org.il</p>
                    <p className="text-sm text-foreground/60">זמינים 24/7</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-soft text-center hover:shadow-premium transition-smooth group">
                  <div className="inline-block p-4 bg-bright/10 rounded-2xl mb-6 group-hover:bg-bright/20 transition-smooth">
                    <MessageCircle className="w-12 h-12 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">וואטסאפ</h3>
                  <p className="text-foreground/70 mb-6">
                    תשובות מהירות בצ'אט
                  </p>
                  <div className="space-y-2">
                    <p className="font-bold text-primary text-xl">050-123-4567</p>
                    <p className="text-sm text-foreground/60">ימים א'-ה' 9:00-21:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Contact Form */}
        <section className="py-16 bg-gradient-to-b from-accent/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <span className="inline-block bg-bright/20 text-secondary font-bold px-4 py-2 rounded-full text-sm">טופס יצירת קשר</span>
                <h2 className="text-4xl font-bold text-primary">שלחו לנו הודעה</h2>
                <p className="text-xl text-foreground/70">
                  מלאו את הפרטים ונחזור אליכם בהקדם האפשרי
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-premium">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">שם מלא *</label>
                      <Input placeholder="הכניסו את שמכם המלא" className="h-12" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">טלפון *</label>
                      <Input type="tel" placeholder="050-1234567" className="h-12" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">אימייל *</label>
                    <Input type="email" placeholder="your@email.com" className="h-12" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">נושא הפנייה *</label>
                    <Input placeholder="לדוגמה: ייעוץ טכנולוגי, הזמנת הרצאה, הצטרפות לתנועה" className="h-12" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">ההודעה שלכם *</label>
                    <Textarea placeholder="ספרו לנו במה נוכל לעזור..." className="min-h-[200px] resize-none" required />
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="consent" className="mt-1" required />
                    <label htmlFor="consent" className="text-sm text-foreground/70">
                      אני מסכים/ה לקבל מידע ועדכונים מ"לוקחים אחריות" ומאשר/ת שמירת הפרטים ליצירת קשר
                    </label>
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-bright hover:bg-bright/90 text-primary font-bold shadow-glow text-lg h-14">
                    <Send className="ml-2" />
                    שלחו הודעה
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-center text-sm text-foreground/60">
                    הפרטים שלכם מוגנים ולא יועברו לצד שלישי.
                    <a href="#" className="text-secondary hover:underline mr-1">קראו את מדיניות הפרטיות</a>
                  </p>
                </div>
              </div>

              {/* Embedded Ravpage Form */}
              <div className="mt-12 pt-12 border-t border-border">
                <div className="text-center space-y-4 mb-8">
                  <h3 className="text-2xl font-bold text-primary">הרשמו לעדכונים שיעזרו לכם להיות הורים טובים יותר!</h3>
                  <p className="text-foreground/70">נעדכן אתכם בכל מה שחשוב לדעת</p>
                </div>

                <div ref={ravpageRef} className="ravpage-form-container bg-accent/5 rounded-2xl p-6 md:p-8" style={{ direction: 'rtl' }}>
                  <form className="form space-y-4" action="https://subscribe.responder.co.il/" method="post">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">שם מלא</label>
                        <Input name="fields[subscribers_name]" type="text" placeholder="הכניסו את שמכם" className="h-12" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">כתובת אימייל</label>
                        <Input name="fields[subscribers_email]" type="email" placeholder="your@email.com" className="h-12" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">טלפון</label>
                        <Input name="fields[subscribers_phone]" type="tel" placeholder="050-1234567" className="h-12" required />
                      </div>
                    </div>

                    <input type="hidden" name="__ravxx_url__" value="http://form.ravpage.co.il/908ebe9b5b3f55ea60ff5e869702f2c069709320" />
                    <input type="hidden" name="form_id" value="2842449" />
                    <input type="hidden" name="encoding" value="utf-8" />

                    <Button type="submit" size="lg" className="w-full bg-bright hover:bg-bright/90 text-primary font-bold shadow-glow text-lg h-14 mt-6">
                      <Send className="ml-2" />
                      להרשמה
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Info */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-primary">המשרדים שלנו</h2>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-bright/20 rounded-2xl flex items-center justify-center">
                        <MapPin className="text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary mb-2">כתובת</h3>
                        <p className="text-foreground/70">
                          רחוב ההגנה 25, תל אביב<br />
                          קומה 3, בניין המרכז החינוכי
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-bright/20 rounded-2xl flex items-center justify-center">
                        <Clock className="text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary mb-2">שעות פעילות</h3>
                        <p className="text-foreground/70">
                          ימים א'-ה': 9:00-18:00<br />
                          יום ו': 9:00-14:00<br />
                          שבת וחגים: סגור
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-bright/20 rounded-2xl flex items-center justify-center">
                        <Phone className="text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary mb-2">מוקד טלפוני</h3>
                        <p className="text-foreground/70">
                          מוקד אור: 1-800-123-456<br />
                          משרד ראשי: 03-1234567<br />
                          פקס: 03-1234568
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-secondary/10 to-bright/10 rounded-3xl p-8 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <MapPin className="w-24 h-24 text-secondary mx-auto" />
                    <h3 className="text-2xl font-bold text-primary">נשמח לראותכם</h3>
                    <p className="text-foreground/70">
                      תיאום פגישה מראש מומלץ
                    </p>
                    <Button className="bg-bright hover:bg-bright/90 text-primary font-bold shadow-glow">
                      תיאום פגישה
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <CTASection />
      </main>
    </PublicLayout>
  );
};

export default Contact;
