import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Users, Calendar, Target } from "lucide-react";
import type { DeepProcess } from "./DeepProcessesSection";

interface DeepProcessDialogProps {
  process: DeepProcess | null;
  onClose: () => void;
}

const DeepProcessDialog = ({ process, onClose }: DeepProcessDialogProps) => {
  if (!process) return null;

  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Dialog open={!!process} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-gradient-to-br from-secondary to-secondary/80 p-6 sm:p-8 sticky top-0 z-10">
          <DialogHeader className="text-right">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm text-white shrink-0">
                {process.icon}
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-right mb-1">
                  {process.title}
                </DialogTitle>
                <p className="text-white/80 text-sm sm:text-base">{process.subtitle}</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Description */}
          <div>
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
              {process.description}
            </p>
          </div>

          {/* Phases */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg sm:text-xl text-primary flex items-center gap-2 text-right">
              <Calendar className="w-5 h-5 text-secondary" />
              שלבי התהליך
            </h4>
            <div className="space-y-4">
              {process.phases.map((phase, index) => (
                <div
                  key={index}
                  className="bg-accent/50 rounded-xl p-5 border-r-4 border-secondary"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-primary mb-2 text-right">{phase.title}</h5>
                      <p className="text-foreground/70 mb-3 text-right">{phase.description}</p>
                      {phase.details && (
                        <ul className="space-y-2">
                          {phase.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 text-right">
                              <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcomes */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg sm:text-xl text-primary flex items-center gap-2 text-right">
              <Target className="w-5 h-5 text-secondary" />
              תוצאות התהליך
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {process.outcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-secondary/10 p-4 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-right">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg sm:text-xl text-primary flex items-center gap-2 text-right">
              <Users className="w-5 h-5 text-secondary" />
              למי מתאים?
            </h4>
            <div className="flex flex-wrap gap-2">
              {process.targetAudience.map((audience, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium"
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-border">
            <Button
              size="lg"
              className="w-full bg-bright hover:bg-bright/90 text-primary font-bold text-base sm:text-lg py-6"
              onClick={scrollToContact}
            >
              מעוניינים בתהליך זה - צרו קשר
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeepProcessDialog;
