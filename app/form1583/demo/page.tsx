"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle2, Loader2, Download, AlertCircle } from "@/lib/icons"
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
