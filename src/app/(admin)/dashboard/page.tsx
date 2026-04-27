"use client"

import { RevenueBarChart } from "@/components/dashboard/RevenBarchart"
import { RevenueLineChart } from "@/components/dashboard/RevenueLineChart"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { UseDashboard } from "@/components/dashboard/UseDashboard"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Wallet } from "lucide-react"

export default function DashboardPage() {
  const { summary, monthly } = UseDashboard()
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Revenue"
          value={summary?.revenue || 0}
          icon={DollarSign}
        />

        <SummaryCard
          title="Cost"
          value={summary?.cost || 0}
          icon={Wallet}
        />

        <SummaryCard
          title="Profit"
          value={summary?.profit || 0}
          icon={TrendingUp}
        />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Revenue Trend</h2>
            <RevenueLineChart data={monthly} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Revenue Comparison</h2>
            <RevenueBarChart data={monthly} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



