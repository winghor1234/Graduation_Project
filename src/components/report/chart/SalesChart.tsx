// // "use client"

// // import {
// //     LineChart,
// //     Line,
// //     XAxis,
// //     YAxis,
// //     Tooltip,
// //     ResponsiveContainer,
// //     CartesianGrid,
// // } from "recharts"

// // type Props = {
// //     data: {
// //         month: string
// //         value: number
// //     } []
// // }

// // export default function SalesChart({ data }: Props) {
// //     console.log("data in SalesChart: ", data);
// //     return (
// //         <div className="h-[300px]">
// //             <ResponsiveContainer width="100%" height="100%">
// //                 <LineChart data={data}>
// //                     <CartesianGrid strokeDasharray="3 3" />

// //                     <XAxis dataKey="month" />
// //                     <YAxis />

// //                     <Tooltip />

// //                     <Line
// //                         type="monotone"
// //                         dataKey="revenue"
// //                         stroke="#6366f1"
// //                         strokeWidth={2}
// //                         dot={false}
// //                     />
// //                 </LineChart>
// //             </ResponsiveContainer>
// //         </div>
// //     )
// // }


// "use client"

// // import {
// //     LineChart,
// //     Line,
// //     XAxis,
// //     YAxis,
// //     Tooltip,
// //     ResponsiveContainer,
// //     CartesianGrid,
// //     Area,
// //     AreaChart,
// // } from "recharts"
// import SalesGraphCard from "../SalesGraphCard"

// type Props = {
//     data: {
//         month: string
//         value: number
//     }[]
// }

// // type tooltipProps = {
// //     active?: boolean
// //     payload?: any[]
// //     label?: string
// // }

// const mockData = {
//     labels: ["Jan 23'", "Feb 23'", "Mar 23'", "Apr 23'", "May 23'", "Jun 23'", "Jul 23'", "Aug 23'", "Sep 23'", "Oct 23'", "Nov 23'"],
//     unitsSold: [88, 115, 155, 160, 95, 55, 130, 205, 155, 90, 125],
//     revenue: [75, 95, 105, 95, 70, 60, 85, 120, 100, 80, 105],
//     cost: [35, 42, 50, 48, 38, 32, 40, 55, 45, 38, 43],
//     profit: [30, 40, 45, 42, 32, 28, 35, 52, 40, 32, 42],
//     expenses: [60, 75, 90, 85, 65, 55, 70, 95, 78, 65, 75],
//     revenueBars: [75, 95, 105, 95, 70, 60, 85, 120, 100, 80, 105],
// }

// // const CustomTooltip = ({ active, payload, label }: tooltipProps) => {
// //     if (active && payload && payload.length) {
// //         return (
// //             <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3">
// //                 <p className="text-xs text-gray-400 mb-1">{label}</p>
// //                 <p className="text-sm font-bold text-blue-600">
// //                     ${payload[0].value?.toLocaleString()}
// //                 </p>
// //             </div>
// //         )
// //     }
// //     return null
// // }

// export default function SalesChart({ data }: Props) {
//     return (
//         // <div className="h-[300px]">
//         //     <ResponsiveContainer width="100%" height="100%">
//         //         <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
//         //             <defs>
//         //                 <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
//         //                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
//         //                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//         //                 </linearGradient>
//         //             </defs>

//         //             <CartesianGrid
//         //                 strokeDasharray="3 3"
//         //                 stroke="#f1f5f9"
//         //                 vertical={false}
//         //             />

//         //             <XAxis
//         //                 dataKey="month"
//         //                 tick={{ fontSize: 11, fill: "#94a3b8" }}
//         //                 axisLine={false}
//         //                 tickLine={false}
//         //             />
//         //             <YAxis
//         //                 tick={{ fontSize: 11, fill: "#94a3b8" }}
//         //                 axisLine={false}
//         //                 tickLine={false}
//         //                 tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
//         //             />

//         //             <Tooltip content={<CustomTooltip />} />

//         //             <Area
//         //                 type="monotone"
//         //                 dataKey="revenue"
//         //                 stroke="#3b82f6"
//         //                 strokeWidth={2.5}
//         //                 fill="url(#blueGrad)"
//         //                 dot={false}
//         //                 activeDot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
//         //             />
//         //         </AreaChart>
//         //     </ResponsiveContainer>
//         // </div>

