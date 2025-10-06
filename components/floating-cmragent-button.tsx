"use client"

import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

export function FloatingCMRAgentButton() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-full h-14 px-6 gap-2"
        asChild
      >
        <a
          href="https://app.dreambase.ai/workspace/bc1aa565-a7c8-42f6-b445-f74b0238a074/dashboards/reports/aa015d37-f60c-4229-99dc-04e8b5a340aa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Bot className="h-5 w-5" />
          <span className="font-semibold">CMRAgent</span>
        </a>
      </Button>
    </div>
  )
}
