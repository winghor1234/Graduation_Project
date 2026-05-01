// components/dashboard/RevenueChart.tsx
"use client"
import { MonthlyRevenue } from "@/modules/report/report.type"
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer} from "recharts"
// const data = [
//     { month: "Jan", revenue: 4000 },
//     { month: "Feb", revenue: 3000 },
//     { month: "Mar", revenue: 5000 },
//     { month: "Apr", revenue: 7000 },
//     { month: "May", revenue: 6000 },
// ]

export function RevenueChart({ data }: { data: MonthlyRevenue[]}) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border col-span-2">
            <h3 className="font-semibold text-gray-800 mb-4">
                Revenue Overview
            </h3>

            <div className="h-64">
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <XAxis dataKey="month" stroke="#888" />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}