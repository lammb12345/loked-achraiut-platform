import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ContactFormSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    institution: "",
    location: "",
    termsAccepted: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      toast.error("יש לאשר את התקנון וקבלת הדיוור");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await (supabase.from("contact_requests" as any) as any).insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        role: formData.role,
        institution: formData.institution,
        location: formData.location,
        request_type: "institution_contact",
        terms_accepted: formData.termsAccepted,
        source: "institutions_page",
      });

      if (error) throw error;

      try {
        await supabase.functions.invoke("send-contact-email", {
          body: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            role: formData.role,
            institution: formData.institution,
            location: formData.location,
            request_type: "lecture",
            source: "institutions_page",
          },
        });
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
      }

      toast.success("נחזור אליכם בהקדם האפשרי");

      setFormData({
        name: "",
        phone: "",
        email: "",
        role: "",
        institution: "",
        location: "",
        termsAccepted: false
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("אירעה שגיאה בשליחת הטופס, אנא נסו שוב");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section dir="rtl" id="contact-form" className="py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
              אל תחכו למשבר הבא בווצאפ. בואו נקדים תרופה
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 px-4">
              אתם לא צריכים לשבור את הראש לבד. השאירו פרטים, ונבנה יחד את הפתרון שמתאים בדיוק לבית הספר שלכם – בין אם זו הרצאה אחת חזקה או תהליך שנתי.
            </p>
          </div>

          <Card className="shadow-glow">
            <CardContent className="p-6 sm:p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    שם מלא *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="השם המלא שלך"
                    required
                    className="text-base sm:text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    טלפון נייד *
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="מספר הנייד שלך"
                    required
                    className="text-base sm:text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    מייל *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="כתובת המייל שלך"
                    required
                    className="text-base sm:text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    תפקיד *
                  </label>
                  <Input
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="מה התפקיד שלך?"
                    required
                    className="text-base sm:text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    שם המוסד / הגוף המזמין *
                  </label>
                  <Input
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="שם המוסד"
                    required
                    className="text-base sm:text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    מיקום בארץ *
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="איפה נמצא המוסד?"
                    required
                    className="text-base sm:text-lg"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms-contact"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
                    }
                    className="mt-1"
                  />
                  <Label
                    htmlFor="terms-contact"
                    className="text-sm text-foreground/80 cursor-pointer leading-relaxed"
                  >
                    אני מאשר/ת קבלת דיוור ומסכים/ה{" "}
                    <a href="/terms" className="underline text-primary hover:text-bright">
                      לתקנון האתר
                    </a>
                    {" "}ולמדיניות הפרטיות *
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-bright hover:bg-bright/90 text-primary font-bold text-base sm:text-lg py-5 sm:py-6"
                >
                  {isSubmitting ? "שולח..." : "דברו איתי, אני רוצה לקחת אחריות"}
                  <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
