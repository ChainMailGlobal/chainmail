"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle2, Loader2, Download, AlertCircle, FileText } from "@/lib/icons"
import { put } from "@vercel/blob"

export default function Form1583DemoPage() {
  const [id1File, setId1File] = useState<File | null>(null)
  const [id2File, setId2File] = useState<File | null>(null)
  const [id1Preview, setId1Preview] = useState<string | null>(null)
  const [id2Preview, setId2Preview] = useState<string | null>(null)
  const [witnessMethod, setWitnessMethod] = useState<"remote" | "walk_in">("remote")
  const [signedDocFile, setSignedDocFile] = useState<File | null>(null)
  const [signedDocPreview, setSignedDocPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sample pre-filled data
  const invitationData = {
    customer_name: "Daniel Kaneshiro",
    customer_email: "creative808@gmail.com",
    cmra_name: "Aloha Mail Services",
    cmra_address: "123 Kalakaua Ave, Honolulu, HI 96815",
    cmra_phone: "(808) 555-1234",
  }

  const handleFileSelect = (file: File, setFile: (file: File) => void, setPreview: (url: string) => void) => {
    setFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    setError(null)

    // Validation
    if (!id1File || !id2File) {
      setError("Please upload both ID documents")
      return
    }

    if (witnessMethod === "walk_in" && !signedDocFile) {
      setError("Please upload the signed Form 1583 document")
      return
    }

    setUploading(true)

    try {
      // Upload ID files to Blob storage
      const id1Blob = await put(`form1583/demo/id1-${Date.now()}.jpg`, id1File, {
        access: "public",
      })
      const id2Blob = await put(`form1583/demo/id2-${Date.now()}.jpg`, id2File, {
        access: "public",
      })

      let signedDocUrl = null
      if (witnessMethod === "walk_in" && signedDocFile) {
        const signedDocBlob = await put(`form1583/demo/signed-${Date.now()}.pdf`, signedDocFile, {
          access: "public",
        })
        signedDocUrl = signedDocBlob.url
      }

      // Simulate API call (in demo mode, we just log the data)
      console.log("[v0] Demo submission:", {
        customer_name: invitationData.customer_name,
        customer_email: invitationData.customer_email,
        id1_url: id1Blob.url,
        id2_url: id2Blob.url,
        witness_method: witnessMethod,
        signed_doc_url: signedDocUrl,
      })

      // Show success
      setSubmitted(true)
    } catch (err) {
      console.error("[v0] Demo submission error:", err)
      setError("Failed to upload files. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Form Submitted Successfully!</CardTitle>
            <CardDescription>
              This is a demo submission. In production, the customer would receive a confirmation email with their
              completed Form 1583.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Demo Banner */}
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Demo Mode:</strong> This is a preview of the Form 1583 completion page. In production, customers
            access this via a secure invitation link.
          </AlertDescription>
        </Alert>

        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              What You Need to Know
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2">📋 What is Form 1583?</h3>
              <p className="text-sm text-gray-700">
                Form 1583 is a federal requirement that authorizes your CMRA (Commercial Mail Receiving Agency) to
                receive mail on your behalf. This is a standard USPS compliance process required by law.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2">⏱️ How Long Does This Take?</h3>
              <p className="text-sm text-gray-700">
                <strong>10-15 minutes total.</strong> Upload your IDs (2 min), choose witness method (1 min), and
                complete verification (7-12 min depending on method chosen).
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3">✅ Step-by-Step Process:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">1.</span>
                  <span>
                    <strong>Upload 2 Photo IDs</strong> - Driver's License, Passport, State ID, or Military ID
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">2.</span>
                  <span>
                    <strong>Review Pre-filled Info</strong> - Your name, email, and CMRA location are already filled in
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">3.</span>
                  <span>
                    <strong>Choose Witness Method</strong> - Remote video call (recommended) or walk-in at CMRA location
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">4.</span>
                  <span>
                    <strong>Complete Verification</strong> - Quick identity verification with authorized witness
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Recommended: Remote AI Witness
              </h3>
              <p className="text-sm text-gray-700">
                Complete everything from home via video call. No appointment needed, no travel required. Our AI-powered
                system guides you through the entire process in under 15 minutes.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h3 className="font-semibold text-gray-900 mb-2">⚠️ Important Tips:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  • Ensure your IDs are <strong>clear and legible</strong> (no glare or shadows)
                </li>
                <li>
                  • All <strong>four corners</strong> of each ID must be visible in the photo
                </li>
                <li>
                  • IDs must be <strong>current and not expired</strong>
                </li>
                <li>
                  • Use <strong>color photos</strong> (not black and white)
                </li>
                <li>
                  • Accepted formats: <strong>JPG, PNG, or PDF</strong>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your USPS Form 1583</CardTitle>
            <CardDescription>Upload your identification documents to complete your mailbox application</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Pre-filled Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={invitationData.customer_name} disabled className="bg-gray-50" />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input value={invitationData.customer_email} disabled className="bg-gray-50" />
                </div>
              </div>
            </div>

            {/* CMRA Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Your Mailbox Location</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>CMRA Name</Label>
                  <Input value={invitationData.cmra_name} disabled className="bg-gray-50" />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={invitationData.cmra_address} disabled className="bg-gray-50" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={invitationData.cmra_phone} disabled className="bg-gray-50" />
                </div>
              </div>
            </div>

            {/* ID Upload Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Upload Identification Documents</h3>
              <p className="text-sm text-gray-600">
                Please upload two forms of identification (e.g., Driver's License, Passport, State ID)
              </p>

              {/* ID 1 Upload */}
              <div>
                <Label>Primary ID Document</Label>
                <div className="mt-2">
                  {id1Preview ? (
                    <div className="relative">
                      <img
                        src={id1Preview || "/placeholder.svg"}
                        alt="ID 1 Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setId1File(null)
                          setId1Preview(null)
                        }}
                        className="absolute top-2 right-2"
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileSelect(file, setId1File, setId1Preview)
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* ID 2 Upload */}
              <div>
                <Label>Secondary ID Document</Label>
                <div className="mt-2">
                  {id2Preview ? (
                    <div className="relative">
                      <img
                        src={id2Preview || "/placeholder.svg"}
                        alt="ID 2 Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setId2File(null)
                          setId2Preview(null)
                        }}
                        className="absolute top-2 right-2"
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileSelect(file, setId2File, setId2Preview)
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Witness Method Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Choose Witness Method</h3>
              <RadioGroup value={witnessMethod} onValueChange={(v) => setWitnessMethod(v as any)}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="remote" id="remote" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="remote" className="font-medium cursor-pointer">
                      Remote AI Witness (Recommended)
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Complete the witness process online with AI-guided video verification. Fast and convenient.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="walk_in" id="walk_in" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="walk_in" className="font-medium cursor-pointer">
                      Walk-in at CMRA Location
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Print the form, sign it in person at the CMRA location, and upload the signed document.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Walk-in Instructions */}
            {witnessMethod === "walk_in" && (
              <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold">Walk-in Instructions</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Download and print the pre-filled Form 1583</li>
                  <li>Visit {invitationData.cmra_name} during business hours</li>
                  <li>Sign the form in front of a CMRA representative</li>
                  <li>Upload the signed document below</li>
                </ol>

                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download Form 1583
                </Button>

                {/* Signed Document Upload */}
                <div>
                  <Label>Upload Signed Form 1583</Label>
                  <div className="mt-2">
                    {signedDocPreview ? (
                      <div className="relative">
                        <div className="w-full p-4 border rounded-lg bg-white">
                          <div className="flex items-center space-x-3">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                            <div className="flex-1">
                              <p className="font-medium">Signed document uploaded</p>
                              <p className="text-sm text-gray-600">{signedDocFile?.name}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSignedDocFile(null)
                                setSignedDocPreview(null)
                              }}
                            >
                              Change
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Upload signed PDF or photo</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setSignedDocFile(file)
                              setSignedDocPreview(file.name)
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button onClick={handleSubmit} disabled={uploading} className="w-full" size="lg">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Form 1583
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