//         <div className="p-6 bg-gray-50 min-h-screen">
//             <SalesGraphCard data={mockData} />
//         </div>
//     )
// }

"use client"

import { useMemo } from "react"
import { Chart } from "react-chartjs-2"
import { type ChartData, type ChartOptions } from "chart.js"
import ChartLegend from "./ChartLegend"
import { SalesGraphData } from "../../Type"

type Props = { data: SalesGraphData }

const LEGEND_ITEMS = [
    { label: "Expenses", color: "rgba(100,180,255,0.35)", type: "bar" as const },
    { label: "Revenue", color: "rgba(50,130,255,0.55)", type: "bar" as const },
    { label: "Units Sold", color: "#22c55e", type: "line" as const },
    { label: "Cost", color: "#f87171", type: "line" as const, dashed: true },
    { label: "Revenue line", color: "#60a5fa", type: "line" as const },
    { label: "Profit", color: "#fbbf24", type: "line" as const },
]

export default function SalesChart({ data }: Props) {
    const chartData: ChartData<"bar" | "line"> = useMemo(() => ({
        labels: data.labels,
        datasets: [
            {
                type: "bar" as const,
                label: "Expenses",
                data: data.expenses,
                backgroundColor: "rgba(100,180,255,0.25)",
                borderColor: "rgba(100,180,255,0.4)",
                borderWidth: 0.5,
                yAxisID: "y2",
                order: 5,
                borderRadius: 2,
            },
            {
                type: "bar" as const,
                label: "Revenue",
                data: data.revenueBars,
                backgroundColor: "rgba(50,130,255,0.45)",
                borderColor: "rgba(50,130,255,0.6)",
                borderWidth: 0.5,
                yAxisID: "y2",
                order: 4,
                borderRadius: 2,
            },
            {
                type: "line" as const,
                label: "Units Sold",
                data: data.unitsSold,
                borderColor: "#22c55e",
                borderWidth: 2.5,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#22c55e",
                tension: 0.4,
                yAxisID: "y1",
                order: 1,
            },
            {
                type: "line" as const,
                label: "Cost",
                data: data.cost,
                borderColor: "#f87171",
                borderWidth: 2,
                borderDash: [5, 4],
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#f87171",
                tension: 0.4,
                yAxisID: "y1",
                order: 2,
            },
            {
                type: "line" as const,
                label: "Revenue line",
                data: data.revenue,
                borderColor: "#60a5fa",
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#60a5fa",
                tension: 0.4,
                yAxisID: "y1",
                order: 3,
            },
            {
                type: "line" as const,
                label: "Profit",
                data: data.profit,
                borderColor: "#fbbf24",
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#fbbf24",
                tension: 0.4,
                yAxisID: "y1",
                order: 2,
            },
        ],
    }), [data])

    const options: ChartOptions<"bar"> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 0,
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(255,255,255,0.97)",
                borderColor: "rgba(100,160,255,0.3)",
                borderWidth: 1,
                titleColor: "#374151",
                bodyColor: "#6b7280",
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}K`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: "rgba(150,180,220,0.12)" },
                border: { display: false },
                ticks: { color: "#9ca3af", font: { size: 11 }, maxRotation: 0 },
            },
            y1: {
                position: "left",
                grid: { color: "rgba(150,180,220,0.12)" },
                border: { display: false },
                ticks: { color: "#9ca3af", font: { size: 11 }, callback: (v) => `${v}K` },
                min: 0,
            },
            y2: {
                position: "right",
                grid: { drawOnChartArea: false },
                border: { display: false },
                ticks: { color: "#9ca3af", font: { size: 11 }, callback: (v) => `${v}M` },
                min: 0,
            },
        },
    }), [])

    return (
        <>
            <div className="flex justify-between mb-1">
                <span className="text-[11px] text-gray-400">Units Sold/M</span>
                <span className="text-[11px] text-gray-400">Revenue, $k</span>
            </div>
            <div className="relative h-[300px] w-full min-w-0">
                <Chart type="bar" data={chartData} options={options} />
            </div>
            <ChartLegend items={LEGEND_ITEMS} />
        </>
    )
}