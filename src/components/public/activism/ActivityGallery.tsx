import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fallback images for when database is empty
import gallery1 from "@/assets/activism/gallery-1.jpeg";
import gallery2 from "@/assets/activism/gallery-2.jpeg";
import gallery3 from "@/assets/activism/gallery-3.jpeg";
import gallery4 from "@/assets/activism/gallery-4.jpeg";
import gallery5 from "@/assets/activism/gallery-5.jpeg";
import gallery6 from "@/assets/activism/gallery-6.jpeg";
import gallery7 from "@/assets/activism/gallery-7.jpeg";
import gallery8 from "@/assets/activism/gallery-8.jpeg";
import gallery9 from "@/assets/activism/gallery-9.jpeg";
import gallery10 from "@/assets/activism/gallery-10.jpeg";
import gallery11 from "@/assets/activism/gallery-11.jpeg";
import gallery12 from "@/assets/activism/gallery-12.jpeg";
import gallery13 from "@/assets/activism/gallery-13.jpeg";
import gallery14 from "@/assets/activism/gallery-14.jpeg";
import gallery15 from "@/assets/activism/gallery-15.jpeg";
import gallery16 from "@/assets/activism/gallery-16.jpeg";
import gallery17 from "@/assets/activism/gallery-17.jpeg";

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
}

const fallbackImages = [
  { id: "1", image_url: gallery1, alt_text: "פעילות קהילתית", display_order: 0 },
  { id: "2", image_url: gallery3, alt_text: "הרצאה בכנס", display_order: 1 },
  { id: "3", image_url: gallery4, alt_text: "דובר בכנס", display_order: 2 },
  { id: "4", image_url: gallery17, alt_text: "פגישה במשרד התקשורת", display_order: 3 },
  { id: "5", image_url: gallery9, alt_text: "הרצאה על במה", display_order: 4 },
  { id: "6", image_url: gallery5, alt_text: "מפגש עם אנשי מקצוע", display_order: 5 },
  { id: "7", image_url: gallery10, alt_text: "דוברת בכנס כיפת ברזל דיגיטלית", display_order: 6 },
  { id: "8", image_url: gallery11, alt_text: "שיחה על הבמה", display_order: 7 },
  { id: "9", image_url: gallery13, alt_text: "צוות הפעילים", display_order: 8 },
  { id: "10", image_url: gallery14, alt_text: "פעילים בכנס", display_order: 9 },
  { id: "11", image_url: gallery15, alt_text: "פגישה עם בכירים", display_order: 10 },
  { id: "12", image_url: gallery16, alt_text: "פגישת עבודה", display_order: 11 },
  { id: "13", image_url: gallery8, alt_text: "דיון שולחן עגול", display_order: 12 },
  { id: "14", image_url: gallery6, alt_text: "שיחה עם משתתפים", display_order: 13 },
  { id: "15", image_url: gallery7, alt_text: "מפגש נטוורקינג", display_order: 14 },
  { id: "16", image_url: gallery2, alt_text: "משתתף בכנס", display_order: 15 },
  { id: "17", image_url: gallery12, alt_text: "באנר כנס כיפת ברזל דיגיטלית", display_order: 16 },
];

const ActivityGallery = () => {
  const { data: dbImages = [] } = useQuery({
    queryKey: ["activism-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activism_gallery")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const images = dbImages.length > 0 ? dbImages : fallbackImages;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <span className="inline-block bg-bright/20 text-secondary font-bold px-4 py-2 rounded-full text-sm">
              רגעים מהשטח
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">גלריית הפעילות שלנו</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              כנסים, מפגשים ופעילויות מהשטח - ביחד אנחנו משנים את המציאות
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                  index === 0 || index === 3 || index === 8 ? 'row-span-2' : ''
                }`}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{
                    minHeight: index === 0 || index === 3 || index === 8 ? '400px' : '200px',
                    height: '100%'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-medium text-sm md:text-base">{image.alt_text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivityGallery;
