import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section dir="rtl" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background with Mirror Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/70 to-transparent z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transform scale-x-[-1] brightness-110"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 h-full flex items-center">
        <div className="max-w-3xl mr-0 pr-4 md:pr-8 mt-24 md:mt-48">
          <div className="space-y-6 md:space-y-8">
            {/* Main Heading */}
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                שומרים על הילדים ברשת.{" "}
                <span className="text-bright">
                  לוקחים אחריות.
                </span>
              </h1>
              <p className="text-lg md:text-2xl text-primary-foreground/90 leading-relaxed max-w-2xl">
                תנועה חינוכית-לאומית לשמירה על ילדי ישראל בעידן המסכים – דרך
                חינוך, ליווי, ייעוץ ואקטיביזם.
              </p>
            </div>

            {/* CTA Buttons - Only 2 buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Link to="/institutions">
                <Button
                  size="lg"
                  className="bg-bright hover:bg-bright/90 text-primary font-bold text-base md:text-lg px-6 md:px-8 py-5 md:py-7 shadow-glow transition-smooth w-full sm:w-auto"
                >
                  הזמן הרצאה למוסד החינוך
                </Button>
              </Link>
              <a
                href="https://moked.org.il/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 font-bold text-base md:text-lg px-6 md:px-8 py-5 md:py-7 transition-smooth w-full sm:w-auto"
                >
                  קבל ייעוץ ממוקד אור
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-1/2 transform translate-x-1/2 z-20 animate-bounce"></div>
    </section>
  );
}
