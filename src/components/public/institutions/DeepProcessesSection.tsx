import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, GraduationCap, Users, CheckCircle, ArrowLeft, Calendar, FileCheck } from "lucide-react";
import DeepProcessDialog from "./DeepProcessDialog";

export interface DeepProcess {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  phases: {
    title: string;
    description: string;
    details?: string[];
  }[];
  outcomes: string[];
  targetAudience: string[];
}

const deepProcesses: DeepProcess[] = [
  {
    id: "smartphone-delay",
    title: "דחיית גיל הסמארטפון",
    subtitle: "תהליך קהילתי מקיף",
    description: "תהליך שלם ליישוב או מוסד לדחיית גיל קבלת הסמארטפון עם אמנה קהילתית מחייבת",
    icon: <Smartphone className="w-8 h-8" />,
    phases: [
      {
        title: "פגישה ראשונה – גיבוש אמנת המסכים",
        description: "מאמן המדיה של הארגון נפגש עם הוועד המוביל של היישוב/המוסד",
        details: [
          "בניית אמנת מסכים קהילתית משותפת",
          "הגדרת עקרון דחיית גיל קבלת הסמארטפון",
          "הצגת דוגמאות מהשטח מקהילות שהצליחו"
        ]
      },
      {
        title: "פגישה שנייה – הרצאה להורים",
        description: "הרצאה סוחפת ומעשירה על אתגרי המדיה",
        details: [
          "מהם הסיכונים וההשפעות של שימוש לא מבוקר במסכים?",
          "מהי הדרך הבריאה והמאוזנת לשימוש?",
          "מדוע כל כך חשוב לדחות את גיל קבלת הטלפון החכם?",
          "הצגת אמנת המסכים והזמנת ההורים לחתימה"
        ]
      }
    ],
    outcomes: [
      "נורמה אחידה ומחייבת בקהילה",
      "הפחתת לחץ חברתי על ילדים והורים",
      "שותפות קהילתית אמיתית",
      "מסמך אמנה חתום לשימוש לאורך השנים"
    ],
    targetAudience: ["יישובים", "מוסדות חינוך", "קהילות", "וועדי הורים"]
  },
  {
    id: "digital-citizens",
    title: "תכנית אזרחים דיגיטליים",
    subtitle: "ליווי מוסד חינוכי שנתי",
    description: "תהליך חינוכי-רגשי מקיף לשימוש אחראי ומצמיח ברשת - מבית לוקחים אחריות",
    icon: <GraduationCap className="w-8 h-8" />,
    phases: [
      {
        title: "פתיחה - ניתוח ותכנון",
        description: "נתחיל בשאלונים לניתוח הרגלי התלמידים ופגישות מקיפות לתכנון התהליך",
        details: [
          "שאלונים לניתוח הרגלי מדיה של התלמידים",
          "פגישות עם ההנהלה להגדרת יעדים",
          "התאמת התכנים לצרכי המוסד הספציפיים"
        ]
      },
      {
        title: "הכשרה - צוותי מחנכים",
        description: "מפגשים עם צוותי המחנכים להקניית מיומנויות רלוונטיות",
        details: [
          "הדרכות מקצועיות למחנכים",
          "מערכים מוכנים לשימוש בכיתה",
          "ליווי לשאלות ואתגרים"
        ]
      },
      {
        title: "הרצאות וסדנאות",
        description: "שיחות עם התלמידים בגובה העיניים",
        details: [
          "הרצאות מותאמות גיל",
          "סדנאות מרתקות ואינטראקטיביות",
          "עבודה משותפת לתלמידים והורים"
        ]
      },
      {
        title: "מיומנויות חשובות",
        description: "פיתוח כלים להתמודדות עם אתגרי העולם החדש",
        details: [
          "בריונות ושיימינג",
          "זהות וערכים",
          "זהירות ברשת",
          "שמירת מידע אישי ומוגנות"
        ]
      }
    ],
    outcomes: [
      "תעודות 'אזרחים דיגיטליים אחראי' לתלמידים",
      "שיח בין איזון אחריות וחיים למסך",
      "כלים מעשיים לצוות ולתלמידים",
      "תשתית לעבודה מתמשכת"
    ],
    targetAudience: ["בתי ספר יסודיים", "חטיבות ביניים", "תיכונים"]
  }
];

const DeepProcessesSection = () => {
  const [selectedProcess, setSelectedProcess] = useState<DeepProcess | null>(null);

  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section dir="rtl" id="deep-processes" className="py-12 sm:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                <FileCheck className="w-5 h-5" />
                <span className="font-medium">תהליכי עומק</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
                ליווי מקיף ומשמעותי
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
                לא סתם הרצאה - תהליך שלם שמשנה את התרבות הארגונית ויוצר שינוי אמיתי ומתמשך
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {deepProcesses.map((process) => (
                <Card
                  key={process.id}
                  className="overflow-hidden hover:shadow-premium transition-smooth group cursor-pointer border-2 border-transparent hover:border-secondary/30"
                  onClick={() => setSelectedProcess(process)}
                >
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-secondary to-secondary/80 p-6 sm:p-8">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm text-white shrink-0">
                          {process.icon}
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                            {process.title}
                          </h3>
                          <p className="text-white/80 text-sm sm:text-base">{process.subtitle}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 space-y-5">
                      <p className="text-foreground/80 leading-relaxed">
                        {process.description}
                      </p>

                      {/* Phases preview */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-primary flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          שלבי התהליך
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {process.phases.map((phase, index) => (
                            <span
                              key={index}
                              className="bg-accent px-3 py-1.5 rounded-full text-sm text-foreground/80"
                            >
                              {index + 1}. {phase.title.split('–')[0]}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Outcomes preview */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-primary flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          תוצאות התהליך
                        </h4>
                        <ul className="space-y-2">
                          {process.outcomes.slice(0, 3).map((outcome, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                              {outcome}
                            </li>
                          ))}
                          {process.outcomes.length > 3 && (
                            <li className="text-sm text-secondary font-medium">
                              +{process.outcomes.length - 3} עוד...
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Target audience */}
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                          <Users className="w-4 h-4" />
                          <span>מתאים ל:</span>
                          <span className="text-foreground/80">{process.targetAudience.join(', ')}</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white group-hover:bg-secondary group-hover:text-white"
                      >
                        לפרטים נוספים
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 sm:mt-14 text-center">
              <p className="text-foreground/70 mb-4">
                לא בטוחים מה מתאים לכם? נשמח לייעץ
              </p>
              <Button
                size="lg"
                className="bg-bright hover:bg-bright/90 text-primary font-bold"
                onClick={scrollToContact}
              >
                שוחחו איתנו
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <DeepProcessDialog
        process={selectedProcess}
        onClose={() => setSelectedProcess(null)}
      />
    </>
  );
};

export default DeepProcessesSection;
