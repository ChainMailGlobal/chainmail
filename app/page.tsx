import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { SevenBenefitsSection } from "@/components/seven-benefits-section"
import { CmraCrisisSection } from "@/components/cmra-crisis-section"
import { CmraDefinitionSection } from "@/components/cmra-definition-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <SevenBenefitsSection />
      <CmraCrisisSection />
      <CmraDefinitionSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
