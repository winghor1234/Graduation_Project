"use client"

import { useState, useMemo } from "react"
import ChartSummaryBar from "./chart/ChartSummaryBar"
import { useGetFinancialReport } from "@/app/features/hooks/Financial"
import { formatCurrency } from "@/utils/FormatCurrency"
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
import { CalendarDays } from "lucide-react"

type Period = "WEEK" | "MONTH" | "YEAR" | "CUSTOM"

const PERIODS: { label: string; value: Period }[] = [
    { label: "ອາທິດ",      value: "WEEK"   },
    { label: "ເດືອນ",      value: "MONTH"  },
    { label: "ປີ",          value: "YEAR"   },
    { label: "ກຳນົດເອງ",  value: "CUSTOM" },
]

function fmtMonth(yyyyMM: string) {
    const [y, m] = yyyyMM.split("-")
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("lo-LA", { month: "short", year: "2-digit" })
}

type Props = { data?: any }

export default function SalesGraphCard(_props: Props) {
    const [period, setPeriod] = useState<Period>("YEAR")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const queryParams = useMemo(() => {
        if (period === "CUSTOM") {
            return {
                period: undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            }
        }
        return { period, startDate: undefined, endDate: undefined }
    }, [period, startDate, endDate])

    const { data: finData, isLoading } = useGetFinancialReport(queryParams)

    const report = finData?.data
    const summary = report?.summary
    const monthly: { month: string; revenue: number; cost: number; profit: number; saleCount: number }[] =
        report?.monthly ?? []

    const chartData = useMemo(() =>
        monthly.map((m) => ({
            month: fmtMonth(m.month),
            ລາຍຮັບ: m.revenue,
            ຕົ້ນທຶນ: m.cost,
            ກຳໄລ: m.profit,
        }))
    , [monthly])

    const summaryItems = [
        { label: "ລາຍຮັບລວມ", value: formatCurrency(summary?.totalRevenue ?? 0), color: "#3b82f6" },
        { label: "ຕົ້ນທຶນລວມ", value: formatCurrency(summary?.totalCost ?? 0),    color: "#f87171" },
        { label: "ກຳໄລລວມ",   value: formatCurrency(summary?.totalProfit ?? 0),  color: "#22c55e" },
        { label: "ຈຳນວນຂາຍ",  value: `${summary?.saleCount ?? 0} ລາຍການ`,        color: "#a78bfa" },
    ]

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm w-full min-w-0">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-[15px] font-semibold text-admin-text">
                        ກຣາຟລາຍຮັບ, ຕົ້ນທຶນ ແລະ ກຳໄລ
                    </h2>
                    <p className="text-[11px] text-admin-muted mt-0.5">
                        ຂໍ້ມູນຈິງຈາກລະບົບ · {monthly.length} ເດືອນ
                    </p>
                </div>

                {/* Period buttons */}
                <div className="flex gap-1.5 flex-wrap">
                    {PERIODS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-all flex items-center gap-1 ${
                                period === p.value
                                    ? "bg-blue-50 border-blue-300 text-blue-600"
                                    : "bg-transparent border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                        >
                            {p.value === "CUSTOM" && <CalendarDays size={12} />}
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom date range */}
            {period === "CUSTOM" && (
                <div className="flex flex-wrap gap-3 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-400 uppercase tracking-wide">ວັນທີເລີ່ມ</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-400 uppercase tracking-wide">ວັນທີສິ້ນສຸດ</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            )}

            {/* Summary cards */}
            <ChartSummaryBar items={summaryItems} />

            {/* Chart area */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-75 gap-3">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-xs text-gray-400">ກຳລັງໂຫຼດຂໍ້ມູນ...</span>
                </div>
            ) : chartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-75 gap-2 text-gray-400">
                    <span className="text-2xl">📊</span>
                    <span className="text-sm">ບໍ່ມີຂໍ້ມູນໃນຊ່ວງທີ່ເລືອກ</span>
                </div>
            ) : (
                <>
                    <div className="flex justify-between mb-1">
                        <span className="text-[11px] text-admin-muted">ຍອດ (ກີບ)</span>
                        <span className="text-[11px] text-admin-muted">{monthly.length} ເດືອນ</span>
                    </div>
                    <div className="h-75 w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
                                    contentStyle={{
                                        borderRadius: 10,
                                        border: "1px solid #e5e7eb",
                                        fontSize: 12,
                                        backgroundColor: "rgba(255,255,255,0.97)",
                                    }}
                                    labelStyle={{ color: "#374151", fontWeight: 600, marginBottom: 4 }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                                <Bar dataKey="ລາຍຮັບ" fill="rgba(59,130,246,0.75)"  radius={[4, 4, 0, 0]} />
                                <Bar dataKey="ຕົ້ນທຶນ" fill="rgba(248,113,113,0.75)" radius={[4, 4, 0, 0]} />
                                <Line
                                    type="monotone"
                                    dataKey="ກຳໄລ"
                                    stroke="#22c55e"
                                    strokeWidth={2.5}
                                    dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }}
                                    activeDot={{ r: 5 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    )
}
