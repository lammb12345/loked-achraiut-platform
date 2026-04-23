import { PublicLayout } from '@/components/public/PublicLayout'
import { HeroSection } from '@/components/public/HeroSection'
import { VisionSection } from '@/components/public/VisionSection'
import { InitiativeCards } from '@/components/public/InitiativeCards'
import { NewsSection } from '@/components/public/NewsSection'
import { CTASection } from '@/components/public/CTASection'

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <VisionSection />
      <InitiativeCards />
      <NewsSection />
      <CTASection />
    </PublicLayout>
  )
}
