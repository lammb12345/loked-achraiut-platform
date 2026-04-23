import { Target, Users, Award, Heart, Shield, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicLayout } from '@/components/public/PublicLayout'
import { Button } from "@/components/ui/button";
import { CTASection } from '@/components/public/CTASection'
import graduationCapGif from "@/assets/graduation-cap.gif";
import lawGif from "@/assets/law.gif";
import ideaTargetGif from "@/assets/idea-target.gif";
import videoGif from "@/assets/video.gif";
import robotGif from "@/assets/robot.gif";
import customerServiceGif from "@/assets/customer-service.gif";
import friendshipGif from "@/assets/friendship.gif";

const activities = [
  { image: lawGif, title: "חקיקה ואקטיביזם", subtitle: "להגנת ילדים ברשת" },
  { image: ideaTargetGif, title: "כלים חדשניים", subtitle: "לניהול זמן מסך וקשיבות דיגיטלית" },
  { image: videoGif, title: "הדרכות מקיפות וידע", subtitle: "להורים ואנשי טיפול" },
  { image: graduationCapGif, title: "ליווי מוסדות חינוכיים", subtitle: "והרצאות לנוער וצוותים" },
  { image: robotGif, title: "מיזמים פורצי דרך", subtitle: "בתקשורת מקדמת חוסן" },
  { image: customerServiceGif, title: "ליווי טכנולוגי ורגשי", subtitle: "להורים" },
  { image: friendshipGif, title: "שיתופי פעולה", subtitle: "עם אנשי מחקר וטיפול, חברות טק, ורשתות חברתיות" }
];

