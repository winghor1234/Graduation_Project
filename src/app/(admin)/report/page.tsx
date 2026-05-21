// // "use client"


// // import { useGetReport } from "@/app/features/hooks"
// // import SalesChart from "@/components/report/SalesChart"
// // import StatCard from "@/components/report/StatCard"
// // import { formatCurrency } from "@/utils/FormatCurrency"
// // import { DollarSign, ShoppingCart, Package, AlertTriangle, Import, BaggageClaim } from "lucide-react"

// // export default function Report() {
// //     const {data, isLoading, error} = useGetReport()
// //     const report = data?.data
// //     console.log("report data : ",report);
// //     return (
// //         <div className="p-6 space-y-6 bg-[#f5f7fb] min-h-screen">

// //             {/* ================= TOP CARDS ================= */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

// //                 <StatCard
// //                     title="Total Revenue"
// //                     value={formatCurrency(report?.summary?.revenue || 0)}
// //                     sub="$183.23 avg. order value"
// //                     growth="14.4%"
// //                     icon={<DollarSign size={20} />}
// //                     color="green"
// //                 />
// //                 <StatCard
// //                     title="Total Cost"
// //                     value={formatCurrency(report?.summary?.cost || 0)}
// //                     sub="$183.23 avg. order value"
// //                     growth="14.4%"
// //                     icon={<DollarSign size={20} />}
// //                     color="green"
// //                 />
// //                 <StatCard
// //                     title="Total Profit"
// //                     value={formatCurrency(report?.summary?.profit || 0)}
// //                     sub="$183.23 avg. order value"
// //                     growth="14.4%"
// //                     icon={<DollarSign size={20} />}
// //                     color="green"
// //                 />

// //                 <StatCard
// //                     title="Total Orders"
// //                     value={formatCurrency(report?.order.length || 0)}
// //                     sub="15.7 orders per day"
// //                     growth="16.6%"
// //                     icon={<ShoppingCart size={20} />}
// //                     color="blue"
// //                 />

// //                 <StatCard
// //                     title="Units Sold"
// //                     value={formatCurrency(report?.sold.length || 0)}
// //                     sub="3.5 items per order"
// //                     icon={<Package size={20} />}
// //                     color="purple"
// //                 />

// //                 <StatCard
// //                     title="Purchases"
// //                     value={formatCurrency(report?.purchases.length || 0)}
// //                     sub="43 low stock • 10 out of stock"
// //                     icon={<BaggageClaim size={20} />}
// //                     color="orange"
// //                 />
// //                 <StatCard
// //                     title="Import "
// //                     value={formatCurrency(report?.imports.length || 0)}
// //                     sub="43 low stock • 10 out of stock"
// //                     icon={<Import size={20} />}
// //                     color="orange"
// //                 />
// //                 <StatCard
// //                     title="Inventory Alerts"
// //                     value={formatCurrency(report?.lowStock.length || 0)}
// //                     sub="43 low stock • 10 out of stock"
// //                     icon={<AlertTriangle size={20} />}
// //                     color="orange"
// //                 />
// //             </div>

// //             {/* ================= TABS ================= */}
// //             <div className="flex gap-2 bg-gray-200 p-1 rounded-full w-fit">
// //                 <button className="px-4 py-1 bg-white rounded-full text-sm font-medium">
// //                     Sales
// //                 </button>
// //                 <button className="px-4 py-1 text-sm text-gray-500">
// //                     Revenue
// //                 </button>
// //                 <button className="px-4 py-1 text-sm text-gray-500">
// //                     Inventory
// //                 </button>
// //             </div>

// //             {/* ================= CHART ================= */}
// //             <div className="bg-white p-6 rounded-2xl border border-gray-100">
// //                 <h2 className="text-lg font-semibold">Daily Sales Trend</h2>
// //                 <p className="text-sm text-gray-500 mb-4">
// //                     Units sold over the last 30 days
// //                 </p>

// //                 <SalesChart data={report?.monthlyRevenue || []} />
// //             </div>

// //         </div>
// //     )
// // }

// 'use client'
// import { useExportPdf, useGetReport } from "@/app/features/hooks"
// import SalesGraphCard from "@/components/report/SalesGraphCard"
// import StatCard from "@/components/report/StatCard"
// import { DollarSign, ShoppingCart, Package, AlertTriangle, Import, BaggageClaim } from "lucide-react"


// // const mockSalesData = {788
// //     labels: ["Jan 23'", "Feb 23'", "Mar 23'", "Apr 23'", "May 23'", "Jun 23'", "Jul 23'", "Aug 23'", "Sep 23'", "Oct 23'", "Nov 23'"],
// //     unitsSold: [88, 115, 155, 160, 95, 55, 130, 205, 155, 90, 125],
// //     revenue: [75, 95, 105, 95, 70, 60, 85, 120, 100, 80, 105],
// //     cost: [35, 42, 50, 48, 38, 32, 40, 55, 45, 38, 43],
// //     profit: [30, 40, 45, 42, 32, 28, 35, 52, 40, 32, 42],
// //     expenses: [60, 75, 90, 85, 65, 55, 70, 95, 78, 65, 75],
// //     revenueBars: [75, 95, 105, 95, 70, 60, 85, 120, 100, 80, 105],
// // }

