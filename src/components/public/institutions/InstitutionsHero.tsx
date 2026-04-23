import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";

const InstitutionsHero = () => {
  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section dir="rtl" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background with Mirror Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/70 to-transparent z-10" />
        <video
          key={Date.now()}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-110"
        >
          <source src={`/institutions-hero-video.mp4?v=${Date.now()}`} type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-20 h-full flex items-center">
        <div className="max-w-3xl mr-0 pr-4 sm:pr-8 mt-32 sm:mt-48 w-full">
          <div className="space-y-6 sm:space-y-8">
            {/* Main Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                סדנאות מוגנות ברשת. <span className="text-bright drop-shadow-lg">לוקחים אחריות אצלכם בבית הספר</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed drop-shadow-md">
                אתם יודעים שחייבים לטפל באתגר המסכים, אבל אין לכם זמן, ולצוות אין ידע בנושא?
              </p>
              <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed drop-shadow-md font-medium">
                אנחנו כאן כדי לתת לכם גב. מעטפת חינוכית מקצועית, שתהפוך את הכאוס הדיגיטלי לקרקע של צמיחה ואחריות אישית.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 pb-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={() => window.open('https://wa.me/972585582120', '_blank')}
                className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 shadow-glow transition-smooth w-full sm:w-auto"
              >
                דברו איתנו בווצאפ
                <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="lg"
                onClick={scrollToContact}
                className="bg-bright hover:bg-bright/90 text-primary font-bold text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 shadow-glow transition-smooth w-full sm:w-auto"
              >
                לקבלת ייעוץ אישי והתאמת תוכנית
                <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstitutionsHero;
