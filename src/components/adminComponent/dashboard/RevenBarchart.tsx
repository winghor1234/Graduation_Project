"use client"

import { MonthlyRevenue } from "@/modules/report/report.type"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function RevenueBarChart({ data }: { data: MonthlyRevenue[] }) {
    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tickFormatter={(val) =>
                            new Date(val).toLocaleDateString("lo-LA", {
                                month: "short"
                            })
                        }
                    />
                    <YAxis />
                    <Tooltip
                        formatter={(value) =>
                            `$${Number(value ?? 0).toLocaleString()}`
                        }
                    />
                    <Bar dataKey="revenue" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}