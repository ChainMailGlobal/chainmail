import { CheckCircle, Shield } from "@/lib/icons"

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-white">
            How <span className="text-cyan-400">Aloha Pre-Check</span> Works
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto text-pretty">
            Our AI-powered assistant guides you through USPS Form 1583 compliance in minutes, not weeks.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Share Basic Info</h3>
                <p className="text-slate-300 text-lg mb-4">
                  Tell us who you are (CMRA owner/employee, CMRA customer, or individual setting up a mailbox), your
                  name, physical address, and the mailbox address you're registering.
                </p>
                <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2 text-cyan-400">Accepted Government IDs:</p>
                  <ul className="space-y-1">
                    <li className="text-sm text-slate-300">• Driver's License</li>
                    <li className="text-sm text-slate-300">• U.S. Passport or Passport Card</li>
                    <li className="text-sm text-slate-300">• State-Issued ID Card</li>
                    <li className="text-sm text-slate-300">• Military ID</li>
                    <li className="text-sm text-slate-300">• Permanent Resident Card (Green Card)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Upload Two IDs</h3>
                <p className="text-slate-300 text-lg mb-4">
                  Snap photos of your government-issued photo ID (driver's license, passport, etc.) and a secondary
                  document proving your physical address (utility bill, bank statement, lease, etc.). Our AI extracts
                  the data automatically.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2 text-cyan-400">Primary ID (Photo):</p>
                    <ul className="space-y-1">
                      <li className="text-sm text-slate-300">• Driver's License</li>
                      <li className="text-sm text-slate-300">• Passport</li>
                      <li className="text-sm text-slate-300">• State ID</li>
                      <li className="text-sm text-slate-300">• Military ID</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2 text-cyan-400">Secondary ID (Address):</p>
                    <ul className="space-y-1">
                      <li className="text-sm text-slate-300">• Utility Bill</li>
                      <li className="text-sm text-slate-300">• Bank Statement</li>
                      <li className="text-sm text-slate-300">• Lease Agreement</li>
                      <li className="text-sm text-slate-300">• Insurance Statement</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2 text-cyan-400">Business Documents (if applicable):</p>
                  <ul className="space-y-1">
                    <li className="text-sm text-slate-300">• Articles of Incorporation</li>
                    <li className="text-sm text-slate-300">• EIN Letter (IRS Form SS-4)</li>
                    <li className="text-sm text-slate-300">• Business License</li>
                    <li className="text-sm text-slate-300">• Operating Agreement or Certificate of Good Standing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Pick Your Witness Path</h3>
                <p className="text-slate-300 text-lg mb-4">
                  Choose how you'd like to complete the required USPS witness step:
                </p>
                <div className="space-y-3">
                  <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                    <p className="font-medium text-white mb-1">AI Witness (Instant)</p>
                    <p className="text-sm text-slate-300">
                      Record a short video on your phone following AI prompts. Approved in seconds.
                    </p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                    <p className="font-medium text-white mb-1">Live Video Call</p>
                    <p className="text-sm text-slate-300">
                      Schedule a 5-minute video call with a certified witness at your convenience.
                    </p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                    <p className="font-medium text-white mb-1">In-Person</p>
                    <p className="text-sm text-slate-300">
                      Visit your CMRA location to complete the witness process face-to-face.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Sign & You're Done</h3>
                <p className="text-slate-300 text-lg mb-4">
                  Review your auto-filled Form 1583, add your digital signature, and receive your completed,
                  USPS-compliant PDF instantly. Your CMRA dashboard updates in real-time with your approved status.
                </p>
                <div className="flex items-center gap-2 text-sm text-cyan-400">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Instant PDF • Real-Time Dashboard • USPS Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-cyan-400 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Need to know if you're a CMRA?
            </h3>
            <p className="text-slate-300">
              A <strong className="text-white">Commercial Mail Receiving Agency (CMRA)</strong> is a private business
              that accepts mail on behalf of third parties. If you run a mailbox rental service, virtual office, or mail
              forwarding business, you're a CMRA. If you're renting a mailbox from one of these businesses, you're a
              CMRA customer. If you're setting up a personal mailbox at a CMRA location, you're an individual applicant.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-slate-800/70 border border-slate-700 rounded-lg p-6 max-w-2xl">
            <h3 className="text-lg font-semibold mb-2 text-white">Ready to Start Aloha Pre-Check?</h3>
            <p className="text-slate-300 mb-4">
              Click the CMRAgent shield in the bottom right corner to begin. Our AI assistant is available 24/7 to guide
              you through every step of the process.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>2-Minute Setup • USPS Compliant • Instant Approval</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
