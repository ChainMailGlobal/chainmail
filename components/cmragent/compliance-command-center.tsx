"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  TrendingUp,
  Users,
  Database,
  Timer,
  Bell,
  Download,
  Eye,
  RefreshCw,
} from "lucide-react"

interface ComplianceAlert {
  id: string
  type: "crd_deadline" | "id_expiration" | "form_missing" | "emergency_processing"
  customer: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  dueDate: string
  status: "active" | "resolved" | "snoozed"
}

interface ComplianceCommandCenterProps {
  cmraLocationId: string
}

export function ComplianceCommandCenter({ cmraLocationId }: ComplianceCommandCenterProps) {
  const [activeScenario, setActiveScenario] = useState<"crd_window" | "emergency">("crd_window")
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)

  const complianceAlerts: ComplianceAlert[] = [
    {
      id: "alert_001",
      type: "crd_deadline",
      customer: "Sarah Johnson",
      message: "CRD submission deadline approaching in 15 days",
      severity: "high",
      dueDate: "2025-02-15",
      status: "active",
    },
    {
      id: "alert_002",
      type: "id_expiration",
      customer: "Mike Chen",
      message: "Driver's license expires in 7 days",
      severity: "medium",
      dueDate: "2025-02-05",
      status: "active",
    },
    {
      id: "alert_003",
      type: "emergency_processing",
      customer: "Jennifer Wu",
      message: "Emergency 30-day processing deadline in 3 days",
      severity: "critical",
      dueDate: "2025-02-01",
      status: "active",
    },
    {
      id: "alert_004",
      type: "form_missing",
      customer: "David Kim",
      message: "PS Form 1583 signature required",
      severity: "medium",
      dueDate: "2025-02-10",
      status: "active",
    },
  ]

  const crdMetrics = {
    totalCustomers: 156,
    compliantCustomers: 142,
    pendingSubmissions: 14,
    daysRemaining: 47,
    completionRate: 91.0,
  }

  const emergencyMetrics = {
    activeCases: 3,
    completedToday: 2,
    pendingReview: 1,
    daysRemaining: 12,
    successRate: 94.5,
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <div className="flex space-x-4">
        <Button
          variant={activeScenario === "crd_window" ? "default" : "outline"}
          onClick={() => setActiveScenario("crd_window")}
          className="flex items-center space-x-2"
        >
          <Database className="h-4 w-4" />
          <span>CRD 9-Month Window</span>
        </Button>
        <Button
          variant={activeScenario === "emergency" ? "default" : "outline"}
          onClick={() => setActiveScenario("emergency")}
          className="flex items-center space-x-2"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Emergency 30-Day Processing</span>
        </Button>
      </div>

      {activeScenario === "crd_window" && (
        <div className="space-y-6">
          {/* CRD Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  Total Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{crdMetrics.totalCustomers}</div>
                <p className="text-sm text-slate-600">Registered at this location</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  CRD Compliant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{crdMetrics.compliantCustomers}</div>
                <p className="text-sm text-slate-600">{crdMetrics.completionRate}% completion rate</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Timer className="h-5 w-5 mr-2 text-orange-500" />
                  Days Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{crdMetrics.daysRemaining}</div>
                <p className="text-sm text-slate-600">Until CRD deadline</p>
              </CardContent>
            </Card>
          </div>

          {/* CRD Progress Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                CRD Submission Progress
              </CardTitle>
              <CardDescription>Track customer compliance status and submission timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Submitted to USPS</span>
                  <span className="text-sm text-slate-600">{crdMetrics.compliantCustomers} customers</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(crdMetrics.compliantCustomers / crdMetrics.totalCustomers) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">✓ {crdMetrics.compliantCustomers} Compliant</span>
                  <span className="text-orange-600">⏳ {crdMetrics.pendingSubmissions} Pending</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeScenario === "emergency" && (
        <div className="space-y-6">
          {/* Emergency Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  Active Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{emergencyMetrics.activeCases}</div>
                <p className="text-sm text-slate-600">Requiring immediate attention</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{emergencyMetrics.completedToday}</div>
                <p className="text-sm text-slate-600">{emergencyMetrics.successRate}% success rate</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Timer className="h-5 w-5 mr-2 text-orange-500" />
                  Critical Deadline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{emergencyMetrics.daysRemaining}</div>
                <p className="text-sm text-slate-600">Days until emergency deadline</p>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Processing Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Emergency Processing Queue
              </CardTitle>
              <CardDescription>High-priority cases requiring 30-day processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    customer: "Jennifer Wu",
                    reason: "Business relocation",
                    priority: "Critical",
                    dueDate: "2025-02-01",
                  },
                  { customer: "Robert Chen", reason: "Legal proceedings", priority: "High", dueDate: "2025-02-03" },
                  {
                    customer: "Maria Garcia",
                    reason: "Identity theft recovery",
                    priority: "High",
                    dueDate: "2025-02-05",
                  },
                ].map((case_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-slate-900">{case_.customer}</p>
                        <p className="text-sm text-slate-600">{case_.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-red-100 text-red-700 mb-1">
                        {case_.priority}
                      </Badge>
                      <p className="text-sm text-slate-600">Due: {case_.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compliance Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-orange-500" />
                Compliance Alerts
              </CardTitle>
              <CardDescription>Active alerts requiring attention</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceAlerts
              .filter((alert) => alert.status === "active")
              .map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedAlert === alert.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {alert.severity === "critical" ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : alert.severity === "high" ? (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{alert.customer}</p>
                        <p className="text-sm text-slate-600">{alert.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <p className="text-sm text-slate-600 mt-1">Due: {alert.dueDate}</p>
                    </div>
                  </div>

                  {selectedAlert === alert.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Action
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bell className="h-4 w-4 mr-2" />
                          Snooze Alert
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automated Actions</CardTitle>
            <CardDescription>Trigger compliance workflows and reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Compliance Scan
            </Button>
            <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Generate CRD Report
            </Button>
            <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              <Bell className="h-4 w-4 mr-2" />
              Send Deadline Reminders
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regulatory Updates</CardTitle>
            <CardDescription>Latest USPS compliance requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">DMM 508.1.8.1 Update</p>
                <p className="text-xs text-blue-700">New CRD submission requirements effective March 2025</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Emergency Processing</p>
                <p className="text-xs text-green-700">30-day processing guidelines updated</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium text-orange-900">ID Verification</p>
                <p className="text-xs text-orange-700">Enhanced biometric requirements coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
