import { Send, Mail } from "lucide-react";

const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
const YoutubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export function Footer() {
  const quickLinks = [
    { label: "קצת עלינו", href: "/about" },
    { label: "מוקד אור", href: "https://moked.org.il/", external: true },
    { label: "מוסדות חינוך", href: "/institutions" },
    { label: "אקטיביזם", href: "/activism" },
    { label: "תמצית החדשות", href: "https://tamzit.org.il/", external: true },
    { label: "צור קשר", href: "/contact" },
  ];

  return (
    <footer className="bg-primary-dark text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo and Vision */}
          <div className="md:col-span-2 space-y-6">
            <img src={logo} alt="לוקחים אחריות" className="h-20 w-auto" />
            <p className="text-xl font-medium leading-relaxed text-primary-foreground/90">
              לוקחים אחריות – כי שמירה על הילדים היא אחריות של כולנו.
            </p>
            <p className="text-primary-foreground/70 leading-relaxed">
              תנועה חינוכית-לאומית שמטרתה להגן על ילדי ישראל מהסכנות הדיגיטליות
              ולהעניק להם כלים לשימוש בריא ומאוזן בטכנולוגיה.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-bright">קישורים מהירים</h3>
            <nav className="space-y-3">
              {quickLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary-foreground/80 hover:text-bright transition-smooth"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block text-primary-foreground/80 hover:text-bright transition-smooth"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-bright">צרו קשר</h3>
            <div className="space-y-4">
              <a
                href="mailto:contact@mmb.org.il"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-bright transition-smooth"
              >
                <Mail size={20} />
                <span>contact@mmb.org.il</span>
              </a>
              <div className="flex gap-4 pt-4">
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-bright flex items-center justify-center transition-smooth group">
                  <FacebookIcon />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-bright flex items-center justify-center transition-smooth group">
                  <InstagramIcon />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-bright flex items-center justify-center transition-smooth group">
                  <YoutubeIcon />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-bright flex items-center justify-center transition-smooth group">
                  <Send className="text-primary-foreground group-hover:text-primary" size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <div className="flex items-center gap-2">
              <p>© 2025 לוקחים אחריות – כל הזכויות שמורות.</p>
              <span className="hidden md:inline">|</span>
              <a
                href="https://wa.me/972526018772"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bright transition-smooth text-xs"
              >
                נבנה ב<span className="text-primary-foreground">❤</span> ע״י סער חלק
              </a>
            </div>
            <div className="flex gap-6">
              <Link to="/terms" className="hover:text-bright transition-smooth">תקנון האתר</Link>
              <Link to="/privacy" className="hover:text-bright transition-smooth">מדיניות פרטיות</Link>
              <a href="#" className="hover:text-bright transition-smooth">נגישות</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
