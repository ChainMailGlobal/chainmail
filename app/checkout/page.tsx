import { Suspense } from "react"
import { redirect } from "next/navigation"
import StripeCheckout from "@/components/stripe-checkout"

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string }
}) {
  const plan = searchParams.plan

  // Redirect to pricing if no plan specified
  if (!plan) {
    redirect("/pricing")
  }

  // Redirect free plan to signup
  if (plan === "hero") {
    redirect("/demo-v31")
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Subscription</h1>
          <p className="text-muted-foreground">Secure checkout powered by Stripe</p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <StripeCheckout productId={plan} />
        </Suspense>
      </div>
    </div>
  )
}
