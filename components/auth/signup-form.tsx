"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, Loader2, CheckCircle2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"

export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()

      if (!supabase) {
        setError("Authentication service is not available")
        setIsLoading(false)
        return
      }

      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setError("Signup failed. Please try again.")
        setIsLoading(false)
        return
      }

      // Create user profile in users table
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: formData.email,
        full_name: formData.fullName,
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("[v0] Profile creation error:", profileError)
        // Continue anyway - the auth account was created
      }

      setSuccess(true)
      setIsLoading(false)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      console.error("[v0] Signup error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
            <p className="text-slate-600 mb-4">
              Your account has been successfully created. Please check your email to verify your account.
            </p>
            <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/")} className="bg-white hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <Card className="shadow-xl border-0">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-50 to-emerald-50">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-full shadow-md">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-slate-900">Create Your Account</CardTitle>
          <CardDescription className="text-slate-600">Sign up to access your Form 1583 dashboard</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-slate-700">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="mt-1"
                placeholder="John Doe"
                disabled={isLoading}
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
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1"
                placeholder="••••••••"
                disabled={isLoading}
                minLength={8}
              />
              <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-slate-700">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="mt-1"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <button onClick={() => router.push("/login")} className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
