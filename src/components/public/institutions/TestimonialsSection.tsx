import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const textTestimonials = [
  {
    id: 1,
    text: "נושאים חשובים מאין כמותם! הילדים היו מרותקים גם המורים כבר ביקשו את ההרצאה!",
    author: "ענבל",
    role: "רכזת תקשוב, בי\"ס רמון",
    rating: 5
  },
  {
    id: 2,
    text: "סופר סופר חשוב! אני חושבת שכל הורה וילד צריך לשמוע איך להשתמש נכון ברשת!",
    author: "שלי",
    role: "אמא של ענבל כיתה ה'",
    rating: 5
  },
  {
    id: 3,
    text: "ההרצאה שינתה לנו את האקלים בכיתות. התלמידים התחילו לדבר על הנושא בצורה פתוחה ובוגרת.",
    author: "רחל כהן",
    role: "מנהלת בית ספר",
    rating: 5
  },
  {
    id: 4,
    text: "אחרי ההכשרה, הרגשתי שסוף סוף יש לי כלים אמיתיים להתמודד עם אתגרי המדיה בכיתה.",
    author: "דוד לוי",
    role: "מורה חטיבת ביניים",
    rating: 5
  }
];

interface VideoTestimonial {
  id: string;
  title: string;
  video_url: string;
  display_order: number;
}

const TestimonialsSection = () => {
  const { data: videoTestimonials = [], isLoading } = useQuery({
    queryKey: ["testimonial-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonial_videos")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as VideoTestimonial[];
    },
  });

  return (
    <section dir="rtl" id="testimonials" className="py-12 sm:py-20 bg-gradient-primary">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-3 sm:mb-4">
            מה אומרים עלינו
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-foreground text-center mb-8 sm:mb-12 px-4">
            אלפי מחנכים, הורים ותלמידים כבר חוו את השינוי
          </p>

          {/* Text Testimonials */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {textTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-background/95 backdrop-blur-sm shadow-glow">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-bright text-bright" />
                    ))}
                  </div>
                  <p className="text-base sm:text-lg text-foreground/80 mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-primary text-sm sm:text-base">{testimonial.author}</p>
                    <p className="text-xs sm:text-sm text-foreground/70">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Video Testimonials */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-6 sm:mb-8">
              המלצות בווידאו
            </h3>
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {videoTestimonials.map((video) => (
                  <Card key={video.id} className="bg-background/95 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      <AspectRatio ratio={9 / 16}>
                        <video
                          src={video.video_url}
                          className="w-full h-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                          title={video.title}
                        />
                      </AspectRatio>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
