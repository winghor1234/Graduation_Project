"use client"

import { useState, useMemo } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler, type ChartOptions, type ChartData,} from "chart.js"
import { Chart } from "react-chartjs-2"
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler)

export type SalesGraphData = {
    labels: string[]
    unitsSold: number[]
    revenue: number[]
    cost: number[]
    profit: number[]
    expenses: number[]
    revenueBars: number[]
}

type Props = { data: SalesGraphData }
type ViewMode = "M" | "Y"
type ActiveTab = "Sales" | "Revenue" | "Inventory"

const TABS: ActiveTab[] = ["Sales", "Revenue", "Inventory"]

const LEGEND_ITEMS = [
    { label: "Expenses", color: "rgba(100,180,255,0.35)", type: "bar" },
    { label: "Revenue", color: "rgba(50,130,255,0.6)", type: "bar" },
    { label: "Units Sold", color: "#22c55e", type: "line" },
    { label: "Cost", color: "#f87171", type: "line" },
    { label: "Revenue line", color: "#60a5fa", type: "line" },
    { label: "Profit", color: "#fbbf24", type: "line" },
] as const

export default function SalesGraphCard({ data }: Props) {
    const [view, setView] = useState<ViewMode>("M")
    const [tab, setTab] = useState<ActiveTab>("Sales")

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
                ticks: {
                    color: "#9ca3af",
                    font: { size: 11 },
                    callback: (v) => `${v}K`,
                },
                min: 0,
                max: 280,
            },
            y2: {
                position: "right",
                grid: { drawOnChartArea: false },
                border: { display: false },
                ticks: {
                    color: "#9ca3af",
                    font: { size: 11 },
                    callback: (v) => `${v}M`,
                },
                min: 0,
                max: 7,
            },
        },
    }), [])

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm w-full min-w-0">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h2 className="text-[15px] font-semibold text-gray-800">Sales Graph</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">Performance overview by period</p>
                </div>
                <div className="flex items-center gap-3 border-2 border-red-600">
                    {/* Tabs */}
                    <div className="flex bg-gray-100 rounded-full p-0.5 gap-0.5">
                        {TABS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-3.5 py-1 text-xs rounded-full font-medium transition-all ${tab === t
                                        ? "bg-white text-gray-800 shadow-sm"
                                        : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    {/* View toggle */}
                    <div className="flex gap-1">
                        {(["M", "Y"] as ViewMode[]).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`px-3 py-1 text-xs rounded-lg border font-medium transition-all ${view === v
                                        ? "bg-blue-50 border-blue-200 text-blue-600"
                                        : "bg-transparent border-gray-200 text-gray-400 hover:border-gray-300"
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Axis labels */}
            <div className="flex justify-between mb-1">
                <span className="text-[11px] text-gray-400">Units Sold/M</span>
                <span className="text-[11px] text-gray-400">Revenue, $k</span>
            </div>

            {/* Chart */}
            <div className="relative h-[300px] w-full min-w-0">
                <Chart type="bar" data={chartData} options={options} />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-gray-50">
                {LEGEND_ITEMS.map((item) => (
                    <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        {item.type === "bar" ? (
                            <span
                                className="w-6 h-2.5 rounded-sm inline-block"
                                style={{ backgroundColor: item.color }}
                            />
                        ) : (
                            <span
                                className="w-6 h-[2.5px] inline-block rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                        )}
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    )
}