import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-6">The CMRAi™ Advantage</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Like the hydroperoxyl radical that transforms atmospheric chemistry, our AI-powered authorized employee
            creates a radical transformation in how businesses experience compliance - making it instant, efficient,
            zero fraud, immutable, compliant, effective, and enjoyable to run a business.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Transparency: Why CMRAi™ Exists</h3>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                  Currently, no official USPS APIs exist for CMRA compliance automation. Traditional solutions require
                  manual data entry, paper forms, and weeks of processing time.
                </p>
                <p className="text-blue-800 text-sm leading-relaxed">
                  <strong>Our Solution:</strong> CMRAi™ is our proprietary AI that acts as an authorized employee,
                  performing intelligent RPA (Robotic Process Automation) to "manually" navigate USPS portals, fill
                  forms, and complete compliance tasks on your behalf - transforming weeks of work into minutes of
                  automation.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              asChild
            >
              <a href="/demo-v31">Schedule a Demo</a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">No credit card required • Cancel anytime</p>
        </div>
      </div>
    </section>
  )
}
