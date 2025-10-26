"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, Upload, CheckCircle, AlertCircle, Loader2, FileText, Camera } from "@/lib/icons"

interface InvitationData {
  success: boolean
  invitation_id: string
  first_name: string
  last_name: string
  email: string
  cmra_name: string
  cmra_address: string
}

export default function CompleteForm1583Page() {
  const [token, setToken] = useState<string | null>(null)
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [witnessMethod, setWitnessMethod] = useState<"remote" | "walk_in" | null>(null)
  const [id1File, setId1File] = useState<File | null>(null)
  const [id2File, setId2File] = useState<File | null>(null)
  const [signedDocFile, setSignedDocFile] = useState<File | null>(null)
  const [id1Url, setId1Url] = useState<string | null>(null)
  const [id2Url, setId2Url] = useState<string | null>(null)
  const [signedDocUrl, setSignedDocUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const id1InputRef = useRef<HTMLInputElement>(null)
  const id2InputRef = useRef<HTMLInputElement>(null)
  const signedDocInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tokenParam = params.get("token")

    if (!tokenParam) {
      setError("No invitation token provided")
      setLoading(false)
      return
    }

    setToken(tokenParam)
    fetchInvitationData(tokenParam)
  }, [])

  const fetchInvitationData = async (token: string) => {
    try {
      const response = await fetch(`/api/form1583/invitation?token=${token}`)

      if (!response.ok) {
        throw new Error("Invalid or expired invitation link")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to load invitation")
      }

      setInvitationData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invitation")
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async (file: File, type: "id1" | "id2" | "signed_doc"): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("kind", type === "signed_doc" ? "signed_form" : "photo_id")
    formData.append("case_id", invitationData?.invitation_id || "pending")

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload ${type}`)
    }

    const data = await response.json()
    return data.fileUrl || data.url
  }

  const handleFileSelect = async (file: File, type: "id1" | "id2" | "signed_doc") => {
    setUploading(true)
    setError(null)

    try {
      const url = await uploadFile(file, type)

      if (type === "id1") {
        setId1File(file)
        setId1Url(url)
      } else if (type === "id2") {
        setId2File(file)
        setId2Url(url)
      } else {
        setSignedDocFile(file)
        setSignedDocUrl(url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!invitationData || !token || !witnessMethod || !id1Url || !id2Url) {
      setError("Please complete all required fields")
      return
    }

    if (witnessMethod === "walk_in" && !signedDocUrl) {
      setError("Please upload the signed Form 1583")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/form1583/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitation_id: invitationData.invitation_id,
          token,
          id1_url: id1Url,
          id2_url: id2Url,
          witness_method: witnessMethod,
          signed_doc_url: witnessMethod === "walk_in" ? signedDocUrl : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Submission failed")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePrintForm = () => {
    window.open("/form1583-blank.pdf", "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your invitation...</p>
        </div>
      </div>
    )
  }

  if (error && !invitationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Return Home
          </a>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted!</h2>
          <p className="text-gray-600 mb-6">
            {witnessMethod === "remote"
              ? "Your Form 1583 has been submitted. You'll receive an email with next steps for scheduling your remote witness session."
              : "Your Form 1583 has been submitted for verification. You'll receive a confirmation email shortly."}
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Return Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Form 1583</h1>
          <p className="text-gray-600">Just a few more steps to get your mailbox set up</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* Pre-filled Information */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Your Information (Pre-filled)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={invitationData?.first_name || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={invitationData?.last_name || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={invitationData?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">CMRA Location</label>
                <input
                  type="text"
                  value={`${invitationData?.cmra_name} - ${invitationData?.cmra_address}`}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* ID Upload Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your IDs</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please upload two forms of identification (e.g., Driver's License, Passport, State ID)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ID 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo ID #1 *</label>
                <input
                  ref={id1InputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "id1")}
                  className="hidden"
                />
                <button
                  onClick={() => id1InputRef.current?.click()}
                  disabled={uploading || !!id1File}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {id1File ? (
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">{id1File.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">or use camera</p>
                    </div>
                  )}
                </button>
              </div>

              {/* ID 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo ID #2 *</label>
                <input
                  ref={id2InputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "id2")}
                  className="hidden"
                />
                <button
                  onClick={() => id2InputRef.current?.click()}
                  disabled={uploading || !!id2File}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {id2File ? (
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">{id2File.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">or use camera</p>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Witness Method Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Witness Method *</h3>
            <div className="space-y-3">
              <button
                onClick={() => setWitnessMethod("remote")}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  witnessMethod === "remote"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      witnessMethod === "remote" ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
                    }`}
                  >
                    {witnessMethod === "remote" && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Remote Witness (Recommended)</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Schedule a video call with our authorized witness. Complete everything from home in 10-15 minutes.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setWitnessMethod("walk_in")}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  witnessMethod === "walk_in"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      witnessMethod === "walk_in" ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
                    }`}
                  >
                    {witnessMethod === "walk_in" && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Walk-in Witness</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Print the form, visit the CMRA location to sign with a witness, then upload a photo of the signed
                      document.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Walk-in Instructions */}
          {witnessMethod === "walk_in" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Walk-in Instructions
              </h4>
              <ol className="space-y-2 text-sm text-gray-700 mb-4">
                <li className="flex gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Print the blank Form 1583 using the button below</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">2.</span>
                  <span>Visit {invitationData?.cmra_name} during business hours</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Sign the form in front of an authorized witness</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">4.</span>
                  <span>Take a clear photo of the signed document</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">5.</span>
                  <span>Upload the photo below</span>
                </li>
              </ol>

              <button
                onClick={handlePrintForm}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mb-4"
              >
                <FileText className="w-5 h-5" />
                Print Blank Form 1583
              </button>

              {/* Signed Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Signed Form *</label>
                <input
                  ref={signedDocInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "signed_doc")}
                  className="hidden"
                />
                <button
                  onClick={() => signedDocInputRef.current?.click()}
                  disabled={uploading || !!signedDocFile}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signedDocFile ? (
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">{signedDocFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Click to upload signed form</p>
                      <p className="text-xs text-gray-500 mt-1">Photo or PDF accepted</p>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={
              submitting ||
              uploading ||
              !witnessMethod ||
              !id1Url ||
              !id2Url ||
              (witnessMethod === "walk_in" && !signedDocUrl)
            }
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Form 1583
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By submitting, you agree to the USPS Form 1583 terms and authorize {invitationData?.cmra_name} to receive
            mail on your behalf.
          </p>
        </div>
      </div>
    </div>
  )
}
