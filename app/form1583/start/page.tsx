"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Shield } from "@/lib/icons"

export default function Form1583StartPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setError("No invitation token provided")
      return
    }

    // Call backend to validate token and create Supabase account
    const initializeInvitation = async () => {
      try {
        console.log("[v0] Validating invitation token:", token)

        const response = await fetch(`${process.env.NEXT_PUBLIC_AGENT_BACKEND_BASE || ""}/api/form1583/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to validate invitation")
        }

        const data = await response.json()
        console.log("[v0] Invitation validated:", data)

        // Redirect to dashboard with invitation_id and openChat flag
        const redirectUrl = `/dashboard?invitation_id=${data.invitation_id}&openChat=true`
        console.log("[v0] Redirecting to:", redirectUrl)

        setStatus("success")
        setTimeout(() => {
          router.push(redirectUrl)
        }, 1000)
      } catch (err) {
        console.error("[v0] Error initializing invitation:", err)
        setStatus("error")
        setError(err instanceof Error ? err.message : "Failed to process invitation")
      }
    }

    initializeInvitation()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>

        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Processing Your Invitation</h1>
            <p className="text-gray-600 mb-6">Please wait while we set up your account...</p>
            <div className="flex justify-center gap-2">
              <div
                className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Welcome!</h1>
            <p className="text-gray-600 mb-6">Redirecting you to your dashboard...</p>
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-3">Invalid Invitation</h1>
            <p className="text-gray-600 mb-6">{error || "This invitation link is invalid or has expired."}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Go to Homepage
            </button>
          </>
        )}
      </div>
    </div>
  )
}
