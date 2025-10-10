import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PlanSelectorProps {
  currentPlan?: string
  hasActiveSubscription: boolean
}

export function PlanSelector({ currentPlan, hasActiveSubscription }: PlanSelectorProps) {
  const plans = [
    {
      id: "hero",
      name: "Hero",
      price: "Free",
      description: "Essential features to get started",
      features: ["Up to 50 users", "Single location", "Basic CMRA compliance"],
      isFree: true,
    },
    {
      id: "hero-plus",
      name: "Hero+",
      price: "$49",
      period: "/month",
      description: "Enhanced workflow automation",
      features: ["Up to 100 users", "Everything in Hero", "Enhanced workflow automation"],
      isFree: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$149",
      period: "/month",
      description: "Multi-location management",
      features: ["Up to 500 clients", "Everything in Hero+", "Multi-location management"],
      isFree: false,
      popular: true,
    },
    {
      id: "pro-plus",
      name: "Pro+",
      price: "$299",
      period: "/month",
      description: "Multi-location enterprise solution",
      features: ["Up to 1,000 users", "Everything in Pro", "Enterprise features"],
      isFree: false,
    },
  ]

  if (hasActiveSubscription && currentPlan) {
    return (
      <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">Current Plan</h3>
              <Badge className="bg-cyan-600">{currentPlan}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Your subscription is active and ready to use</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/pricing">Upgrade Plan</Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Select Your Plan</h3>
        <p className="text-muted-foreground">Choose a plan to unlock full access to your CMRA dashboard and features</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`p-4 relative ${plan.popular ? "border-purple-300 shadow-lg" : "border-gray-200"}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-600">MOST POPULAR</Badge>
            )}

            <div className="text-center mb-4">
              <h4 className="font-bold text-lg mb-1">{plan.name}</h4>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
              </div>
            </div>

            <p className="text-sm text-center text-muted-foreground mb-4">{plan.description}</p>

            <ul className="space-y-2 mb-4 text-sm">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
              <Link href={plan.isFree ? "/demo-v31" : `/checkout?plan=${plan.id}`}>
                {plan.isFree ? "Current Plan" : "Select Plan"}
              </Link>
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Need more users?{" "}
          <Link href="/contact" className="text-cyan-600 hover:underline font-medium">
            Contact Sales
          </Link>
        </p>
      </div>
    </Card>
  )
}
