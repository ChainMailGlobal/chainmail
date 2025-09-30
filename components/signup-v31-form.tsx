"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Shield, Zap, Copy, Eye, EyeOff, ArrowLeft } from "lucide-react"

export function SignupV31Form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/signup-v31", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus("success")
        setCredentials(result.credentials)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="bg-white hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-purple-600 to-emerald-600 text-white mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Exclusive v3.1 Preview
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Experience the Future of CMRA Compliance</h1>
          <p className="text-lg text-slate-600">
            Get exclusive access to MailboxHero v3.1 with patent-pending AI witness technology
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-purple-50 to-emerald-50">
            <CardTitle className="text-2xl text-slate-900">Request Demo Access</CardTitle>
            <CardDescription className="text-slate-600">
              Join the select group testing our revolutionary compliance platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {credentials ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">🎉 Demo Access Granted!</h3>
                  <p className="text-green-700 mb-4">
                    Your exclusive v3.1 demo credentials have been generated and sent to your email:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white p-3 rounded border">
                      <div>
                        <Label className="text-sm text-slate-600">Username</Label>
                        <p className="font-mono font-semibold text-slate-900">{credentials.username}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(credentials.username)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded border">
                      <div>
                        <Label className="text-sm text-slate-600">Password</Label>
                        <p className="font-mono font-semibold text-slate-900">
                          {showPassword ? credentials.password : "••••••••"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(credentials.password)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-green-600 mt-4">
                    ⏰ These credentials are valid for 24 hours and provide full access to all v3.1 features.
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => (window.location.href = "/demo-v31")}
                  className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white py-3"
                >
                  Access v3.1 Demo Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="Daniel Kaneshiro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="daniel@chainmail.global"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company" className="text-slate-700">
                      Company/CMRA
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="Resource Suites Hawaii"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-slate-700">
                      Role
                    </Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="CMRA Owner"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-3">What You'll Experience:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-slate-700">
                      <Shield className="w-4 h-4 text-emerald-600 mr-2" />
                      Patent-pending AI witness technology
                    </div>
                    <div className="flex items-center text-slate-700">
                      <Zap className="w-4 h-4 text-purple-600 mr-2" />
                      95%+ biometric accuracy with GPS verification
                    </div>
                    <div className="flex items-center text-slate-700">
                      <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                      CMID token minting and blockchain audit trails
                    </div>
                  </div>
                </div>

                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    Request submitted successfully! Generating your credentials...
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    Failed to submit request. Please try again or contact Daniel@chainmail.global directly.
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white py-3"
                >
                  {isSubmitting ? (
                    "Generating Credentials..."
                  ) : (
                    <>
                      Access v3.1 Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
