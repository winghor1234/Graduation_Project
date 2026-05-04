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

const data = [
    { name: "Feb 22", value: 45 },
    { name: "Feb 23", value: 52 },
    { name: "Feb 24", value: 38 },
    { name: "Feb 25", value: 60 },
    { name: "Feb 26", value: 55 },
    { name: "Feb 27", value: 48 },
    { name: "Feb 28", value: 42 },
    { name: "Mar 1", value: 58 },
    { name: "Mar 2", value: 62 },
    { name: "Mar 3", value: 50 },
    { name: "Mar 4", value: 47 },
    { name: "Mar 5", value: 55 },
    { name: "Mar 6", value: 48 },
    { name: "Mar 7", value: 44 },
    { name: "Mar 8", value: 60 },
    { name: "Mar 9", value: 67 },
    { name: "Mar 10", value: 52 },
    { name: "Mar 11", value: 46 },
    { name: "Mar 12", value: 61 },
    { name: "Mar 13", value: 57 },
    { name: "Mar 14", value: 50 },
    { name: "Mar 15", value: 53 },
    { name: "Mar 16", value: 64 },
    { name: "Mar 17", value: 59 },
    { name: "Mar 18", value: 52 },
    { name: "Mar 19", value: 61 },
    { name: "Mar 20", value: 68 },
    { name: "Mar 21", value: 55 },
    { name: "Mar 22", value: 49 },
]

export default function SalesChart() {
    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />
                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}