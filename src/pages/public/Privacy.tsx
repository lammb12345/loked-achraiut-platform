import { PublicLayout } from '@/components/public/PublicLayout'

const Privacy = () => {
  return (
    <PublicLayout>
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg" dir="rtl">
            <h1 className="text-4xl font-bold text-primary mb-8">מדיניות פרטיות</h1>
            <p className="text-foreground/70 mb-6">עודכן לאחרונה: פברואר 2026</p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">1. מבוא</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              עמותת "לוקחים אחריות" (להלן: "העמותה", "אנחנו") מכבדת את פרטיותך ומחויבת להגן על המידע האישי שלך.
              מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלך בהתאם לחוק הגנת הפרטיות,
              התשמ"א-1981 ותיקון 13 לחוק.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">2. סוגי המידע שאנו אוספים</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              אנו עשויים לאסוף את סוגי המידע הבאים:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-4 mr-4">
              <li><strong>מידע שאתה מספק לנו:</strong> שם, כתובת דוא"ל, מספר טלפון, שם מוסד חינוכי, תפקיד</li>
              <li><strong>מידע טכני:</strong> כתובת IP, סוג הדפדפן, מערכת הפעלה, זמני גישה</li>
              <li><strong>מידע על שימוש:</strong> דפים שנצפו, פעולות באתר, העדפות משתמש</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">3. מטרות השימוש במידע</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              אנו משתמשים במידע שנאסף למטרות הבאות:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-4 mr-4">
              <li>מתן שירותים ומענה לפניות</li>
              <li>שליחת עדכונים, ניוזלטרים וחומרים חינוכיים (בכפוף להסכמתך)</li>
              <li>שיפור האתר והשירותים שלנו</li>
              <li>ניתוח סטטיסטי ומחקר</li>
              <li>עמידה בדרישות חוק</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">4. שימוש בעוגיות (Cookies)</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              אתר זה משתמש בעוגיות לשיפור חוויית הגלישה. להלן סוגי העוגיות בהן אנו משתמשים:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-4 mr-4">
              <li><strong>עוגיות הכרחיות:</strong> נדרשות לפעולה תקינה של האתר ואינן ניתנות לביטול</li>
              <li><strong>עוגיות אנליטיקה:</strong> עוזרות לנו להבין כיצד מבקרים משתמשים באתר</li>
              <li><strong>עוגיות שיווק:</strong> מאפשרות הצגת תוכן ופרסומות מותאמים אישית</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              ניתן לנהל את העדפות העוגיות דרך באנר ההסכמה או דרך הגדרות הדפדפן שלך.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">5. שיתוף מידע עם צדדים שלישיים</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              אנו לא מוכרים או משכירים את המידע האישי שלך. עם זאת, אנו עשויים לשתף מידע עם:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-4 mr-4">
              <li>ספקי שירות הפועלים מטעמנו (אחסון, דיוור)</li>
              <li>רשויות חוק בהתאם לדרישה חוקית</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">6. זכויותיך</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              בהתאם לחוק הגנת הפרטיות, עומדות לך הזכויות הבאות:
            </p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-4 mr-4">
              <li><strong>זכות עיון:</strong> לעיין במידע שנאסף עליך</li>
              <li><strong>זכות תיקון:</strong> לבקש תיקון מידע שגוי</li>
              <li><strong>זכות מחיקה:</strong> לבקש מחיקת המידע שלך</li>
              <li><strong>זכות התנגדות:</strong> להתנגד לדיוור ישיר</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              למימוש זכויותיך, ניתן לפנות אלינו בפרטים המפורטים להלן.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">7. אבטחת מידע</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              אנו נוקטים באמצעי אבטחה מתאימים להגנה על המידע שלך מפני גישה בלתי מורשית,
              שינוי, חשיפה או השמדה. עם זאת, אין אנו יכולים להבטיח אבטחה מוחלטת של מידע המועבר באינטרנט.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">8. שינויים במדיניות</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              אנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו באתר עם תאריך העדכון.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">9. יצירת קשר</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              לשאלות, בקשות או תלונות בנוגע למדיניות פרטיות זו או לטיפול במידע האישי שלך, ניתן לפנות אלינו:
            </p>
            <ul className="list-none text-foreground/80 space-y-2 mb-4">
              <li><strong>דוא"ל:</strong> contact@mmb.org.il</li>
              <li><strong>כתובת:</strong> עמותת לוקחים אחריות</li>
            </ul>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
};

export default Privacy;
