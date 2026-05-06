"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts"

type Props = {
    data: {
        month: string
        value: number
    } []
}

export default function SalesChart({ data }: Props) {
    console.log("data in SalesChart: ", data);
    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />
                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}