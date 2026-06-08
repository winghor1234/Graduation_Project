"use client"
import { MonthlyRevenue } from "@/modules/report/report.type";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RevenueLineChart({ data }: { data: MonthlyRevenue[] }) {
    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tickFormatter={(val) =>
                            new Date(val).toLocaleDateString("en-US", {
                                month: "short",
                                year: "2-digit"
                            })
                        }
                    />
                    <YAxis />
                    <Tooltip
                        formatter={(value) =>
                            `$${Number(value ?? 0).toLocaleString()}`
                        }
                    />
                    <Line type="monotone" dataKey="revenue" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}