"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  Mic,
  CheckCircle,
  AlertCircle,
  Brain,
  FileText,
  Shield,
  Clock,
  MapPin,
  Fingerprint,
  Eye,
  ArrowLeft,
} from "lucide-react"
import { useConfidenceScoring } from "@/hooks/use-confidence-scoring"
import { ConfidenceDisplay } from "@/components/v3b/confidence-display"
import {
  startWitnessSession,
  saveCustomerSignature,
  completeWitnessSession,
  saveWitnessConfirmation,
} from "@/lib/actions/v3b-actions"
import { logSessionEvent } from "@/lib/v3b-client"

type WitnessStep =
  | "intro"
  | "camera-setup"
  | "ai-initialize"
  | "facial-recognition"
  | "liveness-check"
  | "gps-verify"
  | "signature-capture"
  | "cmra-counter-signature" // Added CMRA counter-signature step
  | "ai-witness"
  | "blockchain-record"
  | "complete"

interface BiometricData {
  faceMatch: number
  livenessScore: number
  gpsVerified: boolean
  signatureConfidence: number
}

export default function V3bWitnessFlow() {
  const [currentStep, setCurrentStep] = useState<WitnessStep>("intro")
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [progress, setProgress] = useState(0)
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [cmraSignatureData, setCmraSignatureData] = useState<string | null>(null) // Added CMRA signature state
  const [biometrics, setBiometrics] = useState<BiometricData>({
    faceMatch: 0,
    livenessScore: 0,
    gpsVerified: false,
    signatureConfidence: 0,
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cmraCanvasRef = useRef<HTMLCanvasElement>(null) // Added CMRA signature canvas ref

  const [sessionId, setSessionId] = useState<string>("")
  const [sessionStartTime, setSessionStartTime] = useState<number>(0)
  const [verbalAcknowledgment, setVerbalAcknowledgment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { score, isAnalyzing, analyzeFrame, analyzeFullSession } = useConfidenceScoring(
    sessionId,
    currentStep !== "intro" && currentStep !== "complete",
  )

  // Simulate AI processing
  useEffect(() => {
    if (currentStep === "facial-recognition") {
      const interval = setInterval(() => {
        setBiometrics((prev) => ({
          ...prev,
          faceMatch: Math.min(prev.faceMatch + 10, 98.9),
        }))
      }, 200)

      setTimeout(() => {
        clearInterval(interval)
        setCurrentStep("liveness-check")
      }, 2500)

      return () => clearInterval(interval)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep === "liveness-check") {
      const interval = setInterval(() => {
        setBiometrics((prev) => ({
          ...prev,
          livenessScore: Math.min(prev.livenessScore + 10, 97.3),
        }))
      }, 200)

      setTimeout(() => {
        clearInterval(interval)
        setCurrentStep("gps-verify")
      }, 2500)

      return () => clearInterval(interval)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep === "gps-verify") {
      setTimeout(() => {
        setBiometrics((prev) => ({
          ...prev,
          gpsVerified: true,
        }))
        setCurrentStep("signature-capture")
        setIsRecording(true)
      }, 2000)
    }
  }, [currentStep])

  useEffect(() => {
    if (score.overall > 0) {
      setBiometrics((prev) => ({
        ...prev,
        faceMatch: score.overall,
        livenessScore: score.liveness,
      }))
    }
  }, [score])

  const handleStartSession = async () => {
    const newSessionId = crypto.randomUUID()
    setSessionId(newSessionId)
    setSessionStartTime(Date.now())

    console.log("[v0] Starting V3b session:", newSessionId)

    // Log session start event
    await logSessionEvent(newSessionId, "session_started", {
      sessionType: "v3b_autonomous_ai",
      userAgent: navigator.userAgent,
    })

    setCurrentStep("camera-setup")
  }

  const handleCameraReady = async () => {
    setIsVideoOn(true)
    setCurrentStep("ai-initialize")

    if (sessionId) {
      const result = await startWitnessSession(sessionId)
      console.log("[v0] Session started:", result)

      await logSessionEvent(sessionId, "camera_initialized", {
        videoEnabled: true,
        audioEnabled: !isMuted,
      })
    }

    setTimeout(() => {
      setCurrentStep("facial-recognition")
    }, 2000)
  }

  const handleDrawSignature = async () => {
    if (canvasRef.current && sessionId) {
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
        setSignatureData(dataUrl)

        setIsSubmitting(true)
        const result = await saveCustomerSignature(sessionId, dataUrl)
        console.log("[v0] Signature saved:", result)

        await logSessionEvent(sessionId, "signature_captured", {
          signatureUrl: result.signatureUrl,
        })

        // Simulate verbal acknowledgment
        const mockVerbal = "I am John Smith and I am signing Form 1583"
        setVerbalAcknowledgment(mockVerbal)

        await logSessionEvent(sessionId, "verbal_acknowledgment", {
          transcript: mockVerbal,
        })

        setBiometrics((prev) => ({ ...prev, signatureConfidence: 96.4 }))

        setCurrentStep("cmra-counter-signature")
        setIsSubmitting(false)
      }
    }
  }

  const handleCmraCounterSignature = async () => {
    if (cmraCanvasRef.current && sessionId) {
      const canvas = cmraCanvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Simulate CMRA signature drawing
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(50, 80)
        ctx.lineTo(150, 60)
        ctx.stroke()

        const dataUrl = canvas.toDataURL()
        setCmraSignatureData(dataUrl)

        setIsSubmitting(true)

        // Save CMRA witness confirmation
        const confirmation = "I witnessed John Smith signing Form 1583 and verbally confirming their identity"
        const result = await saveWitnessConfirmation(sessionId, confirmation, dataUrl)
        console.log("[v0] CMRA counter-signature saved:", result)

        await logSessionEvent(sessionId, "cmra_counter_signature", {
          signatureUrl: dataUrl,
          confirmation,
        })

        setCurrentStep("ai-witness")
        setIsSubmitting(false)

        setTimeout(async () => {
          const analysis = await analyzeFullSession({
            customerName: "John Smith",
            duration: Math.floor((Date.now() - sessionStartTime) / 1000),
            verbalAcknowledgment,
          })

          console.log("[v0] AI Analysis complete:", analysis)

          await logSessionEvent(sessionId, "ai_analysis_complete", {
            confidenceScore: analysis?.overallConfidence,
            livenessScore: analysis?.livenessScore,
            fraudFlags: analysis?.fraudFlags,
          })

          setCurrentStep("blockchain-record")

          setTimeout(async () => {
            const completion = await completeWitnessSession(sessionId)
            console.log("[v0] Session completed:", completion)

            await logSessionEvent(sessionId, "session_completed", {
              form1583Url: completion.form1583Url,
              certificateUrl: completion.certificateUrl,
              ipfsHash: completion.ipfsHash,
              blockchainTx: completion.blockchainTx,
            })

            setCurrentStep("complete")
            setIsRecording(false)
          }, 3000)
        }, 3000)
      }
    }
  }

  const getSessionDuration = () => {
    if (sessionStartTime === 0) return "0:00"
    const seconds = Math.floor((Date.now() - sessionStartTime) / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
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
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-4">
            V3b: Fully Autonomous AI Witness (Patent-Pending)
          </Badge>
          <h1 className="text-4xl font-bold text-emerald-900 mb-2">AI-Powered Digital Witnessing</h1>
          <p className="text-lg text-emerald-700">Fully automated biometric verification and witnessing</p>
        </div>

        {/* Intro Step */}
        {currentStep === "intro" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Welcome to V3b AI Witnessing</CardTitle>
              <CardDescription className="text-lg">
                Fully autonomous AI witness with advanced biometric verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="font-semibold text-emerald-900 mb-4">AI Verification Process:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Fingerprint className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <strong>Facial Recognition:</strong> 95%+ confidence match against ID photo
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Eye className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <strong>Liveness Detection:</strong> Ensures you're physically present (not a photo/video)
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <strong>GPS Validation:</strong> Confirms location matches ID address
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <strong>Signature Verification:</strong> AI analyzes signature against ID sample
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <strong>Blockchain Recording:</strong> Immutable audit trail on XRPL
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Pilot Program:</strong> This AI witnessing technology is patent-pending and currently in
                    pilot phase. All sessions are subject to human review for compliance verification.
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStartSession}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
              >
                Start AI Witnessing Session
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Camera Setup Step */}
        {currentStep === "camera-setup" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Camera Setup</CardTitle>
              <CardDescription>Initializing biometric sensors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-100 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Initializing camera and sensors...</p>
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
                    <span className="text-green-900">GPS sensor active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-900">AI models loaded</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleCameraReady} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Begin AI Verification
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AI Initialize Step */}
        {currentStep === "ai-initialize" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Initializing AI Witness</CardTitle>
              <CardDescription>Loading biometric verification models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                  <Brain className="w-12 h-12 text-emerald-600" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Facial recognition model</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Liveness detection model</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Signature analysis model</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">GPS verification system</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>

              <Progress value={100} className="w-full" />
            </CardContent>
          </Card>
        )}

        {/* Facial Recognition, Liveness, GPS Steps */}
        {(currentStep === "facial-recognition" || currentStep === "liveness-check" || currentStep === "gps-verify") && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {currentStep === "facial-recognition" && "Facial Recognition"}
                {currentStep === "liveness-check" && "Liveness Detection"}
                {currentStep === "gps-verify" && "GPS Verification"}
              </CardTitle>
              <CardDescription>
                {currentStep === "facial-recognition" && "Matching your face against ID photo"}
                {currentStep === "liveness-check" && "Verifying you are physically present"}
                {currentStep === "gps-verify" && "Confirming your location"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {/* Simulated face detection overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-80 border-2 border-emerald-500 rounded-lg animate-pulse">
                    <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                      {currentStep === "facial-recognition" && `Face Match: ${biometrics.faceMatch.toFixed(1)}%`}
                      {currentStep === "liveness-check" && `Liveness: ${biometrics.livenessScore.toFixed(1)}%`}
                      {currentStep === "gps-verify" && "Verifying Location..."}
                    </div>
                  </div>
                </div>
              </div>

              {currentStep === "facial-recognition" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Face detection</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Feature extraction</span>
                    <Progress value={biometrics.faceMatch} className="w-32" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">ID photo comparison</span>
                    <span className="text-sm font-medium text-emerald-600">{biometrics.faceMatch.toFixed(1)}%</span>
                  </div>
                </div>
              )}

              {currentStep === "liveness-check" && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-sm text-emerald-800 mb-2">
                      <strong>Please follow the prompts:</strong>
                    </p>
                    <div className="space-y-1 text-sm text-emerald-700">
                      <div>✓ Blink naturally</div>
                      <div>✓ Turn head slightly left</div>
                      <div>✓ Turn head slightly right</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Liveness confidence</span>
                    <span className="text-sm font-medium text-emerald-600">{biometrics.livenessScore.toFixed(1)}%</span>
                  </div>
                </div>
              )}

              {currentStep === "gps-verify" && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-900">Location Verification</span>
                    </div>
                    <div className="space-y-1 text-sm text-emerald-700">
                      <div>Current Location: Honolulu, HI</div>
                      <div>ID Address: 1234 Main Street, Honolulu, HI 96813</div>
                      {biometrics.gpsVerified && (
                        <div className="flex items-center space-x-2 text-green-600 font-medium mt-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Location verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Signature Capture, AI Witness, Blockchain Steps */}
        {(currentStep === "signature-capture" ||
          currentStep === "cmra-counter-signature" || // Added CMRA counter-signature step
          currentStep === "ai-witness" ||
          currentStep === "blockchain-record") && (
          <div className="space-y-4">
            {/* Status Bar */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {isRecording && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-red-600">
                          {currentStep === "cmra-counter-signature" ? "CMRA Witnessing" : "AI Recording"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>Session time: {getSessionDuration()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-emerald-600">
                      <Brain className="w-4 h-4" />
                      <span>
                        {currentStep === "cmra-counter-signature" ? "CMRA Counter-Signing" : "AI Witness Active"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Face: {score.overall.toFixed(1)}%</Badge>
                    <Badge className="bg-green-100 text-green-800">Live: {score.liveness.toFixed(1)}%</Badge>
                    {biometrics.gpsVerified && <Badge className="bg-green-100 text-green-800">GPS ✓</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {(currentStep === "ai-witness" || currentStep === "blockchain-record") && (
              <ConfidenceDisplay
                overallScore={score.overall}
                livenessScore={score.liveness}
                fraudFlags={[]}
                isAnalyzing={isAnalyzing}
              />
            )}

            {/* Split Screen Interface */}
            <div className="grid grid-cols-1 gap-4">
              {/* Video Feed - Top */}
              <Card className="shadow-xl border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Video className="w-5 h-5 text-emerald-600" />
                    <span>
                      {currentStep === "cmra-counter-signature" ? "CMRA Forward-Facing Camera" : "Biometric Video Feed"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {/* AI analysis overlay */}
                    <div className="absolute inset-0">
                      <div className="absolute top-4 left-4 space-y-2">
                        {currentStep === "cmra-counter-signature" ? (
                          <>
                            <div className="bg-blue-500/90 text-white text-xs px-3 py-1 rounded">CMRA Witnessing</div>
                            <div className="bg-blue-500/90 text-white text-xs px-3 py-1 rounded">Live Camera Feed</div>
                          </>
                        ) : (
                          <>
                            <div className="bg-emerald-500/90 text-white text-xs px-3 py-1 rounded">
                              Face Match: {biometrics.faceMatch.toFixed(1)}%
                            </div>
                            <div className="bg-emerald-500/90 text-white text-xs px-3 py-1 rounded">
                              Liveness: {biometrics.livenessScore.toFixed(1)}%
                            </div>
                            {biometrics.gpsVerified && (
                              <div className="bg-emerald-500/90 text-white text-xs px-3 py-1 rounded">
                                GPS: Verified
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Signature Pad - Bottom */}
              <Card className="shadow-xl border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span>
                      {currentStep === "cmra-counter-signature"
                        ? "CMRA Counter-Signature Pad"
                        : "Digital Signature Pad"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border-2 border-slate-300 rounded-lg p-4">
                    <canvas
                      ref={currentStep === "cmra-counter-signature" ? cmraCanvasRef : canvasRef}
                      width={600}
                      height={200}
                      className="w-full border border-slate-200 rounded cursor-crosshair"
                      style={{ touchAction: "none" }}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-slate-600">
                        {currentStep === "cmra-counter-signature"
                          ? "CMRA: Sign to confirm you witnessed the customer signing"
                          : "Sign above with your finger or mouse"}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const canvas =
                              currentStep === "cmra-counter-signature" ? cmraCanvasRef.current : canvasRef.current
                            const ctx = canvas?.getContext("2d")
                            if (ctx && canvas) {
                              ctx.clearRect(0, 0, canvas.width, canvas.height)
                            }
                          }}
                          disabled={isSubmitting}
                        >
                          Clear
                        </Button>
                        {currentStep === "signature-capture" && (
                          <Button
                            size="sm"
                            onClick={handleDrawSignature}
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Submit Signature"}
                          </Button>
                        )}
                        {currentStep === "cmra-counter-signature" && (
                          <Button
                            size="sm"
                            onClick={handleCmraCounterSignature}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Submit Counter-Signature"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {currentStep === "signature-capture" && (
                    <div className="mt-4 bg-emerald-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-emerald-900 mb-2">AI Verbal Prompt</h4>
                      <p className="text-sm text-emerald-800 mb-3">
                        AI: "Please state clearly: 'I am [Your Name] and I am signing Form 1583'"
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-emerald-700">
                        <Mic className="w-4 h-4" />
                        <span>Listening for verbal acknowledgment...</span>
                      </div>
                    </div>
                  )}

                  {currentStep === "cmra-counter-signature" && (
                    <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">CMRA Witness Confirmation</span>
                      </div>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Customer signature captured</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Verbal acknowledgment recorded</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Identity verified</span>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                          <p className="font-medium text-blue-900 mb-1">CMRA Attestation:</p>
                          <p className="text-xs text-blue-700">
                            "I witnessed the customer signing this document and verbally confirming their identity and
                            agreement to the terms."
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === "ai-witness" && (
                    <div className="mt-4 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Brain className="w-5 h-5 text-emerald-600" />
                        <span className="font-semibold text-emerald-900">AI Witnessing in Progress</span>
                      </div>
                      <div className="space-y-2 text-sm text-emerald-800">
                        <div className="flex items-center justify-between">
                          <span>Signature analysis</span>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Biometric correlation</span>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Compliance verification</span>
                          <Progress value={75} className="w-24" />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === "blockchain-record" && (
                    <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">Recording to Blockchain</span>
                      </div>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div>Generating CMID token...</div>
                        <div>Writing to XRPL ledger...</div>
                        <div>Creating immutable audit trail...</div>
                        <Progress value={90} className="mt-2" />
                      </div>
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
              <CardTitle className="text-2xl text-green-900">AI Witnessing Complete!</CardTitle>
              <CardDescription className="text-lg">
                Your Form 1583 has been successfully witnessed by AI and recorded on blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-4">Biometric Verification Results:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Facial Recognition:</span>
                    <span className="font-medium text-green-600">{biometrics.faceMatch.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Liveness Detection:</span>
                    <span className="font-medium text-green-600">{biometrics.livenessScore.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">GPS Verification:</span>
                    <span className="font-medium text-green-600">Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Signature Confidence:</span>
                    <span className="font-medium text-green-600">{biometrics.signatureConfidence.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Session Duration:</span>
                    <span className="font-medium">1:12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">CMID Token:</span>
                    <span className="font-mono text-xs">0x7f8e9d2a...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Blockchain:</span>
                    <span className="font-medium text-green-600">XRPL Recorded</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Pilot Program Notice:</strong> This session will be reviewed by a human compliance officer
                    within 24 hours as part of our USPS pilot program validation process.
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Next Steps:</strong> Your executed Form 1583 will be available in your dashboard within 24
                    hours pending compliance review. You'll receive an email notification when approved.
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">View Dashboard</Button>
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
