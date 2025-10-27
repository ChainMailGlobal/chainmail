"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle, XCircle, AlertCircle, Download, Send } from "lucide-react"

interface CustomerRow {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
}

interface BulkCustomerInviteProps {
  cmraLocationId: string
  cmraName: string
}

export function BulkCustomerInvite({ cmraLocationId, cmraName }: BulkCustomerInviteProps) {
  const [file, setFile] = useState<File | null>(null)
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [sendResults, setSendResults] = useState<{ success: number; failed: number } | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    if (!uploadedFile.name.endsWith(".csv")) {
      setValidationErrors(["Please upload a CSV file"])
      return
    }

    setFile(uploadedFile)
    parseCSV(uploadedFile)
  }

  const parseCSV = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length < 2) {
        setValidationErrors(["CSV file is empty or has no data rows"])
        return
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
      const requiredHeaders = ["firstname", "lastname", "email"]
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

      if (missingHeaders.length > 0) {
        setValidationErrors([`Missing required columns: ${missingHeaders.join(", ")}`])
        return
      }

      const parsedCustomers: CustomerRow[] = []
      const errors: string[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())
        const row: any = {}

        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })

        // Validate email
        if (!row.email || !row.email.includes("@")) {
          errors.push(`Row ${i}: Invalid email address`)
          continue
        }

        // Validate required fields
        if (!row.firstname || !row.lastname) {
          errors.push(`Row ${i}: Missing first name or last name`)
          continue
        }

        parsedCustomers.push({
          firstName: row.firstname,
          lastName: row.lastname,
          email: row.email,
          phone: row.phone,
          address: row.address,
        })
      }

      setCustomers(parsedCustomers)
      setValidationErrors(errors)
    }

    reader.readAsText(file)
  }

  const handleSendInvites = async () => {
    setIsProcessing(true)
    setSendResults(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_AGENT_BACKEND_BASE || "https://mailboxhero.pro"

      const backendResponse = await fetch(`${backendUrl}/api/form1583/bulk-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cmra_id: cmraLocationId,
          cmra_owner_id: "current-user-id", // TODO: Get from auth context
          clients: customers.map((c) => ({
            first_name: c.firstName,
            last_name: c.lastName,
            email: c.email,
            client_type: "individual",
          })),
        }),
      })

      if (!backendResponse.ok) {
        throw new Error(`Backend returned ${backendResponse.status}`)
      }

      const backendData = await backendResponse.json()

      if (!backendData.success || !backendData.invitations) {
        throw new Error("Backend did not return invitation data")
      }

      let successCount = 0
      let failedCount = 0

      for (const invitation of backendData.invitations) {
        try {
          const emailResponse = await fetch("/api/email/send-customer-invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: invitation.client_email,
              customerName: `${invitation.client_first_name} ${invitation.client_last_name}`,
              cmraName: invitation.cmra_name,
              inviteLink: invitation.invite_link,
            }),
          })

          if (emailResponse.ok) {
            successCount++
          } else {
            failedCount++
          }
        } catch (error) {
          console.error("Error sending email:", error)
          failedCount++
        }
      }

      setSendResults({ success: successCount, failed: failedCount })
    } catch (error) {
      console.error("Error sending invites:", error)
      setValidationErrors(["Failed to send invites. Please try again."])
    } finally {
      setIsProcessing(false)
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-500" />
            Bulk Customer Invites
          </CardTitle>
          <CardDescription>
            Upload a CSV file to send Form 1583 verification invites to multiple customers at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Download Template */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <p className="font-medium text-blue-900">Need a template?</p>
              <p className="text-sm text-blue-700">Download our CSV template to get started</p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <p className="text-lg font-medium text-slate-700">{file ? file.name : "Click to upload CSV file"}</p>
              <p className="text-sm text-slate-500 mt-2">Required columns: FirstName, LastName, Email</p>
            </label>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Validation Errors</p>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {customers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{customers.length} customers ready to invite</p>
                  <p className="text-sm text-slate-600">Review the list below before sending invites</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Validated
                </Badge>
              </div>

              {/* Customer List */}
              <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b sticky top-0">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">Name</th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">Email</th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, index) => (
                      <tr key={index} className="border-b hover:bg-slate-50">
                        <td className="p-3 text-sm">
                          {customer.firstName} {customer.lastName}
                        </td>
                        <td className="p-3 text-sm">{customer.email}</td>
                        <td className="p-3 text-sm text-slate-600">{customer.phone || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSendInvites}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Sending Invites...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send {customers.length} Invites
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Results */}
          {sendResults && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Invites Sent Successfully</p>
                  <p className="text-sm text-green-700 mt-1">
                    {sendResults.success} invites sent, {sendResults.failed} failed
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
            CSV Format Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <p>
            <strong>Required columns:</strong> FirstName, LastName, Email
          </p>
          <p>
            <strong>Optional columns:</strong> Phone, Address
          </p>
          <p>
            <strong>Example:</strong>
          </p>
          <pre className="bg-slate-100 p-3 rounded text-xs overflow-x-auto">
            FirstName,LastName,Email,Phone,Address{"\n"}
            John,Doe,john@example.com,555-0100,123 Main St{"\n"}
            Jane,Smith,jane@example.com,555-0101,456 Oak Ave
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
