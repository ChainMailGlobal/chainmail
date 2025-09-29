"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Eye, AlertTriangle } from "lucide-react"

interface ConfidenceDisplayProps {
  overallScore: number
  livenessScore: number
  fraudFlags?: string[]
  isAnalyzing?: boolean
}

export function ConfidenceDisplay({
  overallScore,
  livenessScore,
  fraudFlags = [],
  isAnalyzing,
}: ConfidenceDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "High Confidence"
    if (score >= 60) return "Medium Confidence"
    return "Low Confidence"
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          AI Confidence Analysis
        </h3>
        {isAnalyzing && (
          <Badge variant="outline" className="animate-pulse">
            Analyzing...
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Overall Confidence
            </span>
            <span className={`text-sm font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}% - {getScoreLabel(overallScore)}
            </span>
          </div>
          <Progress value={overallScore} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Liveness Detection
            </span>
            <span className={`text-sm font-bold ${getScoreColor(livenessScore)}`}>{livenessScore}%</span>
          </div>
          <Progress value={livenessScore} className="h-2" />
        </div>

        {fraudFlags.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-900">Attention Required</p>
                <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                  {fraudFlags.map((flag, index) => (
                    <li key={index}>• {flag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
