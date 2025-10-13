import { Suspense } from "react"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Registration</h1>
          <p className="text-muted-foreground">Set your password and check your email for the verification link</p>
        </div>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  )
}
