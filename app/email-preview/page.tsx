"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Download, Send } from "lucide-react"

const emailTemplates = [
  { value: "session-confirmation", label: "Session Confirmation" },
  { value: "session-complete", label: "Session Complete" },
  { value: "session-reminder", label: "Session Reminder" },
  { value: "customer-invite", label: "Customer Invite" },
  { value: "missing-upload", label: "Missing Upload" },
  { value: "invalid-upload", label: "Invalid Upload" },
  { value: "violation-alert", label: "Violation Alert" },
]

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("customer-invite")
  const [testEmail, setTestEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState("")
  const [previewHtml, setPreviewHtml] = useState("")

  const handlePreview = async () => {
    try {
      const response = await fetch("/api/email/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: selectedTemplate }),
      })
      const data = await response.json()
      setPreviewHtml(data.html)
    } catch (error) {
      setMessage("Failed to load preview")
    }
  }

  const handleSendTest = async () => {
    if (!testEmail) {
      setMessage("Please enter an email address")
      return
    }

    setSending(true)
    setMessage("")

    try {
      const response = await fetch("/api/email/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selectedTemplate,
          to: testEmail,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✓ Test email sent to ${testEmail}`)
      } else {
        setMessage(`✗ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("✗ Failed to send test email")
    } finally {
      setSending(false)
    }
  }

  const downloadTemplate = () => {
    const template =
      "FirstName,LastName,Email,Phone,Address\nJohn,Doe,john@example.com,555-0100,123 Main St\nJane,Smith,jane@example.com,555-0101,456 Oak Ave"
    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "customer-invite-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Email Template Preview</h1>
          <p className="text-slate-600">Preview and test email templates for customer invitations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <Card className="p-6 h-fit">
            <div className="space-y-6">
              <div>
                <Label htmlFor="template">Select Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger id="template">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handlePreview} className="w-full">
                Preview Template
              </Button>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Send Test Email</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSendTest} disabled={sending} className="w-full" variant="secondary">
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Test Email
                      </>
                    )}
                  </Button>

                  {message && (
                    <p className={`text-sm ${message.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>
                      {message}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">CSV Template</h3>
                <Button onClick={downloadTemplate} variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>
            </div>
          </Card>

          {/* Preview */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="font-semibold mb-4">Email Preview</h3>
            {previewHtml ? (
              <div className="border rounded-lg overflow-hidden bg-white">
                <iframe srcDoc={previewHtml} className="w-full h-[800px]" title="Email Preview" />
              </div>
            ) : (
              <div className="border rounded-lg p-12 text-center text-slate-400">
                Select a template and click "Preview Template" to see the email design
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
