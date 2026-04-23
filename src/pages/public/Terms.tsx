import { PublicLayout } from '@/components/public/PublicLayout'

const Terms = () => {
  return (
    <PublicLayout>
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg" dir="rtl">
            <h1 className="text-4xl font-bold text-primary mb-8">תקנון האתר</h1>
            <p className="text-foreground/70 mb-6">עודכן לאחרונה: דצמבר 2025</p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">1. כללי</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              ברוכים הבאים לאתר עמותת "לוקחים אחריות". השימוש באתר זה מהווה הסכמה לתנאי השימוש המפורטים להלן.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">2. הרשמה לדיוור</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              בהרשמה לדיוור אתם מסכימים לקבל עדכונים, מידע וחומרים מהעמותה. ניתן לבטל את ההרשמה בכל עת.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">3. שימוש במידע</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              המידע שנאסף ישמש אך ורק לצורך יצירת קשר ושיפור השירות. לא נעביר מידע לצדדים שלישיים ללא הסכמה.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">4. יצירת קשר</h2>
            <p className="text-foreground/80 leading-relaxed">
              לשאלות בנוגע לתקנון זה ניתן לפנות אלינו בכתובת: contact@mmb.org.il
            </p>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
};

export default Terms;
