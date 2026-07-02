"use client"

import { useState } from "react"
import { useGetFinancialReport } from "@/app/features/hooks/Financial"
import StatCard from "@/components/adminComponent/report/StatCard"
import { formatCurrency } from "@/utils/FormatCurrency"
import { ShoppingCart, TrendingDown, BarChart2, Calendar } from "lucide-react"
import Link from "next/link"
import ExportButton from "@/components/ExportButton"
import { handleExpensesMonthlyPDFExport, handleExpensesMonthlyExcelExport } from "@/components/adminComponent/exportReport/ExportToReport"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts"

type Period = "WEEK" | "MONTH" | "YEAR" | "CUSTOM"

function formatMonthLabel(yyyyMM: string) {
    const [year, month] = yyyyMM.split("-")
    const d = new Date(Number(year), Number(month) - 1, 1)
    return d.toLocaleDateString("lo-LA", { month: "short", year: "2-digit" })
}

export default function ExpensesPage() {
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

    const maxCostMonth = monthly.length > 0
        ? monthly.reduce((a, b) => (a.cost > b.cost ? a : b))
        : null

    const chartData = monthly.map((m) => ({
        month: formatMonthLabel(m.month),
        ລາຍຈ່າຍ: m.cost,
        isMax: m.month === maxCostMonth?.month,
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
                    <h1 className="text-2xl font-bold text-gray-800">ລາຍງານລາຍຈ່າຍ</h1>
                    <p className="text-sm text-gray-500 mt-1">ຕົ້ນທຶນ ແລະ ຄ່າໃຊ້ຈ່າຍທັງໝົດ</p>
                </div>

                {/* Period filter + Export */}
                <div className="flex gap-2 flex-wrap justify-end items-center">
                    <ExportButton title="PDF" loading={isLoading} onExport={() => handleExpensesMonthlyPDFExport(monthly)} />
                    <ExportButton title="Excel" loading={isLoading} onExport={() => handleExpensesMonthlyExcelExport(monthly)} />
                    {(["WEEK", "MONTH", "YEAR", "CUSTOM"] as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                                period === p
                                    ? "bg-red-500 text-white"
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
                            title="ລາຍຈ່າຍລວມ"
                            value={summary?.totalCost ?? 0}
                            icon={<TrendingDown size={18} />}
                            color="red"
                            sub="ຄ່າໃຊ້ຈ່າຍທັງໝົດ"
                        />
                        <StatCard
                            title="ສະເລ່ຍຕໍ່ເດືອນ"
                            value={summary?.avgMonthlyCost ?? 0}
                            icon={<BarChart2 size={18} />}
                            color="amber"
                            sub={`ຈາກ ${summary?.monthCount ?? 0} ເດືອນ`}
                        />
                        <StatCard
                            title="ຈຳນວນການສັ່ງຊື້"
                            value={summary?.purchaseCount ?? 0}
                            icon={<ShoppingCart size={18} />}
                            color="purple"
                            sub="ໃບສັ່ງຊື້ທັງໝົດ"
                        />
                        <StatCard
                            title="ເດືອນລາຍຈ່າຍສູງສຸດ"
                            value={maxCostMonth?.cost ?? 0}
                            icon={<Calendar size={18} />}
                            color="red"
                            sub={maxCostMonth ? formatMonthLabel(maxCostMonth.month) : "—"}
                        />
                    </div>

                    {/* Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-800 mb-4">ກຣາຟລາຍຈ່າຍລາຍເດືອນ</h2>
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
                                        formatter={(v: number) => [formatCurrency(v), "ລາຍຈ່າຍ"]}
                                        contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                                    />
                                    <Bar dataKey="ລາຍຈ່າຍ" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={entry.isMax ? "#ef4444" : "#fca5a5"}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        <p className="text-xs text-gray-400 mt-2 text-right">
                            ສີແດງເຂັ້ມ = ເດືອນລາຍຈ່າຍສູງສຸດ
                        </p>
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
                                        <th className="text-right px-6 py-3">ລາຍຈ່າຍ</th>
                                        <th className="text-right px-6 py-3">ລາຍຮັບ</th>
                                        <th className="text-right px-6 py-3">% ຂອງທັງໝົດ</th>
                                        <th className="text-right px-6 py-3">ສະຖານະ</th>
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
                                            const pct = (summary?.totalCost ?? 0) > 0
                                                ? (m.cost / (summary?.totalCost ?? 1) * 100).toFixed(1)
                                                : "0.0"
                                            const profitable = m.profit >= 0
                                            return (
                                                <tr key={m.month} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-3 font-medium text-gray-700">
                                                        {formatMonthLabel(m.month)}
                                                    </td>
                                                    <td className="px-6 py-3 text-right font-semibold text-red-500">
                                                        {formatCurrency(m.cost)}
                                                    </td>
                                                    <td className="px-6 py-3 text-right text-blue-500">
                                                        {formatCurrency(m.revenue)}
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                                                            {pct}%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${profitable ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                                                            {profitable ? "ກຳໄລ" : "ຂາດທຶນ"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                                {monthly.length > 0 && (
                                    <tfoot>
                                        <tr className="bg-red-50 font-semibold text-sm">
                                            <td className="px-6 py-3 text-gray-700">ລວມທັງໝົດ</td>
                                            <td className="px-6 py-3 text-right text-red-700">
                                                {formatCurrency(summary?.totalCost ?? 0)}
                                            </td>
                                            <td className="px-6 py-3 text-right text-blue-700">
                                                {formatCurrency(summary?.totalRevenue ?? 0)}
                                            </td>
                                            <td className="px-6 py-3 text-right text-red-600">100%</td>
                                            <td className="px-6 py-3 text-right">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${(summary?.totalProfit ?? 0) >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                                    {(summary?.totalProfit ?? 0) >= 0 ? "ກຳໄລ" : "ຂາດທຶນ"}
                                                </span>
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
