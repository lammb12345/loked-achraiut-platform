import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import LectureDialog from "./LectureDialog";
import {
  Target,
  Users,
  Brain,
  User,
  Shield,
  MessageSquare,
  Heart,
  Sprout,
  Scale,
  Sunrise,
  UserCheck,
  BookOpen
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Lecture {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  audiences: ("נוער" | "יסודי" | "הורים" | "צוות")[];
  icon: LucideIcon;
  image?: string;
}

const lectures: Lecture[] = [
  // נוער
  {
    id: "dream",
    title: "חלום אחד ביום",
    subtitle: "הרצאה לנוער",
    description: "איך הופכים את המסך ממלכודת זמן לכלי להגשמת חלומות?",
    fullDescription: "הרצאה מרתקת שמדברת ישירות ללב הנוער. נסביר איך המסך יכול להיות כלי להגשמת חלומות במקום מלכודת זמן. שיחה כנה שתזיז להם משהו בלב ותניע לפעולה.",
    audiences: ["נוער"],
    icon: Target
  },
  {
    id: "living-here",
    title: "כאן גרים בכיף",
    subtitle: "הרצאה לנוער",
    description: "מחזירים את החברות למרכז. על קשרים אמיתיים מול וירטואליים",
    fullDescription: "הרצאה על הזהות שלנו ברשת לעומת מי שאנחנו באמת. נדבר על קשרים אמיתיים, חברויות איכותיות, והפער בין העולם הוירטואלי לעולם האמיתי.",
    audiences: ["נוער"],
    icon: Users
  },
  {
    id: "smart-online",
    title: "חכמים ברשת",
    subtitle: "סדנה לנוער",
    description: "איך בונים 'שריר' של התנגדות? ניהול זמן, סינון רעשים וחשיבה עצמאית מול האלגוריתם",
    fullDescription: "סדנה מעמיקה שמלמדת את הנוער לפתח 'שריר' נפשי מול הפיתויים הדיגיטליים. נלמד ניהול זמן חכם, סינון תכנים, וחשיבה עצמאית מול האלגוריתמים שמנסים לשלוט בנו.",
    audiences: ["נוער"],
    icon: Brain
  },
  {
    id: "double-identity",
    title: "זהות כפולה",
    subtitle: "סדנה לבנות",
    description: "שיח רגיש על הפער בין מי שאני באמת לבין ה'פילטר' ברשת",
    fullDescription: "סדנה מיוחדת לבנות, שמטפלת בנושאים רגישים של זהות, פילטרים ברשת, צניעות דיגיטלית ושמירה על הפנימיות. נדבר על איך לשמור על עצמנו בעולם חשוף.",
    audiences: ["נוער"],
    icon: User
  },
  // יסודי
  {
    id: "careful-online",
    title: "זהירים ברשת",
    subtitle: "סדנה ליסודי",
    description: "הצעדים הראשונים בעולם הדיגיטלי. פרטיות, מוגנות וכללי ברזל",
    fullDescription: "סדנה מותאמת לילדי בית ספר יסודי. נלמד את הצעדים הראשונים בעולם הדיגיטלי בצורה בטוחה - שמירה על פרטיות, זיהוי סכנות, וכללי ברזל להתנהלות נכונה ברשת.",
    audiences: ["יסודי"],
    icon: Shield
  },
  {
    id: "friends-online",
    title: "חברים ברשת",
    subtitle: "סדנה ליסודי",
    description: "הווצאפ הכיתתי הוא לא ג'ונגל. לומדים להתכתב בכבוד ולשמור על החברים",
    fullDescription: "סדנה מעשית שמלמדת ילדים איך להשתמש בווטסאפ הכיתתי בצורה נכונה. נדבר על כבוד, על חברות, על איך להגיב למצבים קשים, ועל שמירה על האקלים החברתי בקבוצה.",
    audiences: ["יסודי"],
    icon: MessageSquare
  },
  // הורים
  {
    id: "connected-1",
    title: "מחוברים 1.0",
    subtitle: "סדרת מחוברים להורים",
    description: "הבסיס להורות בעידן המסכים. איך שומרים על קשר חם כשהמסך חוצץ בינינו?",
    fullDescription: "המפגש הראשון בסדרה - הבסיס. נלמד את היסודות של הורות בעידן המסכים, איך לשמור על קשר חם עם הילדים למרות המסכים, ואיך לדבר איתם על הנושא בלי להתנגש.",
    audiences: ["הורים"],
    icon: Heart
  },
  {
    id: "connected-2",
    title: "מחוברים 2.0",
    subtitle: "חדש! סדרת מחוברים להורים",
    description: "איך מתעניינים בילד באמת בלי 'לחפור'? כלים ליצירת שגרה של צמיחה בבית",
    fullDescription: "המפגש השני - עומק. נלמד איך להתעניין בילדים בצורה אמיתית וכנה, בלי 'לחפור' ולגרום להתנגדות. נקבל כלים מעשיים ליצירת שגרות משפחתיות שמעודדות צמיחה.",
    audiences: ["הורים"],
    icon: Sprout
  },
  {
    id: "connected-3",
    title: "מחוברים 3.0",
    subtitle: "חדש! סדרת מחוברים להורים",
    description: "סוף למריבות. איך מציבים גבולות ברורים, מכבדים ויציבים",
    fullDescription: "המפגש השלישי - גבולות. נלמד איך להציב גבולות ברורים ומכבדים סביב המסכים, איך לעמוד בהם, ואיך להפחית את החיכוכים סביב הנושא כמעט לאפס.",
    audiences: ["הורים"],
    icon: Scale
  },
  {
    id: "grow-quiet",
    title: "לגדול על שקט",
    subtitle: "בוקר הורים וילדים",
    description: "חוויה משותפת ומקרבת שפותחת את הלב ואת האוזניים",
    fullDescription: "בוקר מיוחד להורים וילדים יחד. חוויה משותפת שמקרבת ופותחת שיח משפחתי על הנושא. נעבור תהליך משותף שיחזק את הקשר וייצור הבנה משותפת.",
    audiences: ["הורים"],
    icon: Sunrise
  },
  // צוות
  {
    id: "connected-teachers",
    title: "מחוברים למורים",
    subtitle: "הכשרת צוות",
    description: "מיישרים קו. מבינים את השפה, את הסכנות ואת ההזדמנויות",
    fullDescription: "הכשרה מקיפה לצוות החינוכי. נבין את עולם הרשת של הילדים, נלמד את השפה שלהם, נזהה סכנות מוקדם, ונדע איך לנצל את ההזדמנויות החינוכיות.",
    audiences: ["צוות"],
    icon: UserCheck
  },
  {
    id: "winning-media",
    title: "מערך מדיה מנצח",
    subtitle: "כלים לכיתה",
    description: "תכלס לכיתה. איך מעבירים שיעור חינוך על מסכים בלי שהתלמידים יגלגלו עיניים?",
    fullDescription: "מערך שיעורים מוכן לשימוש בכיתה. נקבל כלים מעשיים, פעילויות מרתקות, ודרכים להעביר את המסרים החשובים בצורה שתופסת את תשומת הלב של התלמידים.",
    audiences: ["צוות"],
    icon: BookOpen
  }
];

const LecturesFilter = () => {
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  const audiences = ["הכל", "נוער", "יסודי", "הורים", "צוות"];

  const filteredLectures = selectedAudience && selectedAudience !== "הכל"
    ? lectures.filter(lecture => lecture.audiences.includes(selectedAudience as any))
    : lectures;

  return (
    <>
      <section dir="rtl" id="lectures" className="py-12 sm:py-20 bg-gradient-accent">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-3 sm:mb-4">
              ארגז הכלים של "לוקחים אחריות"
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 text-center mb-8 sm:mb-12 px-4">
              כל מוסד והצרכים שלו. בחרו את מה שנכון לכם עכשיו:
            </p>

            {/* Audience Filter */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
              {audiences.map((audience) => (
                <button
                  key={audience}
                  onClick={() => setSelectedAudience(audience === "הכל" ? null : audience)}
                  className={cn(
                    "px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-smooth text-sm sm:text-base",
                    (!selectedAudience && audience === "הכל") || selectedAudience === audience
                      ? "bg-primary text-primary-foreground shadow-premium"
                      : "bg-background text-foreground hover:bg-accent"
                  )}
                >
                  {audience}
                </button>
              ))}
            </div>

            {/* Lectures Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredLectures.map((lecture) => {
                const IconComponent = lecture.icon;
                return (
                  <Card
                    key={lecture.id}
                    className="bg-background hover:shadow-premium transition-smooth cursor-pointer group overflow-hidden"
                    onClick={() => setSelectedLecture(lecture)}
                  >
                    <CardContent className="p-0">
                      {/* Icon area with gradient */}
                      <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
                        <IconComponent className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 group-hover:text-bright transition-smooth">
                          {lecture.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-foreground/60 mb-3">{lecture.subtitle}</p>
                        <p className="text-sm sm:text-base text-foreground/80 mb-4 line-clamp-3">{lecture.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {lecture.audiences.map((audience) => (
                            <Badge
                              key={audience}
                              variant="secondary"
                              className="text-xs"
                            >
                              {audience}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <LectureDialog
        lecture={selectedLecture}
        onClose={() => setSelectedLecture(null)}
      />
    </>
  );
};

export default LecturesFilter;
