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
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                <div>
                  From <span className="text-orange-400">Zero</span> Compliance Headaches
                </div>
                <div>
                  to <span className="text-cyan-400">HERO</span>
                </div>
                <div>in Your Industry</div>
              </h1>

              <p className="text-lg md:text-xl text-blue-200 mb-2">
                Reimagined-Efficient. Redefined-Effective. Reinvented-Enjoyable.
              </p>
              <p className="text-md md:text-lg text-blue-300 mb-8">
                USPS Compliance Automation Through AI Authorized Employees
              </p>
            </div>

            <div className="flex-1 flex justify-center flex-col items-center">
              <div className="relative w-full h-96 md:h-[500px]">
                <img
                  src="/images/design-mode/Screenshot%202025-08-27%20055429.png"
                  alt="MailboxHero PRO Storybook Cover"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-cyan-400/30"
                />

                {/* Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                  <Button
                    size="lg"
                    className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 px-10 rounded-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-110"
                    asChild
                  >
                    <a href="/pdf-viewer">
                      Meet Your MailBox Hero PRO!
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
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
