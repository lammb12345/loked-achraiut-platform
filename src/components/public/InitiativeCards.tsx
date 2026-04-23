import { Button } from "@/components/ui/button";
import { GraduationCap, Newspaper, Headphones, ArrowLeft, Users, Scale, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

interface InitiativeCardData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  videoSrc: string;
  link: string;
  isExternal: boolean;
  buttonText: string;
  accentColor: string;
}

const initiativesRow1: InitiativeCardData[] = [
  {
    id: "institutions",
    title: "מרכז חינוכי והרצאות",
    description: "הרצאות, סדנאות ותהליכי ליווי מקיפים למוסדות חינוך",
    icon: <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />,
    videoSrc: "/institutions-hero-video.mp4",
    link: "/institutions",
    isExternal: false,
    buttonText: "למרכז החינוכי",
    accentColor: "bg-primary",
  },
  {
    id: "news",
    title: "תמצית החדשות",
    description: "סיכום שבועי קצר וממוקד של החדשות החשובות",
    icon: <Newspaper className="w-5 h-5 md:w-6 md:h-6" />,
    videoSrc: "/news-banner-video.mp4",
    link: "https://tamzit.org.il/",
    isExternal: true,
    buttonText: "לתמצית החדשות",
    accentColor: "bg-[#2E7AB8]",
  },
  {
    id: "moked",
    title: "מוקד אור",
    description: "ייעוץ ותמיכה בהתאמת פתרונות טכנולוגיים – ללא עלות",
    icon: <Headphones className="w-5 h-5 md:w-6 md:h-6" />,
    videoSrc: "/moked-or-video.mp4",
    link: "https://moked.org.il/",
    isExternal: true,
    buttonText: "למוקד אור",
    accentColor: "bg-secondary",
  },
];

const initiativesRow2: InitiativeCardData[] = [
  {
    id: "parents-club",
    title: "מועדון ההורים",
    description: "כלים חדשניים להורות מאוזנת ומצמיחה בדיגיטל",
    icon: <Users className="w-5 h-5 md:w-6 md:h-6" />,
    videoSrc: "/parents-club-video.mp4",
    link: "https://conectedmmb.lovable.app/",
    isExternal: true,
    buttonText: "למועדון ההורים",
    accentColor: "bg-[#8B5CF6]",
  },
  {
    id: "activism",
    title: "חקיקה ואקטיביזם",
    description: "פעולות למען כל ילדי ישראל",
    icon: <Scale className="w-5 h-5 md:w-6 md:h-6" />,
    videoSrc: "/activism-video.mp4",
    link: "/activism",
    isExternal: false,
    buttonText: "לחקיקה ואקטיביזם",
    accentColor: "bg-[#059669]",
  },
  {
    id: "yeshiva-world",
    title: "עולם הישיבות",
    description: "עזים בקדושה במכינות, ישיבות, ומדרשות",
    icon: <BookOpen className="w-5 h-5 md:w-6 md:h-6" />,
    videoSrc: "/yeshiva-world-video.mp4",
    link: "https://www.facebook.com/azimbkdosha/?locale=he_IL",
    isExternal: true,
    buttonText: "לעולם הישיבות",
    accentColor: "bg-[#B45309]",
  },
];

const InitiativeCard = ({ initiative }: { initiative: InitiativeCardData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll-based reveal on mobile
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // On mobile, show expanded state when visible via scroll
  const showExpanded = isHovered || (isVisible && typeof window !== 'undefined' && window.innerWidth < 768);

  const cardContent = (
    <>
      {/* Video background - visible on hover (desktop) or scroll-reveal (mobile) */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-700 ${
          showExpanded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={initiative.videoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Static content - visible when not expanded */}
      <div
        className={`absolute inset-0 z-5 flex flex-col items-center justify-center p-4 md:p-6 text-center transition-opacity duration-500 ${
          showExpanded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className={`p-2.5 md:p-4 ${initiative.accentColor} rounded-xl md:rounded-2xl mb-2 md:mb-4`}>
          <div className="text-white">{initiative.icon}</div>
        </div>
        <h3 className="text-sm md:text-2xl font-bold text-foreground mb-1 md:mb-2 px-2">
          {initiative.title}
        </h3>
        <p className="text-muted-foreground text-xs md:text-base max-w-[200px] md:max-w-xs hidden md:block">
          {initiative.description}
        </p>
      </div>

      {/* Expanded content - visible on hover/scroll */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-4 md:p-6 text-center transition-all duration-500 ${
          showExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className={`p-3 md:p-4 ${initiative.accentColor}/80 backdrop-blur-sm rounded-xl md:rounded-2xl mb-3 md:mb-4`}>
          <div className="text-white">{initiative.icon}</div>
        </div>
        <h3 className="text-base md:text-2xl font-bold text-white mb-1.5 md:mb-2 drop-shadow-lg px-2">
          {initiative.title}
        </h3>
        <p className="text-white/90 text-xs md:text-base max-w-[200px] md:max-w-xs mb-4 md:mb-6 drop-shadow-md line-clamp-2 md:line-clamp-none">
          {initiative.description}
        </p>
        {initiative.isExternal ? (
          <a href={initiative.link} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              className="bg-bright hover:bg-bright/90 text-primary font-bold px-4 md:px-6 py-2 md:py-5 shadow-glow transition-smooth text-xs md:text-base"
            >
              {initiative.buttonText}
              <ArrowLeft className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </a>
        ) : (
          <Link to={initiative.link}>
            <Button
              size="sm"
              className="bg-bright hover:bg-bright/90 text-primary font-bold px-4 md:px-6 py-2 md:py-5 shadow-glow transition-smooth text-xs md:text-base"
            >
              {initiative.buttonText}
              <ArrowLeft className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Subtle gradient border on hover */}
      <div
        className={`absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none transition-opacity duration-500 ${
          showExpanded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(135deg, hsl(45 100% 51% / 0.4), hsl(40 100% 58% / 0.2))",
          padding: "2px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </>
  );

  return (
    <div
      ref={cardRef}
      className="group relative bg-card rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500 h-[240px] md:h-[360px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cardContent}
    </div>
  );
};

export function InitiativeCards() {
  return (
    <section className="pt-8 pb-16 md:pt-10 md:pb-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-block text-secondary/70 text-sm font-medium mb-2">הפעילות שלנו</span>
          <h2 className="text-xl md:text-3xl font-bold text-primary">
            המיזמים שלנו
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto mb-3 md:mb-6">
          {initiativesRow1.map((initiative, index) => (
            <div
              key={initiative.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <InitiativeCard initiative={initiative} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto">
          {initiativesRow2.map((initiative, index) => (
            <div
              key={initiative.id}
              className="animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <InitiativeCard initiative={initiative} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
