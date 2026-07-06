"use client"

import { useState } from "react"
import { useGetFinancialReport } from "@/app/features/hooks/Financial"
import StatCard from "@/components/adminComponent/report/StatCard"
import { formatCurrency } from "@/utils/FormatCurrency"
import { DollarSign, TrendingUp, TrendingDown, Percent } from "lucide-react"
import Link from "next/link"
import ExportButton from "@/components/ExportButton"
import { handleProfitMonthlyPDFExport, handleProfitMonthlyExcelExport } from "@/components/adminComponent/exportReport/ExportToReport"
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"

type Period = "WEEK" | "MONTH" | "YEAR" | "CUSTOM"

function formatMonthLabel(yyyyMM: string) {
    const [year, month] = yyyyMM.split("-")
    const d = new Date(Number(year), Number(month) - 1, 1)
    return d.toLocaleDateString("lo-LA", { month: "short", year: "2-digit" })
}

export default function ProfitPage() {
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

    const chartData = monthly.map((m) => ({
        month: formatMonthLabel(m.month),
        ລາຍຮັບ: m.revenue,
        ຕົ້ນທຶນ: m.cost,
        ກຳໄລ: m.profit,
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
                    <h1 className="text-2xl font-bold text-gray-800">ລາຍງານກຳໄລ</h1>
                    <p className="text-sm text-gray-500 mt-1">ລາຍຮັບ, ຕົ້ນທຶນ ແລະ ກຳໄລ</p>
                </div>

                {/* Period filter + Export */}
                <div className="flex gap-2 flex-wrap justify-end items-center">
                    <ExportButton title="PDF" loading={isLoading} onExport={() => handleProfitMonthlyPDFExport(monthly)} />
                    <ExportButton title="Excel" loading={isLoading} onExport={() => handleProfitMonthlyExcelExport(monthly)} />
                    {(["WEEK", "MONTH", "YEAR", "CUSTOM"] as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                                period === p
                                    ? "bg-emerald-500 text-white"
                                    : "bg-white border text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {p === "WEEK" ? "ອາທິດ" : p === "MONTH" ? "ເດືອນ" : p === "YEAR" ? "ປີ" : "ກຳນົດເອງ"}
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
                            title="ກຳໄລລວມ"
                            value={summary?.totalProfit ?? 0}
                            icon={<TrendingUp size={18} />}
                            color={(summary?.totalProfit ?? 0) >= 0 ? "green" : "red"}
                            sub="ລາຍຮັບ ຫັກ ຕົ້ນທຶນ"
                        />
                        <StatCard
                            title="ອັດຕາກຳໄລ"
                            value={Math.round(summary?.profitMargin ?? 0)}
                            icon={<Percent size={18} />}
                            color="purple"
                            sub={`${(summary?.profitMargin ?? 0).toFixed(1)}% ຂອງລາຍຮັບ`}
                        />
                        <StatCard
                            title="ລາຍຮັບທັງໝົດ"
                            value={summary?.totalRevenue ?? 0}
                            icon={<DollarSign size={18} />}
                            color="blue"
                            sub="ຈາກການຂາຍ"
                        />
                        <StatCard
                            title="ຕົ້ນທຶນທັງໝົດ"
                            value={summary?.totalCost ?? 0}
                            icon={<TrendingDown size={18} />}
                            color="amber"
                            sub="ຈາກການສັ່ງຊື້"
                        />
                    </div>

                    {/* Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-800 mb-4">
                            ກຣາຟລາຍຮັບ, ຕົ້ນທຶນ ແລະ ກຳໄລ
                        </h2>
                        {chartData.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-gray-400">
                                ບໍ່ມີຂໍ້ມູນໃນຊ່ວງນີ້
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
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
                                        formatter={(v, name) => [formatCurrency(Number(v)), name]}
                                        contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="ລາຍຮັບ" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="ຕົ້ນທຶນ" fill="#f87171" radius={[4, 4, 0, 0]} />
                                    <Line
                                        type="monotone"
                                        dataKey="ກຳໄລ"
                                        stroke="#22c55e"
                                        strokeWidth={2.5}
                                        dot={{ r: 3, fill: "#22c55e" }}
                                    />
                                </ComposedChart>
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
                                        <th className="text-right px-6 py-3">ຕົ້ນທຶນ</th>
                                        <th className="text-right px-6 py-3">ກຳໄລ</th>
                                        <th className="text-right px-6 py-3">ອັດຕາ %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {monthly.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-gray-400">
                                                ບໍ່ມີຂໍ້ມູນ
                                            </td>
                                        </tr>
                                    ) : (
                                        monthly.map((m) => {
                                            const margin = m.revenue > 0
                                                ? (m.profit / m.revenue * 100).toFixed(1)
                                                : "0.0"
                                            const isPositive = m.profit >= 0
                                            return (
                                                <tr key={m.month} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-3 font-medium text-gray-700">
                                                        {formatMonthLabel(m.month)}
                                                    </td>
                                                    <td className="px-6 py-3 text-right text-blue-600 font-medium">
                                                        {formatCurrency(m.revenue)}
                                                    </td>
                                                    <td className="px-6 py-3 text-right text-red-500 font-medium">
                                                        {formatCurrency(m.cost)}
                                                    </td>
                                                    <td className={`px-6 py-3 text-right font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                                                        {isPositive ? "+" : ""}{formatCurrency(m.profit)}
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                                                            {margin}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                                {monthly.length > 0 && (
                                    <tfoot>
                                        <tr className="bg-emerald-50 font-semibold text-sm">
                                            <td className="px-6 py-3 text-gray-700">ລວມທັງໝົດ</td>
                                            <td className="px-6 py-3 text-right text-blue-700">
                                                {formatCurrency(summary?.totalRevenue ?? 0)}
                                            </td>
                                            <td className="px-6 py-3 text-right text-red-600">
                                                {formatCurrency(summary?.totalCost ?? 0)}
                                            </td>
                                            <td className={`px-6 py-3 text-right font-bold ${(summary?.totalProfit ?? 0) >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                                                {formatCurrency(summary?.totalProfit ?? 0)}
                                            </td>
                                            <td className="px-6 py-3 text-right text-emerald-600">
                                                {(summary?.profitMargin ?? 0).toFixed(1)}%
                                            </td>
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
