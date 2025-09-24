"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  Globe,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  RotateCcw,
  Download,
  ImageIcon,
  Zap,
  Settings,
  AlertCircle,
  Users,
  FileText,
  Camera,
  RefreshCw,
} from "lucide-react"

interface BCGAccount {
  id: string
  accountNumber?: string
  status: "pending" | "active" | "suspended"
  lastSyncDate?: string
}

interface CRDRegistration {
  id: string
  registrationNumber?: string
  registrationDate?: string
  nineMonthDeadline?: string
  submissionProgress: {
    total: number
    submitted: number
    pending: number
  }
}

interface RPATask {
  id: string
  type: "bcg_account_creation" | "crd_form_submission" | "address_verification" | "bulk_processing"
  customerName: string
  status: "pending" | "processing" | "completed" | "failed" | "retrying"
  processingTime?: number
  screenshots?: string[]
  errorMessage?: string
  attempts: number
  createdAt: string
}

interface USPSIntegrationCenterProps {
  cmraLocationId?: string
  bcgStatus?: BCGAccount
  crdStatus?: CRDRegistration
  activeTasks?: RPATask[]
}

export function USPSIntegrationCenter({
  cmraLocationId = "loc_001",
  bcgStatus = {
    id: "bcg_001",
    accountNumber: "BCG-2024-7891",
    status: "active",
    lastSyncDate: "2025-01-27T10:30:00Z",
  },
  crdStatus = {
    id: "crd_001",
    registrationNumber: "CRD-CA-2024-1234",
    registrationDate: "2024-06-15",
    nineMonthDeadline: "2025-03-15",
    submissionProgress: {
      total: 156,
      submitted: 142,
      pending: 14,
    },
  },
  activeTasks = [
    {
      id: "task_001",
      type: "bcg_account_creation",
      customerName: "Sarah Johnson",
      status: "completed",
      processingTime: 145,
      screenshots: ["bcg_login.png", "account_created.png"],
      attempts: 1,
      createdAt: "2025-01-27T08:15:00Z",
    },
    {
      id: "task_002",
      type: "crd_form_submission",
      customerName: "Mike Chen",
      status: "processing",
      attempts: 1,
      createdAt: "2025-01-27T09:45:00Z",
    },
    {
      id: "task_003",
      type: "address_verification",
      customerName: "Lisa Park",
      status: "failed",
      errorMessage: "USPS portal timeout - retrying in 5 minutes",
      attempts: 2,
      createdAt: "2025-01-27T09:30:00Z",
    },
  ],
}: USPSIntegrationCenterProps) {
  const [selectedTask, setSelectedTask] = useState<RPATask | null>(null)
  const [showScreenshots, setShowScreenshots] = useState(false)
  const [bulkProcessing, setBulkProcessing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "processing":
      case "pending":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "suspended":
      case "failed":
        return "bg-red-100 text-red-700 border-red-200"
      case "retrying":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
      case "pending":
        return <Clock className="h-4 w-4" />
      case "suspended":
      case "failed":
        return <AlertTriangle className="h-4 w-4" />
      case "retrying":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleRetryTask = (taskId: string) => {
    console.log(`Retrying task: ${taskId}`)
    // Simulate retry logic
  }

  const handleBulkAction = (action: string) => {
    setBulkProcessing(true)
    console.log(`Starting bulk action: ${action}`)
    setTimeout(() => setBulkProcessing(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">USPS Integration Center</h2>
          <p className="text-slate-600">Manage BCG and CRD integrations with unified RPA monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Activity className="h-3 w-3 mr-1" />
            All Systems Online
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Split Screen Layout - BCG and CRD */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* BCG Panel */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle className="flex items-center text-purple-700">
              <Globe className="h-5 w-5 mr-2" />
              Business Customer Gateway (BCG)
            </CardTitle>
            <CardDescription>USPS BCG portal integration and account management</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Status</span>
                <Badge className={getStatusColor(bcgStatus.status)}>
                  {getStatusIcon(bcgStatus.status)}
                  <span className="ml-1 capitalize">{bcgStatus.status}</span>
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Number</span>
                <span className="text-sm font-mono">{bcgStatus.accountNumber || "Not assigned"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Sync</span>
                <span className="text-sm text-slate-600">
                  {bcgStatus.lastSyncDate ? new Date(bcgStatus.lastSyncDate).toLocaleString() : "Never synced"}
                </span>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Create BCG Accounts
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Portal Data
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  BCG Setup Wizard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CRD Panel */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center text-blue-700">
              <Database className="h-5 w-5 mr-2" />
              Commercial Receiving Database (CRD)
            </CardTitle>
            <CardDescription>CRD registration and form submission management</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Registration Status</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <span className="ml-1">Active</span>
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Registration Number</span>
                <span className="text-sm font-mono">{crdStatus.registrationNumber}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">9-Month Deadline</span>
                <span className="text-sm text-orange-600 font-medium">
                  {new Date(crdStatus.nineMonthDeadline || "2025-03-15").toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Submission Progress</span>
                  <span className="font-medium">
                    {crdStatus.submissionProgress.submitted}/{crdStatus.submissionProgress.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(crdStatus.submissionProgress.submitted / crdStatus.submissionProgress.total) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-600">
                  {crdStatus.submissionProgress.pending} customers pending submission
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Submit CRD Forms
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Compliance Report
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  CRD Setup Wizard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unified RPA Task Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-emerald-500" />
                Unified RPA Task Queue
              </CardTitle>
              <CardDescription>Real-time monitoring of all USPS automation tasks</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                {activeTasks.filter((t) => t.status === "processing").length} Active
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowScreenshots(!showScreenshots)}
                className="bg-transparent"
              >
                <Camera className="h-4 w-4 mr-2" />
                Screenshots
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                  selectedTask?.id === task.id ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
                }`}
                onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : task.status === "processing"
                            ? "bg-blue-100 text-blue-600"
                            : task.status === "failed"
                              ? "bg-red-100 text-red-600"
                              : task.status === "retrying"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {getStatusIcon(task.status)}
                    </div>
                    <div>
                      <p className="font-medium">{task.customerName}</p>
                      <p className="text-sm text-slate-600 capitalize">
                        {task.type.replace(/_/g, " ")} • Attempt {task.attempts}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {task.processingTime && <span className="text-sm text-slate-600">{task.processingTime}s</span>}
                    <Badge className={getStatusColor(task.status)}>
                      <span className="capitalize">{task.status}</span>
                    </Badge>
                    {task.status === "failed" && (
                      <Button size="sm" variant="outline" onClick={() => handleRetryTask(task.id)}>
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>

                {selectedTask?.id === task.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Task Details</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Created:</span>
                            <span>{new Date(task.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Type:</span>
                            <span className="capitalize">{task.type.replace(/_/g, " ")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Attempts:</span>
                            <span>{task.attempts}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {task.errorMessage && (
                          <div>
                            <h4 className="font-medium mb-2 text-red-600">Error Details</h4>
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{task.errorMessage}</p>
                          </div>
                        )}
                        {task.screenshots && task.screenshots.length > 0 && showScreenshots && (
                          <div>
                            <h4 className="font-medium mb-2">Screenshots</h4>
                            <div className="flex space-x-2">
                              {task.screenshots.map((screenshot, index) => (
                                <div
                                  key={index}
                                  className="w-16 h-16 bg-slate-100 rounded border flex items-center justify-center"
                                >
                                  <ImageIcon className="h-6 w-6 text-slate-400" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unified Action Bar */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-500" />
            Bulk Operations
          </CardTitle>
          <CardDescription>Execute bulk actions across BCG and CRD systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button
              onClick={() => handleBulkAction("create_bcg_accounts")}
              disabled={bulkProcessing}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {bulkProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              Bulk BCG Creation
            </Button>
            <Button
              onClick={() => handleBulkAction("submit_crd_forms")}
              disabled={bulkProcessing}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {bulkProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Bulk CRD Submission
            </Button>
            <Button
              onClick={() => handleBulkAction("verify_addresses")}
              disabled={bulkProcessing}
              variant="outline"
              className="bg-white"
            >
              {bulkProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Address Verification
            </Button>
            <Button
              onClick={() => handleBulkAction("generate_reports")}
              disabled={bulkProcessing}
              variant="outline"
              className="bg-white"
            >
              {bulkProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export Reports
            </Button>
          </div>

          {bulkProcessing && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-700 font-medium">Processing bulk operation...</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                This may take several minutes depending on the number of records.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
