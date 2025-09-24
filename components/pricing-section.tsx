import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Hero",
    price: "$19",
    period: "/month",
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
  },
  {
    name: "Hero+",
    price: "$79",
    period: "/month",
    description: "Enhanced workflow automation",
    features: [
      "Everything in Hero",
      "Enhanced workflow automation",
      "Up to 200 users",
      "Advanced compliance suite",
      "Blockchain audit trails",
      "USPS-ready CRD submission",
      "Priority support",
    ],
    popular: true,
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-50 to-cyan-100",
    borderColor: "border-cyan-400",
  },
  {
    name: "Pro",
    price: "$149",
    period: "/month",
    description: "Multi-location management",
    features: [
      "Everything in Hero+",
      "Multi-location management",
      "Up to 1,000 users",
      "Advanced compliance automation",
      "Custom compliance workflows",
      "Analytics dashboard",
      "Dedicated account manager",
    ],
    popular: false,
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
  },
  {
    name: "Pro-Ent",
    price: "$299",
    period: "/month",
    description: "Enterprise features with white-label options",
    features: [
      "Everything in Pro",
      "Enterprise features",
      "White-label options",
      "Unlimited users",
      "Custom integrations",
      "24/7 dedicated support",
      "Advanced analytics",
      "SSO & compliance integrations",
    ],
    popular: false,
    gradient: "from-orange-500 to-orange-600",
    bgGradient: "from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
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
              className={`pricing-card border-2 ${plan.borderColor} p-6 rounded-lg text-center bg-gradient-to-b ${plan.bgGradient} hover:from-${plan.bgGradient.split(" ")[1]} hover:to-white transition-all duration-300 relative overflow-hidden ${
                plan.popular ? "transform hover:scale-105 shadow-lg hover:shadow-xl mt-4" : ""
              }`}
            >
              {plan.popular && (
                <>
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md z-20">
                    MOST POPULAR
                  </span>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-400/20 rounded-full -translate-y-10 translate-x-10"></div>
                </>
              )}

              <div className={`relative z-10 ${plan.popular ? "mt-8" : ""}`}>
                <div
                  className={`w-12 h-12 ${plan.popular ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-stone-500"} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Check className="w-6 h-6 text-white" />
                </div>

                <h4 className={`font-bold text-lg ${plan.popular ? "text-cyan-700" : "text-stone-700"}`}>
                  {plan.name}
                </h4>

                <p className="text-3xl font-extrabold my-2">
                  {plan.price}
                  <span className="font-normal text-base">/mo</span>
                </p>

                <p className={`text-sm ${plan.popular ? "text-cyan-600" : "text-stone-600"} mb-6`}>
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8 text-left">
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
                  <a href={plan.name === "Pro-Ent" ? "/contact" : "/demo"}>
                    {plan.name === "Pro-Ent" ? "Contact Sales" : "Get Started"}
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
