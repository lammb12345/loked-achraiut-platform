import { useRef } from "react";
import { PublicLayout } from '@/components/public/PublicLayout'
import InstitutionsHero from "@/components/public/institutions/InstitutionsHero";
import InstitutionsNavigation from "@/components/public/institutions/InstitutionsNavigation";
import ChallengesSection from "@/components/public/institutions/ChallengesSection";
import SolutionSection from "@/components/public/institutions/SolutionSection";
import LecturesFilter from "@/components/public/institutions/LecturesFilter";
import DeepProcessesSection from "@/components/public/institutions/DeepProcessesSection";
import SpeakersGrid from "@/components/public/institutions/SpeakersGrid";
import TestimonialsSection from "@/components/public/institutions/TestimonialsSection";
import ContactFormSection from "@/components/public/institutions/ContactFormSection";
import WhatsAppFloat from "@/components/public/institutions/WhatsAppFloat";

const Institutions = () => {
  const contactFormRef = useRef<HTMLDivElement>(null);

  return (
    <PublicLayout>
      <InstitutionsHero />
      <InstitutionsNavigation />
      <ChallengesSection />
      <SolutionSection />
      <LecturesFilter />
      <DeepProcessesSection />
      <TestimonialsSection />
      <SpeakersGrid />
      <div ref={contactFormRef}>
        <ContactFormSection />
      </div>
      <WhatsAppFloat />
    </PublicLayout>
  );
};

export default Institutions;
