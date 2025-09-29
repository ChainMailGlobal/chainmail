"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  Shield,
  Clock,
  ArrowLeft,
} from "lucide-react"

type WitnessStep =
  | "intro"
  | "camera-setup"
  | "agent-connect"
  | "identity-verify"
  | "signature-capture"
  | "agent-witness"
  | "complete"

export default function V3aWitnessFlow() {
  const [currentStep, setCurrentStep] = useState<WitnessStep>("intro")
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [progress, setProgress] = useState(0)
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [agentConnected, setAgentConnected] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate camera access
  useEffect(() => {
    if (currentStep === "camera-setup" && videoRef.current) {
      // In production, this would use navigator.mediaDevices.getUserMedia()
      // For now, we'll simulate it
      console.log("[v0] Camera setup initiated")
    }
  }, [currentStep])

  const handleStartSession = () => {
    setCurrentStep("camera-setup")
  }

  const handleCameraReady = () => {
    setIsVideoOn(true)
    setCurrentStep("agent-connect")
    // Simulate agent connection
    setTimeout(() => {
      setAgentConnected(true)
      setCurrentStep("identity-verify")
    }, 2000)
  }

  const handleIdentityVerified = () => {
    setIsRecording(true)
    setCurrentStep("signature-capture")
  }

  const handleSignatureComplete = (signature: string) => {
    setSignatureData(signature)
    setCurrentStep("agent-witness")
    // Simulate agent witnessing
    setTimeout(() => {
      setCurrentStep("complete")
      setIsRecording(false)
    }, 3000)
  }

  const handleDrawSignature = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Simulate signature drawing
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(50, 80)
        ctx.lineTo(150, 60)
        ctx.stroke()

        const dataUrl = canvas.toDataURL()
        handleSignatureComplete(dataUrl)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/demo-v31")}
            className="bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Demo
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-purple-100 text-purple-800 border-purple-300 mb-4">V3a: Semi-Autonomous Witness</Badge>
          <h1 className="text-4xl font-bold text-purple-900 mb-2">Digital Witnessing Session</h1>
          <p className="text-lg text-purple-700">Live virtual agent witnessing with split-screen interface</p>
        </div>

        {/* Intro Step */}
        {currentStep === "intro" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Welcome to V3a Digital Witnessing</CardTitle>
              <CardDescription className="text-lg">
                You'll connect with a live virtual agent who will witness your Form 1583 signature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-4">What to expect:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>Split-screen interface:</strong> Your face on top, signature pad on bottom
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>Live virtual agent:</strong> Real person witnessing via video
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>Verbal acknowledgment:</strong> You'll confirm your identity and signature
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>Session recording:</strong> Full video and audit trail stored securely
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Privacy Notice:</strong> This session will be recorded for compliance purposes. All
                    recordings are stored securely and privately in your account.
                  </div>
                </div>
              </div>

              <Button onClick={handleStartSession} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6">
                Start Witnessing Session
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Camera Setup Step */}
        {currentStep === "camera-setup" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Camera Setup</CardTitle>
              <CardDescription>Please allow camera and microphone access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-100 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Initializing camera...</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-900">Camera access granted</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-900">Microphone access granted</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleCameraReady} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Continue to Agent Connection
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Agent Connect Step */}
        {currentStep === "agent-connect" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Connecting to Virtual Agent</CardTitle>
              <CardDescription>Please wait while we connect you with an available agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
                  <User className="w-12 h-12 text-purple-600" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-slate-700 mb-2">Connecting to agent...</p>
                <Progress value={66} className="w-full max-w-md mx-auto" />
              </div>

              {agentConnected && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-900 font-medium">Connected to Agent Jessica Martinez</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Identity Verify, Signature Capture, Agent Witness Steps */}
        {(currentStep === "identity-verify" ||
          currentStep === "signature-capture" ||
          currentStep === "agent-witness") && (
          <div className="space-y-4">
            {/* Status Bar */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {isRecording && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-red-600">Recording</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>Session time: 1:23</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Agent: Jessica Martinez</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className={isMuted ? "bg-red-50" : ""}
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={!isVideoOn ? "bg-red-50" : ""}
                    >
                      {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Split Screen Interface */}
            <div className="grid grid-cols-1 gap-4">
              {/* Video Feed - Top */}
              <Card className="shadow-xl border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Video className="w-5 h-5 text-purple-600" />
                    <span>Video Feed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                      style={{ display: isVideoOn ? "block" : "none" }}
                    />
                    {!isVideoOn && (
                      <div className="text-center">
                        <VideoOff className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-400">Camera off</p>
                      </div>
                    )}
                    {/* Simulated face detection overlay */}
                    {isVideoOn && currentStep !== "agent-witness" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-80 border-2 border-purple-500 rounded-lg">
                          <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                            Face Detected: 98.7%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Signature Pad - Bottom */}
              <Card className="shadow-xl border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>Digital Signature Pad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border-2 border-slate-300 rounded-lg p-4">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={200}
                      className="w-full border border-slate-200 rounded cursor-crosshair"
                      style={{ touchAction: "none" }}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-slate-600">Sign above with your finger or mouse</p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const ctx = canvasRef.current?.getContext("2d")
                            if (ctx && canvasRef.current) {
                              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                            }
                          }}
                        >
                          Clear
                        </Button>
                        {currentStep === "signature-capture" && (
                          <Button size="sm" onClick={handleDrawSignature} className="bg-purple-600 hover:bg-purple-700">
                            Submit Signature
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {currentStep === "identity-verify" && (
                    <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Verbal Acknowledgment Required</h4>
                      <p className="text-sm text-purple-800 mb-3">
                        Please state clearly: "I am [Your Name] and I am signing Form 1583"
                      </p>
                      <Button onClick={handleIdentityVerified} className="w-full bg-purple-600 hover:bg-purple-700">
                        I Have Acknowledged
                      </Button>
                    </div>
                  )}

                  {currentStep === "agent-witness" && (
                    <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">Agent Witnessing in Progress</span>
                      </div>
                      <p className="text-sm text-green-800">
                        Agent Jessica Martinez is reviewing and witnessing your signature...
                      </p>
                      <Progress value={75} className="mt-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {currentStep === "complete" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-900">Witnessing Complete!</CardTitle>
              <CardDescription className="text-lg">
                Your Form 1583 has been successfully witnessed and recorded
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-4">Session Summary:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Witness Agent:</span>
                    <span className="font-medium">Jessica Martinez</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Session Duration:</span>
                    <span className="font-medium">2:47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Identity Confidence:</span>
                    <span className="font-medium text-green-600">98.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Signature Captured:</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Video Recording:</span>
                    <span className="font-medium text-green-600">Stored Securely</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Compliance Status:</span>
                    <span className="font-medium text-green-600">USPS Compliant</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Next Steps:</strong> Your executed Form 1583 will be available in your dashboard within 24
                    hours. You'll receive an email notification when it's ready.
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">View Dashboard</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Download Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
