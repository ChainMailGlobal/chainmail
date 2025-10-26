"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2, Mail } from "@/lib/icons"

export default function TestInvitePage() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [magicLink, setMagicLink] = useState("")

  const sendTestInvite = async () => {
    if (!email || !firstName || !lastName) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")
    setSuccess(false)
    setMagicLink("")

    try {
      // Call the backend to create an invitation
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AGENT_BACKEND_BASE || "https://app.mailboxhero.pro"}/api/form1583/test-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            cmra_name: "Test CMRA Location",
            cmra_address: "123 Test St, Honolulu, HI 96815",
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to send invitation")
      }

      const data = await response.json()

      // Send the email using our Resend integration
      const emailResponse = await fetch("/api/email/send-test-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          token: data.token,
          cmraName: "Test CMRA Location",
        }),
      })

      if (!emailResponse.ok) {
        throw new Error("Failed to send email")
      }

      setSuccess(true)
      setMagicLink(`${window.location.origin}/form1583/complete?token=${data.token}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-blue-600" />
              Test Form 1583 Invitation
            </CardTitle>
            <CardDescription>
              Send yourself a test invitation email to try the complete Form 1583 workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Daniel"
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Kaneshiro"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <Button onClick={sendTestInvite} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Invitation
                  </>
                )}
              </Button>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

            {success && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Invitation Sent Successfully!
                  </div>
                  <p className="text-sm text-green-600">
                    Check your email inbox for the invitation. The email includes a magic link to complete Form 1583.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">Or click here to test directly:</p>
                  <a
                    href={magicLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {magicLink}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
