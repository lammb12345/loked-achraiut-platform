import { ExternalLink } from "lucide-react";

const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
import { buttonVariants } from "@/components/ui/button";

const socialVideos = [
  {
    id: 1,
    embedUrl: "https://www.instagram.com/reel/C5kE7EJoYEZ/embed",
    title: "טיפ להורים על זמן מסך"
  },
  {
    id: 2,
    embedUrl: "https://www.instagram.com/reel/C4kYNE0IKzB/embed",
    title: "איך מדברים עם ילדים על רשתות חברתיות"
  },
  {
    id: 3,
    embedUrl: "https://www.instagram.com/reel/C3PQnQ4I8Uw/embed",
    title: "הרצאה קצרה על בריאות דיגיטלית"
  }
];

export function SocialSection() {
  return (
    <section dir="rtl" className="py-16 sm:py-24 bg-gradient-to-b from-accent/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <InstagramIcon />
              <h2 className="text-3xl sm:text-4xl font-bold text-primary">
                עקבו אחרינו
              </h2>
            </div>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              תכנים חדשים כל יום, טיפים, הרצאות קצרות ועדכונים מהשטח
            </p>
          </div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {socialVideos.map((video) => (
              <div
                key={video.id}
                className="relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-premium transition-smooth group"
              >
                <div className="aspect-[9/16] bg-muted flex items-center justify-center">
                  <iframe
                    src={video.embedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency
                    allow="encrypted-media"
                    title={video.title}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-4 pointer-events-none">
                  <span className="text-primary-foreground font-medium text-sm">
                    {video.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://www.instagram.com/lokchim_achrayot/"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                size: "lg",
                className: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold gap-2 px-8"
              })}
            >
              <InstagramIcon />
              עקבו אחרינו באינסטגרם
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
