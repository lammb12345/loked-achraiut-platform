import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Lecture } from "./LecturesFilter";

interface LectureDialogProps {
  lecture: Lecture | null;
  onClose: () => void;
}

const LectureDialog = ({ lecture, onClose }: LectureDialogProps) => {
  if (!lecture) return null;

  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const IconComponent = lecture.icon;

  return (
    <Dialog open={!!lecture} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-right">
          <div className="mb-4 text-secondary">
            <IconComponent className="w-12 h-12" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl text-right">{lecture.title}</DialogTitle>
          <p className="text-base sm:text-lg text-foreground/70 text-right">
            {lecture.subtitle}
          </p>
        </DialogHeader>

        <div className="space-y-5 sm:space-y-6 py-4">
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-2 text-right">תיאור קצר:</h4>
            <p className="text-sm sm:text-base text-foreground/80 text-right">{lecture.description}</p>
          </div>

          <div>
            <h4 className="font-bold text-base sm:text-lg mb-2 text-right">פירוט מלא:</h4>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed text-right">{lecture.fullDescription}</p>
          </div>

          <div>
            <h4 className="font-bold text-base sm:text-lg mb-2 text-right">מתאים ל:</h4>
            <div className="flex flex-wrap gap-2">
              {lecture.audiences.map((audience) => (
                <Badge key={audience} variant="secondary" className="text-sm sm:text-base px-3 sm:px-4 py-1">
                  {audience}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-bright hover:bg-bright/90 text-primary font-bold text-sm sm:text-base"
            onClick={scrollToContact}
          >
            מעוניינים בהרצאה זו - צרו קשר
            <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LectureDialog;
