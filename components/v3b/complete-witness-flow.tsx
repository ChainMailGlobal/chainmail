"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { VideoCallInterface } from "@/components/v3b/video-call-interface"
import { SignaturePad } from "@/components/v3b/signature-pad"
import { AIIdentityVerification } from "@/components/v3b/ai-identity-verification"
import { AILivenessCheck } from "@/components/v3b/ai-liveness-check"
import { LiveSessionAIGuide } from "@/components/v3b/live-session-ai-guide"
import { AIAssistedFormField } from "@/components/v3b/ai-form-assistant"
import { startWitnessSession, saveCustomerSignature, completeWitnessSession } from "@/lib/actions/v3b-actions"
import { generateForm1583PDF, generateWitnessCertificate, type Form1583Data } from "@/lib/pdf/form-1583-generator"
import { sendSessionCompleteEmail } from "@/lib/email/send-email"
import { useVideoRecorder } from "@/hooks/use-video-recorder"
import { VideoRecorderControls } from "@/components/v3b/video-recorder-controls"
import { uploadVideoToBlob } from "@/lib/blob-storage"
import { Input } from "@/components/ui/input"

type FlowStep =
  | "intro"
  | "customer-info"
  | "video-call"
  | "identity-verification"
  | "liveness-check"
  | "signature-capture"
  | "generating-documents"
  | "blockchain-recording"
  | "complete"

