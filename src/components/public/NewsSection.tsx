import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  published_date: string | null;
  created_at: string;
}

// Array of diverse, relevant images for articles
const articleImages = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
];

const getImageForArticle = (index: number, title: string): string => {
  const titleHash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return articleImages[(titleHash + index) % articleImages.length];
};

export function NewsSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, excerpt, image_url, category, published_date, created_at")
        .eq("published", true)
        .order("published_date", { ascending: false })
        .limit(3);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section dir="rtl" className="pt-12 pb-24 bg-accent/10" id="news">
      <div className="container mx-auto px-4">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            עולם התוכן
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            עדכונים שבועיים מעולם החינוך הדיגיטלי והטכנולוגיה
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">טוען מאמרים...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">אין מאמרים עדיין</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Link
                to={`/article/${article.id}`}
                key={article.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <article className="article-card shadow-soft cursor-pointer h-full group">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getImageForArticle(index, article.title)}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="article-card-image-overlay" />
                    {article.category && (
                      <div className="absolute top-4 right-4">
                        <span className="article-card-badge">
                          {article.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="bg-accent/50 px-3 py-1 rounded-full flex items-center gap-2 text-foreground/70">
                        <Calendar size={14} />
                        {formatDate(article.published_date || article.created_at)}
                      </span>
                    </div>

                    <h3 className="article-card-title text-xl">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="text-foreground/70 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="pt-2">
                      <span className="article-card-cta">
                        <span>קראו עוד</span>
                        <ArrowLeft size={16} className="article-card-cta-arrow" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/news">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 transition-smooth"
            >
              לכל המאמרים
              <ArrowLeft className="mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
