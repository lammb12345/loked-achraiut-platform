import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import promoImage from "@/assets/lecture-promo.png";

interface PromoPopupProps {
  onRequestLecture: () => void;
}

const PromoPopup = ({ onRequestLecture }: PromoPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("promoPopupDismissed");
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("promoPopupDismissed", "true");
  };

  const handleImageClick = () => {
    setIsOpen(false);
    sessionStorage.setItem("promoPopupDismissed", "true");
    onRequestLecture();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] p-0 border-0 bg-transparent overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-2 left-2 z-50 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-smooth shadow-lg"
          aria-label="סגור"
        >
          <X size={24} />
        </button>
        <img
          src={promoImage}
          alt="מבצע סוף שנה - הרצאה שנייה ב-1 שקל בלבד!"
          className="w-full h-auto cursor-pointer rounded-lg shadow-2xl hover:scale-[1.02] transition-transform duration-300"
          onClick={handleImageClick}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PromoPopup;
