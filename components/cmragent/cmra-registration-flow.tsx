"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Camera,
  CheckCircle,
  Upload,
  FileText,
  Shield,
  User,
  Building,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Scan,
  Download,
} from "lucide-react"

type RegistrationStep =
  | "account-creation"
  | "id-capture"
  | "rbac-assignment"
  | "form-generation"
  | "physical-execution"
  | "upload-verification"
  | "dashboard-access"

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  emailConfirm: string
  password: string
  passwordConfirm: string
  role: "owner" | "manager" | "employee" | ""
  photoId: {
    type: string
    file: File | null
    extractedData: any
  }
  addressId: {
    type: string
    file: File | null
    extractedData: any
  }
  form1583aGenerated: boolean
  form1583aUrl: string
  executedFormUploaded: boolean
  missingFields: string[]
}

export function CMRARegistrationFlow() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("account-creation")
  const [progress, setProgress] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrScanning, setOcrScanning] = useState(false)

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    emailConfirm: "",
    password: "",
    passwordConfirm: "",
    role: "",
    photoId: {
      type: "",
      file: null,
      extractedData: null,
    },
    addressId: {
      type: "",
      file: null,
      extractedData: null,
    },
    form1583aGenerated: false,
    form1583aUrl: "",
    executedFormUploaded: false,
    missingFields: [],
  })

  const steps = [
    { id: "account-creation", label: "Account", icon: User },
    { id: "id-capture", label: "ID Capture", icon: Camera },
    { id: "rbac-assignment", label: "Role", icon: Shield },
    { id: "form-generation", label: "Form 1583-A", icon: FileText },
    { id: "physical-execution", label: "Execution", icon: Upload },
    { id: "upload-verification", label: "Upload", icon: CheckCircle },
    { id: "dashboard-access", label: "Dashboard", icon: Building },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const photoIdTypes = [
    { value: "drivers_license", label: "Driver's License" },
    { value: "passport", label: "Passport" },
    { value: "state_id", label: "State ID" },
    { value: "military_id", label: "Military ID" },
  ]

  const addressIdTypes = [
    { value: "utility_bill", label: "Utility Bill" },
    { value: "lease_agreement", label: "Lease Agreement" },
    { value: "bank_statement", label: "Bank Statement" },
    { value: "mortgage_statement", label: "Mortgage Statement" },
  ]

  const handleOCRScan = async (idType: "photo" | "address") => {
    setOcrScanning(true)

    // Simulate OCR processing with ChatGPT AI
    setTimeout(() => {
      const mockExtractedData = {
        name: "Sarah Johnson",
        address: "1234 Pacific Ave",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        idNumber: "D1234567",
        dateOfBirth: "1985-03-15",
      }

      if (idType === "photo") {
        setRegistrationData((prev) => ({
          ...prev,
          photoId: {
            ...prev.photoId,
            extractedData: mockExtractedData,
          },
          firstName: mockExtractedData.name.split(" ")[0],
          lastName: mockExtractedData.name.split(" ")[1],
        }))
      } else {
        setRegistrationData((prev) => ({
          ...prev,
          addressId: {
            ...prev.addressId,
            extractedData: mockExtractedData,
          },
        }))
      }

      setOcrScanning(false)
    }, 2000)
  }

  const handleGenerateForm1583A = async () => {
    setIsProcessing(true)

    // Simulate form generation
    setTimeout(() => {
      setRegistrationData((prev) => ({
        ...prev,
        form1583aGenerated: true,
        form1583aUrl: "/api/forms/1583a-preview.pdf",
      }))
      setIsProcessing(false)
    }, 1500)
  }

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id as RegistrationStep)
      setProgress(((currentStepIndex + 2) / steps.length) * 100)
    }
  }

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id as RegistrationStep)
      setProgress((currentStepIndex / steps.length) * 100)
    }
  }

  const AccountCreationStep = () => (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Create Your CMRA Account</CardTitle>
        <CardDescription className="text-center text-base">
          Start your journey to USPS-compliant operations
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={registrationData.firstName}
              onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
              placeholder="Enter first name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={registrationData.lastName}
              onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
              placeholder="Enter last name"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              value={registrationData.email}
              onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
              placeholder="your.email@example.com"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="emailConfirm">Confirm Email Address</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="emailConfirm"
              type="email"
              value={registrationData.emailConfirm}
              onChange={(e) => setRegistrationData({ ...registrationData, emailConfirm: e.target.value })}
              placeholder="Confirm your email"
              className="pl-10"
            />
          </div>
          {registrationData.email &&
            registrationData.emailConfirm &&
            registrationData.email !== registrationData.emailConfirm && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Emails do not match
              </p>
            )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={registrationData.password}
              onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
              placeholder="Create a strong password"
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="passwordConfirm">Confirm Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="passwordConfirm"
              type={showPasswordConfirm ? "text" : "password"}
              value={registrationData.passwordConfirm}
              onChange={(e) => setRegistrationData({ ...registrationData, passwordConfirm: e.target.value })}
              placeholder="Confirm your password"
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {registrationData.password &&
            registrationData.passwordConfirm &&
            registrationData.password !== registrationData.passwordConfirm && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Passwords do not match
              </p>
            )}
        </div>

        <Button
          onClick={handleNextStep}
          disabled={
            !registrationData.firstName ||
            !registrationData.lastName ||
            !registrationData.email ||
            !registrationData.emailConfirm ||
            registrationData.email !== registrationData.emailConfirm ||
            !registrationData.password ||
            !registrationData.passwordConfirm ||
            registrationData.password !== registrationData.passwordConfirm
          }
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          Continue to ID Capture
        </Button>
      </CardContent>
    </Card>
  )

  const IDCaptureStep = () => (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">ID Selection and Capture</CardTitle>
        <CardDescription className="text-center text-base">
          AI-powered OCR will extract your information automatically
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Required Documents
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• One photo ID (Driver's License, Passport, State ID, or Military ID)</li>
            <li>• One address verification (Utility Bill, Lease, Bank Statement, or Mortgage)</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="photoIdType">Photo ID Type</Label>
            <Select
              value={registrationData.photoId.type}
              onValueChange={(value) =>
                setRegistrationData({
                  ...registrationData,
                  photoId: { ...registrationData.photoId, type: value },
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select photo ID type" />
              </SelectTrigger>
              <SelectContent>
                {photoIdTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            {ocrScanning ? (
              <div className="space-y-4">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-slate-600">Scanning document with AI OCR...</p>
              </div>
            ) : registrationData.photoId.extractedData ? (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">OCR Extraction Complete</h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <div>Name: {registrationData.photoId.extractedData.name}</div>
                    <div>ID Number: {registrationData.photoId.extractedData.idNumber}</div>
                    <div>DOB: {registrationData.photoId.extractedData.dateOfBirth}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Camera className="h-12 w-12 text-slate-400 mx-auto" />
                <div>
                  <p className="text-sm text-slate-600 mb-2">Capture or upload your photo ID</p>
                  <Button
                    onClick={() => handleOCRScan("photo")}
                    disabled={!registrationData.photoId.type}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    Start Camera Capture
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="addressIdType">Address Verification Type</Label>
            <Select
              value={registrationData.addressId.type}
              onValueChange={(value) =>
                setRegistrationData({
                  ...registrationData,
                  addressId: { ...registrationData.addressId, type: value },
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select address verification type" />
              </SelectTrigger>
              <SelectContent>
                {addressIdTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            {registrationData.addressId.extractedData ? (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Address Verified</h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <div>{registrationData.addressId.extractedData.address}</div>
                    <div>
                      {registrationData.addressId.extractedData.city}, {registrationData.addressId.extractedData.state}{" "}
                      {registrationData.addressId.extractedData.zip}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Camera className="h-12 w-12 text-slate-400 mx-auto" />
                <div>
                  <p className="text-sm text-slate-600 mb-2">Capture or upload address verification</p>
                  <Button
                    onClick={() => handleOCRScan("address")}
                    disabled={!registrationData.addressId.type}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    Start Camera Capture
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handlePreviousStep} variant="outline" className="flex-1 bg-transparent">
            Previous
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={!registrationData.photoId.extractedData || !registrationData.addressId.extractedData}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Continue to Role Assignment
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const RBACAssignmentStep = () => (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-emerald-50">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Role Assignment</CardTitle>
        <CardDescription className="text-center text-base">
          Select your role for CMRA platform access control
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          <div
            onClick={() => setRegistrationData({ ...registrationData, role: "owner" })}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              registrationData.role === "owner"
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">Owner</h4>
              {registrationData.role === "owner" && <CheckCircle className="h-5 w-5 text-emerald-600" />}
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Full administrative access to all CMRA operations, compliance tools, and client management
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Full Access</Badge>
              <Badge variant="secondary">Client Management</Badge>
              <Badge variant="secondary">Compliance Tools</Badge>
              <Badge variant="secondary">Financial Reports</Badge>
            </div>
          </div>

          <div
            onClick={() => setRegistrationData({ ...registrationData, role: "manager" })}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              registrationData.role === "manager"
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">Manager</h4>
              {registrationData.role === "manager" && <CheckCircle className="h-5 w-5 text-emerald-600" />}
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Manage daily operations, client onboarding, and compliance workflows
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Operations</Badge>
              <Badge variant="secondary">Client Onboarding</Badge>
              <Badge variant="secondary">Compliance</Badge>
            </div>
          </div>

          <div
            onClick={() => setRegistrationData({ ...registrationData, role: "employee" })}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              registrationData.role === "employee"
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">Employee</h4>
              {registrationData.role === "employee" && <CheckCircle className="h-5 w-5 text-emerald-600" />}
            </div>
            <p className="text-sm text-slate-600 mb-3">Basic access for front-desk operations and customer service</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Customer Service</Badge>
              <Badge variant="secondary">Basic Operations</Badge>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handlePreviousStep} variant="outline" className="flex-1 bg-transparent">
            Previous
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={!registrationData.role}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Continue to Form Generation
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const FormGenerationStep = () => (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Form 1583-A Generation</CardTitle>
        <CardDescription className="text-center text-base">
          Auto-generated with your verified information
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {!registrationData.form1583aGenerated ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Form Preview Data</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <strong>Name:</strong> {registrationData.firstName} {registrationData.lastName}
                </div>
                <div>
                  <strong>Email:</strong> {registrationData.email}
                </div>
                <div>
                  <strong>ID Number:</strong> {registrationData.photoId.extractedData?.idNumber}
                </div>
                <div>
                  <strong>Role:</strong> {registrationData.role?.toUpperCase()}
                </div>
                <div className="md:col-span-2">
                  <strong>Address:</strong> {registrationData.addressId.extractedData?.address},{" "}
                  {registrationData.addressId.extractedData?.city}, {registrationData.addressId.extractedData?.state}{" "}
                  {registrationData.addressId.extractedData?.zip}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleGenerateForm1583A}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-700 px-8"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Generating Form...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Form 1583-A PDF
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h4 className="font-semibold text-green-900">Form 1583-A Generated Successfully</h4>
              </div>
              <p className="text-sm text-green-800 mb-4">
                Your pre-filled Form 1583-A has been generated and emailed to {registrationData.email}
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Download Form 1583-A PDF
              </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Next Steps Required
              </h4>
              <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
                <li>Print the Form 1583-A PDF</li>
                <li>Visit your local USPS station manager</li>
                <li>Obtain verification and counter-signature</li>
                <li>Take a photo of the executed form</li>
                <li>Return here to upload the photo</li>
              </ol>
            </div>

            <div className="flex space-x-4">
              <Button onClick={handlePreviousStep} variant="outline" className="flex-1 bg-transparent">
                Previous
              </Button>
              <Button onClick={handleNextStep} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Continue to Execution Instructions
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )

  const PhysicalExecutionStep = () => (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Physical Execution Required</CardTitle>
        <CardDescription className="text-center text-base">
          USPS compliance requires in-person verification
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <h4 className="font-semibold text-red-900 mb-4 text-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Critical Compliance Step
          </h4>
          <p className="text-red-800 mb-4">
            Platform access will NOT be granted until you complete the physical execution and upload the signed form.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 mb-1">Print Your Form</h5>
              <p className="text-sm text-slate-600">Download and print the Form 1583-A PDF that was emailed to you</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 mb-1">Visit USPS Station Manager</h5>
              <p className="text-sm text-slate-600">
                Bring your printed form and photo ID to your local USPS station manager for verification
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 mb-1">Obtain Counter-Signature</h5>
              <p className="text-sm text-slate-600">
                The station manager will verify your identity and counter-sign the form
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              4
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 mb-1">Photograph the Executed Form</h5>
              <p className="text-sm text-slate-600">
                Use your mobile device to take a clear photo of the signed and counter-signed form
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              5
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 mb-1">Station Manager Keeps Original</h5>
              <p className="text-sm text-slate-600">
                The physical original stays with the station manager for USPS records
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This process typically takes 15-30 minutes at the USPS station. Make sure to bring
            valid photo identification.
          </p>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handlePreviousStep} variant="outline" className="flex-1 bg-transparent">
            Previous
          </Button>
          <Button onClick={handleNextStep} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            I Understand - Continue to Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const UploadVerificationStep = () => (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Upload Executed Form</CardTitle>
        <CardDescription className="text-center text-base">
          Upload your signed and counter-signed Form 1583-A
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {!registrationData.executedFormUploaded ? (
          <>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
              <Upload className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h4 className="font-semibold text-slate-900 mb-2">Upload Executed Form Photo</h4>
              <p className="text-sm text-slate-600 mb-4">
                Take a clear photo of your signed Form 1583-A with station manager counter-signature
              </p>
              <Button
                onClick={() => setRegistrationData({ ...registrationData, executedFormUploaded: true })}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo / Upload File
              </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-900 mb-2">Photo Requirements:</h5>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li>All text must be clearly readable</li>
                <li>Both your signature and station manager signature visible</li>
                <li>No glare or shadows obscuring text</li>
                <li>Entire form visible in frame</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h4 className="font-semibold text-green-900">Form Uploaded Successfully</h4>
              </div>
              <p className="text-sm text-green-800">
                Your executed Form 1583-A has been uploaded and is being verified. You will receive confirmation within
                24 hours.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">What Happens Next?</h4>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Our compliance team reviews your uploaded form</li>
                <li>Station manager signature is verified</li>
                <li>Your account is marked as fully verified</li>
                <li>You receive email confirmation with dashboard access</li>
              </ol>
            </div>

            <Button onClick={handleNextStep} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Complete Registration
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )

  const DashboardAccessStep = () => (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-3xl text-center text-green-900">Registration Complete!</CardTitle>
        <CardDescription className="text-center text-lg">
          Welcome to CMRAgent - Your CMRA Operations Platform
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3">Account Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Name:</span>
              <span className="font-semibold">
                {registrationData.firstName} {registrationData.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="font-semibold">{registrationData.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Role:</span>
              <span className="font-semibold">{registrationData.role?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge className="bg-yellow-100 text-yellow-800">Pending Verification</Badge>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Welcome Email Sent
          </h4>
          <p className="text-sm text-blue-800 mb-3">
            We've sent a welcome email to <strong>{registrationData.email}</strong> with:
          </p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Standard Operating Procedures (SOP)</li>
            <li>Onboarding instructions</li>
            <li>Link to client-facing Form 1583 digital experience (V3)</li>
            <li>Dashboard access credentials (once verified)</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-900 mb-3">Next Steps:</h4>
          <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
            <li>Check your email for welcome message and SOP</li>
            <li>Complete the digital 1583 workflow as a customer (training requirement)</li>
            <li>Wait for verification confirmation (typically within 24 hours)</li>
            <li>Access your CMRAgent dashboard once verified</li>
          </ol>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => (window.location.href = "/cmragent")}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled
          >
            <Building className="h-4 w-4 mr-2" />
            Access Dashboard (Available After Verification)
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="outline" className="w-full">
            Return to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">CMRA Registration & Setup</h1>
          <p className="text-lg text-slate-600">Complete your USPS-compliant CMRA onboarding</p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStepIndex
              const isComplete = index < currentStepIndex

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center min-w-[80px] ${
                    isActive ? "opacity-100" : isComplete ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isComplete
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isComplete ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs text-center text-slate-600">{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {currentStep === "account-creation" && <AccountCreationStep />}
        {currentStep === "id-capture" && <IDCaptureStep />}
        {currentStep === "rbac-assignment" && <RBACAssignmentStep />}
        {currentStep === "form-generation" && <FormGenerationStep />}
        {currentStep === "physical-execution" && <PhysicalExecutionStep />}
        {currentStep === "upload-verification" && <UploadVerificationStep />}
        {currentStep === "dashboard-access" && <DashboardAccessStep />}
      </div>
    </div>
  )
}
