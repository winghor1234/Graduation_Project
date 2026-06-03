

'use client'

// import {
//     useExportPdf,
//     useGetReport
// } from "@/app/features/hooks"


import { useGetReport } from "@/app/features/hooks"
import ExportButton from "@/components/ExportButton"
import { handleCustomerExcelExport, handleCustomerPDFExport } from "@/components/ExportToReport"
import SalesGraphCard from "@/components/report/SalesGraphCard"
import StatCard from "@/components/report/StatCard"
import { DollarSign, ShoppingCart, Package, AlertTriangle, Import, BaggageClaim } from "lucide-react"


export default function ReportPage() {


    // const {
    //     data,
    //     isLoading,
    //     error
    // } = useGetReport()

    // const {
    //     mutate: exportPdf,
    //     isPending: exporting
    // } = useExportPdf()

    const { data, isLoading, error } = useGetReport()
    const report = data?.data
    console.log("report:", report)

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
                <div>
                    <ExportButton onExport={() => handleCustomerPDFExport(report?.customers)} loading={isLoading} title="Export PDF" />
                    <ExportButton onExport={() => handleCustomerExcelExport(report?.customers)} loading={isLoading} title="Export Excel" />
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