
"use client"

import { useGetDashboard } from "@/app/features/hooks"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import StatCard from "@/components/dashboard/StatCard"
import { TopProducts } from "@/components/dashboard/TopProducts"
import { formatCurrency } from "@/utils/FormatCurrency"

export default function DashboardPage() {
  const { data, isLoading, } = useGetDashboard()
  if (isLoading) return <p>Loading...</p>
  console.log("data : ", data);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(data?.data?.summary?.revenue || 0)} />
        <StatCard title="Orders" value={formatCurrency(data?.data?.orders.length || 0)} growth={data?.data?.percent}/>
        <StatCard title="Customers" value={formatCurrency(data?.data?.customers || 0)}  />
        <StatCard title="Profit" value={formatCurrency(data?.data?.summary?.profit || 0)}  />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={data?.data?.monthly} />
        <TopProducts products={data?.data?.topProducts} />
      </div>

      {/* Table */}
      <RecentOrders orders={data?.data?.orders} />
    </div>
  )
}
