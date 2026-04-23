import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  Clock,
  Video,
  Users,
  Bot,
  FileText,
  Award,
  Star,
  ShieldCheck,
  Sparkles,
  Gift,
  Zap,
  BookOpen,
  ArrowDown,
  ChevronDown,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PublicLayout } from '@/components/public/PublicLayout';

// Images
import fatherChild from "@/assets/father-child-computer.png";
import happyKids from "@/assets/happy-kids-phones.png";
import customerService from "@/assets/customer-service.gif";
import friendship from "@/assets/friendship.gif";
import graduationCap from "@/assets/graduation-cap.gif";
import ideaTarget from "@/assets/idea-target.gif";
import robotGif from "@/assets/robot.gif";
import videoGif from "@/assets/video.gif";

const PURCHASE_URL = "https://secure.cardcom.solutions/EA/EA5/uxYxx1KI0Ua41FQLfCnqBQ/PaymentSP";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function MediaCoaches() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background" dir="rtl">
        {/* HERO - Full screen video background, no header */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <motion.div style={{ scale: heroScale }} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/75 to-primary z-10" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Floating orbs */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="absolute top-[15%] right-[10%] w-[400px] h-[400px] rounded-full bg-bright/10 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[20%] left-[15%] w-[300px] h-[300px] rounded-full bg-secondary/15 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-[50%] left-[50%] w-[200px] h-[200px] rounded-full bg-bright/5 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
          </div>

          {/* Content */}
          <motion.div style={{ opacity: heroOpacity }} className="relative z-20 container mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-5xl mx-auto text-center"
            >
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2 bg-bright/20 backdrop-blur-sm text-bright border border-bright/30 font-bold text-sm sm:text-base px-6 py-2.5 rounded-full">
                  <span className="w-2 h-2 bg-bright rounded-full animate-pulse" />
                  קורס דיגיטלי במחיר מלחמה
                </span>
              </motion.div>

              <motion.p variants={fadeUp} className="text-base sm:text-lg text-primary-foreground/60 mb-3 tracking-wide uppercase font-light">
                אחרי שעזרנו ליותר מ-100,000 משפחות, נוער ואנשי חינוך
              </motion.p>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1]">
                <span className="text-primary-foreground">הכשרת</span>
                <br />
                <span className="relative">
                  <span className="text-bright">מאמני מדיה</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="hsl(45 100% 51%)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg sm:text-2xl md:text-3xl font-light text-primary-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed">
                איך להפוך את הכאוס הדיגיטלי להזדמנות לצמיחה,
                <br className="hidden sm:block" />
                חיבור אמיתי וקריירה חדשה ב-75 יום?
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <a href="#pricing">
                  <Button size="lg" className="bg-bright hover:bg-bright/90 text-primary font-bold text-lg sm:text-xl px-10 sm:px-14 py-6 sm:py-8 shadow-glow rounded-2xl group">
                    <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    לרכישה במחיר מיוחד
                  </Button>
                </a>
              </motion.div>

              {/* Stats strip */}
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 sm:gap-10 text-primary-foreground/50 text-sm">
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-bright/70" /> 10 דקות ביום</span>
                <span className="w-px h-4 bg-primary-foreground/20" />
                <span className="flex items-center gap-2"><Video className="h-4 w-4 text-bright/70" /> 75 סרטוני הדרכה</span>
                <span className="w-px h-4 bg-primary-foreground/20" />
                <span className="flex items-center gap-2"><Award className="h-4 w-4 text-bright/70" /> תעודת הסמכה</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          >
            <ChevronDown className="h-8 w-8 text-primary-foreground/30" />
          </motion.div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
            <svg viewBox="0 0 1440 40" fill="none" className="w-full block">
              <path d="M0 40V20C240 5 480 0 720 10C960 20 1200 25 1440 15V40H0Z" fill="hsl(var(--background))" />
            </svg>
          </div>
        </section>

        {/* Problem Section with image */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          {/* Subtle gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/20 to-background" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="max-w-6xl mx-auto"
            >
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Text side */}
                <div>
                  <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                    <span className="w-2 h-2 bg-destructive rounded-full" />
                    הבעיה שכולנו מכירים
                  </motion.div>

                  <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
                    ברוכים הבאים ל-2026,
                    <br />
                    <span className="text-secondary">העולם הדיגיטלי החדש</span>
                  </motion.h2>

                  <motion.div variants={fadeUp} className="text-lg text-foreground/70 space-y-4 mb-8">
                    <p>מקום שבו במרחק לחיצה אחת, אנחנו משיגים כל מידע, כל קישור, כל צורך.</p>
                    <p>עולם שבו העבודה נמצאת בכף היד, הלמידה זמינה מכל מקום בעולם, ואנחנו כבר לעולם לא רחוקים אחד מהשני!</p>
                    <p className="text-xl font-bold text-primary">אבל...</p>
                    <p>באותו זמן בדיוק, המסכים עלולים להיות גם כלוב של הרגלים לא בריאים.</p>
                  </motion.div>

                  <motion.div variants={fadeUp} className="space-y-3">
                    {[
                      "מי לא מכיר את הרגע שבו הילד שלנו שקוע בטלפון ולא שומע כשקוראים לו?",
                      "כמה מאיתנו התעוררו מבולבלים אחרי שעתיים של שיטוט ברשתות?",
                      "איך אנחנו מתקשים לעמוד בפיתוי ה'סווייפ' האינסופי?",
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-3 bg-destructive/5 rounded-xl px-5 py-4 border border-destructive/10">
                        <span className="text-destructive text-lg mt-0.5">⚠️</span>
                        <p className="text-foreground/70 text-sm sm:text-base">{text}</p>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Image side */}
                <motion.div variants={scaleIn} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-bright/20 to-secondary/20 rounded-3xl blur-3xl -z-10 scale-95" />
                  <div className="relative rounded-3xl overflow-hidden shadow-premium">
                    <img
                      src={happyKids}
                      alt="ילדים עם טלפונים"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                  </div>
                  {/* Floating stat card */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute -bottom-4 -right-4 sm:-right-8 bg-background rounded-2xl shadow-premium p-4 border border-border"
                  >
                    <p className="text-3xl font-bold text-bright">19%</p>
                    <p className="text-xs text-foreground/60">מהילדים חווים<br />קשיי ויסות</p>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div variants={fadeUp} className="text-center mt-16 sm:mt-20">
                <p className="text-2xl sm:text-3xl font-bold text-primary mb-3">
                  זה לא חייב להיות ככה.{" "}
                  <span className="text-bright">אפשר אחרת.</span>
                </p>
                <p className="text-lg text-foreground/60">
                  איך להפוך את המסך לכלי עוצמתי במקום להיות שבוי שלו?
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Band - Glassmorphism */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-primary" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(45_100%_51%/0.08),transparent_70%)]" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-5xl mx-auto"
            >
              {[
                { num: "100,000+", label: "הורים, מורים ונוער", icon: "👨‍👩‍👧‍👦" },
                { num: "75", label: "ימי הכשרה", icon: "📚" },
                { num: "10", label: "דקות ביום", icon: "⏱️" },
                { num: "4", label: "מחזורים", icon: "🎓" },
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center">
                  <span className="text-3xl mb-2 block">{stat.icon}</span>
                  <p className="text-3xl sm:text-5xl font-bold text-bright mb-1">{stat.num}</p>
                  <p className="text-sm sm:text-base text-primary-foreground/60">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Now - with GIFs */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/10 to-background" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="max-w-5xl mx-auto"
            >
              <motion.div variants={fadeUp} className="text-center mb-14">
                <span className="inline-flex items-center gap-2 bg-bright/10 text-bright px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                  <Zap className="h-4 w-4" /> למה דווקא עכשיו?
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold text-primary">
                  הזמן לפעול הוא <span className="text-bright">עכשיו</span>
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    gif: ideaTarget,
                    title: "קצב התמכרות מזנק",
                    desc: "19% מהילדים והנוער חווים קשיי ויסות מול מסכים, ו-5% נמצאים ברמת התמכרות קלינית.",
                    gradient: "from-destructive/10 to-destructive/5",
                  },
                  {
                    gif: customerService,
                    title: "אין מומחים בשטח",
                    desc: "גם לא במערכות הרווחה והטיפול הקלאסיות. התחום חדש ודורש התמחות ייעודית.",
                    gradient: "from-bright/10 to-bright/5",
                  },
                  {
                    gif: friendship,
                    title: "ביקוש עצום",
                    desc: "הרצאות, סדנאות, אימונים אישיים ומשפחתיים – בבתי ספר, רשויות מקומיות ועמותות.",
                    gradient: "from-secondary/10 to-secondary/5",
                  },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp}>
                    <Card className="h-full border-0 shadow-soft hover:shadow-premium transition-all duration-500 group overflow-hidden bg-background">
                      <CardContent className="p-0">
                        <div className={`bg-gradient-to-br ${item.gradient} p-8 flex items-center justify-center`}>
                          <img src={item.gif} alt={item.title} className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                          <p className="text-foreground/60 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Who Is It For - with image */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-accent/30 to-bright/[0.03]" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="max-w-6xl mx-auto"
            >
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Image */}
                <motion.div variants={scaleIn} className="order-2 lg:order-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-bright/10 rounded-3xl blur-3xl -z-10 scale-95" />
                  <div className="rounded-3xl overflow-hidden shadow-premium">
                    <img
                      src={fatherChild}
                      alt="אבא וילד מול מחשב"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                </motion.div>

                {/* Text */}
                <div className="order-1 lg:order-2">
                  <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                    <Users className="h-4 w-4" /> למי זה מתאים?
                  </motion.div>

                  <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-10 leading-tight">
                    למי התוכנית
                    <br />
                    <span className="text-secondary">מתאימה?</span>
                  </motion.h2>

                  <div className="space-y-5">
                    {[
                      { emoji: "🎯", title: "מטפלים ומאמנים", text: "שרוצים כלי חדשני וחיוני למאה ה-21 שיביא להם לקוחות חדשים." },
                      { emoji: "💡", title: "מובילי שינוי", text: "לכל מי שמרגיש שהגיע הזמן ורוצה ללמוד כיצד להשפיע, להדריך ואפילו להרוויח מזה." },
                      { emoji: "🤝", title: "שותפים לעשייה", text: "למי שמעריך את העשייה של לוקחים אחריות ורוצה לגלות את הסודות ולהצטרף." },
                    ].map((item, i) => (
                      <motion.div key={i} variants={fadeUp} className="flex items-start gap-4 bg-background/80 backdrop-blur-sm rounded-2xl p-5 border border-border/50 shadow-soft hover:shadow-premium transition-all duration-400">
                        <span className="text-3xl">{item.emoji}</span>
                        <div>
                          <h3 className="font-bold text-primary text-lg mb-1">{item.title}</h3>
                          <p className="text-foreground/60 text-sm leading-relaxed">{item.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What You Get - Premium cards with GIFs */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/20" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="max-w-5xl mx-auto"
            >
              <motion.div variants={fadeUp} className="text-center mb-14">
                <span className="inline-flex items-center gap-2 bg-bright/10 text-bright px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                  <Gift className="h-4 w-4" /> מה מקבלים?
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold text-primary mb-3">
                  מה מקבלים <span className="text-bright">בקורס?</span>
                </h2>
                <p className="text-foreground/50 text-lg">מודל קצר יומי – 10 דקות ביום, שמייצרות שינוי אמיתי!</p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { gif: videoGif, icon: <Video className="h-5 w-5" />, title: "75 סרטוני הדרכה יומיים", desc: "כל יום סרטון קצר של 10 דקות עם ידע חד, יישומי וברור." },
                  { gif: null, icon: <BookOpen className="h-5 w-5" />, title: "משימות פרקטיות", desc: "כדי להתחיל לשנות הרגלים וליישם מודלים עכשיו." },
                  { gif: robotGif, icon: <Bot className="h-5 w-5" />, title: "בוט AI מתקדם", desc: "בוט בינה מלאכותית זמין 24/7 עם תשובות מקצועיות וכלים פרקטיים." },
                  { gif: null, icon: <FileText className="h-5 w-5" />, title: "חומרי הדרכה פרקטיים", desc: "מערכי שיעור, דפי עבודה, שאלוני אבחון – תשתית מוכנה." },
                  { gif: graduationCap, icon: <Award className="h-5 w-5" />, title: "תעודת הסמכה", desc: "תעודת מאמן/ת מדיה רשמית מטעם ׳לוקחים אחריות׳." },
                  { gif: null, icon: <Star className="h-5 w-5" />, title: "השתלבות בפרויקטים", desc: "בוגרים מצטיינים מקבלים הזדמנות להרצות ולהדריך." },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp}>
                    <Card className="h-full border-0 shadow-soft hover:shadow-premium transition-all duration-500 group bg-background overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-11 h-11 bg-gradient-to-br from-bright/20 to-bright/5 rounded-xl flex items-center justify-center text-bright group-hover:scale-110 transition-transform duration-300">
                            {item.gif ? (
                              <img src={item.gif} alt="" className="w-7 h-7 object-contain" />
                            ) : (
                              item.icon
                            )}
                          </div>
                          <h3 className="font-bold text-primary text-base">{item.title}</h3>
                        </div>
                        <p className="text-foreground/60 text-sm leading-relaxed">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3 Approaches - Premium dark section */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary" />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bright/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeUp} className="text-center mb-14">
                <span className="inline-flex items-center gap-2 bg-bright/10 backdrop-blur-sm text-bright border border-bright/20 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                  <BookOpen className="h-4 w-4" /> שלוש הגישות המרכזיות
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold text-primary-foreground mb-3">
                  שלוש הגישות שמשנות <span className="text-bright">הכל</span>
                </h2>
                <p className="text-primary-foreground/50 text-lg max-w-2xl mx-auto">
                  היסודות שעזרו לנו לייצר השפעה עוצמתית ומהפכה בחינוך לשימוש בריא במדיה
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {[
                  {
                    num: "01",
                    title: "הגישה המוטיבציונית",
                    subtitle: "להפוך התנגדויות להזדמנויות",
                    points: [
                      "שינוי מתוך בחירה – לגרום לאנשים לרצות שינוי",
                      "שאלות פתוחות במקום הוראות",
                      "החזרת השליטה לילדים ולמתבגרים עם ליווי רגשי",
                    ],
                    gradient: "from-bright/10 to-transparent",
                  },
                  {
                    num: "02",
                    title: "שיטת הסמכות החדשה",
                    subtitle: "להציב גבולות בלי מאבקים",
                    points: [
                      "נוכחות הורית פעילה – מלווה שאינו נעלם",
                      "אחריות עצמית במקום ענישה",
                      "פעולה הדרגתית ובניית הרגלים חדשים",
                    ],
                    gradient: "from-secondary/10 to-transparent",
                  },
                  {
                    num: "03",
                    title: "השפעה אטומית",
                    subtitle: "לייצר שינוי רגשי אמיתי",
                    points: [
                      "שיקוף הקונפליקט הפנימי",
                      "חיבור לצרכים רגשיים עמוקים",
                      "בניית סיפור חדש – ממגבלה לחופש",
                    ],
                    gradient: "from-bright/10 to-transparent",
                  },
                ].map((approach, i) => (
                  <motion.div key={i} variants={fadeUp}>
                    <div className={`h-full rounded-3xl bg-gradient-to-b ${approach.gradient} border border-primary-foreground/10 backdrop-blur-sm p-8 hover:border-bright/30 transition-all duration-500 group`}>
                      <span className="text-6xl font-bold text-bright/20 group-hover:text-bright/40 transition-colors duration-500">{approach.num}</span>
                      <h3 className="text-xl font-bold text-primary-foreground mt-3 mb-1">{approach.title}</h3>
                      <p className="text-primary-foreground/40 text-sm mb-5">{approach.subtitle}</p>
                      <ul className="space-y-3">
                        {approach.points.map((point, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-primary-foreground/70">
                            <CheckCircle2 className="h-4 w-4 text-bright shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Syllabus */}
        <section className="py-20 sm:py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-accent/20" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeUp} className="text-center mb-14">
                <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                  <BookOpen className="h-4 w-4" /> סילבוס מלא
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold text-primary mb-3">
                  75 ימים ל<span className="text-bright">מאמן מדיה!</span>
                </h2>
                <p className="text-foreground/50 text-lg">בכל יום סרטון קצר + משימת יישום</p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Accordion className="space-y-3">
                  {[
                    { week: "שבוע 1-2", title: "מבוא לעולם המדיה ותפקיד המאמן", items: ["ההיבט החברתי והרגשי של העידן הדיגיטלי", "אבחנה בין 'שימוש רצוי' לתלות והתמכרות", "איך נראה תפקיד 'מאמן מדיה'? איך מתחילים?"] },
                    { week: "שבוע 3-4", title: "הגישה המוטיבציונית – שינוי מתוך רצון פנימי", items: ["עקרונות הגישה (שאלות פתוחות, טיפול באמביוולנטיות)", "פיתוח אמון עם ילדים, הורים וצוותי חינוך", "הפיכת משפטי התנגדות להזדמנויות דיאלוג"] },
                    { week: "שבוע 5-6", title: "שיטת הסמכות החדשה – גבולות ברורים", items: ["מודל הסמכות המכבדת של פרופ' חיים עומר", "הצבת גבולות עקביים מול ילדים ומתבגרים", "מה עושים כשגבולות נחצים? (כלים למצבי משבר)"] },
                    { week: "שבוע 7-8", title: "השפעה אטומית – שינוי רגשי אמיתי", items: ["זיהוי קונפליקטים פנימיים", "איך לדבר בשפה שלהם ולהניע שינוי", "בניית 'סיפור חדש' – ממגבלה לחופש"] },
                    { week: "שבוע 9-10", title: "פרקטיקה בעבודה עם משפחות ובתי ספר", items: ["בניית תוכנית ליווי מותאמת אישית", "ניהול תהליכי עבודה עם צוות חינוך ומנהלים", "טכניקות לשיחות קשות במצבי משבר"] },
                    { week: "שבוע 11", title: "להפוך את הידע לקריירה", items: ["כלים לשיווק עצמי כ'מאמן מדיה'", "בניית הצעות מחיר, עבודה עם גופים ציבוריים", "חיבור לרשת המקצועית של 'לוקחים אחריות'"] },
                  ].map((week, i) => (
                    <AccordionItem key={i} value={`week-${i}`} className="bg-background border border-border/50 rounded-2xl px-5 shadow-soft data-[state=open]:shadow-premium transition-shadow">
                      <AccordionTrigger className="text-right hover:no-underline py-5">
                        <div className="flex items-center gap-3">
                          <span className="bg-gradient-to-br from-bright to-bright/70 text-primary px-3 py-1 rounded-lg text-sm font-bold">{week.week}</span>
                          <span className="font-bold text-primary text-base sm:text-lg">{week.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-5">
                        <ul className="space-y-2.5 pr-4">
                          {week.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-foreground/60">
                              <CheckCircle2 className="h-4 w-4 text-bright shrink-0 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Bonuses */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-bright/[0.03]" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="max-w-5xl mx-auto"
            >
              <motion.div variants={fadeUp} className="text-center mb-14">
                <span className="inline-flex items-center gap-2 bg-bright/10 text-bright px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                  <Gift className="h-4 w-4" /> בונוסים מתנה
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold text-primary mb-3">
                  4 בונוסים <span className="text-bright">ללא עלות!</span>
                </h2>
                <p className="text-foreground/50 text-lg">כלולים בקורס ללא תוספת תשלום</p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { gif: videoGif, title: "4 לייבים מוקלטים בזום", value: "4,000", desc: "ניתוח מקרי אמת מהשטח + לייב מיוחד על שיטות שיווק ופרסום." },
                  { gif: robotGif, title: "בוט AI מתקדם", value: "2,500", desc: "תשובות מקצועיות מהירות, רעיונות לתרגילים, מותאם לתכני לוקחים אחריות." },
                  { gif: null, title: "חומרי הדרכה פרקטיים", value: "3,500", desc: "מערכי שיעור, דפי עבודה, שאלוני אבחון – תשתית מוכנה." },
                  { gif: graduationCap, title: "השתלבות בפרויקטים אמיתיים", value: "פרייסלס", desc: "בוגרים מצטיינים מקבלים הפניות להדרכות בבתי ספר ובקליניקות." },
                ].map((bonus, i) => (
                  <motion.div key={i} variants={fadeUp}>
                    <Card className="h-full border-0 shadow-soft hover:shadow-premium transition-all duration-500 group bg-background overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-bright/15 to-bright/5 rounded-2xl flex items-center justify-center">
                            {bonus.gif ? (
                              <img src={bonus.gif} alt="" className="w-9 h-9 object-contain" />
                            ) : (
                              <FileText className="h-6 w-6 text-bright" />
                            )}
                          </div>
                          <span className="bg-gradient-to-r from-bright/20 to-bright/10 text-bright px-3 py-1 rounded-full text-sm font-bold border border-bright/20">
                            שווי {bonus.value} ₪
                          </span>
                        </div>
                        <h3 className="font-bold text-primary text-lg mb-2">{bonus.title}</h3>
                        <p className="text-foreground/60 text-sm leading-relaxed">{bonus.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* PRICING - Dramatic section */}
        <section id="pricing" className="py-20 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary" />
          <div className="absolute inset-0">
            <div className="absolute top-[20%] right-[20%] w-[600px] h-[600px] bg-bright/8 rounded-full blur-[200px]" />
            <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div variants={fadeUp} className="mb-10">
                <span className="inline-flex items-center gap-2 bg-bright/20 backdrop-blur-sm text-bright border border-bright/30 px-5 py-2 rounded-full text-sm font-bold mb-6">
                  <Sparkles className="h-4 w-4" /> הצעה מיוחדת
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold text-primary-foreground mb-3">
                  אז מה העלות של הקורס?
                </h2>
                <p className="text-primary-foreground/50 text-lg">בואו נראה יחד את הערך שתקבלו:</p>
              </motion.div>

              {/* Price Anchoring */}
              <motion.div variants={fadeUp} className="space-y-2 mb-12 max-w-2xl mx-auto">
                {[
                  { item: "75 ימי הכשרה – סרטוני הדרכה יומיים ומשימות", value: "5,000 ₪" },
                  { item: "4 לייבים קבוצתיים מוקלטים בזום", value: "4,000 ₪" },
                  { item: "בוט AI מתקדם", value: "2,500 ₪" },
                  { item: "חומרי הדרכה פרקטיים", value: "3,500 ₪" },
                  { item: "קבוצה סגורה וליווי צמוד", value: "2,000 ₪" },
                  { item: "תעודת הסמכה + השתלבות בפרויקטים", value: "פרייסלס" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3 px-5 rounded-xl bg-primary-foreground/5 border border-primary-foreground/5">
                    <span className="text-sm sm:text-base text-primary-foreground/70 text-right">{row.item}</span>
                    <span className="text-sm sm:text-base font-bold text-primary-foreground/40 whitespace-nowrap mr-4">{row.value}</span>
                  </div>
                ))}
              </motion.div>

              {/* Crossed prices */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                <div className="bg-primary-foreground/5 rounded-2xl px-8 py-5 border border-primary-foreground/10">
                  <p className="text-sm text-primary-foreground/40 mb-1">ערך כולל</p>
                  <p className="text-3xl font-bold line-through decoration-destructive decoration-[3px] text-primary-foreground/30">17,000 ₪</p>
                </div>
                <ArrowDown className="h-6 w-6 text-bright sm:rotate-[-90deg]" />
                <div className="bg-primary-foreground/5 rounded-2xl px-8 py-5 border border-primary-foreground/10">
                  <p className="text-sm text-primary-foreground/40 mb-1">מחיר רגיל</p>
                  <p className="text-3xl font-bold line-through decoration-destructive decoration-[3px] text-primary-foreground/30">4,950 ₪</p>
                </div>
              </motion.div>

              {/* The Price */}
              <motion.div variants={scaleIn}>
                <div className="relative max-w-lg mx-auto">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-bright/30 rounded-3xl blur-3xl -z-10 scale-105" />

                  <div className="absolute -top-5 right-1/2 translate-x-1/2 z-10">
                    <span className="bg-destructive text-destructive-foreground font-bold text-sm px-5 py-2 rounded-full shadow-lg animate-pulse inline-flex items-center gap-2">
                      🔥 מחיר מלחמה – לזמן מוגבל!
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-bright via-bright to-bright/80 rounded-3xl pt-10 pb-8 px-8 sm:px-12 text-primary shadow-glow">
                    <p className="text-lg font-bold mb-3 text-primary/80">קורס דיגיטלי מלא – כולל הכל!</p>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-7xl sm:text-9xl font-bold tracking-tight">870</span>
                      <span className="text-3xl sm:text-4xl font-bold">₪</span>
                    </div>
                    <p className="text-primary/60 font-medium mb-8 text-sm">בלבד! (חיסכון של מעל 94%!)</p>

                    <a href={PURCHASE_URL} target="_blank" rel="noopener noreferrer" className="block">
                      <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-dark font-bold text-xl px-14 py-8 shadow-premium w-full rounded-2xl group">
                        <Sparkles className="ml-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                        רוצה לרכוש עכשיו!
                      </Button>
                    </a>

                    <div className="flex items-center justify-center gap-2 mt-5 text-primary/50 text-sm">
                      <ShieldCheck className="h-4 w-4" />
                      <span>אחריות מלאה ל-14 יום – החזר כספי מלא</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Guarantee */}
        <section className="py-16 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-bright/20 to-bright/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-10 w-10 text-bright" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-primary mb-5">אחריות מלאה ל-14 יום</h3>
              <p className="text-lg text-foreground/60 leading-relaxed max-w-2xl mx-auto">
                אם תוך שבועיים תרגישו שזה לא מה שציפיתם או לא מתאים לכם,
                תקבלו החזר כספי מלא – בלי שום שאלות.
                אנחנו מאמינים לחלוטין בתוכנית שלנו ורוצים שתצאו איתה לדרך רק אם אתם בטוחים!
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 sm:py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/10" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="max-w-3xl mx-auto"
            >
              <motion.div variants={fadeUp} className="text-center mb-14">
                <h2 className="text-3xl sm:text-5xl font-bold text-primary">שאלות נפוצות</h2>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Accordion className="space-y-3">
                  {[
                    { q: "האם אני צריך/ה רקע קודם בהוראה או טיפול?", a: "ממש לא. התוכנית מיועדת לכל מי שרוצה לרכוש כלים יישומיים בתחום המסכים. אין צורך בתואר או הסמכה מוקדמת – אנחנו מתחילים מהבסיס ועובדים צעד-אחר-צעד." },
                    { q: "כמה זמן ביום נדרש להשקיע?", a: "כ-10 דקות ביום בלבד! בכל יום מקבלים סרטון קצר ומשימה יישומית. ההיקם גמיש ומותאם לאנשים עסוקים." },
                    { q: "האם אקבל תעודה רשמית בסיום?", a: "כן. בסיום התוכנית מקבלים תעודת 'מאמן מדיה' מטעם 'לוקחים אחריות', המעידה שרכשתם התמחות פרקטית." },
                    { q: "התוכנית היא רק אונליין?", a: "כן, התוכנית כולה מתקיימת אונליין, כדי שתוכלו ללמוד מכל מקום ובזמן שנוח לכם. בנוסף כלולים לייבים מוקלטים בזום." },
                    { q: "אני כבר עובד/ת בתחום. מה הערך המוסף?", a: "התוכנית משלבת שלושה עמודי תווך באופן ממוקד לבעיית המסכים העכשווית. גם מי שמכיר את הגישות, ימצא כאן יישום ייחודי ופרקטי." },
                    { q: "ואם אתחיל ולא אתחבר?", a: "יש אחריות מלאה ל-14 יום. אם תרגישו שהתוכנית לא מתאימה, תקבלו החזר כספי מלא – בלי שאלות." },
                  ].map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border/50 rounded-2xl px-5 shadow-soft data-[state=open]:shadow-premium transition-shadow">
                      <AccordionTrigger className="text-right hover:no-underline py-5 font-bold text-primary">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-foreground/60 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(45_100%_51%/0.1),transparent_60%)]" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-bold text-primary-foreground mb-5">
                אז מה נשאר לעשות <span className="text-bright">עכשיו?</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-primary-foreground/50 mb-10">
                הצטרפו לקורס הדיגיטלי המלא במחיר מלחמה של 870 ₪ בלבד
                <br />
                ותתחילו את המסע להפוך למאמני מדיה מוסמכים!
              </motion.p>
              <motion.div variants={fadeUp}>
                <a href={PURCHASE_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-bright hover:bg-bright/90 text-primary font-bold text-xl px-14 py-8 shadow-glow rounded-2xl group">
                    <Sparkles className="ml-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                    לרכישה עכשיו – 870 ₪ בלבד
                  </Button>
                </a>
                <p className="text-primary-foreground/30 text-sm mt-5">
                  <ShieldCheck className="inline h-4 w-4 ml-1" />
                  אחריות מלאה ל-14 יום | תשלום מאובטח
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
