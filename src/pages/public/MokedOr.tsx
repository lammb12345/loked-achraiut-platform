import { PublicLayout } from '@/components/public/PublicLayout'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Settings, Phone, Smartphone, Star, MessageCircle, ExternalLink } from "lucide-react";

const MokedOr = () => {
  return (
    <PublicLayout>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-4 bg-gradient-primary">
          <div className="container mx-auto max-w-6xl text-center">

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              פתרונות טכנולוגיים<br />לאתגרי הרשת
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              מוקד אור מספק ייעוץ ותמיכה בהתאמת פתרונות טכנולוגיים ליחידים ולמשפחות – ללא עלות וללא מטרות רווח. הפתרון עבורכם קרוב מתמיד!
            </p>
            <div className="flex justify-center gap-4 flex-wrap mb-8">
              <Button size="lg" className="bg-bright hover:bg-bright/90 text-primary font-bold text-lg px-8 py-6">
                <MessageCircle className="ml-2 h-5 w-5" />
                ייעוץ בוואטסאפ
              </Button>
              <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 border-2">
                תרמו למהפכה
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              מאושר ע"י מומחי טכנולוגיה וגדולי הרבנים
            </p>
          </div>
        </section>

        {/* What's Special About Us */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-4">מה מיוחד בנו?</h2>
            <p className="text-center text-xl text-muted-foreground mb-12 max-w-4xl mx-auto">
              אספנו ובדקנו עשרות אפליקציות ומכשירים, ונמליץ לכם על הפתרונות הרלוונטיים והאיכותיים ביותר כיום להתנהלות בריאה במדיה – אישית ומשפחתית.
            </p>
          </div>
        </section>

        {/* Simple Devices Section */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Phone className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-4xl font-bold mb-4">מכשירים פשוטים ומותאמים</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                עשרות אלפי אפליקציות, מאות פיצ'רים ובעיקר פיזור נפשי וריחוק חברתי – האם נכון לתת לילד סמארטפון בגיל צעיר? אם לא – מה החלופה? אספנו עבורכם את המכשירים הפשוטים, המותאמים והאיכותיים ביותר לילדות תוססת ואמיתית.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[{
                name: "נוקיא 110",
                desc: "מכשיר מקשים פשוט 4G",
                price: "₪194-204",
                rating: 4
              }, {
                name: "נוקיא 3210 2024",
                desc: "מכשיר מקשים איכותי ומאסיבי",
                price: "₪307-317",
                rating: 5
              }, {
                name: "שיאומי Qin 1s+",
                desc: "מכשיר מקשים איכותי - חסום לאינטרנט",
                price: "₪297-336",
                rating: 4
              }, {
                name: "שיאומי F21 פרו",
                desc: "מקשים משולב מגע - מוגן וללא דפדפן",
                price: "₪497-636",
                rating: 5
              }, {
                name: "שיאומי F22 פרו",
                desc: "מקשים משולב מגע - מוגן וללא דפדפן",
                price: "₪637-676",
                rating: 4
              }, {
                name: "שיאומי Qin 3 ultra",
                desc: "מכשיר טאצ' איכותי - מוגן וללא דפדפן",
                price: "₪779",
                rating: 5
              }].map((device, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Smartphone className="h-12 w-12 text-primary" />
                      <div className="flex">
                        {[...Array(device.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{device.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{device.desc}</p>
                    <div className="flex gap-2 mb-4 text-xs">
                      <span className="bg-accent px-2 py-1 rounded">שיחות והודעות</span>
                      <span className="bg-accent px-2 py-1 rounded">וואטסאפ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{device.price}</span>
                      <Button variant="outline" size="sm">
                        לפרטים <ExternalLink className="mr-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Protection & Filtering Section */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-4xl font-bold mb-4">הגנה וסינון תוכן</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                במרחבי הרשת אפשר לצמוח בגדול, אך אפשר גם להיחשף לתכנים פוגעניים ולא ראויים. אספנו עבורכם את הפתרונות הטובים ביותר – בחינם ובתשלום – להגנה מלאה ואיכותית על ילדיכם ברשת.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[{
                name: "כשר פליי",
                desc: "אפליקציית חסימה לסמרטפון/מחשב מוגן",
                price: "₪150-170 לשנה",
                rating: 4
              }, {
                name: "נטספארק",
                desc: "מסלולי הגנה מותאמים אישית - שירות סינון מתקדם",
                price: "מ-₪219 לשנה",
                rating: 4
              }, {
                name: "רימון",
                desc: "שומרים על הבית - שירות סינון מתקדם בתשלום",
                price: "לפי חבילה",
                rating: 4.5
              }, {
                name: "סינון חינמי ובסיסי",
                desc: "שירות סינון של ספקיות האינטרנט",
                price: "ללא עלות",
                rating: 2
              }].map((service, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Shield className="h-10 w-10 text-primary" />
                      <div className="flex">
                        {[...Array(Math.floor(service.rating))].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{service.price}</span>
                      <Button variant="outline" size="sm">
                        לפרטים <ExternalLink className="mr-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Parental Control Section */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Settings className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-4xl font-bold mb-4">ניהול עצמי ובקרת הורים</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                בסמארטפון או במחשב, בקרת הורים היא הדרך שלכם להקנות למשפחה הרגלים דיגיטליים בריאים. החליטו יחד מהו זמן המסך הראוי, ובאילו שעות המכשירים יהיו כבויים.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[{
                name: "Google Family Link",
                desc: "אפליקציית בקרת הורים למכשירים ניידים",
                price: "ללא עלות",
                rating: 4.5
              }, {
                name: "Stay Focused",
                desc: "אפליקציית ניהול עצמי לאנדרואיד",
                price: "ללא עלות",
                rating: 4
              }, {
                name: "Apple Screen Time",
                desc: "בקרת הורים וניהול עצמי למכשירי אפל",
                price: "ללא עלות",
                rating: 5
              }, {
                name: "Surfie",
                desc: "בקרת הורים, ניהול זמנים וסינון תוכן",
                price: "₪245 לשנה",
                rating: 2.5
              }, {
                name: "גולשים בזמן",
                desc: "תכנה לבקרת הורים במחשב עבור ילדים ונוער",
                price: "לפרטים",
                rating: 4
              }, {
                name: "Kid Security",
                desc: "אפליקציית בקרת הורים לאנדרואיד עבור ילדים",
                price: "לפרטים",
                rating: 4
              }].map((app, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Settings className="h-10 w-10 text-primary" />
                      <div className="flex">
                        {[...Array(Math.floor(app.rating))].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{app.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{app.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">{app.price}</span>
                      <Button variant="outline" size="sm">
                        לפרטים <ExternalLink className="mr-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Consultation Section */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-gradient-primary border-0 shadow-glow">
              <CardContent className="p-12 text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-6 text-primary" />
                <h2 className="text-3xl font-bold mb-4">לייעוץ והכוונה טכנולוגית</h2>
                <p className="text-xl mb-6">פנו אלינו בוואטסאפ!</p>
                <p className="text-lg mb-8 text-muted-foreground">ימים א'-ה' בשעות 13:00-16:00</p>
                <Button size="lg" className="bg-bright hover:bg-bright/90 text-primary font-bold text-lg px-12 py-6 mb-6">
                  <MessageCircle className="ml-2 h-6 w-6" />
                  לחצו לשליחת הודעת וואטסאפ
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-12">מספרים עלינו</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[{
                text: "המקצועיות, מהירות התגובה, הידע והסדר שווה הכל! תודה רבה על שירות מסור! מוקד אור אין עליכם!",
                author: "אנונימי",
                location: "קדימה-צורן"
              }, {
                text: "וואאוו אין לי מילים להודות לכם. זה סינון מצוין. בדיוק כמו שרציתי. השם ישמור אותכם מכול רע תמיד. תודה יישר כוח.",
                author: "אליאור אביתר בניתה",
                location: "רחובות"
              }, {
                text: "תודה גדולה. רק מילה טובה - הפעילות שלכם זה ההבדל הגדול בין מי שעושה, למי שרק יודע לזעוק...",
                author: "דוד ירוסלביץ",
                location: "בית שאן"
              }].map((testimonial, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">&quot;{testimonial.text}&quot;</p>
                    <div className="border-t pt-3">
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-4 bg-gradient-accent">
          <div className="container mx-auto max-w-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">אל תישארו מאחור!</h2>
              <p className="text-xl text-muted-foreground">
                השאירו פרטים ונדאג לעדכן אתכם בכל הכלים והפתרונות החדשים
              </p>
            </div>
            <Card>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">שם מלא</label>
                    <Input placeholder="מה שמך?" className="text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">טלפון</label>
                    <Input type="tel" placeholder="שנוכל לשוחח" className="text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">אימייל</label>
                    <Input type="email" placeholder="אליו נשלח עדכונים" className="text-lg" />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
                    שלחו את הפרטים
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
};

export default MokedOr;