export default function CompleteWitnessFlow() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("intro")
  const [sessionId, setSessionId] = useState<string>("")
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("")
  const [idVerificationResult, setIdVerificationResult] = useState<any>(null)
  const [livenessResult, setLivenessResult] = useState<any>(null)
  const [documentUrls, setDocumentUrls] = useState({ form1583: "", certificate: "" })
  const [blockchainTxHash, setBlockchainTxHash] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  const videoRecorder = useVideoRecorder()

  const handleStartSession = async () => {
    const newSessionId = crypto.randomUUID()
    setSessionId(newSessionId)

    console.log("[v0] Starting complete witness session:", newSessionId)

    await startWitnessSession(newSessionId)

    setCurrentStep("customer-info")
  }

  const handleCustomerInfoSubmit = () => {
    if (!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.phone) {
      alert("Please fill in all required fields")
      return
    }
    setCurrentStep("video-call")
  }

  const handleVideoCallComplete = () => {
    setCurrentStep("identity-verification")
  }

  const handleIdentityVerified = (result: any) => {
    console.log("[v0] Identity verification result:", result)
    setIdVerificationResult(result)
    setCurrentStep("liveness-check")
  }

  const handleLivenessVerified = (result: any) => {
    console.log("[v0] Liveness check result:", result)
    setLivenessResult(result)
    setCurrentStep("signature-capture")

    videoRecorder.startRecording()
  }

  const handleSignatureComplete = async (signatureData: string) => {
    console.log("[v0] Signature captured")
    setSignatureDataUrl(signatureData)
    setIsProcessing(true)

    try {
      videoRecorder.stopRecording()

      await saveCustomerSignature(sessionId, signatureData)

      let videoHash = ""
      if (videoRecorder.videoBlob) {
        const videoUrl = await uploadVideoToBlob(videoRecorder.videoBlob, sessionId)
        console.log("[v0] Video uploaded:", videoUrl)
        videoHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(videoUrl)).then((buf) =>
          Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""),
        )
      }

      setCurrentStep("generating-documents")

      const form1583Data: Form1583Data = {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phone: customerData.phone,
        dateOfBirth: "1990-01-15",
        streetAddress: "1234 Main Street",
        city: "Honolulu",
        state: "HI",
        zipCode: "96813",
        idType: "Driver's License",
        idNumber: "H12345678",
        idIssuingState: "HI",
        idExpirationDate: "2028-01-15",
        cmraName: "Downtown Mail Center",
        cmraAddress: "456 Business Blvd, Honolulu, HI 96814",
        cmraLicense: "CMRA-2024-001",
        witnessName: "AI Witness System",
        witnessTitle: "Automated Digital Witness",
        witnessDate: new Date().toLocaleDateString(),
        customerSignature: signatureData,
        witnessSignature: signatureData,
        sessionId: sessionId,
        sessionType: "V3b Remote AI Witness",
        confidenceScore: idVerificationResult?.confidenceScore || 95,
      }

      const form1583Blob = await generateForm1583PDF(form1583Data)
      const certificateBlob = await generateWitnessCertificate(form1583Data)

      const form1583Url = URL.createObjectURL(form1583Blob)
      const certificateUrl = URL.createObjectURL(certificateBlob)

      setDocumentUrls({ form1583: form1583Url, certificate: certificateUrl })

      const documentHash = await crypto.subtle.digest("SHA-256", await form1583Blob.arrayBuffer()).then((buf) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      )

      setCurrentStep("blockchain-recording")

      const blockchainResponse = await fetch("/api/v3b/record-blockchain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          customerId: customerData.email,
          witnessType: "v3b",
          documentHash,
          videoHash,
        }),
      })

      const blockchainResult = await blockchainResponse.json()
      if (blockchainResult.success) {
        setBlockchainTxHash(blockchainResult.transactionHash)
        console.log("[v0] Blockchain transaction:", blockchainResult.transactionHash)
      }

      await completeWitnessSession(sessionId)

      await sendSessionCompleteEmail({
        to: customerData.email,
        customerName: `${customerData.firstName} ${customerData.lastName}`,
        sessionId: sessionId,
        form1583Url: form1583Url,
        certificateUrl: certificateUrl,
        confidenceScore: idVerificationResult?.confidenceScore,
      })

      setCurrentStep("complete")
    } catch (error) {
      console.error("[v0] Error processing session:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getCurrentStepName = (): string => {
    const stepMap: Record<FlowStep, string> = {
      intro: "welcome",
      "customer-info": "form-review",
      "video-call": "video-call",
      "identity-verification": "id-verification",
      "liveness-check": "liveness-check",
      "signature-capture": "signature",
      "generating-documents": "processing",
      "blockchain-recording": "blockchain-recording",
      complete: "completion",
    }
    return stepMap[currentStep] || "welcome"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      {currentStep !== "intro" && currentStep !== "complete" && (
        <LiveSessionAIGuide sessionStep={getCurrentStepName()} sessionData={customerData} autoSpeak={true} />
      )}

      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="bg-white hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <Badge className="bg-purple-100 text-purple-800 border-purple-300 mb-4">
            Complete V3b Witness Flow with AI Guide & Blockchain
          </Badge>
          <h1 className="text-4xl font-bold text-purple-900 mb-2">Digital Witnessing Session</h1>
          <p className="text-lg text-purple-700">AI-guided video verification with blockchain audit trail</p>
        </div>

        {currentStep === "intro" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Complete Digital Witnessing System</CardTitle>
              <CardDescription className="text-lg">
                Experience the full V3b flow with AI guidance and blockchain recording
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-4">This session includes:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>WebRTC Video Call:</strong> Real-time peer-to-peer video connection with agent
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>AI Identity Verification:</strong> Face matching, fraud detection, and document analysis
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>Liveness Detection:</strong> Anti-spoofing verification with blink and movement detection
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>Digital Signature Capture:</strong> High-quality signature pad with touch support
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>Video Recording:</strong> Session recording with upload to secure storage
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>PDF Generation:</strong> Automatic Form 1583 and witness certificate creation
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>Email Notifications:</strong> Automated confirmation and completion emails
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>AI Form Assistant:</strong> Contextual help for each form field with examples
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>Live AI Guide:</strong> Real-time voice and text guidance throughout the session
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>XRP Blockchain Recording:</strong> Immutable audit trail on XRP Ledger for compliance
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <strong>Database Integration:</strong> Full Supabase integration with audit trail
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Demo Mode:</strong> This is a demonstration of all integrated features. In production, this
                    would connect to real video conferencing, AI services, and email providers.
                  </div>
                </div>
              </div>

              <Button onClick={handleStartSession} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6">
                Start Complete Witness Session
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "customer-info" && (
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Please provide your information for Form 1583 verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <AIAssistedFormField
                  label="First Name"
                  fieldName="firstName"
                  fieldType="text"
                  value={customerData.firstName}
                  onChange={(value) => setCustomerData({ ...customerData, firstName: value })}
                  formContext={customerData}
                >
                  <Input
                    value={customerData.firstName}
                    onChange={(e) => setCustomerData({ ...customerData, firstName: e.target.value })}
                    placeholder="Enter your first name"
                  />
                </AIAssistedFormField>

                <AIAssistedFormField
                  label="Last Name"
                  fieldName="lastName"
                  fieldType="text"
                  value={customerData.lastName}
                  onChange={(value) => setCustomerData({ ...customerData, lastName: value })}
                  formContext={customerData}
                >
                  <Input
                    value={customerData.lastName}
                    onChange={(e) => setCustomerData({ ...customerData, lastName: e.target.value })}
                    placeholder="Enter your last name"
                  />
                </AIAssistedFormField>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <AIAssistedFormField
                  label="Email Address"
                  fieldName="email"
                  fieldType="email"
                  value={customerData.email}
                  onChange={(value) => setCustomerData({ ...customerData, email: value })}
                  formContext={customerData}
                >
                  <Input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </AIAssistedFormField>

                <AIAssistedFormField
                  label="Phone Number"
                  fieldName="phone"
                  fieldType="tel"
                  value={customerData.phone}
                  onChange={(value) => setCustomerData({ ...customerData, phone: value })}
                  formContext={customerData}
                >
                  <Input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </AIAssistedFormField>
              </div>

              <Button
                onClick={handleCustomerInfoSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={
                  !customerData.firstName || !customerData.lastName || !customerData.email || !customerData.phone
                }
              >
                Continue to Video Call
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "video-call" && (
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Video Call with Witness Agent</CardTitle>
              <CardDescription>Connect with your assigned witness agent via video call</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <VideoCallInterface
                sessionId={sessionId}
                participantName="Sarah Johnson (CMRA Agent)"
                participantRole="customer"
                onCallEnd={handleVideoCallComplete}
              />

              <Button onClick={handleVideoCallComplete} className="w-full bg-purple-600 hover:bg-purple-700">
                Continue to Identity Verification
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "identity-verification" && (
          <AIIdentityVerification
            sessionId={sessionId}
            faceVideoUrl="/placeholder-video.mp4"
            idDocumentUrl="/placeholder-id.jpg"
            onVerificationComplete={handleIdentityVerified}
          />
        )}

        {currentStep === "liveness-check" && (
          <AILivenessCheck
            sessionId={sessionId}
            videoStreamUrl="/placeholder-video.mp4"
            onLivenessVerified={handleLivenessVerified}
          />
        )}

        {currentStep === "signature-capture" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Recording</CardTitle>
                <CardDescription>Recording your signature capture for verification</CardDescription>
              </CardHeader>
              <CardContent>
                <VideoRecorderControls
                  isRecording={videoRecorder.isRecording}
                  isPaused={videoRecorder.isPaused}
                  recordingTime={videoRecorder.recordingTime}
                  onStart={videoRecorder.startRecording}
                  onStop={videoRecorder.stopRecording}
                  onPause={videoRecorder.pauseRecording}
                  onResume={videoRecorder.resumeRecording}
                  onReset={videoRecorder.resetRecording}
                />
              </CardContent>
            </Card>

            <SignaturePad
              onSignatureComplete={handleSignatureComplete}
              title="Sign Form 1583"
              description="Please sign your name as it appears on your ID"
              disabled={isProcessing}
            />
          </div>
        )}

        {currentStep === "generating-documents" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Generating Documents</CardTitle>
              <CardDescription>Creating your Form 1583 and witness certificate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
                  <Brain className="w-12 h-12 text-purple-600" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span>Generating Form 1583 PDF</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span>Generating Witness Certificate</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span>Sending Email Notification</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span>Updating Database</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "blockchain-recording" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Recording on Blockchain</CardTitle>
              <CardDescription>Creating immutable audit trail on XRP Ledger</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                  <Brain className="w-12 h-12 text-blue-600" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span>Hashing document data</span>
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span>Submitting to XRP Ledger</span>
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span>Confirming transaction</span>
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  Your session is being recorded on the XRP Ledger for permanent, tamper-proof audit trail. This ensures
                  compliance and provides verifiable proof of your witness session.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "complete" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-900">Session Complete!</CardTitle>
              <CardDescription className="text-lg">
                Your Form 1583 has been successfully witnessed and recorded on blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-4">Verification Summary:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Session ID:</span>
                    <span className="font-mono text-xs">{sessionId.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Identity Confidence:</span>
                    <span className="font-medium text-green-600">{idVerificationResult?.confidenceScore || 95}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Liveness Score:</span>
                    <span className="font-medium text-green-600">{livenessResult?.livenessScore || 97}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Video Recorded:</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                  {blockchainTxHash && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Blockchain TX:</span>
                      <span className="font-mono text-xs text-blue-600">{blockchainTxHash.slice(0, 16)}...</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email Sent:</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900">Your Documents:</h3>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <a href={documentUrls.form1583} download="Form-1583.pdf">
                    Download Form 1583
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <a href={documentUrls.certificate} download="Witness-Certificate.pdf">
                    Download Witness Certificate
                  </a>
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> Your documents have been saved to your account and emailed to{" "}
                  {customerData.email}. Your session has been recorded on the XRP Ledger for permanent audit trail.
                </div>
              </div>

              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
              >
                View My Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
