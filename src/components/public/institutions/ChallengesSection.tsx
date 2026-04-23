import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Ban } from "lucide-react";

const challenges = [
  {
    title: "הווצאפ יצא משליטה",
    description: "קבוצות הכיתה הפכו לזירת קרב. שיימינג, מילים פוגעניות, חרמות שקטים ורעש שלא נגמר גם אחרי שעות הלימודים. זה זולג לכיתה ומחריב את האקלים החברתי שעמלתם עליו."
  },
  {
    title: "ה-AI נכנס בדלת הקדמית",
    description: "פתאום זה כאן. התלמידים משתמשים בבינה מלאכותית כדי ליצור תמונות פוגעניות, לזייף מציאות או להכין שיעורי בית בלי לחשוב. הטכנולוגיה רצה מהר, והצוות מרגיש שהוא נשאר מאחור, מבוהל וחסר כלים."
  },
  {
    title: "הצוות מותש ומרגיש 'זקן'",
    description: "המורים רוצים ללמד, אבל מרגישים שהם מדברים לקיר. התלמידים שקועים במסך, והמורה מרגיש לא רלוונטי, חסר סמכות, ולפעמים פשוט מוותר מראש על המערכה כי 'אין לו כוח לשוטר וגנב'."
  },
  {
    title: "ההורים דורשים תשובות – אבל לא נותנים גיבוי",
    description: "הטלפון שלכם לא מפסיק לצלצל עם תלונות מהורים על מה שקרה ברשת, אבל כשהילד מגיע הביתה – אין גבולות ואין פיקוח. אתם מוצאים את עצמכם לבד במערכה."
  }
];

const ChallengesSection = () => {
  return (
    <section dir="rtl" id="challenges" className="py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
              רגע לפני שמזמינים הרצאה: אנחנו יודעים עם מה אתם מתמודדים
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto px-4">
              אנו שומעים שוב ושוב את הקולות הללו מכם – אנשי החינוך המובילים. אנחנו לא מצפים שתעשו את זה לבד, והשיטה שלנו פותחה בדיוק כדי לתת מענה לקונפליקטים האלו:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {challenges.map((challenge, index) => (
              <Card key={index} className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-2 border-destructive/20 hover:shadow-premium transition-smooth">
                <CardContent className="p-6 sm:p-8">
                  <Ban className="w-8 h-8 text-destructive mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
                    {challenge.title}
                  </h3>
                  <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                    {challenge.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
