import { CheckCircle, Zap, Shield, Clock, FileCheck, Star, Heart } from "@/lib/icons"

export function SevenBenefitsSection() {
  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Instant",
      description: "Real-time compliance verification and processing",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Efficient",
      description: "Streamlined workflows that eliminate manual processes",
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Zero Fraud",
      description: "AI-powered verification prevents fraudulent submissions",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "Immutable",
      description: "Blockchain-secured records that cannot be altered",
    },
    {
      icon: <FileCheck className="h-8 w-8 text-purple-500" />,
      title: "Compliant",
      description: "Built specifically for USPS DMM 508.1.8.1 requirements",
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Enjoyable",
      description: "User-friendly experience that makes compliance pleasant",
    },
    {
      icon: <Star className="h-8 w-8 text-orange-500" />,
      title: "Effective",
      description: "Proven results with measurable compliance improvements",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
