"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Camera,
  FileText,
  Video,
  Shield,
  Clock,
  CheckCircle,
  Upload,
  Scan,
  Users,
  Zap,
  AlertCircle,
  User,
  PlayCircle,
} from "lucide-react"

interface CustomerSession {
  id: string
  customerName: string
  customerEmail: string
  verificationMethod: "v1_wet_ink" | "v2_hybrid" | "v3_ai_witness"
  status: "pending" | "in_progress" | "completed" | "failed"
  form1583Data?: any
}

interface CustomerOnboardingHubProps {
  cmraLocationId?: string
  availableVerificationMethods?: ("v1" | "v2" | "v3")[]
  onCustomerCreated?: (customer: CustomerSession) => void
}

export function CustomerOnboardingHub({
  cmraLocationId = "loc_001",
  availableVerificationMethods = ["v1", "v2", "v3"],
  onCustomerCreated,
}: CustomerOnboardingHubProps) {
  const [activeMethod, setActiveMethod] = useState<"v1" | "v2" | "v3" | null>(null)
  const [onboardingStep, setOnboardingStep] = useState<"select" | "form" | "verification" | "complete">("select")
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
    idType: "drivers_license",
  })
  const [batchMode, setBatchMode] = useState(false)
  const [ocrScanning, setOcrScanning] = useState(false)

  const verificationMethods = [
    {
      id: "v1" as const,
      name: "V1: Wet Ink Foundation",
      description: "Traditional signatures with witness verification",
      timeframe: "2-3 days",
      features: ["In-Person Kiosk Only", "Dual Camera Recording", "Physical Wet Ink Signature", "GPS Verification"],
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      icon: FileText,
      complexity: "Standard",
    },
    {
      id: "v2" as const,
      name: "V2: Hybrid Digital",
      description: "Digital forms with scheduled witness",
      timeframe: "Same day",
      features: ["Split Screen Video", "Remote Witness", "Digital Signature Pad", "Paper-less Workflow"],
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      icon: Video,
      complexity: "Moderate",
    },
    {
      id: "v3" as const,
      name: "V3: AI Witness",
      description: "Biometric verification with AI witness",
      timeframe: "Minutes",
      features: ["Biometric Verification", "AI Witness System", "Instant Processing", "Environmental Impact"],
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
      icon: Shield,
      complexity: "Advanced",
    },
  ]

  const handleOCRScan = () => {
    setOcrScanning(true)
    // Simulate OCR scanning
    setTimeout(() => {
      setCustomerData({
        ...customerData,
        name: "Sarah Johnson",
        address: "123 Pacific Ave, San Francisco, CA 94102",
        idNumber: "D1234567",
        idType: "drivers_license",
      })
      setOcrScanning(false)
    }, 2000)
  }

  const handleMethodSelect = (method: "v1" | "v2" | "v3") => {
    setActiveMethod(method)
    setOnboardingStep("form")
  }

  const handleFormSubmit = () => {
    setOnboardingStep("verification")
  }

  const handleVerificationComplete = () => {
    const newCustomer: CustomerSession = {
      id: `cust_${Date.now()}`,
      customerName: customerData.name,
      customerEmail: customerData.email,
      verificationMethod:
        `${activeMethod}_${activeMethod === "v1" ? "wet_ink" : activeMethod === "v2" ? "hybrid" : "ai_witness"}` as any,
      status: "completed",
      form1583Data: customerData,
    }

    onCustomerCreated?.(newCustomer)
    setOnboardingStep("complete")
  }

  if (onboardingStep === "select") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Customer Onboarding Hub</h2>
            <p className="text-slate-600">Select verification method and process customer intake</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant={batchMode ? "default" : "outline"}
              onClick={() => setBatchMode(!batchMode)}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Batch Mode</span>
            </Button>
            {batchMode && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                High-Volume Processing
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {verificationMethods.map((method) => {
            const Icon = method.icon
            const isAvailable = availableVerificationMethods.includes(method.id)

            return (
              <Card
                key={method.id}
                className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  isAvailable ? "border-0 shadow-lg" : "border-dashed border-slate-300 opacity-60"
                }`}
                onClick={() => isAvailable && handleMethodSelect(method.id)}
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${method.gradient}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className={`font-semibold ${isAvailable ? "" : "bg-slate-200 text-slate-500"}`}
                    >
                      {method.complexity}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-6 w-6 text-${method.color}-500`} />
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{method.timeframe}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{method.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {method.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className={`h-2 w-2 rounded-full bg-${method.color}-500 mr-3 flex-shrink-0`} />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isAvailable ? (
                    <Button
                      className={`w-full bg-gradient-to-r ${method.gradient} hover:opacity-90 text-white`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMethodSelect(method.id)
                      }}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start {method.id.toUpperCase()} Process
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full bg-transparent">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Not Available
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {batchMode && (
          <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Users className="h-5 w-5 mr-2" />
                Batch Processing Options
              </CardTitle>
              <CardDescription>Process multiple customers simultaneously for high-volume operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="bg-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
                <Button variant="outline" className="bg-white">
                  <Scan className="h-4 w-4 mr-2" />
                  Bulk OCR Scan
                </Button>
                <Button variant="outline" className="bg-white">
                  <Zap className="h-4 w-4 mr-2" />
                  Auto-Process Queue
                </Button>
              </div>
              <p className="text-sm text-blue-600">
                Batch mode allows processing up to 50 customers simultaneously with automated workflow management.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (onboardingStep === "form") {
    const selectedMethod = verificationMethods.find((m) => m.id === activeMethod)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Customer Information</h2>
            <p className="text-slate-600">
              {selectedMethod?.name} - {selectedMethod?.description}
            </p>
          </div>
          <Button variant="outline" onClick={() => setOnboardingStep("select")}>
            Back to Methods
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2 text-blue-500" />
                OCR Document Scanning
              </CardTitle>
              <CardDescription>Scan customer ID for automatic form pre-fill</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                {ocrScanning ? (
                  <div className="space-y-4">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
                    <p className="text-sm text-slate-600">Scanning document...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="h-12 w-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Place ID document in scanner</p>
                      <Button onClick={handleOCRScan} className="bg-blue-500 hover:bg-blue-600">
                        <Scan className="h-4 w-4 mr-2" />
                        Start OCR Scan
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {customerData.name && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">OCR Scan Complete</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Extracted: {customerData.name}, {customerData.idType.replace("_", " ").toUpperCase()} #
                    {customerData.idNumber}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-emerald-500" />
                Customer Details
              </CardTitle>
              <CardDescription>Review and complete customer information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    value={customerData.idNumber}
                    onChange={(e) => setCustomerData({ ...customerData, idNumber: e.target.value })}
                    placeholder="Enter ID number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleFormSubmit}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={!customerData.name || !customerData.email}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Proceed to {selectedMethod?.name} Verification
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (onboardingStep === "verification") {
    const selectedMethod = verificationMethods.find((m) => m.id === activeMethod)

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedMethod?.name} Verification</h2>
          <p className="text-slate-600">Processing customer: {customerData.name}</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className={`bg-gradient-to-r ${selectedMethod?.gradient} text-white`}>
            <CardTitle className="flex items-center justify-center">
              {selectedMethod?.icon && <selectedMethod.icon className="h-6 w-6 mr-2" />}
              Verification in Progress
            </CardTitle>
            <CardDescription className="text-white/80 text-center">
              Estimated completion: {selectedMethod?.timeframe}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
              </div>

              <div className="text-center space-y-2">
                <p className="font-medium">
                  {activeMethod === "v1" && "Setting up dual camera recording and preparing wet ink signature pad..."}
                  {activeMethod === "v2" && "Connecting to witness via split-screen video call..."}
                  {activeMethod === "v3" && "Initializing AI witness system and biometric verification..."}
                </p>
                <p className="text-sm text-slate-600">Form 1583 data has been pre-filled and is ready for signature</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Customer Information Summary:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Name: {customerData.name}</div>
                  <div>Email: {customerData.email}</div>
                  <div>Phone: {customerData.phone}</div>
                  <div>
                    ID: {customerData.idType.replace("_", " ").toUpperCase()} #{customerData.idNumber}
                  </div>
                </div>
              </div>

              <Button onClick={handleVerificationComplete} className="w-full bg-emerald-500 hover:bg-emerald-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Verification Process
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (onboardingStep === "complete") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Onboarding Complete!</h2>
          <p className="text-slate-600">Customer {customerData.name} has been successfully onboarded</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">Verification Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Customer Name</p>
                  <p className="font-medium">{customerData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Verification Method</p>
                  <p className="font-medium">{verificationMethods.find((m) => m.id === activeMethod)?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <Badge className="bg-green-100 text-green-700">Completed</Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Processing Time</p>
                  <p className="font-medium">{verificationMethods.find((m) => m.id === activeMethod)?.timeframe}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => {
                    setOnboardingStep("select")
                    setActiveMethod(null)
                    setCustomerData({
                      name: "",
                      email: "",
                      phone: "",
                      address: "",
                      idNumber: "",
                      idType: "drivers_license",
                    })
                  }}
                  className="flex-1"
                >
                  <User className="h-4 w-4 mr-2" />
                  Onboard Another Customer
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  View Customer Record
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
