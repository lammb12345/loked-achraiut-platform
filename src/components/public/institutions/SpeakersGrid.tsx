import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User, Loader2 } from "lucide-react";

interface Speaker {
  id: string;
  name: string;
  title: string;
  description: string;
  expertise: string[];
  audiences: string[];
  image_url: string | null;
  display_order: number;
}

const SpeakersGrid = () => {
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null);

  const { data: speakers = [], isLoading } = useQuery({
    queryKey: ["speakers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("speakers")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Speaker[];
    },
  });

  const audiences = ["הכל", "נוער", "יסודי", "הורים", "צוות", "הנהלה"];

  const filteredSpeakers = selectedAudience && selectedAudience !== "הכל"
    ? speakers.filter(speaker => speaker.audiences.includes(selectedAudience))
    : speakers;

  if (isLoading) {
    return (
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </section>
    );
  }

  return (
    <section dir="rtl" id="speakers" className="py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-3 sm:mb-4">
            הנבחרת שלנו
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 text-center mb-8 sm:mb-12 px-4">
            אנשים שיעשו לכם סדר – עם ניסיון שטח, שפה מחוברת והבנה עמוקה
          </p>

          {/* Audience Filter */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {audiences.map((audience) => (
              <button
                key={audience}
                onClick={() => setSelectedAudience(audience === "הכל" ? null : audience)}
                className={cn(
                  "px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-smooth text-sm sm:text-base",
                  (!selectedAudience && audience === "הכל") || selectedAudience === audience
                    ? "bg-primary text-primary-foreground shadow-premium"
                    : "bg-background border border-border text-foreground hover:bg-accent"
                )}
              >
                {audience}
              </button>
            ))}
          </div>

          {/* Speakers Grid */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {filteredSpeakers.map((speaker) => (
              <Card
                key={speaker.id}
                className="bg-gradient-to-br from-background to-accent/20 hover:shadow-premium transition-smooth"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br from-secondary to-secondary/80">
                      {speaker.image_url ? (
                        <img
                          src={speaker.image_url}
                          alt={speaker.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-primary mb-1">
                        {speaker.name}
                      </h3>
                      <p className="text-bright font-medium mb-3 text-sm sm:text-base">{speaker.title}</p>
                      <p className="text-sm sm:text-base text-foreground/80 mb-4 leading-relaxed">
                        {speaker.description}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-foreground/60 mb-2">תחומי מומחיות:</p>
                          <div className="flex flex-wrap gap-2">
                            {speaker.expertise.map((exp) => (
                              <Badge key={exp} variant="outline" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs sm:text-sm font-medium text-foreground/60 mb-2">מתאים ל:</p>
                          <div className="flex flex-wrap gap-2">
                            {speaker.audiences.map((aud) => (
                              <Badge key={aud} className="bg-primary/10 text-primary text-xs">
                                {aud}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeakersGrid;
