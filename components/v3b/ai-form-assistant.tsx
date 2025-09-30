"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, X, HelpCircle, Info } from "lucide-react"
import { generateText } from "ai"

interface AIFormAssistantProps {
  fieldName: string
  fieldType: string
  currentValue?: string
  formContext?: Record<string, any>
  onSuggestion?: (suggestion: string) => void
}

export function AIFormAssistant({
  fieldName,
  fieldType,
  currentValue,
  formContext,
  onSuggestion,
}: AIFormAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [explanation, setExplanation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const getFieldExplanation = async () => {
    setIsLoading(true)
    setIsOpen(true)

    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `You are an AI assistant helping users fill out USPS Form 1583 for Commercial Mail Receiving Agency (CMRA) registration.

Field Name: ${fieldName}
Field Type: ${fieldType}
Current Value: ${currentValue || "empty"}
Form Context: ${JSON.stringify(formContext || {})}

Provide a clear, concise explanation of:
1. What this field requires (2-3 sentences)
2. Why it's important for CMRA compliance
3. Common mistakes to avoid
4. An example of a valid entry

Keep the tone friendly and helpful. Format as plain text with clear sections.`,
      })

      setExplanation(text)

      // Generate suggestions if field is empty
      if (!currentValue && fieldType !== "signature") {
        const { text: suggestionsText } = await generateText({
          model: "openai/gpt-4o-mini",
          prompt: `Based on the form context: ${JSON.stringify(formContext || {})}, suggest 2-3 realistic example values for the "${fieldName}" field. Return only the values, one per line, no explanations.`,
        })

        setSuggestions(suggestionsText.split("\n").filter((s) => s.trim()))
      }
    } catch (error) {
      console.error("[v0] Error getting AI explanation:", error)
      setExplanation("Unable to load AI assistance. Please contact support if you need help with this field.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={getFieldExplanation}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
      >
        <HelpCircle className="h-4 w-4 mr-1" />
        Need help?
      </Button>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              AI Assistant
            </Badge>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span>Analyzing field requirements...</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{explanation}</div>

            {suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                  <Info className="h-3 w-3" />
                  <span>Suggested values:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onSuggestion?.(suggestion)}
                      className="text-xs bg-white hover:bg-blue-50 hover:border-blue-300"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function AIAssistedFormField({
  label,
  fieldName,
  fieldType,
  value,
  onChange,
  formContext,
  children,
}: {
  label: string
  fieldName: string
  fieldType: string
  value?: string
  onChange?: (value: string) => void
  formContext?: Record<string, any>
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <AIFormAssistant
          fieldName={fieldName}
          fieldType={fieldType}
          currentValue={value}
          formContext={formContext}
          onSuggestion={onChange}
        />
      </div>
      {children}
    </div>
  )
}
