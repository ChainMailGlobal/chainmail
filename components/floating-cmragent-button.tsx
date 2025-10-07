"use client"

import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

export function FloatingCMRAgentButton() {
  const handleClick = () => {
    window.open(
      "https://app.dreambase.ai/workspace/bc1aa565-a7c8-42f6-b445-f74b0238a074/dashboards/reports/aa015d37-f60c-4229-99dc-04e8b5a340aa",
      "_blank",
      "noopener,noreferrer",
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        onClick={handleClick}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-full h-16 w-16 p-0 flex items-center justify-center hover:scale-110 group"
        aria-label="Open CMRAgent Assistant"
      >
        <Bot className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" />
      </Button>
    </div>
  )
}
