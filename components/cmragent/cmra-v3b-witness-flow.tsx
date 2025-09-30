"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Shield, CheckCircle, FileText, Brain, Fingerprint, Video, Lock, ArrowLeft } from "lucide-react"

type WitnessStep =
  | "intro"
  | "id-verification"
  | "liveness-check"
  | "form-review"
  | "verbal-acknowledgment"
  | "signature-capture"
  | "blockchain-storage"
  | "complete"

export default function CMRAv3bWitnessFlow() {
  const [currentStep, setCurrentStep] = useState<WitnessStep>("intro")
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    {
      id: "intro",
      title: "Welcome to AI Witness Session",
      description: "Autonomous AI-powered Form 1583 witnessing for CMRA operators",
      icon: Brain,
      color: "emerald",
    },
    {
      id: "id-verification",
      title: "ID Verification",
      description: "95%+ facial recognition accuracy",
      icon: Camera,
      color: "blue",
    },
    {
      id: "liveness-check",
      title: "Liveness Detection",
      description: "Ensuring you're physically present",
      icon: Fingerprint,
      color: "purple",
    },
    {
      id: "form-review",
      title: "Form 1583 Review",
      description: "Review your pre-filled form data",
      icon: FileText,
      color: "slate",
    },
    {
      id: "verbal-acknowledgment",
      title: "Verbal Acknowledgment",
      description: "State your acknowledgment on camera",
      icon: Video,
      color: "orange",
    },
    {
      id: "signature-capture",
      title: "Digital Signature",
      description: "Sign your Form 1583",
      icon: Shield,
      color: "green",
    },
    {
      id: "blockchain-storage",
      title: "Blockchain Audit Trail",
      description: "Securing your witness session",
      icon: Lock,
      color: "indigo",
    },
    {
      id: "complete",
      title: "CMRA Dashboard Activated",
      description: "Your Form 1583 has been successfully witnessed and verified",
      icon: CheckCircle,
      color: "emerald",
    },
  ]

  const handleNextStep = async () => {
    setIsProcessing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)

          const currentIndex = steps.findIndex((s) => s.id === currentStep)
          if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1].id as WitnessStep)
          }
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const currentStepData = steps.find((s) => s.id === currentStep)

  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto pt-4">
          <a href="/demo-v31" className="inline-flex items-center text-emerald-700 hover:text-emerald-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Demo
          </a>
        </div>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-slate-900 mb-4">CMRA Dashboard Activated!</h2>
          <p className="text-xl text-slate-700 mb-8">Your Form 1583 has been successfully witnessed and verified</p>

          <Card className="shadow-xl border-0 mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Session Summary</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">98.7%</div>
                  <div className="text-sm text-slate-600">Facial Recognition</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                  <div className="text-sm text-slate-600">Liveness Detection</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">Verified</div>
                  <div className="text-sm text-slate-600">Blockchain Stored</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <a href="/cmragent">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                Access CMRA Dashboard
              </Button>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto pt-4">
        <a href="/demo-v31" className="inline-flex items-center text-slate-700 hover:text-slate-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Demo
        </a>
      </div>
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-8">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 mb-4">CMRA Agent Verification</Badge>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">AI Witness Session</h2>
          <p className="text-lg text-slate-600">Autonomous Form 1583 witnessing for CMRA operators</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {steps.slice(0, -1).map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    steps.findIndex((s) => s.id === currentStep) >= index
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 2 && (
                  <div
                    className={`w-12 h-1 mx-1 ${
                      steps.findIndex((s) => s.id === currentStep) > index ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div
                className={`w-16 h-16 bg-${currentStepData?.color}-100 rounded-full flex items-center justify-center`}
              >
                {currentStepData?.icon && (
                  <currentStepData.icon className={`w-8 h-8 text-${currentStepData.color}-600`} />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl">{currentStepData?.title}</CardTitle>
            <CardDescription className="text-lg">{currentStepData?.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep !== "intro" && (
              <div className="flex justify-center">
                <img
                  src={`/.jpg?height=300&width=400&query=${encodeURIComponent(currentStepData?.description || "")}`}
                  alt={currentStepData?.title}
                  className="w-full max-w-md rounded-lg shadow-lg"
                />
              </div>
            )}

            {currentStep === "intro" && (
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h4 className="font-semibold text-emerald-900 mb-3">What to Expect</h4>
                <div className="space-y-2 text-emerald-800">
                  <div>• AI-powered facial recognition and liveness detection</div>
                  <div>• Verbal acknowledgment recording</div>
                  <div>• Digital signature capture</div>
                  <div>• Blockchain audit trail creation</div>
                  <div>• Estimated time: 2-3 minutes</div>
                </div>
              </div>
            )}

            {currentStep === "id-verification" && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Facial Recognition</h4>
                <div className="space-y-2 text-blue-800">
                  <div>• Position your face in the camera frame</div>
                  <div>• Ensure good lighting</div>
                  <div>• Remove glasses if possible</div>
                  <div>• AI confidence: 98.7% match</div>
                </div>
              </div>
            )}

            {currentStep === "liveness-check" && (
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Liveness Detection</h4>
                <div className="space-y-2 text-purple-800">
                  <div>• Follow on-screen prompts</div>
                  <div>• Turn your head slowly</div>
                  <div>• Blink when instructed</div>
                  <div>• Prevents photo/video spoofing</div>
                </div>
              </div>
            )}

            {currentStep === "form-review" && (
              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-3">Form 1583 Preview</h4>
                <div className="space-y-2 text-slate-800">
                  <div>• Review all pre-filled information</div>
                  <div>• Verify personal details</div>
                  <div>• Confirm mailing address</div>
                  <div>• Check identification information</div>
                </div>
              </div>
            )}

            {currentStep === "verbal-acknowledgment" && (
              <div className="bg-orange-50 p-6 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-3">Verbal Statement</h4>
                <div className="space-y-2 text-orange-800">
                  <div>• Speak clearly into your microphone</div>
                  <div>• State: "I acknowledge this is my signature"</div>
                  <div>• Recording will be stored securely</div>
                  <div>• Part of blockchain audit trail</div>
                </div>
              </div>
            )}

            {currentStep === "signature-capture" && (
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Digital Signature</h4>
                <div className="space-y-2 text-green-800">
                  <div>• Sign using your mouse or touchscreen</div>
                  <div>• Signature will be embedded in PDF</div>
                  <div>• Legally binding digital signature</div>
                  <div>• Confidence scoring applied</div>
                </div>
              </div>
            )}

            {currentStep === "blockchain-storage" && (
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h4 className="font-semibold text-indigo-900 mb-3">Secure Storage</h4>
                <div className="space-y-2 text-indigo-800">
                  <div>• Video stored in IPFS (immutable)</div>
                  <div>• Blockchain audit trail (XRPL)</div>
                  <div>• 🔒 Private: All recordings, signatures</div>
                  <div>• 📅 Public: Only date/time of witness</div>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-slate-600">Processing {currentStepData?.title.toLowerCase()}...</p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={handleNextStep}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
              >
                {isProcessing ? "Processing..." : currentStep === "intro" ? "Start Session" : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
