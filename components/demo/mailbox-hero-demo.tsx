"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Camera,
  FileText,
  Shield,
  Video,
  Calendar,
  Users,
  BarChart3,
  Clock,
  Mail,
  Phone,
} from "lucide-react"

type DemoVersion = "v1" | "v2" | "v3" | "cmrai" | null
type DemoStep = "intro" | "onboarding" | "version-select" | "flow" | "complete"

export default function MailboxHeroDemo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("intro")
  const [selectedVersion, setSelectedVersion] = useState<DemoVersion>(null)
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const version = urlParams.get("version") as DemoVersion

      if (version === "v3") {
        setCurrentStep("onboarding")
        setSelectedVersion(version)
      }
    }
  }, [])

  const versions = [
    {
      id: "v1" as const,
      name: "V1: Wet Ink Foundation",
      description: "In-person kiosk only - customer controls digital process with minimal CMRA interaction",
      features: [
        "In-Person Kiosk Only",
        "Dual Camera Witness Recording",
        "Physical Wet Ink Signature",
        "GPS Verification & CMRA Counter-Sign",
      ],
      badge: "Kiosk Only",
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "v2" as const,
      name: "V2: Paper-less Digital",
      description: "Split screen with scheduled CMRA witness - completely paper-less process",
      features: ["Split Screen Video", "Schedule Witness with CMRA", "Digital Signature Pad", "Paper-less Workflow"],
      badge: "Paper-less",
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "v3" as const,
      name: "V3: Paper-free AI Witness",
      description: "Revolutionary paper-free process that saves time, money, and the earth",
      features: ["Unsubscribe Unwanted Mail", "Uncluttered Mailboxes", "CMRA Cost Savings", "Environmental Impact"],
      badge: "Paper-free",
      color: "bg-emerald-500",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      id: "cmrai" as const,
      name: "CMRAi: CMRA Operations",
      description: "Complete CMRA onboarding and operational dashboard for CRD equivalent operations",
      features: ["Form 1583-A Onboarding", "Witness Scheduling", "Client Management", "Audit & Compliance"],
      badge: "CMRA Ops",
      color: "bg-orange-500",
      gradient: "from-orange-500 to-orange-600",
    },
  ]

  const handleStartDemo = () => {
    setCurrentStep("onboarding")
  }

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true)
    if (selectedVersion) {
      setCurrentStep("flow")
    } else {
      setCurrentStep("version-select")
    }
  }

  const handleVersionSelect = (version: DemoVersion) => {
    setSelectedVersion(version)
    if (version === "cmrai") {
      setCurrentStep("flow")
    } else {
      setCurrentStep("flow")
    }
  }

  const handleFlowComplete = () => {
    setCurrentStep("complete")
  }

  const resetDemo = () => {
    setCurrentStep("intro")
    setSelectedVersion(null)
    setOnboardingComplete(false)
  }

  const UniversalOnboarding = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(0)

    const steps = [
      {
        title: "Photo ID Capture",
        icon: Camera,
        description: "AI OCR scans Sarah Johnson's driver's license for instant data extraction",
        detail: "Scanning CA DL #D1234567 - Address: 123 Pacific Ave, San Francisco, CA 94102",
        visual: "/smartphone-camera-scanning-drivers-license-with-ai.png",
      },
      {
        title: "Address Verification",
        icon: Shield,
        description: "USPS validation confirms Pacific Business Center as authorized CMRA",
        detail: "Verified: 456 Business Plaza, San Francisco, CA 94105 - CMRA License #CA-2024-1234",
        visual: "/usps-address-verification-interface-with-green-che.png",
      },
      {
        title: "Form 1583 Prefill",
        icon: FileText,
        description: "Auto-populated USPS Form 1583 ready for witness signature",
        detail: "Customer: Sarah Johnson | CMRA: Pacific Business Center | Staff: Jessica Martinez",
        visual: "/usps-form-1583-document-with-auto-filled-fields-hi.png",
      },
    ]

    const handleNext = () => {
      if (step < steps.length - 1) {
        setStep(step + 1)
      } else {
        onComplete()
      }
    }

    return (
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
          <CardTitle className="text-2xl">Universal Onboarding Process</CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-center">
            This streamlined process is shared by all versions - transforming 2-week compliance into 3 minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-8">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon
              const isActive = index === step
              const isComplete = index < step

              return (
                <div
                  key={index}
                  className={`flex items-start space-x-6 p-6 rounded-xl transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 shadow-lg scale-105"
                      : isComplete
                        ? "bg-slate-50 border border-slate-200"
                        : "bg-white border border-slate-100"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full flex-shrink-0 transition-all duration-300 ${
                      isComplete
                        ? "bg-emerald-500 text-white shadow-lg"
                        : isActive
                          ? "bg-emerald-100 text-emerald-600 animate-pulse"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isComplete ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2">{stepItem.title}</h3>
                    <p className="text-slate-600 mb-4">{stepItem.description}</p>
                    {isActive && (
                      <>
                        <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                          <img
                            src={stepItem.visual || "/placeholder.svg"}
                            alt={`${stepItem.title} interface mockup`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <p className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3 font-mono">{stepItem.detail}</p>
                      </>
                    )}
                  </div>
                  {isActive && (
                    <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                      {index === steps.length - 1 ? "Complete Setup" : "Process Next"}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  const V1WetInkFlow = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(0)

    const steps = [
      {
        title: "Walk Into CMRA Office",
        description: "Customer arrives at CMRA office for in-person kiosk experience",
        visual: "/cmra-office-with-dual-camera-setup-and-person-sign.png",
        detail: "Sarah Johnson enters Pacific Business Center for Form 1583 completion",
      },
      {
        title: "Complete Form 1583 Online",
        description: "Fill out Form 1583 digitally, CMRA prints single page",
        visual: "/usps-form-1583-document-with-auto-filled-fields-hi.png",
        detail: "Digital form completion → CMRA prints 1 page for wet ink signature",
      },
      {
        title: "Dual Camera Witness Setup",
        description: "Front camera: Customer face | Rear camera: Physical signature capture",
        visual: "/dual-camera-setup-with-two-angles-recording-person.png",
        detail: "Camera 1: Face view | Camera 2: Pen-on-paper signature | Recording in 4K",
      },
      {
        title: "Physical Wet Ink Signature",
        description: "Customer signs with physical pen while dual cameras record",
        visual: "/person-signing-document-while-being-recorded-by-ca.png",
        detail: "✅ 'I confirm this is my signature' → Customer clicks 'Accept' → End session",
      },
      {
        title: "GPS Verification",
        description: "Confirm customer is physically present in CMRA office location",
        visual: "/gps-location-verification-interface-with-map.png",
        detail: "GPS confirms: Pacific Business Center, 456 Business Plaza, San Francisco, CA",
      },
      {
        title: "CMRA Counter-Signs",
        description: "CMRA staff counter-signs the printed form to complete execution",
        visual: "/cmra-staff-member-reviewing-dual-camera-footage.png",
        detail: "Jessica Martinez (CMRA Manager) counter-signs executed Form 1583",
      },
      {
        title: "Customer Photographs Document",
        description: "Customer takes photo of fully executed document for their records",
        visual: "/smartphone-taking-photo-of-signed-document-for-dig.png",
        detail: "Digital backup stored in customer account + CMRA dashboard",
      },
      {
        title: "Blockchain Storage & Physical Copy",
        description: "Document anchored to XRP blockchain (private), customer keeps original",
        visual: "/blockchain-interface-showing-smart-contract-exec.png",
        detail: "🔒 Private: All recordings/signatures in user's XRP wallet | 📅 Public: Only date/time",
      },
    ]

    return (
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-2xl">V1: Wet Ink Foundation</CardTitle>
          <CardDescription>
            In-person kiosk only - customer controls digital process with minimal CMRA interaction
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {steps.map((stepItem, index) => {
              const isActive = index === step
              const isComplete = index < step

              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg scale-105"
                      : isComplete
                        ? "bg-slate-50 border border-slate-200"
                        : "bg-white border border-slate-100"
                  }`}
                >
                  <div className="flex items-start space-x-6">
                    <div
                      className={`p-3 rounded-full flex-shrink-0 ${
                        isComplete
                          ? "bg-blue-500 text-white"
                          : isActive
                            ? "bg-blue-100 text-blue-600 animate-pulse"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isComplete ? <CheckCircle className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{stepItem.title}</h3>
                      <p className="text-slate-600 mb-4">{stepItem.description}</p>
                      {isActive && (
                        <>
                          <div className="mb-4 rounded-lg overflow-hidden border border-slate-200">
                            <img
                              src={stepItem.visual || "/placeholder.svg"}
                              alt={stepItem.title}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <p className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3 font-mono">{stepItem.detail}</p>
                        </>
                      )}
                    </div>
                    {isActive && (
                      <Button
                        onClick={() => (step < steps.length - 1 ? setStep(step + 1) : onComplete())}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {step === steps.length - 1 ? "Complete V1" : "Next Step"}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  const V2HybridFlow = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(0)

    const steps = [
      {
        title: "Schedule CMRA Witness",
        description: "Book appointment with certified CMRA staff for witness session",
        visual: "/calendar-interface-showing-available-appointment.png",
        detail: "Scheduling with Jessica Martinez - Available: Today 2:00 PM PST",
      },
      {
        title: "Split Screen Setup",
        description: "Join video call with CMRA witness for digital signing",
        visual: "/split-screen-video-call-interface-with-customer.png",
        detail: "Connected: Sarah Johnson (Customer) | Jessica Martinez (CMRA Witness)",
      },
      {
        title: "Digital Signature",
        description: "Sign Form 1583 digitally while witness observes via video",
        visual: "/person-at-home-with-laptop-video-call-signing-docu.png",
        detail: "Digital signature captured and verified by CMRA witness",
      },
      {
        title: "Paper-less Completion",
        description: "Receive digitally executed Form 1583 via secure email",
        visual: "/email-interface-showing-delivered-executed-form-1.png",
        detail: "Form 1583 digitally executed and delivered to sarah.johnson@email.com",
      },
    ]

    return (
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardTitle className="text-2xl">V2: Paper-less Digital</CardTitle>
          <CardDescription>Split screen with scheduled CMRA witness - completely paper-less process</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {steps.map((stepItem, index) => {
              const isActive = index === step
              const isComplete = index < step

              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 shadow-lg scale-105"
                      : isComplete
                        ? "bg-slate-50 border border-slate-200"
                        : "bg-white border border-slate-100"
                  }`}
                >
                  <div className="flex items-start space-x-6">
                    <div
                      className={`p-3 rounded-full flex-shrink-0 ${
                        isComplete
                          ? "bg-purple-500 text-white"
                          : isActive
                            ? "bg-purple-100 text-purple-600 animate-pulse"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isComplete ? <CheckCircle className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{stepItem.title}</h3>
                      <p className="text-slate-600 mb-4">{stepItem.description}</p>
                      {isActive && (
                        <>
                          <div className="mb-4 rounded-lg overflow-hidden border border-slate-200">
                            <img
                              src={stepItem.visual || "/placeholder.svg"}
                              alt={stepItem.title}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <p className="text-sm text-purple-600 bg-purple-50 rounded-lg p-3 font-mono">
                            {stepItem.detail}
                          </p>
                        </>
                      )}
                    </div>
                    {isActive && (
                      <Button
                        onClick={() => (step < steps.length - 1 ? setStep(step + 1) : onComplete())}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {step === steps.length - 1 ? "Complete V2" : "Next Step"}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  const V3AIWitnessFlow = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(0)

    const steps = [
      {
        title: "AI Witness Activation",
        description: "CMRAi AI witness system initiates compliance verification",
        visual: "/futuristic-ai-interface-with-biometric-scanning-a.png",
        detail: "AI Witness v3.1 activated - Processing Form 1583 compliance verification",
      },
      {
        title: "Biometric Verification",
        description: "Advanced biometric confirmation ensures identity authenticity",
        visual: "/biometric-scanning-interface-with-facial-recogni.png",
        detail: "Biometric match: 99.7% confidence | Identity verified: Sarah Johnson",
      },
      {
        title: "Smart Contract Execution",
        description: "Blockchain smart contract automatically executes Form 1583",
        visual: "/blockchain-interface-showing-smart-contract-exec.png",
        detail: "Smart Contract #0x7f8a9b executed | Blockchain hash: 0x4d2e1f...",
      },
      {
        title: "Environmental Impact",
        description: "Unsubscribe from unwanted mail, saving time, money, and the earth",
        visual: "/environmental-dashboard-showing-mail-reduction-s.png",
        detail: "Estimated savings: 847 pieces of unwanted mail/year | 12.3 lbs paper saved",
      },
    ]

    return (
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
          <CardTitle className="text-2xl">V3: Paper-free AI Witness</CardTitle>
          <CardDescription>Revolutionary paper-free process that saves time, money, and the earth</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {steps.map((stepItem, index) => {
              const isActive = index === step
              const isComplete = index < step

              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 shadow-lg scale-105"
                      : isComplete
                        ? "bg-slate-50 border border-slate-200"
                        : "bg-white border border-slate-100"
                  }`}
                >
                  <div className="flex items-start space-x-6">
                    <div
                      className={`p-3 rounded-full flex-shrink-0 ${
                        isComplete
                          ? "bg-emerald-500 text-white"
                          : isActive
                            ? "bg-emerald-100 text-emerald-600 animate-pulse"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isComplete ? <CheckCircle className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{stepItem.title}</h3>
                      <p className="text-slate-600 mb-4">{stepItem.description}</p>
                      {isActive && (
                        <>
                          <div className="mb-4 rounded-lg overflow-hidden border border-slate-200">
                            <img
                              src={stepItem.visual || "/placeholder.svg"}
                              alt={stepItem.title}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <p className="text-sm text-emerald-600 bg-emerald-50 rounded-lg p-3 font-mono">
                            {stepItem.detail}
                          </p>
                        </>
                      )}
                    </div>
                    {isActive && (
                      <Button
                        onClick={() => (step < steps.length - 1 ? setStep(step + 1) : onComplete())}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {step === steps.length - 1 ? "Complete V3" : "Next Step"}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  const CMRAgentFlow = ({ onComplete }: { onComplete: () => void }) => {
    const [phase, setPhase] = useState<"onboarding" | "dashboard">("onboarding")
    const [onboardingStep, setOnboardingStep] = useState(0)
    const [platformAccess, setPlatformAccess] = useState(false)

    const onboardingSteps = [
      {
        title: "CMRA Registration",
        description: "Register your CMRA business with MailboxHero platform",
        detail: "Pacific Business Center - CMRA License #CA-2024-1234",
        visual: "/cmra-registration-form-interface-with-business.png",
      },
      {
        title: "Form 1583-A Completion",
        description: "Complete CMRA's own Form 1583-A for mail receipt authorization",
        detail: "CMRA: Pacific Business Center | Owner: Jessica Martinez",
        visual: "/form-1583a-document-being-filled-out-by-cmra-ow.png",
      },
      {
        title: "Experience Customer Flow",
        description: "Complete Form 1583 as a customer to understand the client experience",
        detail: "Testing customer workflow - Jessica Martinez as test customer",
        visual: "/cmra-owner-testing-customer-workflow-on-laptop.png",
      },
      {
        title: "Staff Training Module",
        description: "Complete witness training and certification program",
        detail: "Witness certification: PASSED | Certificate #WC-2024-0892",
        visual: "/online-training-interface-with-certification-ba.png",
      },
      {
        title: "Integration Setup",
        description: "Configure CMRA systems integration with MailboxHero API",
        detail: "API Key generated | Webhook endpoints configured",
        visual: "/api-integration-dashboard-with-webhook-configu.png",
      },
      {
        title: "Compliance Verification",
        description: "Verify CMRA meets all regulatory requirements",
        detail: "DMM 508.1.8 compliance: VERIFIED | Audit ready: YES",
        visual: "/compliance-checklist-interface-with-green-chec.png",
      },
      {
        title: "Print Form 1583-A",
        description: "Print completed Form 1583-A for postal station submission",
        detail: "Form 1583-A printed for Pacific Business Center",
        visual: "/printer-outputting-form-1583a-document.png",
      },
      {
        title: "Postal Station Visit",
        description: "Visit local postal station for station manager signature",
        detail: "San Francisco Main Post Office - Station Manager: Robert Chen",
        visual: "/post-office-interior-with-station-manager-desk.png",
      },
      {
        title: "Platform Access Granted",
        description: "Submit signed Form 1583-A photo to unlock full platform access",
        detail: "⚠️ PLATFORM ACCESS BLOCKED UNTIL COMPLETION",
        critical: true,
        visual: "/smartphone-taking-photo-of-signed-form-1583a-do.png",
      },
    ]

    const handleOnboardingNext = () => {
      if (onboardingStep < onboardingSteps.length - 1) {
        setOnboardingStep(onboardingStep + 1)
      } else {
        setPlatformAccess(true)
        setPhase("dashboard")
      }
    }

    if (phase === "onboarding") {
      return (
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
            <CardTitle className="text-2xl">CMRAi: CMRA Onboarding</CardTitle>
            <CardDescription>Complete CMRA onboarding with Form 1583-A and postal verification</CardDescription>
            {!platformAccess && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ Platform access will not be granted until postal station verification is completed
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {onboardingSteps.map((stepItem, index) => {
                const isActive = index === onboardingStep
                const isComplete = index < onboardingStep

                return (
                  <div
                    key={index}
                    className={`p-6 rounded-xl transition-all duration-500 ${
                      stepItem.critical && isActive
                        ? "bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 shadow-lg scale-105"
                        : isActive
                          ? "bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 shadow-lg scale-105"
                          : isComplete
                            ? "bg-slate-50 border border-slate-200"
                            : "bg-white border border-slate-100"
                    }`}
                  >
                    <div className="flex items-start space-x-6">
                      <div
                        className={`p-3 rounded-full flex-shrink-0 ${
                          isComplete
                            ? "bg-orange-500 text-white"
                            : isActive && stepItem.critical
                              ? "bg-red-100 text-red-600 animate-pulse"
                              : isActive
                                ? "bg-orange-100 text-orange-600 animate-pulse"
                                : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : stepItem.critical ? (
                          <Shield className="h-6 w-6" />
                        ) : (
                          <FileText className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          Step {index + 1}: {stepItem.title}
                        </h3>
                        <p className="text-slate-600 mb-4">{stepItem.description}</p>
                        {isActive && (
                          <p
                            className={`text-sm rounded-lg p-3 font-mono ${
                              stepItem.critical ? "text-red-600 bg-red-50" : "text-orange-600 bg-orange-50"
                            }`}
                          >
                            {stepItem.detail}
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <Button
                          onClick={handleOnboardingNext}
                          className={`${stepItem.critical ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"} text-white`}
                        >
                          {index === onboardingSteps.length - 1 ? "Access Dashboard" : "Complete Step"}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardTitle className="text-2xl">CMRAi: Operations Dashboard</CardTitle>
          <CardDescription>CRD equivalent operations for complete CMRA management</CardDescription>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-green-700 font-medium">
              ✅ Platform access granted - All CMRA operations available
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  ID Expiration Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sarah Johnson</span>
                    <span className="text-red-600">7 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mike Chen</span>
                    <span className="text-yellow-600">23 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lisa Park</span>
                    <span className="text-green-600">89 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-orange-500" />
                  Client Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Active Clients</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quarterly Reviews</span>
                    <span className="text-blue-600">12 due</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Signups</span>
                    <span className="text-green-600">+8 this week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-orange-500" />
                  Forwarding Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Active Forwards</span>
                    <span className="font-semibold">34</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expiring Soon</span>
                    <span className="text-yellow-600">5 clients</span>
                  </div>
                  <div className="flex justify-between">
                    <span>6-Month Auto</span>
                    <span className="text-green-600">Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
                  Audit Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Compliance Score</span>
                    <span className="text-green-600 font-semibold">98.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Audit</span>
                    <span>Dec 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Review</span>
                    <span className="text-blue-600">Mar 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                  Witness Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Today's Sessions</span>
                    <span className="font-semibold">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span>23 scheduled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="text-green-600">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-orange-500" />
                  Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Open Tickets</span>
                    <span className="text-yellow-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response</span>
                    <span className="text-green-600">2.3 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfaction</span>
                    <span className="text-green-600">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={onComplete} className="bg-orange-600 hover:bg-orange-700 text-white px-8">
              Complete CMRAi Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-4">
        <div className="w-full py-12 px-4">
          <div className="text-center mb-16">
            <div className="mb-8">
              <Badge variant="outline" className="mb-4 text-sm px-4 py-2">
                The Full Circle Story
              </Badge>
              <div className="space-y-2 text-sm text-slate-600 mb-6">
                <p>
                  <strong>2008:</strong> Resource Suites - Traditional paper processes
                </p>
                <p>
                  <strong>2025:</strong> MailboxHero - AI witnessed compliance technology
                </p>
              </div>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              MailboxHero v3.1 Interactive Demo
            </h1>
            <p className="text-xl text-slate-700 mb-4 max-w-4xl mx-auto">
              Experience the complete evolution of CMRA compliance technology that could influence USPS DMM 508.1.8
              regulatory updates
            </p>
            <p className="text-lg text-slate-600 mb-8">
              <strong>Mission:</strong> Making businesses efficient, effective, and enjoyable
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={handleStartDemo}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3"
              >
                Start Interactive Demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 bg-transparent"
                onClick={() => window.open("https://mailboxhero.app", "_blank")}
              >
                Visit Live Platform
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8 px-4">
            {versions.slice(0, 3).map((version, index) => (
              <Card
                key={version.id}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${version.gradient}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="font-semibold">
                      {version.badge}
                    </Badge>
                    <div className="text-2xl font-bold text-slate-400">0{index + 1}</div>
                  </div>
                  <CardTitle className="text-xl mb-2">{version.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{version.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {version.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className={`h-2 w-2 rounded-full ${version.color} mr-3 flex-shrink-0`} />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-16 px-4">
            <Card
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer group"
              onClick={() => handleVersionSelect("cmrai")}
            >
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${versions[3].gradient}`} />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="font-semibold">
                    {versions[3].badge}
                  </Badge>
                  <div className="text-2xl font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                    04
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2">{versions[3].name}</CardTitle>
                <CardDescription className="text-lg leading-relaxed">{versions[3].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  {versions[3].features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm">
                      <div className={`h-2 w-2 rounded-full ${versions[3].color} mr-3 flex-shrink-0`} />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button
                    className={`bg-gradient-to-r ${versions[3].gradient} hover:opacity-90 text-white px-8 py-3`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVersionSelect("cmrai")
                    }}
                  >
                    Start CMRA Operations Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-0 mx-4">
            <h3 className="text-2xl font-bold text-center mb-8">Demonstrated Business Impact</h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">3 min</div>
                <div className="text-sm text-slate-600">vs 2-week traditional</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">95%+</div>
                <div className="text-sm text-slate-600">AI accuracy rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">84.2%</div>
                <div className="text-sm text-slate-600">profit margins</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-700 mb-2">18K+</div>
                <div className="text-sm text-slate-600">target operators</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "onboarding") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full py-12 px-4">
          <UniversalOnboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    )
  }

  if (currentStep === "version-select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full py-12 px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Compliance Journey</h2>
            <p className="text-lg text-slate-600 mb-8">
              Experience how MailboxHero transforms CMRA compliance across three evolutionary stages
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800">
                <strong>Demo Customer:</strong> Sarah Johnson | <strong>CMRA:</strong> Pacific Business Center |{" "}
                <strong>Staff:</strong> Jessica Martinez
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {versions.slice(0, 3).map((version, index) => (
              <Card
                key={version.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg group"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${version.gradient}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="font-semibold text-xs">
                      {version.badge}
                    </Badge>
                    <div className="text-xl font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                      0{index + 1}
                    </div>
                  </div>
                  <CardTitle className="text-lg mb-2">{version.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed mb-4">{version.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {version.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-xs">
                        <div className={`h-1.5 w-1.5 rounded-full ${version.color} mr-2 flex-shrink-0`} />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleVersionSelect(version.id)}
                    className={`w-full bg-gradient-to-r ${version.gradient} hover:opacity-90 text-white text-sm`}
                  >
                    Experience {version.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "flow") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full py-12 px-4">
          {selectedVersion === "v1" && <V1WetInkFlow onComplete={handleFlowComplete} />}
          {selectedVersion === "v2" && <V2HybridFlow onComplete={handleFlowComplete} />}
          {selectedVersion === "v3" && <V3AIWitnessFlow onComplete={handleFlowComplete} />}
          {selectedVersion === "cmrai" && <CMRAgentFlow onComplete={handleFlowComplete} />}
        </div>
      </div>
    )
  }

  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full py-12 px-4 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-xl max-w-4xl mx-auto">
            <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-8" />
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Demo Complete!</h2>
            <p className="text-lg text-slate-600 mb-8">
              You've experienced MailboxHero's <strong>{selectedVersion?.toUpperCase()}</strong> compliance workflow -
              part of the revolutionary technology that could influence USPS regulatory updates.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-slate-800 mb-2">Ready for the USPS Pilot Program</h3>
              <p className="text-sm text-slate-600">
                This technology represents patent-pending innovation designed to work with USPS to modernize CMRA
                compliance nationwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={resetDemo} variant="outline" size="lg" className="px-8 bg-transparent">
                Try Another Version
              </Button>
              <Button
                onClick={() => window.open("https://mailboxhero.app", "_blank")}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8"
              >
                Visit MailboxHero Platform
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
