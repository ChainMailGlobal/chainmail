"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { USPSIntegrationCard } from "./usps-integration-card"
import {
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Shield,
  AlertTriangle,
  TrendingUp,
  Settings,
  Activity,
  AlertCircle,
  ArrowLeft,
  LogOut,
} from "lucide-react"
import { CustomerOnboardingHub } from "./customer-onboarding-hub"
import { ComplianceCommandCenter } from "./compliance-command-center"
import { BusinessAnalyticsDashboard } from "./business-analytics-dashboard"
import { signOut } from "@/lib/actions/auth-actions"

interface CMRADashboardProps {
  data: {
    agent: {
      id: string
      businessName: string
      licenseNumber: string
      isVerified: boolean
    }
    metrics: {
      totalRevenue: number
      totalCustomers: number
      newCustomersThisMonth: number
      complianceRate: number
      totalSessions: number
      completedSessions: number
      inProgressSessions: number
      scheduledSessions: number
    }
    customers: any[]
    sessions: any[]
    alerts: any[]
    recentEvents: any[]
  }
}

export function CMRAgentDashboard({ data }: CMRADashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "customers" | "usps" | "compliance" | "analytics">(
    "dashboard",
  )

  const handleLogout = async () => {
    await signOut()
  }

  const navigationTabs = [
    { id: "dashboard", label: "Dashboard", shortLabel: "Home", icon: BarChart3 },
    { id: "customers", label: "Customer Management", shortLabel: "Customers", icon: Users },
    { id: "compliance", label: "Compliance Center", shortLabel: "Compliance", icon: Shield },
    { id: "analytics", label: "Business Analytics", shortLabel: "Analytics", icon: TrendingUp },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

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
                onClick={() => (window.location.href = "/")}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{data.agent.businessName}</h1>
                <p className="text-xs sm:text-sm text-slate-600">CMRA Operations Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {data.agent.isVerified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hidden sm:flex">
                  ✅ Verified
                </Badge>
              )}
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
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
            {/* USPS Integration Card */}
            <USPSIntegrationCard orgId={data.agent.id} />

            {/* Key Metrics */}
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
                    ${data.metrics.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs sm:text-sm text-green-600">
                    {data.metrics.completedSessions} completed sessions
                  </p>
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
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{data.metrics.totalCustomers}</div>
                  <p className="text-xs sm:text-sm text-blue-600">+{data.metrics.newCustomersThisMonth} this month</p>
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
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{data.metrics.complianceRate}%</div>
                  <p className="text-xs sm:text-sm text-green-600">{data.metrics.completedSessions} verified</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center">
                    <Activity className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Total Sessions</span>
                    <span className="sm:hidden">Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{data.metrics.totalSessions}</div>
                  <p className="text-xs sm:text-sm text-emerald-600">{data.metrics.inProgressSessions} in progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            {data.alerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-orange-500" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.alerts.slice(0, 5).map((alert, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        alert.severity === "warning"
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {alert.severity === "warning" ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="text-sm">{alert.message}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          alert.severity === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                        }
                      >
                        {alert.type}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Activity className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-blue-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Latest session events and customer interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.recentEvents.length > 0 ? (
                  <div className="space-y-3">
                    {data.recentEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{event.event_type}</p>
                            <p className="text-xs text-slate-600">{formatDate(event.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "customers" && (
          <CustomerOnboardingHub
            cmraLocationId={data.agent.id}
            availableVerificationMethods={["v1", "v2", "v3"]}
            onCustomerCreated={(customer) => {
              console.log("New customer created:", customer)
            }}
          />
        )}

        {activeTab === "compliance" && <ComplianceCommandCenter cmraLocationId={data.agent.id} />}

        {activeTab === "analytics" && <BusinessAnalyticsDashboard cmraLocationId={data.agent.id} />}
      </div>
    </div>
  )
}
