"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Calendar,
  Shield,
  AlertTriangle,
  TrendingUp,
  FileText,
  Settings,
  Activity,
  Database,
  Zap,
  AlertCircle,
  Timer,
  UserPlus,
  PlayCircle,
  Download,
  ArrowLeft,
  LogOut,
} from "lucide-react"
import { CustomerOnboardingHub } from "./customer-onboarding-hub"
import { USPSIntegrationCenter } from "./usps-integration-center"
import { ComplianceCommandCenter } from "./compliance-command-center"
import { BusinessAnalyticsDashboard } from "./business-analytics-dashboard"
import { signOut } from "@/lib/actions/auth-actions"

interface CMRALocation {
  id: string
  address: string
  totalCustomers: number
  complianceStatus: "compliant" | "warning" | "critical"
  crdDeadline?: string
  emergencyDeadline?: string
}

interface CMRADashboardProps {
  businessId?: string
  businessName?: string
  locations?: CMRALocation[]
}

export function CMRAgentDashboard({
  businessId = "biz_001",
  businessName = "Pacific Coast Mail Services",
  locations = [
    {
      id: "loc_001",
      address: "123 Harbor Blvd, Los Angeles, CA 90210",
      totalCustomers: 156,
      complianceStatus: "compliant",
      crdDeadline: "2025-03-15",
      emergencyDeadline: "2025-01-30",
    },
  ],
}: CMRADashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "customers" | "usps" | "compliance" | "analytics">(
    "dashboard",
  )
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
  }

  const demoMetrics = {
    totalRevenue: 24500,
    customerGrowthRate: 15,
    complianceRate: 94.2,
    automationSavings: 8200,
    monthlyCustomers: 47,
    pendingVerifications: 12,
    expiringSoon: 8,
    activeForwards: 34,
    crdCompliantCustomers: 142,
    emergencyProcessing: 3,
    rpaTasksCompleted: 89,
    systemUptime: 99.7,
  }

  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const crdDaysRemaining = calculateDaysRemaining(locations[0].crdDeadline || "2025-03-15")
  const emergencyDaysRemaining = calculateDaysRemaining(locations[0].emergencyDeadline || "2025-01-30")

  const navigationTabs = [
    { id: "dashboard", label: "Dashboard", shortLabel: "Home", icon: BarChart3 },
    { id: "customers", label: "Customer Management", shortLabel: "Customers", icon: Users },
    { id: "usps", label: "USPS Integration", shortLabel: "USPS", icon: Database },
    { id: "compliance", label: "Compliance Center", shortLabel: "Compliance", icon: Shield },
    { id: "analytics", label: "Business Analytics", shortLabel: "Analytics", icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/demo-v31")}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Return to Demo</span>
                <span className="sm:hidden">Demo</span>
              </Button>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{businessName}</h1>
                <p className="text-xs sm:text-sm text-slate-600">CMRA Operations Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hidden sm:flex">
                ✅ Platform Access Granted
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 sm:hidden">
                ✅ Active
              </Badge>
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden bg-transparent">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="bg-white border-b hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className="bg-white border-b md:hidden">
        <div className="container mx-auto px-4 py-3">
          <Select value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {(() => {
                  const currentTab = navigationTabs.find((tab) => tab.id === activeTab)
                  const Icon = currentTab?.icon || BarChart3
                  return (
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{currentTab?.shortLabel || currentTab?.label}</span>
                    </div>
                  )
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {navigationTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <SelectItem key={tab.id} value={tab.id}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.shortLabel}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* CRD Compliance Status */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-lg flex items-center">
                      <Database className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-blue-500" />
                      <span className="hidden sm:inline">CRD 9-Month Window</span>
                      <span className="sm:hidden">CRD Window</span>
                    </CardTitle>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                      {crdDaysRemaining} days
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Compliant Customers</span>
                      <span className="font-semibold">{demoMetrics.crdCompliantCustomers}/156</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(demoMetrics.crdCompliantCustomers / 156) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-slate-600">
                        Deadline: {new Date(locations[0].crdDeadline || "2025-03-15").toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Processing Status */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-lg flex items-center">
                      <AlertTriangle className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-orange-500" />
                      <span className="hidden sm:inline">Emergency 30-Day Processing</span>
                      <span className="sm:hidden">Emergency 30-Day</span>
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        emergencyDaysRemaining <= 7
                          ? "bg-red-50 text-red-700"
                          : emergencyDaysRemaining <= 14
                            ? "bg-orange-50 text-orange-700"
                            : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {emergencyDaysRemaining} days
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Emergency Cases</span>
                      <span className="font-semibold text-orange-600">{demoMetrics.emergencyProcessing}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(demoMetrics.emergencyProcessing / 10) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-slate-600">
                        Critical Deadline:{" "}
                        {new Date(locations[0].emergencyDeadline || "2025-01-30").toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center">
                    <TrendingUp className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Monthly Revenue</span>
                    <span className="sm:hidden">Revenue</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">
                    ${demoMetrics.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs sm:text-sm text-green-600">+{demoMetrics.customerGrowthRate}%</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center">
                    <Users className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Active Customers</span>
                    <span className="sm:hidden">Customers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{locations[0].totalCustomers}</div>
                  <p className="text-xs sm:text-sm text-blue-600">+{demoMetrics.monthlyCustomers} this month</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center">
                    <Shield className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Compliance Rate</span>
                    <span className="sm:hidden">Compliance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{demoMetrics.complianceRate}%</div>
                  <p className="text-xs sm:text-sm text-green-600">Above average</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center">
                    <Zap className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">RPA Tasks Completed</span>
                    <span className="sm:hidden">RPA Tasks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{demoMetrics.rpaTasksCompleted}</div>
                  <p className="text-xs sm:text-sm text-emerald-600">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <PlayCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-blue-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Common CMRA operations and workflows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Onboard New Customer
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                    <Zap className="h-4 w-4 mr-2" />
                    Run RPA Automation
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Process Batch Verifications
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Compliance Report
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Witness Sessions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Activity className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-green-500" />
                    System Health
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Real-time system status and connectivity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm">RPA Engine</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm">USPS BCG Portal</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm">CRD Database</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Synced
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm">AI Witness v3.1</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm">Blockchain Network</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {demoMetrics.systemUptime}% Uptime
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Clock className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-orange-500" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  {locations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{location.address}</p>
                        <p className="text-xs text-slate-600">Location</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">
                          CRD Deadline: {new Date(location.crdDeadline || "2025-03-15").toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium text-orange-600">
                          Emergency Deadline:{" "}
                          {new Date(location.emergencyDeadline || "2025-01-30").toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Activity className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-blue-500" />
                  Recent Activity Feed
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Real-time updates on customer onboarding, RPA tasks, and compliance events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "rpa_completed",
                      customer: "Sarah Johnson",
                      detail: "BCG account creation completed",
                      time: "2 hours ago",
                      status: "completed",
                    },
                    {
                      type: "compliance_alert",
                      customer: "Mike Chen",
                      detail: "ID expiration in 7 days",
                      time: "4 hours ago",
                      status: "warning",
                    },
                    {
                      type: "ai_witness",
                      customer: "Lisa Park",
                      detail: "V3 AI witness verification passed",
                      time: "6 hours ago",
                      status: "completed",
                    },
                    {
                      type: "crd_submission",
                      customer: "David Kim",
                      detail: "CRD form submitted to USPS",
                      time: "1 day ago",
                      status: "processing",
                    },
                    {
                      type: "emergency_processing",
                      customer: "Jennifer Wu",
                      detail: "Emergency 30-day processing initiated",
                      time: "1 day ago",
                      status: "urgent",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            activity.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : activity.status === "warning"
                                ? "bg-yellow-100 text-yellow-600"
                                : activity.status === "urgent"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {activity.status === "completed" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : activity.status === "warning" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : activity.status === "urgent" ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.customer}</p>
                          <p className="text-sm text-slate-600">{activity.detail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">{activity.time}</p>
                        <Badge
                          variant="outline"
                          className={
                            activity.status === "completed"
                              ? "bg-green-50 text-green-700"
                              : activity.status === "warning"
                                ? "bg-yellow-50 text-yellow-700"
                                : activity.status === "urgent"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-blue-50 text-blue-700"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "customers" && (
          <CustomerOnboardingHub
            cmraLocationId={locations[0].id}
            availableVerificationMethods={["v1", "v2", "v3"]}
            onCustomerCreated={(customer) => {
              console.log("New customer created:", customer)
              // Handle customer creation
            }}
          />
        )}

        {activeTab === "usps" && (
          <USPSIntegrationCenter
            cmraLocationId={locations[0].id}
            bcgStatus={{
              id: "bcg_001",
              accountNumber: "BCG-2024-7891",
              status: "active",
              lastSyncDate: "2025-01-27T10:30:00Z",
            }}
            crdStatus={{
              id: "crd_001",
              registrationNumber: "CRD-CA-2024-1234",
              registrationDate: "2024-06-15",
              nineMonthDeadline: "2025-03-15",
              submissionProgress: {
                total: 156,
                submitted: 142,
                pending: 14,
              },
            }}
          />
        )}

        {activeTab === "compliance" && <ComplianceCommandCenter cmraLocationId={locations[0].id} />}

        {activeTab === "analytics" && <BusinessAnalyticsDashboard cmraLocationId={locations[0].id} />}
      </div>
    </div>
  )
}
