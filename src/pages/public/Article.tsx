import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from '@/components/public/PublicLayout';
import { CTASection } from "@/components/public/CTASection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Tag, Loader2, Share2, User, BookOpen } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  published_date: string | null;
  created_at: string;
}

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rawData, error } = await supabase
        .from("articles" as any)
        .select("*")
        .eq("id", articleId)
        .eq("published", true)
        .single();

      if (error) throw error;
      const data = rawData as Article;
      setArticle(data);

      // Fetch related articles
      if (data?.category) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: related } = await supabase
          .from("articles" as any)
          .select("*")
          .eq("published", true)
          .eq("category", data.category)
          .neq("id", articleId)
          .limit(3);

        setRelatedArticles((related as Article[]) || []);
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      setError("המאמר לא נמצא");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <main className="pt-8">
          <div className="container mx-auto px-4 py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        </main>
      </PublicLayout>
    );
  }

  if (error || !article) {
    return (
      <PublicLayout>
        <main className="pt-8">
          <div className="container mx-auto px-4 py-24 text-center space-y-6">
            <BookOpen className="w-20 h-20 text-foreground/30 mx-auto" />
            <h1 className="text-4xl font-bold text-primary">המאמר לא נמצא</h1>
            <p className="text-foreground/70 text-xl">
              המאמר שחיפשת לא קיים או הוסר
            </p>
            <Link to="/news">
              <Button className="gap-2">
                <ArrowRight className="w-4 h-4" />
                חזרה לעולם התוכן
              </Button>
            </Link>
          </div>
        </main>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <main className="pt-8">
        {/* Hero Image */}
        {article.image_url && (
          <div className="relative h-[50vh] min-h-[400px] overflow-hidden -mt-8">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <article className={`container mx-auto px-4 ${article.image_url ? '-mt-32 relative z-20' : 'pt-24'}`}>
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium mb-8 transition-smooth"
            >
              <ArrowRight size={18} />
              חזרה לעולם התוכן
            </Link>

            {/* Article Header */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-premium mb-8">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(article.published_date || article.created_at).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                {article.category && (
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    <span className="bg-bright/20 text-secondary px-3 py-1 rounded-full font-medium">
                      {article.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-6">
                {article.title}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-xl text-foreground/70 leading-relaxed border-r-4 border-secondary pr-4">
                  {article.excerpt}
                </p>
              )}

              {/* Share Button */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 size={16} />
                  שתפו את המאמר
                </Button>
              </div>
            </div>

            {/* Article Body */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft mb-8">
              <div
                className="prose prose-lg max-w-none text-foreground/80 leading-relaxed
                  prose-headings:text-primary prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:mb-4
                  prose-ul:my-4 prose-ul:pr-6
                  prose-li:mb-2
                  prose-strong:text-primary prose-strong:font-bold
                  prose-a:text-secondary prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
              />
            </div>

            {/* Author Section */}
            <div className="bg-gradient-to-br from-secondary/10 to-bright/10 rounded-3xl p-8 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-primary">עמותת לוקחים אחריות</p>
                  <p className="text-foreground/70 text-sm">תנועה חינוכית-לאומית לשמירה על ילדי ישראל בעידן המסכים</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-16 bg-accent/10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-primary mb-8 text-center">
                  מאמרים נוספים שיעניינו אתכם
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <Link to={`/article/${related.id}`} key={related.id}>
                      <article className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-premium transition-smooth group h-full">
                        {related.image_url && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={related.image_url}
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-smooth line-clamp-2">
                            {related.title}
                          </h3>
                          {related.excerpt && (
                            <p className="text-foreground/70 text-sm mt-2 line-clamp-2">
                              {related.excerpt}
                            </p>
                          )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <CTASection />
      </main>
    </PublicLayout>
  );
}
