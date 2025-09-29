"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
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
  Globe,
  Printer,
} from "lucide-react"

type DemoVersion = "v1" | "v2" | "v3" | "cmragent" | null
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
      description: "In-person kiosk only - customer controls digital process with minimal CMRA interaction",
      features: [
        "In-person kiosk mode only",
        "Dual camera interface (face + signature)",
        "Physical wet ink signature pad",
        "GPS verification & CMRA counter-sign",
      ],
      badge: "Kiosk Only",
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600",
      theme: "blue",
    },
    {
      id: "v2" as const,
      name: "V2: Hybrid Digital",
      description: "Progressive CMRAs seeking efficiency with Google Calendar scheduling",
      features: [
        "Google Calendar scheduling",
        "Google Meet video calls",
        "Split-screen video interface",
        "Digital signature with confidence scoring",
      ],
      badge: "Remote + Scheduling",
      color: "bg-purple-500",
      gradient: "from-purple-500 to-purple-600",
      theme: "purple",
    },
    {
      id: "v3" as const,
      name: "V3: AI Witness (Patent-Pending)",
      description: "USPS pilot program ready with complete AI automation",
      features: [
        "95%+ biometric face recognition",
        "GPS location verification",
        "6 patent claims execution",
        "CMID token minting on blockchain",
      ],
      badge: "Patent-Pending",
      color: "bg-emerald-500",
      gradient: "from-emerald-500 to-emerald-600",
      theme: "emerald",
    },
    {
      id: "cmragent" as const,
      name: "CMRAgent: CMRA Operations",
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
                    Launch {version.id.toUpperCase()} Experience
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="px-4 mb-8">
            <Card
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 cursor-pointer"
              onClick={() => (window.location.href = "/cmragent/register")} // Link to actual registration instead of demo flow
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-500 to-slate-600" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <Badge variant="secondary" className="font-semibold">
                        CMRA Platform
                      </Badge>
                      <Badge className="bg-red-100 text-red-800 border-red-300">Verification Required</Badge>
                      <div className="text-2xl font-bold text-slate-400">04</div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">CMRAgent: CMRA Operations</h3>
                    <p className="text-base text-slate-600 mb-4">
                      Complete CMRA management platform with Form 1583-A onboarding
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
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
                      <button
                        className="bg-gradient-to-r from-slate-500 to-slate-600 hover:opacity-90 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        Launch CMRAgent
                      </button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-0 mx-4">
            <h3 className="text-2xl font-bold text-center mb-8">Strategic Business Metrics</h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">$606K</div>
                <div className="text-sm text-slate-600">Bootstrap Revenue Target</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">84.2%</div>
                <div className="text-sm text-slate-600">Profit Margins</div>
              </div>
              <div>
                {/* Updated CMRA locations from 2,300+ to 23,000+ */}
                <div className="text-3xl font-bold text-blue-600 mb-2">23,000+</div>
                <div className="text-sm text-slate-600">CMRA Locations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-700 mb-2">USPS</div>
                <div className="text-sm text-slate-600">Pilot Program Ready</div>
              </div>
            </div>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-2">CMRAgent Operations Dashboard</h2>
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
                      <div className="font-medium text-purple-900">V1 Kiosk Session</div>
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

  const CMRAAgentFlow = () => {
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
        description: "Full CMRAgent dashboard and operations access",
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
            <h2 className="text-4xl font-bold text-slate-900 mb-4">CMRAgent: CMRA Operations Platform</h2>
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
                    <div>• Full CMRAgent dashboard access</div>
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
                      Experience {version.id.toUpperCase()}
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
                    <h3 className="text-2xl font-bold mb-2">CMRAgent: CMRA Operations Platform</h3>
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
                        Access CMRAgent
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
        title: "Walk Into CMRA Office",
        description: "Customer arrives for in-person kiosk experience",
        icon: MapPin,
        visual: "/cmra-office-with-dual-camera-setup-and-person-sign.png",
      },
      {
        title: "Complete Form 1583 Online → Print",
        description: "Digital completion, CMRA prints 1 page for signing",
        icon: Printer,
        visual: "/printer-outputting-usps-form-1583-document.png",
      },
      {
        title: "Dual Camera Witness Recording",
        description: "Front: Face | Rear: Physical pen-on-paper signature",
        icon: Camera,
        visual: "/dual-camera-setup-with-two-angles-recording-person.png",
      },
      {
        title: "GPS + CMRA Counter-Sign",
        description: "Location verification + CMRA staff counter-signature",
        icon: Shield,
        visual: "/gps-location-verification-interface-with-map.png",
      },
      {
        title: "Customer Keeps Original",
        description: "Photo for digital backup, customer retains physical form",
        icon: FileText,
        visual: "/smartphone-taking-photo-of-signed-document-for-dig.png",
      },
    ]

    const currentStepData = v1Steps[flowStep]

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">V1: Wet Ink Foundation</h2>
            <p className="text-lg text-blue-700">In-person kiosk only - customer controls process</p>
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
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">In-Person Experience</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>• Customer walks into CMRA office</div>
                    <div>• Minimal CMRA staff interaction required</div>
                    <div>• Customer controls the digital process</div>
                  </div>
                </div>
              )}

              {flowStep === 1 && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Digital-to-Physical Process</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>• Complete Form 1583 online at kiosk</div>
                    <div>• CMRA prints single page for wet ink signature</div>
                    <div>• Seamless digital-to-physical workflow</div>
                  </div>
                </div>
              )}

              {flowStep === 2 && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Dual Camera Witness</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>• Front camera: Customer face verification</div>
                    <div>• Rear camera: Physical pen-on-paper signature capture</div>
                    <div>• ✅ "I confirm this is my signature" → Accept → End</div>
                  </div>
                </div>
              )}

              {flowStep === 3 && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Verification & Counter-Sign</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>• GPS confirms physical presence in CMRA office</div>
                    <div>• CMRA staff counter-signs printed form</div>
                    <div>• Fully executed document ready</div>
                  </div>
                </div>
              )}

              {flowStep === 4 && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Privacy & Storage</h4>
                  <div className="space-y-2 text-blue-800">
                    <div>• 🔒 Private: All recordings, signatures (user's XRP wallet only)</div>
                    <div>• 📅 Public: Only date/time of witness event</div>
                    <div>• Customer keeps original physical form</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
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
        title: "Google Calendar Scheduling",
        description: "3-step booking: date/time/confirm",
        icon: Calendar,
        visual: "/calendar-interface-showing-available-appointment.png",
      },
      {
        title: "Google Meet Video Call",
        description: "Scheduled video session with CMRA witness",
        icon: Video,
        visual: "/split-screen-video-call-interface-with-customer.png",
      },
      {
        title: "Split-Screen Interface",
        description: "Customer face top, signature pad bottom",
        icon: Smartphone,
        visual: "/person-above-digital-signature-pad-interface.png", // Updated visual to show person above signature pad
      },
      {
        title: "Digital Signature Confidence",
        description: "Real-time confidence scoring and WebRTC recording",
        icon: Signature,
        visual: "/digital-signature-pad-with-confidence-scoring.png",
      },
    ]

    const currentStepData = v2Steps[flowStep]

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">V2: Hybrid Digital</h2>
            <p className="text-lg text-purple-700">Progressive CMRAs seeking efficiency</p>
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
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-3">Scheduling System</h4>
                  <div className="space-y-2 text-purple-800">
                    <div>• Google Calendar integration</div>
                    <div>• Available time slots: 9 AM - 5 PM</div>
                    <div>• CMRA witness: Jessica Martinez</div>
                    <div>• Session duration: 2-3 minutes</div>
                  </div>
                </div>
              )}

              {flowStep === 1 && (
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-3">Video Call Session</h4>
                  <div className="space-y-2 text-purple-800">
                    <div>• Google Meet integration</div>
                    <div>• "Hello, ready to sign?" greeting</div>
                    <div>• Name acknowledgment and signature process</div>
                    <div>• "Thank you" completion</div>
                  </div>
                </div>
              )}

              {flowStep === 2 && (
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-3">Split-Screen Interface</h4>
                  <div className="space-y-2 text-purple-800">
                    <div>• Customer face verification (top screen)</div>
                    <div>• Digital signature pad (bottom screen)</div>
                    <div>• CMRA witness sees full split screen</div>
                    <div>• Real-time verification process</div>
                  </div>
                </div>
              )}

              {flowStep === 3 && (
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-3">Confidence Scoring</h4>
                  <div className="space-y-3 text-purple-800">
                    <div className="flex items-center justify-between">
                      <span>Signature Confidence:</span>
                      <span className="font-bold text-green-600">94.7%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox checked readOnly />
                      <span>"I confirm this is my signature"</span>
                    </div>
                    <div>• WebRTC recording → IPFS storage</div>
                    <div>• Private to user's XRP wallet</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
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
    const v3Steps = [
      {
        title: "95%+ Biometric Recognition",
        description: "Advanced face recognition with confidence scoring",
        icon: Brain,
        visual: "/futuristic-ai-interface-with-biometric-scanning-a.png",
      },
      {
        title: "GPS Location Verification",
        description: "Device validation and location confirmation",
        icon: MapPin,
        visual: "/gps-location-verification-interface-with-map.png",
      },
      {
        title: "6 Patent Claims Execution",
        description: "Patent-pending AI witness technology",
        icon: Shield,
        visual: "/patent-claims-visualization-interface.png",
      },
      {
        title: "CMID Token Minting",
        description: "Blockchain token generation and compliance recording",
        icon: Globe,
        visual: "/blockchain-interface-showing-smart-contract-exec.png",
      },
    ]

    const patentClaims = [
      "AI-powered signature verification",
      "Biometric identity confirmation",
      "GPS-based location validation",
      "Automated compliance recording",
      "Blockchain audit trail generation",
      "Real-time confidence scoring",
    ]

    const currentStepData = v3Steps[flowStep]

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">V3: AI Witness (Patent-Pending)</h2>
            <p className="text-lg text-emerald-700">USPS pilot program ready with complete AI automation</p>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mt-2">Patent-Pending Technology</Badge>
          </div>

          <Card className="shadow-xl border-0 border-t-4 border-t-emerald-500">
            <CardHeader className="text-center pb-6 bg-emerald-50">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <currentStepData.icon className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-emerald-900">{currentStepData.title}</CardTitle>
              <CardDescription className="text-lg text-emerald-700">{currentStepData.description}</CardDescription>
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
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-emerald-900 mb-3">Biometric Analysis</h4>
                  <div className="space-y-3 text-emerald-800">
                    <div className="flex items-center justify-between">
                      <span>Face Recognition Confidence:</span>
                      <span className="font-bold text-green-600">98.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Identity Verification:</span>
                      <span className="font-bold text-green-600">Confirmed</span>
                    </div>
                    <div>• Advanced neural network processing</div>
                    <div>• Real-time confidence scoring</div>
                  </div>
                </div>
              )}

              {flowStep === 1 && (
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-emerald-900 mb-3">GPS Verification</h4>
                  <div className="space-y-2 text-emerald-800">
                    <div>• Location: Honolulu, HI (verified)</div>
                    <div>• Device validation: iPhone 15 Pro</div>
                    <div>• IMEI verification (private)</div>
                    <div>• Geofencing compliance confirmed</div>
                  </div>
                </div>
              )}

              {flowStep === 2 && (
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-emerald-900 mb-3">Patent Claims Execution</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-emerald-800">
                    {patentClaims.map((claim, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{claim}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {flowStep === 3 && (
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-emerald-900 mb-3">CMID Token Minting</h4>
                  <div className="space-y-2 text-emerald-800">
                    <div>• CMID Token: 0x7f8e9d...</div>
                    <div>• Blockchain: Ethereum</div>
                    <div>• XRP Dual Chain Recordation</div>
                    <div>• Smart contract execution confirmed</div>
                    <div>• Compliance record immutably stored</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                {flowStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setFlowStep(flowStep - 1)}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={() => (flowStep < v3Steps.length - 1 ? setFlowStep(flowStep + 1) : handleFlowComplete())}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                >
                  {flowStep < v3Steps.length - 1 ? "Continue" : "Complete V3 Demo"}
                </Button>
              </div>
            </CardContent>
          </Card>
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
        {currentStep === "flow" && selectedVersion === "cmragent" && <CMRAAgentFlow />}
        {currentStep === "complete" && <CompletionScreen />}
      </motion.div>
    </AnimatePresence>
  )
}
