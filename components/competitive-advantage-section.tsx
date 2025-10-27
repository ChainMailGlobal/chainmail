import { Zap, Database, Shield, Blocks, Hash, FileCheck, Award } from "lucide-react"

export function CompetitiveAdvantageSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <Award className="w-5 h-5" />
            INDUSTRY FIRST: End-to-End Autonomous Compliance Platform
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">Experience the Future of Compliance</h2>
          <p className="text-xl text-gray-700 mb-4 text-balance">
            The <strong>first and only</strong> fully autonomous compliance platform for CMRAs. Optional features that
            transform how you handle Form 1583 processing forever.
          </p>
          <p className="text-lg text-gray-600 italic text-balance">
            "In 2016, I was the first to call out the features that make all of this possible today. Now, we're
            improving the future of compliance again."
          </p>
        </div>
        {/* </CHANGE> */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-500">
            <Zap className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Bulk Upload Processing</h3>
            <p className="text-gray-700 mb-4">
              Upload CSV files with hundreds of customers. Our system automatically sends personalized invitations,
              tracks completion status, and manages the entire onboarding pipeline.
            </p>
            <div className="text-sm text-blue-600 font-medium">
              ✓ Automated email delivery
              <br />✓ Real-time status tracking
              <br />✓ Zero manual intervention
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-indigo-500">
            <Database className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Autonomous Backend</h3>
            <p className="text-gray-700 mb-4">
              AI-powered orchestration handles document verification, witness scheduling, compliance validation, and
              USPS submission without human oversight.
            </p>
            <div className="text-sm text-indigo-600 font-medium">
              ✓ OCR document extraction
              <br />✓ Automated witness coordination
              <br />✓ Smart compliance checks
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-purple-500">
            <Blocks className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Blockchain Verification</h3>
            <p className="text-gray-700 mb-4">
              Every Form 1583 is cryptographically signed and recorded on the XRP Ledger, creating an immutable audit
              trail that proves compliance forever.
            </p>
            <div className="text-sm text-purple-600 font-medium">
              ✓ Tamper-proof records
              <br />✓ Instant verification
              <br />✓ Coming Q2 2025
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-500">
            <FileCheck className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Audit-Ready Records</h3>
            <p className="text-gray-700 mb-4">
              Every transaction is cryptographically sealed and timestamped on the blockchain, creating immutable
              records that satisfy any compliance audit instantly.
            </p>
            <div className="text-sm text-green-600 font-medium">
              ✓ Tamper-proof documentation
              <br />✓ Instant audit retrieval
              <br />✓ Permanent compliance proof
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <Hash className="w-12 h-12 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-2">XRP-Powered PMB Assignment</h3>
                <p className="text-blue-100 text-lg">
                  Each customer receives a unique Private Mailbox (PMB) number generated from their XRP Ledger
                  transaction hash, ensuring global uniqueness and blockchain verification.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-sm text-blue-100 mb-2">Example PMB Assignment:</div>
              <div className="font-mono text-lg mb-4">
                <span className="text-yellow-300">#</span>
                <span className="text-white">A3F7B2</span>
                <span className="text-blue-200 text-sm ml-2">← First 6 characters of XRP hash</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-200 mb-1">Full XRP Transaction:</div>
                  <div className="font-mono text-xs text-white break-all">
                    A3F7B2C8D4E1F9G5H6I2J8K3L7M1N4O9P2Q6R3S8T1U5V7W2X9Y4Z6
                  </div>
                </div>
                <div>
                  <div className="text-blue-200 mb-1">Customer Address:</div>
                  <div className="text-white">
                    123 Main Street
                    <br />
                    <strong className="text-yellow-300">PMB #A3F7B2</strong>
                    <br />
                    Honolulu, HI 96813
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why CMRAs Choose MailBox Hero Pro</h3>
            <p className="text-lg text-gray-700 mb-2">
              While competitors struggle with manual paperwork and compliance anxiety, MailBox Hero Pro delivers instant
              onboarding, autonomous processing, and blockchain-verified compliance that scales effortlessly.
            </p>
            <p className="text-base text-gray-600 mb-6 italic">
              These advanced features are <strong>optional</strong> — choose the level of automation that fits your
              business today, and scale when you're ready.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">2 min</div>
                <div className="text-sm text-gray-600">Customer onboarding time (vs 2 weeks traditional)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">Automated compliance validation and USPS submission</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">Forever</div>
                <div className="text-sm text-gray-600">Blockchain-verified audit trail (coming soon)</div>
              </div>
            </div>
          </div>
        </div>
        {/* </CHANGE> */}
      </div>
    </section>
  )
}
