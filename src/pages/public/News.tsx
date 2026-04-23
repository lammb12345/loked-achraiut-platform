import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Tag, Search } from "lucide-react";
import { PublicLayout } from '@/components/public/PublicLayout';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { CTASection } from "@/components/public/CTASection";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string[] | null;
  image_url: string | null;
  published_date: string | null;
  created_at: string;
}

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("published_date", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const allTags = [
    'דחיית גיל הסמארטפון',
    'רשתות חברתיות',
    'סינון ואבטחה',
    'בריאות הנפש',
    'חקיקה ורגולציה',
    'מחקרים חדשים',
    'כלים טכנולוגיים',
    'אתגרים חינוכיים'
  ];

  const filteredArticles = articles.filter((item) => {
    const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));
    const matchesSearch = item.title.includes(searchQuery) || (item.excerpt?.includes(searchQuery) ?? false);
    return matchesTag && matchesSearch;
  });

  return (
    <PublicLayout>
      <main>
        {/* Refined Hero Section with Gradient Background */}
        <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary">
          {/* Floating Accents */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-48 h-48 bg-bright/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10 pt-28 pb-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="inline-block bg-bright/90 text-primary font-bold px-4 py-1.5 rounded-full text-sm tracking-wide animate-fade-in">
                תוכן מקצועי
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                עולם התוכן
              </h1>

              <p className="text-base text-primary-foreground/90 leading-relaxed max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                מאמרים, תובנות וידע מעמיק על הורות וחינוך בעידן הדיגיטלי
              </p>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 50" fill="none" className="w-full">
              <path d="M0 50L60 44C120 38 240 26 360 22C480 18 600 18 720 21C840 24 960 30 1080 33C1200 36 1320 36 1380 36L1440 36V50H0Z" fill="white"/>
            </svg>
          </div>
        </section>


        {/* Filters */}
        <section className="py-8 bg-background sticky top-0 z-30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-4 py-2 rounded-full font-medium transition-smooth ${
                      selectedTag === null
                        ? 'bg-secondary text-white'
                        : 'bg-accent/50 text-foreground hover:bg-secondary hover:text-white'
                    }`}
                  >
                    הכל
                  </button>
                  {allTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-4 py-2 rounded-full font-medium transition-smooth ${
                        selectedTag === tag
                          ? 'bg-secondary text-white'
                          : 'bg-accent/50 text-foreground hover:bg-secondary hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40" size={20} />
                  <Input
                    placeholder="חיפוש..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 md:w-64"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-xl text-foreground/70">טוען מאמרים...</p>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <p className="text-xl text-foreground/70">אין מאמרים עדיין</p>
                  <p className="text-foreground/60">בקרוב יעלו כאן תכנים מרתקים</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {filteredArticles.map((article, index) => (
                    <Link
                      to={`/article/${article.id}`}
                      key={article.id}
                      className="opacity-0 animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                    >
                      <article className="article-card shadow-soft cursor-pointer h-full group">
                        {article.image_url && (
                          <div className="aspect-video overflow-hidden relative">
                            <img
                              src={article.image_url}
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
                        )}
                        <div className="p-8 space-y-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="bg-accent/50 px-3 py-1 rounded-full flex items-center gap-2 text-foreground/70">
                                <Calendar size={14} />
                                {new Date(article.published_date || article.created_at).toLocaleDateString('he-IL')}
                              </span>
                            </div>
                            {article.tags && article.tags.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <Tag size={14} className="text-foreground/50" />
                                {article.tags.map((tag, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedTag(tag);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="bg-bright/15 text-secondary px-3 py-1.5 rounded-full text-sm font-medium hover:bg-secondary hover:text-white transition-smooth border border-bright/20"
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <h3 className="article-card-title">
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
                              <span className="article-card-cta-arrow">←</span>
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Topics */}
        <section className="py-16 bg-gradient-to-b from-accent/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl font-bold text-primary">נושאים מרכזיים</h2>
              <p className="text-xl text-foreground/70">
                הנושאים החמים ביותר בעולם החינוך הדיגיטלי
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                {allTags.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedTag(topic);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-6 py-3 rounded-full font-medium shadow-soft hover:shadow-premium transition-smooth hover:scale-105 ${
                      selectedTag === topic
                        ? 'bg-secondary text-white'
                        : 'bg-white text-foreground'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA Section */}
        <CTASection />
      </main>
    </PublicLayout>
  );
}
