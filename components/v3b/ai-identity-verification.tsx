"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, XCircle, Fingerprint, Eye, FileText, Brain, Loader2 } from "lucide-react"
import type { IdentityVerificationResult } from "@/lib/ai/identity-verification"

interface AIIdentityVerificationProps {
  sessionId: string
  faceVideoUrl: string
  idDocumentUrl: string
  verbalAcknowledgment?: string
  onComplete: (result: IdentityVerificationResult) => void
}

export function AIIdentityVerification({
  sessionId,
  faceVideoUrl,
  idDocumentUrl,
  verbalAcknowledgment,
  onComplete,
}: AIIdentityVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<IdentityVerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    setIsVerifying(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/verify-identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          faceVideoUrl,
          idDocumentUrl,
          verbalAcknowledgment,
        }),
      })

      if (!response.ok) {
        throw new Error("Verification failed")
      }

      const data = await response.json()
      setResult(data.result)
      onComplete(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusIcon = () => {
    if (!result) return null
    if (result.isVerified && result.confidenceScore >= 95) {
      return <CheckCircle className="w-8 h-8 text-green-600" />
    }
    if (result.confidenceScore >= 80) {
      return <AlertTriangle className="w-8 h-8 text-yellow-600" />
    }
    return <XCircle className="w-8 h-8 text-red-600" />
  }

  const getStatusColor = () => {
    if (!result) return "slate"
    if (result.isVerified && result.confidenceScore >= 95) return "green"
    if (result.confidenceScore >= 80) return "yellow"
    return "red"
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            {isVerifying ? (
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            ) : result ? (
              getStatusIcon()
            ) : (
              <Brain className="w-8 h-8 text-emerald-600" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl">AI Identity Verification</CardTitle>
        <CardDescription>
          {isVerifying ? "Analyzing biometric data..." : result ? "Verification complete" : "Ready to verify identity"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!result && !isVerifying && (
          <div className="bg-emerald-50 p-6 rounded-lg">
            <h3 className="font-semibold text-emerald-900 mb-4">AI will analyze:</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Fingerprint className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <strong>Face Matching:</strong> Compare face video with ID photo
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Eye className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <strong>Liveness Detection:</strong> Verify physical presence
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <strong>Document Authentication:</strong> Check ID validity
                </div>
              </div>
            </div>
          </div>
        )}

        {isVerifying && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Analyzing face video...</span>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            </div>
            <Progress value={33} className="w-full" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Checking liveness indicators...</span>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            </div>
            <Progress value={66} className="w-full" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Verifying document authenticity...</span>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            </div>
            <Progress value={90} className="w-full" />
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className={`bg-${getStatusColor()}-50 p-6 rounded-lg border border-${getStatusColor()}-200`}>
              <h3 className={`font-semibold text-${getStatusColor()}-900 mb-4`}>Verification Results:</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Overall Confidence:</span>
                  <Badge className={`bg-${getStatusColor()}-100 text-${getStatusColor()}-800`}>
                    {result.confidenceScore.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Liveness Score:</span>
                  <Badge className={`bg-${getStatusColor()}-100 text-${getStatusColor()}-800`}>
                    {result.livenessScore.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Face Match:</span>
                  <Badge
                    className={`${result.faceMatch.isMatch ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {result.faceMatch.isMatch ? "Match" : "No Match"} ({result.faceMatch.similarity.toFixed(1)}%)
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Document Authentic:</span>
                  <Badge
                    className={`${result.documentAnalysis.isAuthentic ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {result.documentAnalysis.isAuthentic ? "Authentic" : "Suspicious"}
                  </Badge>
                </div>
              </div>
            </div>

            {result.fraudFlags.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Fraud Indicators Detected:</strong>
                  <ul className="mt-2 space-y-1">
                    {result.fraudFlags.map((flag, index) => (
                      <li key={index} className="text-sm">
                        • {flag}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {result.recommendations.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Recommendations:</h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-blue-800">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Document Details:</h4>
              <div className="space-y-1 text-sm text-slate-700">
                <div>Type: {result.documentAnalysis.documentType}</div>
                {result.documentAnalysis.issueDate && <div>Issued: {result.documentAnalysis.issueDate}</div>}
                {result.documentAnalysis.expirationDate && <div>Expires: {result.documentAnalysis.expirationDate}</div>}
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!result && !isVerifying && (
          <Button onClick={handleVerify} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6">
            <Brain className="w-5 h-5 mr-2" />
            Start AI Verification
          </Button>
        )}

        {result && (
          <div className="flex space-x-4">
            <Button
              onClick={() => onComplete(result)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!result.isVerified}
            >
              Continue to Next Step
            </Button>
            <Button variant="outline" onClick={handleVerify} className="flex-1 bg-transparent">
              Re-verify
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
