// "use client"

// import { RevenueBarChart } from "@/components/dashboard/RevenBarchart"
// import { RevenueLineChart } from "@/components/dashboard/RevenueLineChart"
// import { SummaryCard } from "@/components/dashboard/SummaryCard"
// import { UseDashboard } from "@/components/dashboard/UseDashboard"
// import { Card, CardContent } from "@/components/ui/card"
// import { TrendingUp, DollarSign, Wallet } from "lucide-react"

// export default function DashboardPage() {
//   const { summary, monthly, loading, error } = UseDashboard()
//   if (loading) return <p>Loading...</p>
//   if (error) return <p>Error: {error}</p>
//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Dashboard</h1>

//       {/* ===== SUMMARY ===== */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <SummaryCard
//           title="Revenue"
//           value={summary?.data?.revenue || 0}
//           icon={DollarSign}
//         />

//         <SummaryCard
//           title="Cost"
//           value={summary?.data?.cost || 0}
//           icon={Wallet}
//         />

//         <SummaryCard
//           title="Profit"
//           value={summary?.data?.profit || 0}
//           icon={TrendingUp}
//         />
//       </div>

//       {/* ===== CHARTS ===== */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="rounded-2xl shadow">
//           <CardContent className="p-4">
//             <h2 className="font-semibold mb-4">Revenue Trend</h2>
//             <RevenueLineChart data={monthly} />
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl shadow">
//           <CardContent className="p-4">
//             <h2 className="font-semibold mb-4">Revenue Comparison</h2>
//             <RevenueBarChart data={monthly} />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
"use client"

import { useGetDashboard } from "@/app/features/hooks"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { StatCard } from "@/components/dashboard/StatCard"
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
        <StatCard title="Total Revenue" value={formatCurrency(data?.data?.summary?.revenue || 0)} growth="+12.5%" />
        <StatCard title="Orders" value={formatCurrency(data?.data?.orders || 0)} growth="+8.3%" />
        <StatCard title="Customers" value={formatCurrency(data?.data?.customers || 0)} growth="+5.2%" />
        <StatCard title="Profit" value={formatCurrency(data?.data?.summary?.profit || 0)} growth="+10.1%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <TopProducts products={data?.data?.topProducts} />
      </div>

      {/* Table */}
      <RecentOrders />
    </div>
  )
}
