import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import fatherChildImage from "@/assets/father-child-computer.png";

export function VisionSection() {
  return (
    <section dir="rtl" className="py-12 md:py-16 bg-gradient-to-b from-background to-accent/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Desktop: Side by side layout, Mobile: Stacked */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">

            {/* Text Content */}
            <div className="flex-1 text-center md:text-right space-y-6">
              {/* Main Introduction */}
              <div className="space-y-3">
                <p className="text-base md:text-lg text-foreground/70">
                  נעים להכיר! אנחנו
                </p>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight bg-gradient-to-l from-[#1B365D] via-[#2E7AB8] to-[#7BC4E8] bg-clip-text text-transparent">
                  עמותת "לוקחים אחריות"
                </h2>
              </div>

              {/* Mission Statement */}
              <div className="max-w-xl">
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  אנחנו כאן כדי ליצור{" "}
                  <span className="font-semibold text-primary">שינוי חברתי חיובי</span>{" "}
                  במרחב הרשת – לסייע להמונים לפתח מודעות לשימוש בריא ומצמיח במדיה.
                </p>
              </div>

              {/* CTA Link */}
              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold text-sm md:text-base transition-colors group"
                >
                  <Sparkles className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                  בואו ללמוד עוד על הארגון שלנו
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Image - Laptop mockup style */}
            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="relative mx-auto w-[280px] md:w-[380px]">
                {/* Laptop frame */}
                <div className="relative bg-gray-800 rounded-t-xl p-2 shadow-2xl">
                  {/* Screen bezel */}
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      src={fatherChildImage}
                      alt="אבא מסביר לילד על המחשב"
                      className="w-full h-[180px] md:h-[240px] object-cover"
                    />
                  </div>
                  {/* Webcam dot */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-600 rounded-full" />
                </div>
                {/* Laptop base */}
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 h-3 md:h-4 rounded-b-lg mx-4" />
                <div className="bg-gray-700 h-1.5 rounded-b-xl mx-12 shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
