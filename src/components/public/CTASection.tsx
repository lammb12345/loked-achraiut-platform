import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type AudienceType = "parent" | "educator" | "youth";

export function CTASection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>("parent");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const audiences = [
    { id: "parent" as AudienceType, label: "הורה", emoji: "👨‍👩‍👧" },
    { id: "educator" as AudienceType, label: "איש / אשת חינוך", emoji: "👩‍🏫" },
    { id: "youth" as AudienceType, label: "צעיר/ה", emoji: "🧑" },
  ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B']
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("יש לאשר את התקנון וקבלת הדיוור");
      return;
    }

    if (!name || !email) {
      toast.error("יש למלא שם ומייל");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (phone) formData.append("phone", phone);
      formData.append("audience", selectedAudience);

      await fetch("https://form.ravpage.co.il/908ebe9b5b3f55ea60ff5e869702f2c069709320", {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      triggerConfetti();
      setShowSuccessPopup(true);
      setName("");
      setEmail("");
      setPhone("");
      setTermsAccepted(false);
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("אירעה שגיאה, אנא נסו שוב");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section dir="rtl" className="relative overflow-hidden">
      {/* Elegant wave decoration at top */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-12 md:h-16"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 Q300,60 600,30 T1200,30 L1200,60 L0,60 Z"
            fill="hsl(var(--primary))"
          />
        </svg>
      </div>

      {/* Main content with gradient background - ends with primary-dark to match footer */}
      <div className="bg-primary pt-16 md:pt-20 pb-12 md:pb-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          {/* Audience Selector - more compact */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            <span className="text-primary-foreground/70 text-sm ml-3">אני:</span>
            {audiences.map((audience) => (
              <button
                key={audience.id}
                onClick={() => setSelectedAudience(audience.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 text-xs md:text-sm ${
                  selectedAudience === audience.id
                    ? "bg-bright text-primary font-semibold shadow-lg"
                    : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/15 border border-primary-foreground/10"
                }`}
              >
                <span>{audience.emoji}</span>
                <span>{audience.label}</span>
              </button>
            ))}
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Right side - Headline */}
            <div className="text-right space-y-4 order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground leading-snug">
                הירשמו לעדכונים
                <br />
                שיעזרו לכם להיות
                <br />
                <span className="text-bright">הורים טובים יותר!</span>
              </h2>
              <p className="text-bright/90 text-base md:text-lg font-medium">
                נדאג לעדכן אתכם בכל מה שחשוב לדעת.
              </p>
              <p className="text-primary-foreground/60 text-xs">
                מעל 70,000 הורים, מורים ומחנכים כבר איתנו.
              </p>
            </div>

            {/* Left side - Form */}
            <div className="order-1 md:order-2">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-primary-foreground/80 text-xs flex items-center gap-1">
                      שם מלא
                      <span className="text-bright">*</span>
                    </label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="מה שמך?"
                      className="h-10 px-3 text-sm bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg focus:border-bright/50 focus:ring-bright/30"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-primary-foreground/80 text-xs flex items-center gap-1">
                      אימייל
                      <span className="text-bright">*</span>
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="אליו נשלח עדכונים"
                      className="h-10 px-3 text-sm bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg focus:border-bright/50 focus:ring-bright/30"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-primary-foreground/80 text-xs">
                      טלפון <span className="text-primary-foreground/50">(לא חובה)</span>
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="שנוכל לשוחח"
                      className="h-10 px-3 text-sm bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg focus:border-bright/50 focus:ring-bright/30"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-bright/10 hover:bg-bright/20 text-primary-foreground font-semibold text-sm border border-primary-foreground/20 hover:border-primary-foreground/40 rounded-full transition-all duration-300"
                >
                  {isSubmitting ? "שולח..." : "רשמו אותי לקבלת עדכונים"}
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 justify-start pt-1">
                  <Checkbox
                    id="terms-cta"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="border-primary-foreground/40 data-[state=checked]:bg-bright data-[state=checked]:border-bright mt-0.5 h-4 w-4"
                  />
                  <Label
                    htmlFor="terms-cta"
                    className="text-primary-foreground/60 text-xs cursor-pointer text-right leading-relaxed"
                  >
                    אני מאשר/ת קבלת דיוור ומסכים/ה{" "}
                    <a href="/terms" className="underline hover:text-bright transition-colors">
                      לתקנון האתר
                    </a>
                  </Label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Prompt Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-8 max-w-md w-full text-center relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-primary mb-2">נרשמתם בהצלחה!</h3>
            <p className="text-muted-foreground mb-6">
              עכשיו חייבים להצטרף גם לקבוצת הוואטסאפ שלנו כדי לקבל עדכונים בזמן אמת!
            </p>

            <a
              href="https://chat.whatsapp.com/DDlDgLFt8bYHt7dYA0saRw"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowSuccessPopup(false)}
            >
              <Button
                size="lg"
                className="w-full bg-bright hover:bg-bright/90 text-primary font-bold px-8 h-14"
              >
                <MessageCircle className="ml-2" />
                הצטרפו לקבוצת וואטסאפ
              </Button>
            </a>

            <button
              onClick={() => setShowSuccessPopup(false)}
              className="mt-4 text-muted-foreground hover:text-foreground text-sm underline"
            >
              אולי אחר כך
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
