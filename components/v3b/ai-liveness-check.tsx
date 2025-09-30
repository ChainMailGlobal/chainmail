"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, XCircle, Eye, Loader2 } from "lucide-react"
import type { LivenessDetectionResult } from "@/lib/ai/liveness-detection"

interface AILivenessCheckProps {
  sessionId: string
  videoUrl: string
  onComplete: (result: LivenessDetectionResult) => void
}

export function AILivenessCheck({ sessionId, videoUrl, onComplete }: AILivenessCheckProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<LivenessDetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    setIsChecking(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/detect-liveness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, videoUrl }),
      })

      if (!response.ok) {
        throw new Error("Liveness check failed")
      }

      const data = await response.json()
      setResult(data.result)
      onComplete(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Liveness check failed")
    } finally {
      setIsChecking(false)
    }
  }

  const getRecommendationColor = () => {
    if (!result) return "slate"
    if (result.recommendation === "approve") return "green"
    if (result.recommendation === "review") return "yellow"
    return "red"
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {isChecking ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : result ? (
              result.isLive ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )
            ) : (
              <Eye className="w-8 h-8 text-blue-600" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl">Liveness Detection</CardTitle>
        <CardDescription>
          {isChecking ? "Analyzing video for liveness..." : result ? "Analysis complete" : "Ready to check liveness"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!result && !isChecking && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-4">Liveness Indicators:</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div>• Natural blinking patterns</div>
              <div>• Head movement and rotation</div>
              <div>• Facial expressions</div>
              <div>• 3D depth perception</div>
              <div>• Lighting variations</div>
            </div>
          </div>
        )}

        {isChecking && (
          <div className="space-y-4">
            <div className="text-center text-sm text-slate-600">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              Analyzing video for signs of life...
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div
              className={`bg-${getRecommendationColor()}-50 p-6 rounded-lg border border-${getRecommendationColor()}-200`}
            >
              <h3 className={`font-semibold text-${getRecommendationColor()}-900 mb-4`}>Liveness Results:</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Liveness Score:</span>
                  <Badge className={`bg-${getRecommendationColor()}-100 text-${getRecommendationColor()}-800`}>
                    {result.livenessScore.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Status:</span>
                  <Badge className={result.isLive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {result.isLive ? "Live Person" : "Suspicious"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Recommendation:</span>
                  <Badge className={`bg-${getRecommendationColor()}-100 text-${getRecommendationColor()}-800`}>
                    {result.recommendation.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-3">Detected Indicators:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  {result.indicators.blinking ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">Blinking</span>
                </div>
                <div className="flex items-center space-x-2">
                  {result.indicators.headMovement ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">Head Movement</span>
                </div>
                <div className="flex items-center space-x-2">
                  {result.indicators.facialExpressions ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">Expressions</span>
                </div>
                <div className="flex items-center space-x-2">
                  {result.indicators.depthPerception ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">3D Depth</span>
                </div>
                <div className="flex items-center space-x-2">
                  {result.indicators.lighting ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">Lighting</span>
                </div>
              </div>
            </div>

            {result.fraudIndicators.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Spoofing Indicators:</strong>
                  <ul className="mt-2 space-y-1">
                    {result.fraudIndicators.map((indicator, index) => (
                      <li key={index} className="text-sm">
                        • {indicator}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!result && !isChecking && (
          <Button onClick={handleCheck} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
            <Eye className="w-5 h-5 mr-2" />
            Check Liveness
          </Button>
        )}

        {result && (
          <div className="flex space-x-4">
            <Button
              onClick={() => onComplete(result)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!result.isLive}
            >
              Continue
            </Button>
            <Button variant="outline" onClick={handleCheck} className="flex-1 bg-transparent">
              Re-check
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
