"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Camera,
  Shield,
  CheckCircle,
  MapPin,
  Smartphone,
  FileText,
  Video,
  Ligature as Signature,
  Brain,
  ArrowLeft,
} from "lucide-react"

type DemoVersion = "v1" | "v2" | "v3" | "cmrai" | null
type DemoStep = "intro" | "onboarding" | "version-select" | "flow" | "complete"
type OnboardingStep = "id-capture" | "address-verify" | "form-prefill" | "biometric-confirm"
type FlowStep = number

interface CustomerData {
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  idNumber: string
}

export default function MailboxHeroDemoV31() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("intro")
  const [selectedVersion, setSelectedVersion] = useState<DemoVersion>(null)
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("id-capture")
  const [flowStep, setFlowStep] = useState<FlowStep>(0)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "Sarah Johnson",
    address: "1234 Main Street",
    city: "Honolulu",
    state: "HI",
    zip: "96813",
    phone: "(808) 555-0123",
    email: "sarah.johnson@email.com",
    idNumber: "H12345678",
  })
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

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
      description: "In-person witnessing with QR code activation, split-screen recording, and blockchain audit trail",
      features: [
        "QR code scan to activate witnessing module",
        "Split-screen: live video + signature pad",
        "Verbal acknowledgment + digital signature",
        "CMRA counter-signature with GPS verification",
        "PDF generation + IPFS/blockchain audit trail",
      ],
      badge: "In Office",
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600",
      theme: "blue",
    },
    {
      id: "v2" as const,
      name: "V2: Hybrid Digital",
      description: "Remote witnessing with flexible scheduling, video call activation, and secure evidence storage",
      features: [
        "Calendar/Calendly scheduling integration",
        "Video call with automatic witnessing module",
        "Verbal acknowledgment + digital signature",
        "IPFS evidence storage with audit logging",
        "Executed PDF delivered to both dashboards",
      ],
      badge: "Remote + Scheduling",
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600",
      theme: "purple",
    },
    {
      id: "v3" as const,
      name: "V3: AI Witness (Patent-Pending)",
      description: "Choose between semi-autonomous virtual agent or fully autonomous AI witnessing",
      features: [
        "V3a: Live virtual receptionist witnessing",
        "V3b: 95%+ facial recognition & liveness detection",
        "Split-screen video interface",
        "Blockchain audit trail & CMID tokens",
      ],
      badge: "Patent-Pending",
      color: "bg-emerald-500",
      gradient: "from-emerald-500 to-emerald-600",
      theme: "emerald",
    },
    {
      id: "cmrai" as const,
      name: "CMRAi: CMRA Operations",
      description: "Complete CMRA management platform with Form 1583-A onboarding",
      features: [
        "CMRA Form 1583-A onboarding",
        "Postal station verification",
        "Client management dashboard",
        "Compliance audit tools",
      ],
      badge: "CMRA Platform",
      color: "bg-slate-500",
      gradient: "from-slate-500 to-slate-600",
      theme: "slate",
    },
  ]

  const IntroSection = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-4">
        <div className="w-full py-12 px-4">
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
                <div className="text-sm font-medium text-slate-600">
                  <strong>2008:</strong> Resource Suites - Traditional paper processes
                </div>
                <div className="h-4 w-px bg-slate-300" />
                <div className="text-sm font-medium text-slate-600">
                  <strong>2025:</strong> MailboxHero v3.1 - AI witnessed compliance technology
                </div>
              </div>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              Experience the Evolution of CMRA Compliance
            </h1>
            <p className="text-xl text-slate-700 mb-4 max-w-4xl mx-auto">
              From signatures autographed by excellence to AI witnessed signature capture
            </p>
            <p className="text-lg text-slate-600 mb-8">
              Patent-pending technology designed for USPS DMM 508.1.8 regulatory innovation
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8 px-4">
            {versions.slice(0, 3).map((version, index) => (
              <Card
                key={version.id}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 cursor-pointer"
                onClick={() => handleVersionSelect(version.id)} // Added click handler to launch experience directly
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
                  <ul className="space-y-3 mb-4">
                    {version.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className={`h-2 w-2 rounded-full ${version.color} mr-3 flex-shrink-0`} />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full bg-gradient-to-r ${version.gradient} hover:opacity-90 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVersionSelect(version.id)
                    }}
                  >
                    Launch {version.id.toUpperCase()} {version.id === "v3" ? "Experiences" : "Experience"}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="px-4 mb-8">
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-500 to-slate-600" />
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <Badge variant="secondary" className="font-semibold">
                      CMRA Platform
                    </Badge>
                    <Badge className="bg-red-100 text-red-800 border-red-300">Verification Required</Badge>
                    <div className="text-2xl font-bold text-slate-400">04</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">CMRAi: CMRA Operations</h3>
                  <p className="text-base text-slate-600 mb-4">
                    Complete CMRA management platform with Form 1583-A onboarding
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {versions[3].features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="h-2 w-2 rounded-full bg-slate-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-2 border-emerald-200 rounded-lg p-4 bg-emerald-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-semibold text-emerald-900">Already Filed Form 1583-A</h4>
                    </div>
                    <p className="text-sm text-emerald-700 mb-4">
                      Complete your personal Form 1583 via autonomous AI witness session. Same process your customers
                      use to receive mail on their own behalf.
                    </p>
                    <a href="/cmragent/witness/v3b">
                      <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200">
                        Start AI Witness Session
                      </button>
                    </a>
                  </div>

                  <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Need Form 1583-A</h4>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      Complete form generation and postal station verification process
                    </p>
                    <a href="/cmragent/register">
                      <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200">
                        Start Registration
                      </button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const UniversalOnboarding = () => {
    const onboardingSteps = [
      {
        id: "id-capture",
        title: "Photo ID Capture",
        description: "AI OCR extraction with ChatGPT integration",
        icon: Camera,
        visual: "/smartphone-camera-scanning-drivers-license-with-ai.png",
      },
      {
        id: "address-verify",
        title: "Address Verification",
        description: "Auto-populate from ID data",
        icon: MapPin,
        visual: "/usps-address-verification-interface-with-green-che.png",
      },
      {
        id: "form-prefill",
        title: "Form 1583 Preview",
        description: "Pre-filled form with customer data",
        icon: FileText,
        visual: "/usps-form-1583-document-with-auto-filled-fields-hi.png",
      },
      {
        id: "biometric-confirm",
        title: "Biometric Confirmation",
        description: "Face verification before version selection",
        icon: Shield,
        visual: "/biometric-scanning-interface-with-facial-recogni.png",
      },
    ]

    const currentStepIndex = onboardingSteps.findIndex((step) => step.id === onboardingStep)
    const currentStepData = onboardingSteps[currentStepIndex]

    const handleNextStep = async () => {
      setIsProcessing(true)
      setProgress(0)

      // Simulate processing with progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsProcessing(false)

            if (currentStepIndex < onboardingSteps.length - 1) {
              setOnboardingStep(onboardingSteps[currentStepIndex + 1].id as OnboardingStep)
            } else {
              handleOnboardingComplete()
            }
            return 100
          }
          return prev + 10
        })
      }, 200)
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Universal Onboarding</h2>
            <p className="text-lg text-slate-600">Secure identity verification for all compliance versions</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {onboardingSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= currentStepIndex ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {index < currentStepIndex ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  {index < onboardingSteps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${index < currentStepIndex ? "bg-emerald-500" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <currentStepData.icon className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
              <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <img
                  src={currentStepData.visual || "/placeholder.svg"}
                  alt={currentStepData.title}
                  className="w-full max-w-md rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(currentStepData.description)}`
                  }}
                />
              </div>

              {onboardingStep === "id-capture" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">AI OCR Results</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Name:</strong> {customerData.name}
                      </div>
                      <div>
                        <strong>ID Number:</strong> {customerData.idNumber}
                      </div>
                      <div>
                        <strong>Address:</strong> {customerData.address}
                      </div>
                      <div>
                        <strong>City, State:</strong> {customerData.city}, {customerData.state}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {onboardingStep === "address-verify" && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">USPS Address Verification</h4>
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span>Address verified and standardized</span>
                    </div>
                  </div>
                </div>
              )}

              {onboardingStep === "form-prefill" && (
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Form 1583 Preview</h4>
                    <div className="text-sm text-purple-700">
                      All customer information has been automatically populated from verified ID data.
                    </div>
                  </div>
                </div>
              )}

              {onboardingStep === "biometric-confirm" && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Biometric Verification</h4>
                    <div className="flex items-center space-x-2 text-emerald-700">
                      <Shield className="w-5 h-5" />
                      <span>Face verification: 98.7% confidence match</span>
                    </div>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-center text-slate-600">Processing {currentStepData.title.toLowerCase()}...</p>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  onClick={handleNextStep}
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
                >
                  {isProcessing
                    ? "Processing..."
                    : currentStepIndex === onboardingSteps.length - 1
                      ? "Complete Onboarding"
                      : "Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const CMRADashboard = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-7xl mx-auto py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">CMRAi Operations Dashboard</h2>
            <p className="text-slate-600">Complete CMRA management and compliance platform</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 mb-2">247</div>
                <div className="text-sm text-slate-600">+12 this month</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">98.4%</div>
                <div className="text-sm text-slate-600">Above industry standard</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Revenue (Monthly)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">$50.5K</div>
                <div className="text-sm text-slate-600">84.2% margin</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>ID Expiration Alerts</CardTitle>
                <CardDescription>Clients requiring ID renewal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <div className="font-medium text-red-900">Sarah Johnson</div>
                      <div className="text-sm text-red-700">Expires in 5 days</div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <div className="font-medium text-yellow-900">Mike Chen</div>
                      <div className="text-sm text-yellow-700">Expires in 15 days</div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <div className="font-medium text-blue-900">Lisa Rodriguez</div>
                      <div className="text-sm text-blue-700">Expires in 28 days</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Notice</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Witness Scheduling</CardTitle>
                <CardDescription>Upcoming compliance appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div>
                      <div className="font-medium text-emerald-900">V2 Hybrid Session</div>
                      <div className="text-sm text-emerald-700">Today 2:30 PM - Alex Thompson</div>
                    </div>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      Join
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div>
                      <div className="font-medium text-purple-900">V1 In-Office Session</div>
                      <div className="text-sm text-purple-700">Tomorrow 10:00 AM - Maria Garcia</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Prepare
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <div className="font-medium text-blue-900">V3 AI Witness</div>
                      <div className="text-sm text-blue-700">Friday 3:15 PM - David Kim</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Monitor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>Add/drop with quarterly reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Q4 2024 Review Due</span>
                    <Badge className="bg-orange-100 text-orange-800">23 clients</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Forwarding Services Ending</span>
                    <Badge className="bg-blue-100 text-blue-800">8 clients</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">New Client Onboarding</span>
                    <Badge className="bg-green-100 text-green-800">5 pending</Badge>
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    Manage Client Records
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Audit Records</CardTitle>
                <CardDescription>Compliance documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Form 1583 Records</span>
                    <span className="text-slate-900 font-medium">247 active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Blockchain Audit Trail</span>
                    <span className="text-emerald-600 font-medium">100% verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">USPS Compliance</span>
                    <span className="text-green-600 font-medium">Current</span>
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    Generate Audit Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={resetDemo} size="lg" className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3">
              Return to Demo Selection
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const CMRAgentFlow = () => {
    const cmrAgentSteps = [
      {
        title: "CMRA Registration",
        description: "Business information and compliance setup",
        icon: FileText,
        visual: "/cmra-registration-form-interface-with-business.png",
      },
      {
        title: "Form 1583-A Completion",
        description: "CMRA owner completes their own Form 1583-A",
        icon: Signature,
        visual: "/form-1583a-document-being-filled-out-by-cmra-ow.png",
      },
      {
        title: "Experience Customer Workflow",
        description: "CMRA owner tests the customer compliance process",
        icon: Smartphone,
        visual: "/cmra-owner-testing-customer-workflow-on-laptop.png",
      },
      {
        title: "Postal Station Verification",
        description: "Print Form 1583-A for station manager signature",
        icon: MapPin,
        visual: "/post-office-interior-with-station-manager-desk.png",
      },
      {
        title: "Platform Access Granted",
        description: "Full CMRAi dashboard and operations access",
        icon: Shield,
        visual: "/compliance-verification-dashboard-with-green.png",
      },
    ]

    const currentStepData = cmrAgentSteps[flowStep]

    if (flowStep >= 5) {
      return <CMRADashboard />
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">CMRAi: CMRA Operations Platform</h2>
            <p className="text-lg text-slate-700">Complete management platform for CMRA operators</p>
            <Badge className="bg-red-100 text-red-800 border-red-300 mt-2">Platform Access Pending Verification</Badge>
          </div>

          <Card className="shadow-xl border-0 border-t-4 border-t-slate-500">
            <CardHeader className="text-center pb-6 bg-slate-50">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <currentStepData.icon className="w-8 h-8 text-slate-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-slate-900">{currentStepData.title}</CardTitle>
              <CardDescription className="text-lg text-slate-700">{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="flex justify-center">
                <img
                  src={currentStepData.visual || "/placeholder.svg"}
                  alt={currentStepData.title}
                  className="w-full max-w-md rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(currentStepData.description)}`
                  }}
                />
              </div>

              {flowStep === 0 && (
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">CMRA Business Setup</h4>
                  <div className="space-y-2 text-slate-800">
                    <div>• Business name: Resource Suites Hawaii</div>
                    <div>• CMRA License: HI-CMRA-2024-001</div>
                    <div>• Location: 1234 Ala Moana Blvd, Honolulu, HI</div>
                    <div>• Owner: Daniel Kaneshiro</div>
                  </div>
                </div>
              )}

              {flowStep === 1 && (
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">Form 1583-A Completion</h4>
                  <div className="space-y-2 text-slate-800">
                    <div>• CMRA owner completes own Form 1583-A</div>
                    <div>• Required for platform access</div>
                    <div>• Demonstrates compliance understanding</div>
                    <div>• Sets example for customer process</div>
                  </div>
                </div>
              )}

              {flowStep === 2 && (
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">Customer Workflow Testing</h4>
                  <div className="space-y-2 text-slate-800">
                    <div>• Experience the customer onboarding process</div>
                    <div>• Test V1, V2, or V3 compliance workflows</div>
                    <div>• Understand customer pain points</div>
                    <div>• Validate system functionality</div>
                  </div>
                </div>
              )}

              {flowStep === 3 && (
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-3">⚠️ Critical: Postal Station Verification Required</h4>
                  <div className="space-y-2 text-red-800">
                    <div>• Print Form 1583-A to local postal station</div>
                    <div>• Obtain station manager signature</div>
                    <div>• Take photo in app for record retention</div>
                    <div>• Give station manager hard copy</div>
                    <div className="font-bold mt-3">
                      Platform access will NOT be granted until this step is completed.
                    </div>
                  </div>
                </div>
              )}

              {flowStep === 4 && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">✅ Platform Access Granted</h4>
                  <div className="space-y-2 text-green-800">
                    <div>• Full CMRAi dashboard access</div>
                    <div>• Client management tools</div>
                    <div>• Compliance audit features</div>
                    <div>• Witness scheduling calendar</div>
                    <div>• ID expiration reminders</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                {flowStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setFlowStep(flowStep - 1)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={() => (flowStep < cmrAgentSteps.length - 1 ? setFlowStep(flowStep + 1) : setFlowStep(5))}
                  className={`px-8 ${flowStep === 3 ? "bg-red-600 hover:bg-red-700" : "bg-slate-600 hover:bg-slate-700"} text-white`}
                  disabled={flowStep === 3}
                >
                  {flowStep === 3
                    ? "Verification Required"
                    : flowStep < cmrAgentSteps.length - 1
                      ? "Continue"
                      : "Access Dashboard"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const VersionSelection = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-7xl mx-auto py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Compliance Version</h2>
            <p className="text-lg text-slate-600">
              Each version targets specific CMRA segments with distinct value propositions
            </p>
          </div>

          {/* V1, V2, V3 in top row */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {versions.slice(0, 3).map((version) => (
              <motion.div key={version.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg cursor-pointer h-full"
                  onClick={() => handleVersionSelect(version.id)}
                >
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${version.gradient}`} />
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="font-semibold">
                        {version.badge}
                      </Badge>
                      {version.id === "v3" && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Patent-Pending</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{version.name}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{version.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {version.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className={`h-2 w-2 rounded-full ${version.color} mr-3 flex-shrink-0`} />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full bg-gradient-to-r ${version.gradient} hover:opacity-90 text-white`}
                      onClick={() => handleVersionSelect(version.id)}
                    >
                      {version.id === "v3" ? "Explore Experiences" : `Experience ${version.id.toUpperCase()}`}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CMRAgent full width below */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg cursor-pointer"
              onClick={() => (window.location.href = "/cmragent/register")} // Link to actual registration instead of demo flow
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-500 to-slate-600" />
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge variant="secondary" className="font-semibold">
                        CMRA Platform
                      </Badge>
                      <Badge className="bg-red-100 text-red-800 border-red-300">Verification Required</Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">CMRAi: CMRA Operations Platform</h3>
                    <p className="text-slate-600 mb-4">Complete CMRA management platform with Form 1583-A onboarding</p>
                    <div className="grid md:grid-cols-4 gap-4">
                      {versions[3].features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="h-2 w-2 rounded-full bg-slate-500 mr-3 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="ml-8">
                    <a href="/cmragent/register">
                      <Button
                        className="bg-gradient-to-r from-slate-500 to-slate-600 hover:opacity-90 text-white px-8 py-3"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        Access CMRAi
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  const V1WetInkFlow = () => {
    const v1Steps = [
      {
        title: "Scan QR Code at CMRA Office",
        description:
          "Customer arrives at CMRA office and scans QR code displayed in office to open witnessing module on their device",
        icon: Smartphone,
        visual: "/smartphone-camera-scanning-qr-code-at-cmra-office.jpg",
      },
      {
        title: "Split-Screen Recording Starts",
        description: "Top: Live face video | Bottom: Digital signature pad",
        icon: Camera,
        visual: "/split-screen-interface-with-face-video-above-and-sign.jpg",
      },
      {
        title: "Customer Verbal Acknowledgment",
        description: '"I acknowledge this is my signature" + digital signature capture',
        icon: Signature,
        visual: "/person-speaking-acknowledgment-while-signing-digital.jpg",
      },
      {
        title: "CMRA Agent Counter-Signs",
        description: "CMRA agent gives acknowledgment and signs on their own pad",
        icon: Shield,
        visual: "/cmra-agent-counter-signing-on-tablet-device.jpg",
      },
      {
        title: "PDF Generated & Mailbox Enabled",
        description: "Both signatures submitted, PDF generated, all parties notified",
        icon: FileText,
        visual: "/completed-form-1583-pdf-with-digital-signatures.jpg",
      },
      {
        title: "Audit Trail & Storage",
        description: "All materials stored in IPFS, blockchain audit trail created",
        icon: CheckCircle,
        visual: "/blockchain-audit-trail-visualization-with-checkm.jpg",
      },
    ]

    const currentStepData = v1Steps[flowStep]

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => (window.location.href = "/demo-v31")}
              className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Demo
            </Button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">V1: Wet Ink Foundation</h2>
            <p className="text-lg text-blue-700">In-office witnessing with QR code activation</p>
          </div>

          <Card className="shadow-xl border-0 border-t-4 border-t-blue-500">
            <CardHeader className="text-center pb-6 bg-blue-50">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <currentStepData.icon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-blue-900">{currentStepData.title}</CardTitle>
              <CardDescription className="text-lg text-blue-700">{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="flex justify-center items-center">
                <img
                  src={currentStepData.visual || "/placeholder.svg"}
                  alt={currentStepData.title}
                  className="w-full max-w-lg h-auto rounded-lg shadow-lg object-contain"
                  onError={(e) => {
                    e.currentTarget.src = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(currentStepData.description)}`
                  }}
                />
              </div>

              {flowStep === 0 && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">📱 QR Code Activation</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>• Customer arrives at CMRA office</div>
                    <div>• Scans QR code displayed in office</div>
                    <div>• Opens witnessing module on their own device</div>
                    <div>• Minimal CMRA staff interaction required</div>
                  </div>
                </div>
              )}

              {flowStep === 1 && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">🎥 Split-Screen Interface</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>
                      • <strong>Top screen:</strong> Live face video recording
                    </div>
                    <div>
                      • <strong>Bottom screen:</strong> Digital signature pad
                    </div>
                    <div>• Front camera captures customer face</div>
                    <div>• Recording starts automatically</div>
                  </div>
                </div>
              )}

              {flowStep === 2 && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">✍️ Verbal Acknowledgment & Signature</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>• Customer states: "I acknowledge this is my signature"</div>
                    <div>• Signs on digital signature pad</div>
                    <div>• Video captures both verbal and written confirmation</div>
                    <div>• Signature confidence scoring in real-time</div>
                  </div>
                </div>
              )}

              {flowStep === 3 && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">🛡️ CMRA Counter-Signature</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>• CMRA agent reviews customer signature</div>
                    <div>• Agent gives verbal acknowledgment</div>
                    <div>• Agent signs on their own signature pad</div>
                    <div>• GPS verification confirms physical location</div>
                  </div>
                </div>
              )}

              {flowStep === 4 && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">📄 PDF Generation & Notifications</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>• Both signatures submitted to system</div>
                    <div>• Fully executed Form 1583 PDF generated</div>
                    <div>• Email notifications sent to all parties</div>
                    <div>• Mailbox access immediately enabled</div>
                  </div>
                </div>
              )}

              {flowStep === 5 && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">🔒 Secure Storage & Audit Trail</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>• Video recording stored in IPFS</div>
                    <div>• Blockchain audit trail created (XRPL)</div>
                    <div>• 🔒 Private: All recordings, signatures (user's XRP wallet only)</div>
                    <div>• 📅 Public: Only date/time of witness event</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4 pt-4">
                {flowStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setFlowStep(flowStep - 1)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={() => (flowStep < v1Steps.length - 1 ? setFlowStep(flowStep + 1) : handleFlowComplete())}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  {flowStep < v1Steps.length - 1 ? "Continue" : "Complete V1 Demo"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const V2HybridFlow = () => {
    const v2Steps = [
      {
        title: "Schedule Remote Session",
        description: "Book appointment via Google Calendar/Calendly integration",
        icon: Calendar,
        visual: "/calendar-interface-showing-available-appointment.jpg", // Updated to .jpg
      },
      {
        title: "Join Video Call & Activate Module",
        description: "Customer joins video call, witnessing module activates automatically",
        icon: Video,
        visual: "/split-screen-video-call-interface-with-customer.jpg", // Updated to .jpg
      },
      {
        title: "Verbal Acknowledgment & Signature",
        description: "Customer acknowledges on camera and signs digitally",
        icon: Signature,
        visual: "/person-above-digital-signature-pad-interface.jpg", // Updated to .jpg
      },
      {
        title: "CMRA Witness Confirmation",
        description: "CMRA agent (audio/video) confirms and counter-signs",
        icon: Shield,
        visual: "/cmra-agent-witnessing-remotely-on-video-call.jpg", // Updated to .jpg
      },
      {
        title: "Evidence Storage & Dashboard Delivery",
        description: "Video stored in IPFS, executed PDF delivered to both dashboards",
        icon: FileText,
        visual: "/dashboard-showing-completed-form-1583-with-video.jpg", // Updated to .jpg
      },
    ]

    const currentStepData = v2Steps[flowStep]

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => (window.location.href = "/demo-v31")}
              className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Demo
            </Button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">V2: Hybrid Digital</h2>
            <p className="text-lg text-purple-700">Remote witnessing with seamless scheduling</p>
          </div>

          <Card className="shadow-xl border-0 border-t-4 border-t-purple-500">
            <CardHeader className="text-center pb-6 bg-purple-50">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <currentStepData.icon className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-purple-900">{currentStepData.title}</CardTitle>
              <CardDescription className="text-lg text-purple-700">{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="flex justify-center items-center">
                <img
                  src={currentStepData.visual || "/placeholder.svg"}
                  alt={currentStepData.title}
                  className="w-full max-w-lg h-auto rounded-lg shadow-lg object-contain"
                  onError={(e) => {
                    e.currentTarget.src = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(currentStepData.description)}`
                  }}
                />
              </div>

              {flowStep === 0 && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">📅 Seamless Scheduling</h4>
                  <div className="space-y-2 text-purple-800">
                    <div>
                      • <strong>Integration:</strong> Google Calendar or Calendly
                    </div>
                    <div>
                      • <strong>Step 1:</strong> Select available date
                    </div>
                    <div>
                      • <strong>Step 2:</strong> Choose time slot (9 AM - 5 PM)
                    </div>
                    <div>
                      • <strong>Step 3:</strong> Confirm appointment
                    </div>
                    <div>
                      • <strong>Duration:</strong> 2-3 minute session
                    </div>
                    <div className="pt-2 text-sm text-purple-700">Automatic email confirmation and reminders sent</div>
                  </div>
                </div>
              )}

              {flowStep === 1 && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">🎥 Video Call & Module Activation</h4>
                  <div className="space-y-2 text-purple-800">
                    <div>• Customer joins scheduled Google Meet session</div>
                    <div>• Witnessing module activates automatically</div>
                    <div>
                      • <strong>Top screen:</strong> Front camera (face verification)
                    </div>
                    <div>
                      • <strong>Bottom screen:</strong> Digital signature pad
                    </div>
                    <div className="pt-2 text-sm text-purple-700">
                      Split-screen interface ensures compliance verification
                    </div>
                  </div>
                </div>
              )}

              {flowStep === 2 && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">✍️ Customer Acknowledgment</h4>
                  <div className="space-y-2 text-purple-800">
                    <div>• Customer gives verbal acknowledgment on camera</div>
                    <div>• "I acknowledge this is my signature"</div>
                    <div>• Customer signs on digital signature pad</div>
                    <div>• Real-time confidence scoring displayed</div>
                    <div className="pt-2 text-sm text-purple-700">WebRTC recording captures entire session</div>
                  </div>
                </div>
              )}

              {flowStep === 3 && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">🛡️ CMRA Witness Confirmation</h4>
                  <div className="space-y-2 text-purple-800">
                    <div>• CMRA agent reviews customer signature</div>
                    <div>• Agent provides verbal confirmation (audio/video)</div>
                    <div>• Agent counter-signs on their own device</div>
                    <div>• Session evidence captured for audit</div>
                    <div className="pt-2 text-sm text-purple-700">CMRA witness: Jessica Martinez (certified agent)</div>
                  </div>
                </div>
              )}

              {flowStep === 4 && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">📦 Storage & Dashboard Delivery</h4>
                  <div className="space-y-3 text-purple-800">
                    <div>
                      • <strong>Video storage:</strong> IPFS (immutable, off-site)
                    </div>
                    <div>
                      • <strong>Audit log:</strong> Blockchain trail created
                    </div>
                    <div>
                      • <strong>PDF delivery:</strong> Both customer & CMRA dashboards
                    </div>
                    <div>
                      • <strong>Status check:</strong> Compliance warnings if issues remain
                    </div>
                    <div className="pt-2 space-y-1 text-sm">
                      <div>• 🔒 Private: All recordings, signatures (user's XRP wallet only)</div>
                      <div>• 📅 Public: Only date/time of witness event</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4 pt-4">
                {flowStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setFlowStep(flowStep - 1)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={() => (flowStep < v2Steps.length - 1 ? setFlowStep(flowStep + 1) : handleFlowComplete())}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  {flowStep < v2Steps.length - 1 ? "Continue" : "Complete V2 Demo"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const V3AIWitnessFlow = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center mb-8">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-4">
              V3: AI Witness (Patent-Pending)
            </Badge>
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">Choose Your AI Witnessing Experience</h2>
            <p className="text-lg text-emerald-700">Select between semi-autonomous or fully autonomous AI witness</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* V3a Card */}
            <Card
              className="shadow-xl border-0 hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
              onClick={() => (window.location.href = "/cmragent/witness/v3a")}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-purple-600" />
              <CardHeader className="text-center pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Video className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">V3a: Semi-Autonomous</CardTitle>
                <CardDescription>Live virtual agent witnessing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span>Live virtual receptionist</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span>Real-time video witnessing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span>Human agent verification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span>Split-screen interface</span>
                  </div>
                </div>
                <Badge className="w-full justify-center bg-green-100 text-green-800 border-green-300">
                  USPS Compliant
                </Badge>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90 text-white">
                  Launch V3a Experience
                </Button>
              </CardContent>
            </Card>

            {/* V3b Card */}
            <Card
              className="shadow-xl border-0 hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
              onClick={() => (window.location.href = "/cmragent/witness/v3b")}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-emerald-600" />
              <CardHeader className="text-center pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">V3b: Fully Autonomous</CardTitle>
                <CardDescription>Complete AI-powered witnessing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>95%+ facial recognition</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Liveness detection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>GPS location verification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Blockchain audit trail</span>
                  </div>
                </div>
                <Badge className="w-full justify-center bg-yellow-100 text-yellow-800 border-yellow-300">
                  Pilot Program
                </Badge>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 text-white">
                  Launch V3b Experience
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={resetDemo} variant="outline" size="lg">
              Back to Demo Selection
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const CompletionScreen = () => {
    const selectedVersionData = versions.find((v) => v.id === selectedVersion)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-4">
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Demo Complete!</h2>
            <p className="text-xl text-slate-700 mb-6">
              You've experienced {selectedVersionData?.name} compliance workflow
            </p>
          </div>

          <Card className="shadow-xl border-0 mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Strategic Impact</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">2-3 min</div>
                  <div className="text-sm text-slate-600">Process Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">95%+</div>
                  <div className="text-sm text-slate-600">AI Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">USPS</div>
                  <div className="text-sm text-slate-600">Pilot Ready</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button
              onClick={resetDemo}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 mr-4"
            >
              Try Another Version
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleStartDemo = () => {
    setCurrentStep("onboarding")
  }

  const handleOnboardingComplete = () => {
    if (selectedVersion) {
      setCurrentStep("flow")
      setFlowStep(0)
    } else {
      setCurrentStep("version-select")
    }
  }

  const handleVersionSelect = (version: DemoVersion) => {
    setSelectedVersion(version)
    setCurrentStep("flow")
    setFlowStep(0)
  }

  const handleFlowComplete = () => {
    setCurrentStep("complete")
  }

  const resetDemo = () => {
    setCurrentStep("intro")
    setSelectedVersion(null)
    setOnboardingStep("id-capture")
    setFlowStep(0)
    setProgress(0)
    setIsProcessing(false)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep === "intro" && <IntroSection />}
        {currentStep === "onboarding" && <UniversalOnboarding />}
        {currentStep === "version-select" && <VersionSelection />}
        {currentStep === "flow" && selectedVersion === "v1" && <V1WetInkFlow />}
        {currentStep === "flow" && selectedVersion === "v2" && <V2HybridFlow />}
        {currentStep === "flow" && selectedVersion === "v3" && <V3AIWitnessFlow />}
        {currentStep === "flow" && selectedVersion === "cmrai" && <CMRAgentFlow />}
        {currentStep === "complete" && <CompletionScreen />}
      </motion.div>
    </AnimatePresence>
  )
}
