"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const handleAuthCallback = async () => {
      const code = searchParams.get("code")
      const token = searchParams.get("token")

      if (code) {
        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error("[v0] Auth callback error:", error)
          router.push("/?error=auth_failed")
          return
        }

        // Check if user has Form 1583 token
        if (token) {
          // Redirect to dashboard with chat open and token
          router.push(`/dashboard?openChat=true&form1583Token=${token}`)
        } else {
          // Regular auth callback - go to dashboard
          router.push("/dashboard?openChat=true")
        }
      } else {
        // No code, redirect to home
        router.push("/")
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}
