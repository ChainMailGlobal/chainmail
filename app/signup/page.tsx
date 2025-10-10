import { Suspense } from "react"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Complete your registration to access your dashboard</p>
        </div>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  )
}
