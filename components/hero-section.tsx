"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "@/lib/icons"

export function HeroSection() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white min-h-screen flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="w-full bg-cyan-900/40 backdrop-blur-sm border-b border-cyan-400/30 relative z-10">
          <div className="text-center py-4">
            <p className="text-sm md:text-base text-cyan-300 font-semibold">
              First USPS DMM 508.1.8.1 CMRA Compliant Software-as-a-Service
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                From <span className="text-orange-400">Zero</span> Compliance Headaches
                <br />
                to <span className="text-cyan-400">Hero</span> Status in Your Industry.
              </h1>

              <p className="text-lg md:text-xl text-blue-200 mb-2">
                Reimagined-Efficient. Redefined-Effective. Reinvented-Enjoyable.
              </p>
              <p className="text-md md:text-lg text-blue-300 mb-8">
                USPS Compliance Automation Through AI Authorized Employees
              </p>

              <div className="flex justify-center lg:justify-start items-center mb-12">
                <Button
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <a href="/pdf-viewer">
                    Meet your Mailbox Hero
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex-1 flex justify-center flex-col items-center">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%208%2C%202025%2C%2006_21_45%20PM-PyMBtJyygIvQskbXvz75gDeeZBQq1p.png"
                  alt="CMRAgent - Professional CMRA Compliance Solution"
                  className="w-full h-96 lg:h-[500px] object-contain rounded-2xl shadow-2xl border-2 border-cyan-400/30"
                />
              </div>

              <div className="mt-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <a href="/demo-v31">Experience v3.1 ✨</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-gradient-to-r from-cyan-900/30 to-blue-900/30 backdrop-blur-sm border-t border-cyan-400/20 relative z-10">
          <div className="text-center py-3">
            <p className="text-cyan-300 font-bold text-xl w-full tracking-wide">
              The Future of USPS Compliance is Here
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
