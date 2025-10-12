import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { CmraCrisisSection } from "@/components/cmra-crisis-section"
import { CmraDefinitionSection } from "@/components/cmra-definition-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { WhatToExpectSection } from "@/components/what-to-expect-section"
import { PricingSection } from "@/components/pricing-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <CmraCrisisSection />
      <CmraDefinitionSection />
      <FeaturesSection />
      <TestimonialsSection />
      <WhatToExpectSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
