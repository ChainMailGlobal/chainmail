"use client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DemoPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function DemoPopup({ isOpen, onClose }: DemoPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">The MailboxHero of Neo-Kyoto</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="h-[calc(95vh-80px)]">
          <embed
            src="/neo-kyoto-mailboxhero-v31.pdf"
            type="application/pdf"
            className="w-full h-full"
            title="The MailboxHero of Neo-Kyoto PDF"
          />
        </div>
      </div>
    </div>
  )
}
