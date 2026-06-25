"use client"

import { useGetDashboard } from "@/app/features/hooks/Dashboard"
import { RecentOrders } from "@/components/adminComponent/dashboard/RecentOrders"
import { RevenueChart } from "@/components/adminComponent/dashboard/RevenueChart"
import StatCard from "@/components/adminComponent/dashboard/StatCard"
import { TopProducts } from "@/components/adminComponent/dashboard/TopProducts"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, ShoppingCart, Users, DollarSign } from "lucide-react"

export default function DashboardPage() {
    const { data, isLoading } = useGetDashboard()

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
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
        <div className="space-y-6">

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="ລາຍຮັບລວມ"
                    value={formatCurrency(data?.data?.summary?.revenue ?? 0)}
                    growth={data?.data?.percent}
                    icon={DollarSign}
                    variant="blue"
                />
                <StatCard
                    title="ອໍເດີ້ທັງໝົດ"
                    value={data?.data?.orders?.length ?? 0}
                    icon={ShoppingCart}
                    variant="green"
                />
                <StatCard
                    title="ລູກຄ້າທັງໝົດ"
                    value={data?.data?.customers ?? 0}
                    icon={Users}
                    variant="purple"
                />
                <StatCard
                    title="ກຳໄລສຸດທິ"
                    value={formatCurrency(data?.data?.summary?.profit ?? 0)}
                    icon={TrendingUp}
                    variant="orange"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueChart data={data?.data?.monthly} />
                <TopProducts products={data?.data?.topProducts} />
            </div>

            {/* Recent Orders */}
            <RecentOrders orders={data?.data?.orders ?? []} />

        </div>
    )
}