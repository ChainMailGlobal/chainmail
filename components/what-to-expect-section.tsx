import { CreditCard, Lock, MessageSquare } from "@/lib/icons"

export function WhatToExpectSection() {
  const steps = [
    {
      icon: CreditCard,
      title: "1. Complete Payment",
      description: "Choose your plan and complete checkout with Stripe. Your subscription activates immediately.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: Lock,
      title: "2. Set Your Password",
      description:
        "You'll be redirected to create your account. Your email is pre-filled from checkout—just set a secure password.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: MessageSquare,
      title: "3. Start Your Registration",
      description:
        "Access your dashboard and launch CMRAgent chat to begin your guided Form 1583 registration process.",
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What to Expect After Signup</h2>
          <p className="text-xl text-slate-300">Get started in minutes with our streamlined onboarding process</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-slate-600 transition-all duration-300"
            >
              <div
                className={`${step.bgColor} ${step.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}
              >
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-300 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-12 p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
          <p className="text-center text-slate-300">
            <span className="font-semibold text-cyan-400">No email verification needed.</span> Since you've completed
            payment, your account is automatically verified and ready to use.
          </p>
        </div>
      </div>
    </section>
  )
}
