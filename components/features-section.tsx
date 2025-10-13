import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, FileCheck, Zap, CheckCircle, AlertCircle } from "@/lib/icons"

const features = [
  {
    icon: Clock,
    title: "3-Minute Compliance",
    description:
      "Transform 2-week CMRA compliance onboarding into 3 minutes with AI witness and automated form processing.",
  },
  {
    icon: Shield,
    title: "Autonomous RPA Audits",
    description:
      "Robotic Process Automation continuously monitors compliance, generates audit reports, and maintains regulatory readiness without manual intervention.",
  },
  {
    icon: FileCheck,
    title: "Auto-Upload to USPS CRD",
    description:
      "Autonomous system automatically submits Form 1583 and updates to USPS Customer Registration Database, ensuring real-time compliance.",
  },
  {
    icon: Zap,
    title: "AI Witness Technology",
    description:
      "Advanced AI verification system provides legally compliant witness services for remote mail management setup.",
  },
]

const expectations = [
  {
    icon: CheckCircle,
    title: "What the System Handles",
    items: [
      "Automatic Form 1583 generation and submission",
      "Real-time USPS CRD database updates",
      "Continuous compliance monitoring and alerts",
      "Audit trail generation and storage",
      "Document encryption and secure storage",
    ],
  },
  {
    icon: AlertCircle,
    title: "What You Provide",
    items: [
      "USPS BCG and CRD login credentials (one-time setup)",
      "Customer information during onboarding",
      "Witness verification (AI, video, or in-person)",
      "Digital signature for Form 1583",
      "Business documentation (if applicable)",
    ],
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            From Automation to Autonomous
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            RPA-powered compliance that audits, monitors, and uploads to USPS CRD without human intervention
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

        <div className="mt-16">
          <h3 className="text-2xl font-heading font-bold text-center text-foreground mb-8">What to Expect</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {expectations.map((expectation, index) => (
              <Card key={index} className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        index === 0 ? "bg-green-500/10" : "bg-blue-500/10"
                      }`}
                    >
                      <expectation.icon className={`h-5 w-5 ${index === 0 ? "text-green-500" : "text-blue-500"}`} />
                    </div>
                    <CardTitle className="text-xl font-heading font-bold text-card-foreground">
                      {expectation.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {expectation.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-muted-foreground">
                        <span
                          className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                            index === 0 ? "bg-green-500" : "bg-blue-500"
                          }`}
                        />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
