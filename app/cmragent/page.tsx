"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BulkCustomerInvite } from "@/components/cmragent/bulk-customer-invite"
import { ArrowLeft, LogOut, Users, BarChart3, Shield, TrendingUp } from "lucide-react"

export default function CMRAgentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [agentData, setAgentData] = useState({
    businessName: "Your CMRA Business",
    id: "cmra_001",
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 300)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
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
                onClick={() => router.push("/")}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{agentData.businessName}</h1>
                <p className="text-xs sm:text-sm text-slate-600">CMRA Operations Dashboard</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$8,420</div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Customer Invite */}
          <BulkCustomerInvite cmraLocationId={agentData.id} cmraName={agentData.businessName} />
        </div>
      </div>
    </div>
  )
}
