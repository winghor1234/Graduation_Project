"use client"

import { useGetDashboard } from "@/app/features/hooks/Dashboard"
import { RecentOrders } from "@/components/adminComponent/dashboard/RecentOrders"
import { RevenueChart } from "@/components/adminComponent/dashboard/RevenueChart"
import StatCard from "@/components/adminComponent/dashboard/StatCard"
import { TopProducts } from "@/components/adminComponent/dashboard/TopProducts"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Skeleton } from "@/components/ui/skeleton"
import {
    TrendingUp,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingDown,
    BarChart2,
} from "lucide-react"

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return "ສະບາຍດີຕອນເຊົ້າ"
    if (h < 17) return "ສະບາຍດີຕອນທ່ຽງ"
    return "ສະບາຍດີຕອນແລງ"
}

function getTodayLabel() {
    return new Date().toLocaleDateString("lo-LA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export default function DashboardPage() {
    const { data, isLoading } = useGetDashboard()
    const d = data?.data

    const profitMargin =
        (d?.summary?.revenue ?? 0) > 0
            ? ((d?.summary?.profit ?? 0) / (d?.summary?.revenue ?? 1)) * 100
            : 0

    if (isLoading) {
        return (
            <div className="space-y-6 p-6 bg-[#f5f7fb] min-h-screen">
                <div className="h-16 bg-white rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
                    <Skeleton className="h-72 rounded-2xl" />
                </div>
                <Skeleton className="h-72 rounded-2xl" />
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6 bg-[#f5f7fb] min-h-screen">

            {/* Page header */}
            <div className="bg-white rounded-2xl px-6 py-4 border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-bold text-gray-800">{getGreeting()} 👋</h1>
                    <p className="text-xs text-gray-400 mt-0.5">{getTodayLabel()}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-gray-500">ລະບົບທຳງານປົກກະຕິ</span>
                </div>
            </div>

            {/* KPI Cards — 2 rows of 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <StatCard
                    title="ລາຍຮັບລວມ"
                    value={formatCurrency(d?.summary?.revenue ?? 0)}
                    growth={d?.percent}
                    icon={DollarSign}
                    variant="blue"
                />
                <StatCard
                    title="ຕົ້ນທຶນລວມ"
                    value={formatCurrency(d?.summary?.cost ?? 0)}
                    icon={TrendingDown}
                    variant="orange"
                />
                <StatCard
                    title="ກຳໄລສຸດທິ"
                    value={formatCurrency(d?.summary?.profit ?? 0)}
                    icon={TrendingUp}
                    variant="green"
                />
                <StatCard
                    title="ອັດຕາກຳໄລ"
                    value={`${profitMargin.toFixed(1)}%`}
                    icon={BarChart2}
                    variant="purple"
                />
                <StatCard
                    title="ລູກຄ້າທັງໝົດ"
                    value={d?.customers ?? 0}
                    icon={Users}
                    variant="blue"
                />
                <StatCard
                    title="ອໍເດີ້ເດືອນນີ້"
                    value={d?.currentMonthOrder ?? 0}
                    growth={d?.percent}
                    icon={ShoppingCart}
                    variant="green"
                />
            </div>

            {/* Revenue chart + Top products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueChart data={d?.monthly ?? []} />
                <TopProducts products={d?.topProducts ?? []} />
            </div>

            {/* Recent orders */}
            <RecentOrders orders={d?.orders ?? []} />

        </div>
    )
}
