"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, CheckCircle, Clock, AlertCircle, ExternalLink, Eye, EyeOff } from "@/lib/icons"

interface USPSIntegrationCardProps {
  orgId: string
}

export function USPSIntegrationCard({ orgId }: USPSIntegrationCardProps) {
  const [status, setStatus] = useState<"PENDING" | "SUBMITTED" | "VERIFIED" | "ESCALATED">("PENDING")
  const [showCredentialForm, setShowCredentialForm] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    bcg: false,
    crd: false,
  })

  const [formData, setFormData] = useState({
    bcg_username: "",
    bcg_password: "",
    crd_username: "",
    crd_password: "",
    allow_rpa_password_reset: false,
  })

  useEffect(() => {
    fetchCredentialStatus()
  }, [orgId])

  const fetchCredentialStatus = async () => {
    try {
      const response = await fetch(`/api/cmra/usps-credentials?org_id=${orgId}`)
      const data = await response.json()

      if (data.credentials) {
        setStatus(data.credentials.status)
        setFormData((prev) => ({
          ...prev,
          bcg_username: data.credentials.bcg_username || "",
          crd_username: data.credentials.crd_username || "",
          allow_rpa_password_reset: data.credentials.allow_rpa_password_reset || false,
        }))
      }
    } catch (error) {
      console.error("Error fetching credential status:", error)
    }
  }

  const handleSubmitCredentials = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/cmra/usps-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_id: orgId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("SUBMITTED")
        setShowCredentialForm(false)
        // Reset password fields for security
        setFormData((prev) => ({
          ...prev,
          bcg_password: "",
          crd_password: "",
        }))
      } else {
        alert(data.error || "Failed to submit credentials")
      }
    } catch (error) {
      console.error("Error submitting credentials:", error)
      alert("Failed to submit credentials")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "SUBMITTED":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Submitted
          </Badge>
        )
      case "VERIFIED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "ESCALATED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Escalated
          </Badge>
        )
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle>USPS Integration</CardTitle>
            </div>
            {getStatusBadge()}
          </div>
          <CardDescription>
            Connect your USPS Business Customer Gateway and Customer Registration Dashboard accounts for automated CRD
            submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "PENDING" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                To automate CRD submissions and assign PMB # tokens, we need your USPS credentials.
              </AlertDescription>
            </Alert>
          )}

          {status === "SUBMITTED" && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your credentials have been submitted and are pending RPA verification. This usually takes 1-2 business
                days.
              </AlertDescription>
            </Alert>
          )}

          {status === "VERIFIED" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your USPS integration is active! RPA will automatically submit CRD entries and assign PMB tokens.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            {status !== "VERIFIED" && (
              <Button onClick={() => setShowCredentialForm(true)} className="flex-1">
                {status === "PENDING" ? "Enter Credentials" : "Update Credentials"}
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowHelpModal(true)} className="flex-1">
              Need Help?
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Credential Form Modal */}
      <Dialog open={showCredentialForm} onOpenChange={setShowCredentialForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>USPS Credentials</DialogTitle>
            <DialogDescription>
              Enter your USPS Business Customer Gateway (BCG) and Customer Registration Dashboard (CRD) credentials
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* BCG Credentials */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Business Customer Gateway (BCG)</h3>
                <a
                  href="https://gateway.usps.com/eAdmin/view/signin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  Open BCG <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bcg_username">BCG Username</Label>
                <Input
                  id="bcg_username"
                  type="text"
                  value={formData.bcg_username}
                  onChange={(e) => setFormData({ ...formData, bcg_username: e.target.value })}
                  placeholder="your-bcg-username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bcg_password">BCG Password</Label>
                <div className="relative">
                  <Input
                    id="bcg_password"
                    type={showPasswords.bcg ? "text" : "password"}
                    value={formData.bcg_password}
                    onChange={(e) => setFormData({ ...formData, bcg_password: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, bcg: !showPasswords.bcg })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.bcg ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* CRD Credentials */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Customer Registration Dashboard (CRD)</h3>
                <a
                  href="https://reg.usps.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  Open CRD <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crd_username">CRD Username</Label>
                <Input
                  id="crd_username"
                  type="text"
                  value={formData.crd_username}
                  onChange={(e) => setFormData({ ...formData, crd_username: e.target.value })}
                  placeholder="your-crd-username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crd_password">CRD Password</Label>
                <div className="relative">
                  <Input
                    id="crd_password"
                    type={showPasswords.crd ? "text" : "password"}
                    value={formData.crd_password}
                    onChange={(e) => setFormData({ ...formData, crd_password: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, crd: !showPasswords.crd })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.crd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* RPA Password Reset Option */}
            <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg">
              <Checkbox
                id="allow_rpa"
                checked={formData.allow_rpa_password_reset}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, allow_rpa_password_reset: checked as boolean })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="allow_rpa" className="text-sm font-medium cursor-pointer">
                  Allow RPA to change passwords during automation
                </Label>
                <p className="text-xs text-gray-600">
                  We'll notify you via email if passwords need to be updated for security or compliance reasons
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Your credentials are encrypted and stored securely. They are only used by our RPA system to automate
                USPS CRD submissions on your behalf.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCredentialForm(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSubmitCredentials} disabled={loading}>
                {loading ? "Submitting..." : "Submit Credentials"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>USPS Integration Help</DialogTitle>
            <DialogDescription>How to set up your USPS credentials</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Don't have USPS accounts yet?</h3>
              <p className="text-sm text-gray-600 mb-3">
                You'll need to create accounts on both the Business Customer Gateway (BCG) and Customer Registration
                Dashboard (CRD).
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Business Customer Gateway (BCG)</span>
                  <a
                    href="https://gateway.usps.com/eAdmin/view/signin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center"
                  >
                    Sign Up <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Customer Registration Dashboard (CRD)</span>
                  <a
                    href="https://reg.usps.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center"
                  >
                    Sign Up <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Required Documents</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Business license or registration</li>
                <li>EIN (Employer Identification Number)</li>
                <li>Proof of business address</li>
                <li>CMRA license number</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Expected Timeline</h3>
              <p className="text-sm text-gray-600">
                USPS account creation typically takes 3-5 business days. Once approved, you can enter your credentials
                here.
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Need help creating your USPS accounts? Click "Request RPA Setup" and our team will guide you through the
                process.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowHelpModal(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowHelpModal(false)
                  // TODO: Implement RPA setup request
                  alert("RPA setup request submitted! Our team will contact you within 1 business day.")
                }}
              >
                Request RPA Setup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
