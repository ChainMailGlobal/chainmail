import { ExternalLink } from "lucide-react"

export function CmraDefinitionSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Am I Considered a Commercial Mail Receiving Agency According to the USPS?
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-8 border border-blue-100">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                According to USPS Domestic Mail Manual (DMM) 508.1.8.1, a{" "}
                <strong>Commercial Mail Receiving Agency (CMRA)</strong> is a private business that accepts U.S. Mail
                delivery on behalf of multiple customers, typically for a fee. CMRAs must register with the local post
                office and receive a unique address designation, such as a private mailbox (PMB). They then hold this
                mail for customer pickup or remail it to a new location with new postage.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Characteristics of a CMRA</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Private Business</h4>
                      <p className="text-gray-600 text-sm">
                        Operates as an independent commercial entity, not directly part of the USPS.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Mail Acceptance Service</h4>
                      <p className="text-gray-600 text-sm">
                        Serves as a central receiving point for mail addressed to their customers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Private Mailbox (PMB) Service</h4>
                      <p className="text-gray-600 text-sm">
                        Customers are assigned a private mailbox at the CMRA, designated with a PMB number.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Registration Required</h4>
                      <p className="text-gray-600 text-sm">
                        Must register with the local Post Office and provide identification.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Customer Responsibility</h4>
                      <p className="text-gray-600 text-sm">
                        Customers pay a fee to the CMRA for the mailbox rental and services.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Mail Handling</h4>
                      <p className="text-gray-600 text-sm">
                        The CMRA accepts mail from the USPS and is responsible for holding or remailing it, but the USPS
                        is not responsible for placing it into individual customer boxes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Official USPS Reference</span>
                </div>
                <p className="text-blue-800 mt-2 text-sm">
                  For the complete official definition and requirements, visit the{" "}
                  <a
                    href="https://about.usps.com/postal-bulletin/2023/pb22624/html/updt_002.htm#:~:text=Effective%20July%209%2C%202023%2C%20the,2."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-600 font-medium"
                  >
                    USPS Postal Bulletin 22624
                  </a>{" "}
                  (Effective July 9, 2023).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
