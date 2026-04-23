import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const InstitutionsNavigation = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const sections = ["challenges", "solution", "lectures", "speakers", "testimonials", "contact-form"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navItems = [
    { id: "challenges", label: "האתגרים" },
    { id: "solution", label: "הפתרון" },
    { id: "lectures", label: "ההרצאות" },
    { id: "speakers", label: "המרצים" },
    { id: "testimonials", label: "המלצות" },
    { id: "contact-form", label: "צור קשר" },
  ];

  return (
    <nav
      dir="rtl"
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-soft" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1 sm:gap-2 py-3 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-smooth whitespace-nowrap",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default InstitutionsNavigation;
