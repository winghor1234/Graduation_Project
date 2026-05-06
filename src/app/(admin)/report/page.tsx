"use client"


import { useGetReport } from "@/app/features/hooks"
import SalesChart from "@/components/report/SalesChart"
import StatCard from "@/components/report/StatCard"
import { formatCurrency } from "@/utils/FormatCurrency"
import { DollarSign, ShoppingCart, Package, AlertTriangle, Import, BaggageClaim } from "lucide-react"

export default function Report() {
    const {data, isLoading, error} = useGetReport()
    const report = data?.data
    console.log("report data : ",report);
    return (
        <div className="p-6 space-y-6 bg-[#f5f7fb] min-h-screen">

            {/* ================= TOP CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(report?.summary?.revenue || 0)}
                    sub="$183.23 avg. order value"
                    growth="14.4%"
                    icon={<DollarSign size={20} />}
                    color="green"
                />
                <StatCard
                    title="Total Cost"
                    value={formatCurrency(report?.summary?.cost || 0)}
                    sub="$183.23 avg. order value"
                    growth="14.4%"
                    icon={<DollarSign size={20} />}
                    color="green"
                />
                <StatCard
                    title="Total Profit"
                    value={formatCurrency(report?.summary?.profit || 0)}
                    sub="$183.23 avg. order value"
                    growth="14.4%"
                    icon={<DollarSign size={20} />}
                    color="green"
                />

                <StatCard
                    title="Total Orders"
                    value={formatCurrency(report?.order.length || 0)}
                    sub="15.7 orders per day"
                    growth="16.6%"
                    icon={<ShoppingCart size={20} />}
                    color="blue"
                />

                <StatCard
                    title="Units Sold"
                    value={formatCurrency(report?.sold.length || 0)}
                    sub="3.5 items per order"
                    icon={<Package size={20} />}
                    color="purple"
                />

                <StatCard
                    title="Purchases"
                    value={formatCurrency(report?.purchases.length || 0)}
                    sub="43 low stock • 10 out of stock"
                    icon={<BaggageClaim size={20} />}
                    color="orange"
                />
                <StatCard
                    title="Import "
                    value={formatCurrency(report?.imports.length || 0)}
                    sub="43 low stock • 10 out of stock"
                    icon={<Import size={20} />}
                    color="orange"
                />
                <StatCard
                    title="Inventory Alerts"
                    value={formatCurrency(report?.lowStock.length || 0)}
                    sub="43 low stock • 10 out of stock"
                    icon={<AlertTriangle size={20} />}
                    color="orange"
                />
            </div>

            {/* ================= TABS ================= */}
            <div className="flex gap-2 bg-gray-200 p-1 rounded-full w-fit">
                <button className="px-4 py-1 bg-white rounded-full text-sm font-medium">
                    Sales
                </button>
                <button className="px-4 py-1 text-sm text-gray-500">
                    Revenue
                </button>
                <button className="px-4 py-1 text-sm text-gray-500">
                    Inventory
                </button>
            </div>

            {/* ================= CHART ================= */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h2 className="text-lg font-semibold">Daily Sales Trend</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Units sold over the last 30 days
                </p>

                <SalesChart data={report?.monthlyRevenue || []} />
            </div>

        </div>
    )
}