// // const mockStats = {
// //     revenue: 125430,
// //     cost: 87200,
// //     profit: 38230,
// //     orders: 342,
// //     unitsSold: 1204,
// //     purchases: 87,
// //     imports: 34,
// //     lowStock: 53,
// // }

// export default function ReportPage() {
//     const { data, isLoading, error } = useGetReport()
//     const report = data?.data
//     console.log("report:", report)
//     return (
//         <div className="p-6 bg-[#f5f7fb] min-h-screen space-y-6">

//             <div>
//                 <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
//                 <p className="text-sm text-gray-400 mt-0.5">Overview of your business performance</p>
//             </div>

//             {/* Stat Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <StatCard
//                     title="Total Revenue"
//                     value={report?.summary?.revenue || 0}
//                     prefix="$"
//                     growth={14.4}
//                     sub="vs last month"
//                     icon={<DollarSign size={18} />}
//                     color="blue"
//                 />
//                 <StatCard
//                     title="Total Cost"
//                     value={report?.summary?.cost || 0}
//                     prefix="$"
//                     growth={-3.2}
//                     sub="vs last month"
//                     icon={<DollarSign size={18} />}
//                     color="red"
//                 />
//                 <StatCard
//                     title="Total Profit"
//                     value={report?.summary?.profit || 0}
//                     prefix="$"
//                     growth={22.1}
//                     sub="vs last month"
//                     icon={<DollarSign size={18} />}
//                     color="green"
//                 />
//                 <StatCard
//                     title="Total Orders"
//                     value={report?.order.length || 0}
//                     growth={16.6}
//                     sub="15.7 per day"
//                     icon={<ShoppingCart size={18} />}
//                     color="purple"
//                 />
//                 <StatCard
//                     title="Units Sold"
//                     value={report?.sold.length || 0}
//                     sub="3.5 items per order"
//                     icon={<Package size={18} />}
//                     color="blue"
//                 />
//                 <StatCard
//                     title="Purchases"
//                     value={report?.purchases.length || 0}
//                     sub="This month"
//                     icon={<BaggageClaim size={18} />}
//                     color="amber"
//                 />
//                 <StatCard
//                     title="Imports"
//                     value={report?.imports.length || 0}
//                     sub="This month"
//                     icon={<Import size={18} />}
//                     color="amber"
//                 />
//                 <StatCard
//                     title="Low Stock Alerts"
//                     value={report?.lowStock.length || 0}
//                     sub="43 low · 10 out of stock"
//                     icon={<AlertTriangle size={18} />}
//                     color="red"
//                 />
//             </div>

//             {/* Chart */}
//             <div className="w-full min-w-0">
//                 <SalesGraphCard data={report} />
//             </div>

//         </div>
//     )
// }


'use client'

import {
    useExportPdf,
    useGetReport
} from "@/app/features/hooks"

import SalesGraphCard from "@/components/report/SalesGraphCard"
import StatCard from "@/components/report/StatCard"

import {
    DollarSign,
    ShoppingCart,
    Package,
    AlertTriangle,
    Import,
    BaggageClaim
} from "lucide-react"

type ExportPdfOptions = {

    fileName: string

    title: string

    columns: {
        header: string
        accessor: string
    }[]

    data: {
        revenue: number
        cost: number
        profit: number
    }[]

}

export default function ReportPage() {

    const {
        data,
        isLoading,
        error
    } = useGetReport()

    const {
        mutate: exportPdf,
        isPending: exporting
    } = useExportPdf()

    const report = data?.data

    const handleExportPdf = () => {

        exportPdf({

            fileName: "report",

            title: "Business Report",

            columns: [

                {
                    header: "Revenue",
                    accessor: "revenue"
                },

                {
                    header: "Cost",
                    accessor: "cost"
                },

                {
                    header: "Profit",
                    accessor: "profit"
                }

            ],

            data: [

                {
                    revenue:
                        Number(
                            report?.summary?.revenue
                        ) || 0,

                    cost:
                        Number(
                            report?.summary?.cost
                        ) || 0,

                    profit:
                        Number(
                            report?.summary?.profit
                        ) || 0

                }

            ]

        })

    }

    if (isLoading) {

        return (

            <div className="p-6">
                Loading...
            </div>

        )

    }

    if (error) {

        return (

            <div className="p-6 text-red-500">
                Failed to load report
            </div>

        )

    }

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

                <button

                    onClick={handleExportPdf}

                    disabled={exporting}

                    className="
                        px-4
                        py-2
                        rounded-lg
                        bg-black
                        text-white
                        disabled:opacity-50
                    "

                >

                    {
                        exporting
                            ? "Exporting..."
                            : "Export PDF"
                    }

                </button>

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