import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Shield } from "lucide-react";

const solutions = [
  "במקום פחד מ-AI: נלמד אותם אחריות דיגיטלית ומוסר טכנולוגי",
  "במקום כאוס בווצאפ: ניצור קוד אתי כיתתי וכלים לתקשורת מכבדת",
  "במקום מורים חסרי אונים: נכשיר את הצוות להיות 'מנטורים דיגיטליים' מובילים",
  "במקום חוסר גיבוי: נעבוד גם עם ההורים ונבנה חזית משותפת"
];

const SolutionSection = () => {
  return (
    <section dir="rtl" id="solution" className="py-12 sm:py-20 bg-gradient-accent">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-bright mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
              אפשר לעצור את הסחף. בשביל זה אנחנו כאן
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto px-4">
              אנחנו לא באים להנחית עליכם עוד משימות. אנחנו באים לקחת מכם את המושכות בתחום הזה, ולהוביל תהליך הבראה:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-background hover:shadow-premium transition-smooth">
                <CardContent className="p-5 sm:p-6 flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-bright flex-shrink-0 mt-1" />
                  <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed">{solution}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center px-4">
            <Card className="bg-gradient-primary shadow-glow max-w-3xl mx-auto">
              <CardContent className="p-6 sm:p-8">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-relaxed drop-shadow-lg">
                  מעטפת חינוכית מקצועית שתהפוך את הכאוס הדיגיטלי לקרקע של צמיחה ואחריות אישית
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
