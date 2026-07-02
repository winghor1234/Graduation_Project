"use client"

import { useMemo } from "react"
import { MonthlyRevenue } from "@/modules/report/report.type"
import { formatCurrency } from "@/utils/FormatCurrency"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

function fmtMonth(yyyyMM: string) {
    const [y, m] = yyyyMM.split("-")
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("lo-LA", { month: "short" })
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className="font-semibold text-emerald-600">{formatCurrency(payload[0].value)}</p>
        </div>
    )
}

export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
    const chartData = useMemo(() =>
        (data ?? []).map((d) => ({
            month: fmtMonth(d.month),
            ລາຍຮັບ: Number(d.revenue),
        }))
    , [data])

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold text-gray-800">ພາບລວມລາຍຮັບ</h3>
                    <p className="text-xs text-gray-400 mt-0.5">ລາຍຮັບລາຍເດືອນທັງໝົດ</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium border border-emerald-100">
                    {chartData.length} ເດືອນ
                </span>
            </div>

            {!chartData.length ? (
                <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                    ບໍ່ມີຂໍ້ມູນ
                </div>
            ) : (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.18} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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
                                width={40}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="ລາຍຮັບ"
                                stroke="#22c55e"
                                strokeWidth={2.5}
                                fill="url(#revenueGrad)"
                                dot={false}
                                activeDot={{ r: 5, fill: "#22c55e", strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}
