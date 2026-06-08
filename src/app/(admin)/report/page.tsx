'use client'
import { useGetDashboard } from "@/app/features/hooks/Dashboard"
import SalesGraphCard from "@/components/adminComponent/report/SalesGraphCard"
import StatCard from "@/components/adminComponent/report/StatCard"
import { DollarSign, ShoppingCart, Package, AlertTriangle, Import, BaggageClaim } from "lucide-react"
import Link from "next/link"

export default function ReportPage() {
    const { data, isLoading, error } = useGetDashboard()
    const report = data?.data
    // console.log("report:", data)
    const reports = [
        {
            title: "Product Report",
            href: "/report/product",
        },
        {
            title: "Purchase Report",
            href: "/report/purchase",
        },
        {
            title: "Import Report",
            href: "/report/import",
        },
        {
            title: "Customer Report",
            href: "/report/customer",
        },
        {
            title: "Sale Report",
            href: "/report/sale",
        },
        {
            title: "Revenue Report",
            href: "/report/revenue",
        },
        {
            title: "Profit Report",
            href: "/report/profit",
        },
        {
            title: "Expenses Report",
            href: "/report/expenses",
        },
    ];

    return (
        <div className="p-6 bg-[#f5f7fb] min-h-screen space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        Dashboard
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Overview of your business performance
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reports.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="bg-white border rounded-xl p-5 shadow hover:shadow-lg"
                        >
                            <h2 className="font-semibold">
                                {item.title}
                            </h2>

                            <p className="text-sm text-gray-500 mt-2">
                                Generate and export report
                            </p>
                        </Link>
                    ))}
                </div>

            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <StatCard
                    title="Total Revenue"
                    value={report?.summary?.revenue || 0}
                    prefix="$"
                    growth={14.4}
                    sub="vs last month"
                    icon={<DollarSign size={18} />}
                    color="blue"
                />

                <StatCard
                    title="Total Cost"
                    value={report?.summary?.cost || 0}
                    prefix="$"
                    growth={-3.2}
                    sub="vs last month"
                    icon={<DollarSign size={18} />}
                    color="red"
                />

                <StatCard
                    title="Total Profit"
                    value={report?.summary?.profit || 0}
                    prefix="$"
                    growth={22.1}
                    sub="vs last month"
                    icon={<DollarSign size={18} />}
                    color="green"
                />

                <StatCard
                    title="Total Orders"
                    value={report?.order?.length || 0}
                    growth={16.6}
                    sub="15.7 per day"
                    icon={<ShoppingCart size={18} />}
                    color="purple"
                />

                <StatCard
                    title="Units Sold"
                    value={report?.sold?.length || 0}
                    sub="3.5 items per order"
                    icon={<Package size={18} />}
                    color="blue"
                />

                <StatCard
                    title="Purchases"
                    value={report?.purchases?.length || 0}
                    sub="This month"
                    icon={<BaggageClaim size={18} />}
                    color="amber"
                />

                <StatCard
                    title="Imports"
                    value={report?.imports?.length || 0}
                    sub="This month"
                    icon={<Import size={18} />}
                    color="amber"
                />

                <StatCard
                    title="Low Stock Alerts"
                    value={report?.lowStock?.length || 0}
                    sub="43 low · 10 out of stock"
                    icon={<AlertTriangle size={18} />}
                    color="red"
                />

            </div>

            {/* Chart */}
            <div className="w-full min-w-0">

                <SalesGraphCard
                    data={report}
                />

            </div>

        </div>

    )

}