import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "קצת עלינו", href: "/about" },
    { label: "מוקד אור", href: "https://moked.org.il", external: true },
    { label: "מוסדות חינוך", href: "/institutions" },
    { label: "אקטיביזם", href: "/activism" },
    { label: "עולם התוכן", href: "/news" },
    { label: "צור קשר", href: "/contact" },
  ];

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo - Right Side */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="לוקחים אחריות" className="h-24 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-smooth font-medium text-base"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-foreground hover:text-primary transition-smooth font-medium text-base"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA Button - Donation */}
          <div className="hidden lg:block">
            <a
              href="https://pe4ch.com/ref/7thzAPPP2che?lang=he"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="default"
                className="bg-bright hover:bg-bright/90 text-primary font-bold px-6 py-4 text-base shadow-glow transition-smooth"
              >
                <Heart className="ml-2 h-5 w-5" />
                תרמו למהפכה!
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button - Left Side */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-2 bg-background border border-border rounded-2xl mt-2 px-4 shadow-md">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-smooth font-medium text-base py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-smooth font-medium text-base py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <a
                href="https://pe4ch.com/ref/7thzAPPP2che?lang=he"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="default"
                  className="bg-bright hover:bg-bright/90 text-primary font-bold mt-4 shadow-glow w-full"
                >
                  <Heart className="ml-2 h-5 w-5" />
                  תרמו למהפכה!
                </Button>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
