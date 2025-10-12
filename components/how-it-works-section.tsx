import { CheckCircle, FileText, Upload, Video, Shield, Download } from "@/lib/icons"

export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Start Your Registration",
      description:
        "Click the CMRAgent button and choose your role: CMRA Owner, Customer, or Individual setting up a mailbox.",
      icon: CheckCircle,
      documents: [
        "Driver's License",
        "U.S. Passport or Passport Card",
        "State-Issued ID Card",
        "Military ID",
        "Permanent Resident Card (Green Card)",
      ],
      documentLabel: "Accepted Government IDs:",
    },
    {
      number: "2",
      title: "Provide Your Information",
      description:
        "Answer guided questions about your identity, address, and mailbox details. The AI assistant walks you through each field.",
      icon: FileText,
      documents: [
        "Utility Bill (electric, gas, water)",
        "Bank or Credit Card Statement",
        "Lease or Mortgage Agreement",
        "Insurance Policy or Statement",
        "Government-Issued Document with Address",
      ],
      documentLabel: "Secondary ID Options:",
    },
    {
      number: "3",
      title: "Upload Required Documents",
      description:
        "Submit two valid forms of ID (driver's license, passport, etc.) and proof of your physical address.",
      icon: Upload,
      documents: [
        "Articles of Incorporation",
        "EIN Letter (IRS Form SS-4)",
        "Business License",
        "Operating Agreement or Bylaws",
        "Certificate of Good Standing",
      ],
      documentLabel: "Business Documents (if applicable):",
    },
    {
      number: "4",
      title: "Choose Witness Method",
      description:
        "Select AI-powered video witness, schedule a live video call, or arrange in-person verification at your CMRA location.",
      icon: Video,
    },
    {
      number: "5",
      title: "Complete Verification",
      description:
        "Complete the witness process where your identity is verified and your Form 1583 is witnessed according to USPS requirements.",
      icon: Shield,
    },
    {
      number: "6",
      title: "Sign & Receive Documents",
      description:
        "Digitally sign your completed Form 1583. Receive your signed documents instantly and gain access to your mailbox services.",
      icon: Download,
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-white">
            Complete Your CMRA Registration in <span className="text-cyan-400">6 Simple Steps</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto text-pretty">
            Our AI-powered assistant guides you through the entire USPS Form 1583 process. Have your documents ready and
            complete registration in under 15 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="relative bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:shadow-xl hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-slate-300 text-pretty">{step.description}</p>

                {step.documents && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-sm font-medium mb-2 text-white">{step.documentLabel || "Required Documents:"}</p>
                    <ul className="space-y-1">
                      {step.documents.map((doc, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-slate-800/70 border border-slate-700 rounded-lg p-6 max-w-2xl">
            <h3 className="text-lg font-semibold mb-2 text-white">Ready to Get Started?</h3>
            <p className="text-slate-300 mb-4">
              Click the CMRAgent button in the bottom right corner to begin your registration. Our AI assistant is
              available 24/7 to guide you through the process.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>USPS Compliant • Secure • Instant Processing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
