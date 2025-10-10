import { Button } from "@/components/ui/button"
import { Check } from "@/lib/icons"

const plans = [
  {
    name: "Hero",
    price: "Free",
    period: "",
    description: "Zero to Hero journey starts here",
    features: [
      "Essential compliance features",
      "Single location",
      "Up to 50 users",
      "Basic CMRA compliance",
      "AI witness verification",
      "Email support",
    ],
    popular: false,
    gradient: "from-stone-500 to-stone-600",
    bgGradient: "from-white to-stone-50",
    borderColor: "border-stone-200",
    checkoutUrl: "/checkout?plan=hero",
  },
  {
    name: "Hero+",
    price: "$49",
    period: "/month",
    description: "Enhanced workflow automation",
    features: [
      "Everything in Hero",
      "Enhanced workflow automation",
      "Up to 100 users",
      "Advanced compliance suite",
      "Blockchain audit trails",
      "USPS-ready CRD submission",
      "Priority support",
    ],
    popular: false,
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-50 to-cyan-100",
    borderColor: "border-cyan-400",
    checkoutUrl: "/checkout?plan=hero-plus",
  },
  {
    name: "Pro",
    price: "$149",
    period: "/month",
    description: "Multi-location management",
    features: [
      "Everything in Hero+",
      "Multi-location management",
      "Up to 500 clients",
      "Advanced compliance automation",
      "Custom compliance workflows",
      "Analytics dashboard",
      "Dedicated account manager",
    ],
    popular: true,
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
    checkoutUrl: "/checkout?plan=pro",
  },
  {
    name: "Pro+",
    price: "$299",
    period: "/month",
    description: "Multi-location enterprise solution",
    features: [
      "Everything in Pro",
      "Enterprise features",
      "Multi-location support",
      "Up to 1,000 users",
      "Custom integrations",
      "24/7 dedicated support",
      "Advanced analytics",
      "SSO & compliance integrations",
    ],
    popular: false,
    gradient: "from-orange-500 to-orange-600",
    bgGradient: "from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
    checkoutUrl: "/checkout?plan=pro-plus",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your team. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card border-2 ${plan.borderColor} rounded-lg bg-gradient-to-b ${plan.bgGradient} hover:from-${plan.bgGradient.split(" ")[1]} hover:to-white transition-all duration-300 relative overflow-visible flex flex-col ${
                plan.popular ? "transform hover:scale-105 shadow-lg hover:shadow-xl" : ""
              }`}
            >
              {plan.popular && (
                <>
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md z-20">
                    MOST POPULAR
                  </span>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-400/20 rounded-full -translate-y-10 translate-x-10"></div>
                </>
              )}

              <div className={`relative z-10 p-6 flex flex-col h-full ${plan.popular ? "pt-8" : ""}`}>
                <div
                  className={`w-12 h-12 ${plan.popular ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-stone-500"} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Check className="w-6 h-6 text-white" />
                </div>

                <h4 className={`font-bold text-lg ${plan.popular ? "text-cyan-700" : "text-stone-700"} text-center`}>
                  {plan.name}
                </h4>

                <div className="text-center h-24 flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    <span className="text-5xl font-extrabold leading-none">{plan.price}</span>
                    {plan.period && (
                      <span className="text-base font-normal text-muted-foreground self-end pb-1">{plan.period}</span>
                    )}
                  </div>
                </div>

                <p className={`text-sm ${plan.popular ? "text-cyan-600" : "text-stone-600"} mb-6 text-center`}>
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8 text-left flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div
                        className={`h-5 w-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mr-3 mt-0.5 flex-shrink-0`}
                      >
                        <Check className="h-3 w-3 text-white font-bold" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r ${plan.gradient} hover:shadow-lg text-white border-0`}
                  asChild
                >
                  <a href={plan.checkoutUrl}>Get Started</a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-16">
          <div className="relative overflow-hidden rounded-2xl border-2 border-gradient-to-r from-cyan-500 to-blue-500 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 p-8 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Need more than 1,000 users?</h3>
              <p className="text-lg text-gray-700 mb-6">
                Get custom enterprise pricing tailored to your organization's needs.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <a href="/contact">Contact Sales</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
