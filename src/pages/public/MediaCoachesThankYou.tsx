import { motion } from "framer-motion";
import { CheckCircle, Mail, MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicLayout } from '@/components/public/PublicLayout';

export default function MediaCoachesThankYou() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-primary relative overflow-hidden flex items-center justify-center" dir="rtl">
        {/* Background orbs */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-bright/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="mx-auto mb-8 w-24 h-24 rounded-full bg-bright/20 flex items-center justify-center"
          >
            <CheckCircle className="w-14 h-14 text-bright" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            תודה שהצטרפת! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl text-primary-foreground/80 mb-3"
          >
            ההרשמה לקורס <span className="text-bright font-bold">מאמני מדיה</span> בוצעה בהצלחה
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-primary-foreground/60 text-lg mb-10"
          >
            בדקות הקרובות תקבלו מייל עם כל הפרטים והגישה לקורס.
            <br />
            בדקו גם בתיקיית הספאם 📬
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <a
              href="https://wa.me/972559444882"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              צרו קשר בוואטסאפ
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border border-primary-foreground/20 text-primary-foreground/80 hover:bg-primary-foreground/10 px-6 py-3 rounded-full font-bold transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              חזרה לאתר
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="glass-effect rounded-2xl p-6 text-primary-foreground/70 text-sm"
          >
            <Mail className="w-5 h-5 mx-auto mb-2 text-bright" />
            שאלות? כתבו לנו ונחזור אליכם בהקדם
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
