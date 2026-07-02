"use client"

import { useState } from "react"
import { useGetFinancialReport } from "@/app/features/hooks/Financial"
import StatCard from "@/components/adminComponent/report/StatCard"
import { formatCurrency } from "@/utils/FormatCurrency"
import { DollarSign, TrendingUp, ShoppingBag, Calendar } from "lucide-react"
import Link from "next/link"
import ExportButton from "@/components/ExportButton"
import { handleRevenueMonthlyPDFExport, handleRevenueMonthlyExcelExport } from "@/components/adminComponent/exportReport/ExportToReport"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

type Period = "WEEK" | "MONTH" | "YEAR" | "CUSTOM"

function formatMonthLabel(yyyyMM: string) {
    const [year, month] = yyyyMM.split("-")
    const d = new Date(Number(year), Number(month) - 1, 1)
    return d.toLocaleDateString("lo-LA", { month: "short", year: "2-digit" })
}

export default function RevenuePage() {
    const [period, setPeriod] = useState<Period>("YEAR")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const { data, isLoading } = useGetFinancialReport({
        period: period !== "CUSTOM" ? period : undefined,
        startDate: period === "CUSTOM" ? startDate : undefined,
        endDate: period === "CUSTOM" ? endDate : undefined,
    })

    const report = data?.data
    const summary = report?.summary
    const monthly = report?.monthly ?? []

    const bestMonth = monthly.length > 0
        ? monthly.reduce((a, b) => (a.revenue > b.revenue ? a : b))
        : null

    const chartData = monthly.map((m) => ({
        month: formatMonthLabel(m.month),
        ລາຍຮັບ: m.revenue,
    }))

    return (
        <div className="space-y-6 p-6 bg-[#f5f7fb] min-h-screen">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <Link
                        href="/report"
                        className="text-sm text-blue-500 hover:underline mb-1 block"
                    >
                        ← ກັບຄືນ
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">ລາຍງານລາຍຮັບ</h1>
                    <p className="text-sm text-gray-500 mt-1">ສະຫຼຸບລາຍຮັບຈາກການຂາຍທັງໝົດ</p>
                </div>

                {/* Period filter + Export */}
                <div className="flex gap-2 flex-wrap justify-end items-center">
                    <ExportButton title="PDF" loading={isLoading} onExport={() => handleRevenueMonthlyPDFExport(monthly)} />
                    <ExportButton title="Excel" loading={isLoading} onExport={() => handleRevenueMonthlyExcelExport(monthly)} />
                    {(["WEEK", "MONTH", "YEAR", "CUSTOM"] as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                                period === p
                                    ? "bg-blue-500 text-white"
                                    : "bg-white border text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {p === "WEEK" ? "ສັບດາ" : p === "MONTH" ? "ເດືອນ" : p === "YEAR" ? "ປີ" : "ກຳນົດເອງ"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom date range */}
            {period === "CUSTOM" && (
                <div className="flex gap-3 bg-white border rounded-xl p-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">ວັນທີເລີ່ມ</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">ວັນທີສິ້ນສຸດ</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-24 text-gray-500">
                    ກຳລັງໂຫຼດຂໍ້ມູນ...
                </div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard
                            title="ລາຍຮັບລວມ"
                            value={summary?.totalRevenue ?? 0}
                            icon={<DollarSign size={18} />}
                            color="blue"
                            sub="ລາຍຮັບທັງໝົດໃນຊ່ວງທີ່ເລືອກ"
                        />
                        <StatCard
                            title="ສະເລ່ຍຕໍ່ເດືອນ"
                            value={summary?.avgMonthlyRevenue ?? 0}
                            icon={<TrendingUp size={18} />}
                            color="green"
                            sub={`ຈາກ ${summary?.monthCount ?? 0} ເດືອນ`}
                        />
                        <StatCard
                            title="ຈຳນວນການຂາຍ"
                            value={summary?.saleCount ?? 0}
                            icon={<ShoppingBag size={18} />}
                            color="purple"
                            sub="ລາຍການຂາຍທັງໝົດ"
                        />
                        <StatCard
                            title="ເດືອນລາຍຮັບສູງສຸດ"
                            value={bestMonth?.revenue ?? 0}
                            icon={<Calendar size={18} />}
                            color="amber"
                            sub={bestMonth ? formatMonthLabel(bestMonth.month) : "—"}
                        />
                    </div>

                    {/* Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-800 mb-4">ກຣາຟລາຍຮັບລາຍເດືອນ</h2>
                        {chartData.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-gray-400">
                                ບໍ່ມີຂໍ້ມູນໃນຊ່ວງນີ້
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                                    />
                                    <Tooltip
                                        formatter={(v: number) => [formatCurrency(v), "ລາຍຮັບ"]}
                                        contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                                    />
                                    <Bar dataKey="ລາຍຮັບ" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Monthly Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50">
                            <h2 className="text-base font-semibold text-gray-800">ລາຍລະອຽດລາຍເດືອນ</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                        <th className="text-left px-6 py-3">ເດືອນ</th>
                                        <th className="text-right px-6 py-3">ລາຍຮັບ</th>
                                        <th className="text-right px-6 py-3">ຈຳນວນຂາຍ</th>
                                        <th className="text-right px-6 py-3">% ຂອງທັງໝົດ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {monthly.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-gray-400">
                                                ບໍ່ມີຂໍ້ມູນ
                                            </td>
                                        </tr>
                                    ) : (
                                        monthly.map((m) => {
                                            const pct = (summary?.totalRevenue ?? 0) > 0
                                                ? (m.revenue / (summary?.totalRevenue ?? 1) * 100).toFixed(1)
                                                : "0.0"
                                            return (
                                                <tr key={m.month} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-3 font-medium text-gray-700">
                                                        {formatMonthLabel(m.month)}
                                                    </td>
                                                    <td className="px-6 py-3 text-right font-semibold text-blue-600">
                                                        {formatCurrency(m.revenue)}
                                                    </td>
                                                    <td className="px-6 py-3 text-right text-gray-600">
                                                        {m.saleCount}
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                                            {pct}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                                {monthly.length > 0 && (
                                    <tfoot>
                                        <tr className="bg-blue-50 font-semibold text-sm">
                                            <td className="px-6 py-3 text-gray-700">ລວມທັງໝົດ</td>
                                            <td className="px-6 py-3 text-right text-blue-700">
                                                {formatCurrency(summary?.totalRevenue ?? 0)}
                                            </td>
                                            <td className="px-6 py-3 text-right text-gray-700">
                                                {summary?.saleCount ?? 0}
                                            </td>
                                            <td className="px-6 py-3 text-right text-blue-600">100%</td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