const About = () => {
  return (
    <PublicLayout>
      <main>
        {/* Refined Hero Section with Gradient Background */}
        <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary">
          {/* Floating Accents */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-5 md:top-20 md:left-10 w-32 md:w-64 h-32 md:h-64 bg-bright/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-40 md:w-80 h-40 md:h-80 bg-secondary/30 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10 pt-24 md:pt-28 pb-12 md:pb-16">
            <div className="max-w-3xl mx-auto text-center space-y-3 md:space-y-5">
              <span className="inline-block bg-bright/90 text-primary font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm tracking-wide animate-fade-in">
                מאז 2018
              </span>

              <h1 className="text-2xl md:text-5xl font-bold text-primary-foreground leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                קצת עלינו
              </h1>

              <p className="text-sm md:text-lg text-primary-foreground/90 leading-relaxed max-w-xl mx-auto animate-fade-in px-4 md:px-0" style={{ animationDelay: '0.2s' }}>
                תנועה חינוכית-לאומית שהוקמה למען שמירה על ילדי ישראל בעידן המסכים
              </p>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute -bottom-px left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full block">
              <path d="M0 60L60 52C120 44 240 28 360 22C480 16 600 16 720 20C840 24 960 32 1080 36C1200 40 1320 40 1380 40L1440 40V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="white"/>
            </svg>
          </div>
        </section>

        {/* Vision Section - Opening */}
        <section dir="rtl" className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
              {/* Main Introduction */}
              <div className="space-y-3 md:space-y-6">
                <p className="text-base md:text-2xl text-foreground/80 leading-relaxed">
                  נעים להכיר! אנחנו
                </p>
                <h2 className="text-2xl md:text-5xl font-bold leading-tight bg-gradient-to-l from-[#1B365D] via-[#2E7AB8] to-[#7BC4E8] bg-clip-text text-transparent">
                  עמותת "לוקחים אחריות"
                </h2>
              </div>

              {/* Mission Statement */}
              <div className="space-y-3 md:space-y-4 max-w-3xl mx-auto px-2">
                <p className="text-sm md:text-xl text-foreground/80 leading-relaxed">
                  אנחנו כאן כדי ליצור{" "}
                  <span className="font-bold text-primary">שינוי חברתי חיובי</span>{" "}
                  במרחב הרשת.
                </p>
                <p className="text-sm md:text-xl text-foreground/70 leading-relaxed">
                  לסייע להמונים לפתח מודעות{" "}
                  <span className="font-semibold">לשימוש בריא, אחראי ומצמיח</span>{" "}
                  במדיה,
                  <br className="hidden md:block" />
                  להפחית זמן מסך שלילי ופוגעני,
                  <br className="hidden md:block" />
                  ולהתמודד בצורה מיטבית עם אתגרי המסך.
                </p>
              </div>

              {/* Activities Header */}
              <div>
                <p className="text-base md:text-2xl font-semibold text-primary mb-4 md:mb-8">
                  את כל זה אנחנו עושים באמצעות:
                </p>
              </div>

              {/* Activities Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-3 md:p-6 rounded-xl md:rounded-2xl bg-white shadow-soft hover:shadow-premium hover:scale-105 transition-smooth animate-fade-up opacity-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <img src={activity.image} alt={activity.title} className="w-10 h-10 md:w-16 md:h-16 mb-2 md:mb-4 mx-auto object-contain" />
                    <h3 className="text-xs md:text-lg font-bold text-primary mb-1 md:mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-foreground/70 text-[10px] md:text-sm hidden md:block">{activity.subtitle}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 md:gap-8 pt-6 md:pt-12">
                <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-8 shadow-soft text-center">
                  <div className="text-xl md:text-5xl font-bold text-bright mb-1 md:mb-2">70K+</div>
                  <div className="text-foreground/70 font-medium text-[10px] md:text-base">הורים ומחנכים בקהילה</div>
                </div>
                <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-8 shadow-soft text-center">
                  <div className="text-xl md:text-5xl font-bold text-bright mb-1 md:mb-2">100K+</div>
                  <div className="text-foreground/70 font-medium text-[10px] md:text-base">תלמידים, הורים ומורים</div>
                </div>
                <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-8 shadow-soft text-center">
                  <div className="text-xl md:text-5xl font-bold text-bright mb-1 md:mb-2">20K+</div>
                  <div className="text-foreground/70 font-medium text-[10px] md:text-base">פניות בשנה במוקד אור</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="space-y-4 md:space-y-8 text-center lg:text-right">
                  <span className="inline-block bg-bright/20 text-secondary font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm">הסיפור שלנו</span>
                  <h2 className="text-2xl md:text-5xl font-bold text-primary">
                    נולדנו מתוך
                    <br />
                    <span className="text-secondary">אכפתיות אמיתית</span>
                  </h2>
                  <div className="space-y-3 md:space-y-6 text-sm md:text-lg text-foreground/80 leading-relaxed">
                    <p>
                      "לוקחים אחריות" נולדה מתוך הכרה עמוקה בצורך דחוף: הורים, מחנכים ומובילי דעה קהל בישראל מבינים שעידן המסכים משנה את פני הילדות.
                    </p>
                    <p className="hidden md:block">
                      מתוך כאב לב על דור שלם שגדל עם טלפון נייד בגיל צעיר מדי, הקמנו מערך פעולה רב-זרועי: ייעוץ טכנולוגי אישי להורים, ליווי והדרכה למוסדות חינוך, ופעילות חברתית-ציבורית.
                    </p>
                  </div>
                </div>

                {/* Visual Card */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-bright/20 to-secondary/20 rounded-2xl md:rounded-3xl blur-xl" />
                  <div className="relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-premium">
                    <div className="space-y-4 md:space-y-8">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-bright/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                          <Shield className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                        </div>
                        <div>
                          <div className="text-xl md:text-3xl font-bold text-primary">2018</div>
                          <div className="text-foreground/60 text-xs md:text-base">שנת הייסוד</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                          <Users className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                        </div>
                        <div>
                          <div className="text-xl md:text-3xl font-bold text-primary">50,000+</div>
                          <div className="text-foreground/60 text-xs md:text-base">משפחות הגענו אליהן</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-bright/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                        </div>
                        <div>
                          <div className="text-xl md:text-3xl font-bold text-primary">500+</div>
                          <div className="text-foreground/60 text-xs md:text-base">מוסדות חינוך</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Values */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-accent/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 md:mb-16 space-y-2 md:space-y-4">
                <span className="inline-block bg-secondary/20 text-secondary font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm">מה מנחה אותנו</span>
                <h2 className="text-2xl md:text-5xl font-bold text-primary">הערכים שלנו</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8">
                <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-8 shadow-soft hover:shadow-premium transition-smooth group">
                  <div className="inline-block p-2 md:p-4 bg-bright/10 rounded-lg md:rounded-2xl mb-3 md:mb-6 group-hover:bg-bright/20 transition-smooth">
                    <Target className="w-6 h-6 md:w-12 md:h-12 text-secondary" />
                  </div>
                  <h3 className="text-sm md:text-2xl font-bold text-primary mb-1 md:mb-4">אחריות משותפת</h3>
                  <p className="text-foreground/70 leading-relaxed text-xs md:text-base hidden md:block">
                    שמירה על הילדים היא אחריות של כולנו – הורים, מחנכים, מקבלי החלטות והחברה כולה.
                  </p>
                </div>

                <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-8 shadow-soft hover:shadow-premium transition-smooth group">
                  <div className="inline-block p-2 md:p-4 bg-bright/10 rounded-lg md:rounded-2xl mb-3 md:mb-6 group-hover:bg-bright/20 transition-smooth">
                    <Heart className="w-6 h-6 md:w-12 md:h-12 text-secondary" />
                  </div>
                  <h3 className="text-sm md:text-2xl font-bold text-primary mb-1 md:mb-4">חינוך ולא פחד</h3>
                  <p className="text-foreground/70 leading-relaxed text-xs md:text-base hidden md:block">
                    אנחנו מאמינים בגישה חינוכית מאוזנת – להעניק כלים, ידע והבנה כיצד לנווט בעולם הדיגיטלי.
                  </p>
                </div>

                <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-8 shadow-soft hover:shadow-premium transition-smooth group">
                  <div className="inline-block p-2 md:p-4 bg-bright/10 rounded-lg md:rounded-2xl mb-3 md:mb-6 group-hover:bg-bright/20 transition-smooth">
                    <Users className="w-6 h-6 md:w-12 md:h-12 text-secondary" />
                  </div>
                  <h3 className="text-sm md:text-2xl font-bold text-primary mb-1 md:mb-4">תמיכה קהילתית</h3>
                  <p className="text-foreground/70 leading-relaxed text-xs md:text-base hidden md:block">
                    אף משפחה לא לבד. אנחנו בונים קהילות תומכות של הורים ומחנכים.
                  </p>
                </div>

                <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-8 shadow-soft hover:shadow-premium transition-smooth group">
                  <div className="inline-block p-2 md:p-4 bg-bright/10 rounded-lg md:rounded-2xl mb-3 md:mb-6 group-hover:bg-bright/20 transition-smooth">
                    <Award className="w-6 h-6 md:w-12 md:h-12 text-secondary" />
                  </div>
                  <h3 className="text-sm md:text-2xl font-bold text-primary mb-1 md:mb-4">מצוינות ומקצועיות</h3>
                  <p className="text-foreground/70 leading-relaxed text-xs md:text-base hidden md:block">
                    כל הליווי וההדרכה שלנו מבוססים על מחקר מעמיק, ידע טכנולוגי והבנה חינוכית.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 md:mb-16 space-y-2 md:space-y-4">
                <span className="inline-block bg-bright/20 text-secondary font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm">המסע שלנו</span>
                <h2 className="text-2xl md:text-5xl font-bold text-primary">ציוני דרך</h2>
              </div>

              <div className="space-y-4 md:space-y-8">
                {[
                  { year: '2018', title: 'הקמת התנועה', desc: 'התחלנו כקבוצת הורים מודאגים שרצו לעשות משהו' },
                  { year: '2019', title: 'מוקד אור', desc: 'הקמנו את מרכז הייעוץ הטכנולוגי הראשון להורים' },
                  { year: '2020', title: 'התרחבות ארצית', desc: 'הגענו ל-100 מוסדות חינוך ברחבי הארץ' },
                  { year: '2022', title: 'קמפיין לאומי', desc: 'השקנו את קמפיין "דחיית גיל הסמארטפון"' },
                  { year: '2024', title: 'השפעה פוליטית', desc: '3 הצעות חוק בקידום בכנסת' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 md:gap-6 items-start group">
                    <div className="flex-shrink-0 w-14 h-14 md:w-24 md:h-24 bg-gradient-to-br from-primary to-secondary rounded-xl md:rounded-2xl flex items-center justify-center shadow-premium group-hover:scale-105 transition-smooth">
                      <span className="text-sm md:text-2xl font-bold text-white">{item.year}</span>
                    </div>
                    <div className="pt-1 md:pt-2">
                      <h3 className="text-base md:text-2xl font-bold text-primary mb-0.5 md:mb-2">{item.title}</h3>
                      <p className="text-foreground/70 text-xs md:text-lg">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-accent/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-8">
              <span className="inline-block bg-secondary/20 text-secondary font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm">הצוות</span>
              <h2 className="text-2xl md:text-4xl font-bold text-primary">האנשים מאחורי התנועה</h2>
              <p className="text-sm md:text-xl text-foreground/70 px-4">
                צוות מקצועי ומסור המונה מומחי חינוך, יועצי טכנולוגיה, פסיכולוגים ומנהיגות קהילתיים
              </p>
              <div className="pt-4 md:pt-8">
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="bg-bright hover:bg-bright/90 text-primary font-bold shadow-glow text-sm md:text-base px-6 py-5"
                  >
                    צרו קשר עם הצוות
                  </Button>
                </Link>
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

export default About;
