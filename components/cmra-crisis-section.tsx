import { AlertTriangle, FileX, Scale, Clock, Users, Building2 } from "@/lib/icons"

export function CmraCrisisSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            URGENT: Regulatory Crisis
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-balance">
            USPS DMM 508.1.8: The Compliance Crisis Threatening Your CMRA Business
          </h2>
          <p className="text-xl text-gray-700 text-balance">
            New USPS classifications have pulled thousands of coworking centers and office business centers into CMRA
            compliance overnight. Non-compliance isn't just risky—it could be considered legal fraud.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-red-500">
            <Scale className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Fraud Risk</h3>
            <p className="text-gray-700">
              Operating without filing Form 1583-A while receiving mail on behalf of others could constitute mail fraud.
              The legal exposure is real and immediate.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-orange-500">
            <FileX className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Form 1583: 47 Fields of Confusion</h3>
            <p className="text-gray-700">
              Form 1583 requires 47 separate data points, multiple signatures, notarization, and physical document
              handling. One mistake invalidates the entire process.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-yellow-500">
            <Clock className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">2-Week Paper Trail Nightmare</h3>
            <p className="text-gray-700">
              Physical forms, in-person meetings, notary appointments, mailing delays, and manual filing create a 2-week
              compliance bottleneck that frustrates customers.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">The Business Disruption Is Real</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">23,000+</div>
                  <div className="text-red-100">Registered CMRAs</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">1.5M+</div>
                  <div className="text-red-100">Hidden CMRA Locations</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">90%+</div>
                  <div className="text-red-100">Non-Compliant</div>
                </div>
              </div>
            </div>
            <p className="text-lg text-red-100">
              Most operators don't even know they need Form 1583-A. Those who do face weeks of manual paperwork,
              frustrated customers, and constant audit anxiety. <strong>The old way doesn't work anymore.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
