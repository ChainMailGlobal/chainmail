import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, FileCheck, Zap } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "3-Minute Compliance",
    description:
      "Transform 2-week CMRA compliance onboarding into 3 minutes with AI witness and automated form processing.",
  },
  {
    icon: Shield,
    title: "Blockchain Audit Trails",
    description:
      "Immutable compliance records with blockchain verification ensure audit-ready documentation and regulatory protection.",
  },
  {
    icon: FileCheck,
    title: "USPS-Ready Submission",
    description: "Automated CRD submission and Form 1583 processing that meets all USPS DMM 508.1.8 requirements.",
  },
  {
    icon: Zap,
    title: "AI Witness Technology",
    description:
      "Advanced AI verification system provides legally compliant witness services for remote mail management setup.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Compliance-First Mail Management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stay compliant with USPS regulations while focusing on your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300 bg-card">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-heading font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
