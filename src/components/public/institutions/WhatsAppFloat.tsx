import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
  const openWhatsApp = () => {
    window.open('https://wa.me/972585582120', '_blank');
  };

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-6 left-6 z-50 group"
      aria-label="פתח שיחה בווצאפ"
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse opacity-20 scale-125" />

      {/* Main button */}
      <div className="relative h-16 w-16 rounded-full bg-[#25D366] hover:bg-[#20BD5A] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-110">
        <MessageCircle className="h-8 w-8 text-white" />
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        דברו איתנו בוואטסאפ
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-foreground" />
      </div>
    </button>
  );
};

export default WhatsAppFloat;
