"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Clock,
  Star,
  ArrowUpRight,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react"

interface BusinessAnalyticsDashboardProps {
  cmraLocationId: string
}

export function BusinessAnalyticsDashboard({ cmraLocationId }: BusinessAnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  const operationalMetrics = {
    monthlyProcessingVolume: 1247,
    averageProcessingTime: 1.8, // hours
    complianceRate: 98.2,
    customerSatisfactionScore: 4.8,
    automationEfficiency: 94.5,
  }

  const customerMetrics = {
    totalCustomers: 156,
    newCustomersThisMonth: 23,
    customerGrowthRate: 17.3,
    customerRetentionRate: 94.2,
    averageCustomerLifetime: 18, // months
  }

  const processingMetrics = {
    totalProcessingFees: 8420, // Monthly fees collected from customers
    averageFeePerCustomer: 54,
    complianceSavings: 12300, // Cost savings from automation
    timesSaved: 156, // Hours saved per month
  }

  const serviceVolume = [
    { service: "Mail Forwarding", volume: 847, percentage: 68 },
    { service: "Package Processing", volume: 234, percentage: 19 },
    { service: "Document Scanning", volume: 98, percentage: 8 },
    { service: "Emergency Processing", volume: 68, percentage: 5 },
  ]

  const monthlyData = [
    { month: "Aug", volume: 1089, customers: 134, fees: 7200 },
    { month: "Sep", volume: 1156, customers: 142, fees: 7680 },
    { month: "Oct", volume: 1203, customers: 148, fees: 7990 },
    { month: "Nov", volume: 1224, customers: 153, fees: 8260 },
    { month: "Dec", volume: 1247, customers: 156, fees: 8420 },
  ]

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "7d":
        return "Last 7 Days"
      case "30d":
        return "Last 30 Days"
      case "90d":
        return "Last 90 Days"
      case "1y":
        return "Last Year"
      default:
        return "Last 30 Days"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">CMRA Operations Analytics</h2>
          <p className="text-slate-600">Processing volume, efficiency metrics, and customer insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range as any)}
                className="text-xs"
              >
                {range === "7d" ? "7D" : range === "30d" ? "30D" : range === "90d" ? "90D" : "1Y"}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedMetric("volume")}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Monthly Processing Volume
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {operationalMetrics.monthlyProcessingVolume.toLocaleString()}
            </div>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedMetric("customers")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Active Customers
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{customerMetrics.totalCustomers}</div>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{customerMetrics.newCustomersThisMonth} new this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedMetric("fees")}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Processing Fees Collected
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ${processingMetrics.totalProcessingFees.toLocaleString()}
            </div>
            <p className="text-sm text-blue-600">Monthly customer fees</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedMetric("efficiency")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Automation Efficiency
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{operationalMetrics.automationEfficiency}%</div>
            <p className="text-sm text-green-600">Tasks automated successfully</p>
          </CardContent>
        </Card>
      </div>

      {/* Processing Volume Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
            Processing Volume & Customer Growth
          </CardTitle>
          <CardDescription>Monthly operational performance over the last 5 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="text-center">
                  <div className="mb-2">
                    <div
                      className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t mx-auto transition-all duration-500"
                      style={{
                        height: `${(data.volume / 1300) * 120}px`,
                        width: "40px",
                      }}
                    />
                    <div
                      className="bg-gradient-to-t from-green-500 to-green-400 rounded-t mx-auto mt-1 transition-all duration-500"
                      style={{
                        height: `${(data.fees / 9000) * 60}px`,
                        width: "40px",
                      }}
                    />
                  </div>
                  <div className="text-xs font-medium text-slate-900">{data.month}</div>
                  <div className="text-xs text-slate-600">{data.volume} items</div>
                  <div className="text-xs text-green-600">${(data.fees / 1000).toFixed(1)}k fees</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                <span>Processing Volume</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2" />
                <span>Customer Fees</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Volume Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-500" />
              Processing Volume by Service
            </CardTitle>
            <CardDescription>Breakdown of monthly processing activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceVolume.map((service, index) => (
                <div key={service.service} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                            ? "bg-green-500"
                            : index === 2
                              ? "bg-purple-500"
                              : "bg-orange-500"
                      }`}
                    />
                    <span className="text-sm font-medium">{service.service}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{service.volume} items</div>
                    <div className="text-xs text-slate-600">{service.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Savings & Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Automation Impact
            </CardTitle>
            <CardDescription>Cost savings and efficiency gains from CMRAgent automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Time Saved Monthly</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">{processingMetrics.timesSaved} hours</div>
                  <div className="text-xs text-green-600">Worth $3,900 in labor</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Compliance Cost Savings</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-blue-600">
                    ${processingMetrics.complianceSavings.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600">Avoided penalties & fees</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Processing Accuracy</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-purple-600">{operationalMetrics.complianceRate}%</div>
                  <div className="text-xs text-purple-600">Error-free processing</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-orange-600">
                    {operationalMetrics.customerSatisfactionScore}/5.0
                  </div>
                  <div className="text-xs text-orange-600">Excellent service rating</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
            Operational Insights & Recommendations
          </CardTitle>
          <CardDescription>Data-driven insights to optimize your CMRA operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Optimization Opportunities</h4>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">Peak Processing Hours</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Most activity occurs 10AM-2PM. Consider staffing adjustments to handle 23% volume increase during
                    peak hours.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Customer Retention</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Customers using 3+ services have 97% retention rate. Cross-selling could increase revenue by
                    $180/month.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Performance Projections</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">Projected Monthly Volume</span>
                  <span className="text-sm font-bold text-green-600">1,380-1,420 items</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">Expected Processing Fees</span>
                  <span className="text-sm font-bold text-blue-600">$9,200-$9,800</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">Automation ROI</span>
                  <span className="text-sm font-bold text-purple-600">285%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
