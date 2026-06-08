"use client"

import { useMemo } from "react"
import { Chart } from "react-chartjs-2"
import { type ChartData, type ChartOptions } from "chart.js"
import ChartLegend from "./ChartLegend"
import { RevenueGraphData } from "@/components/Type"

type Props = { data: RevenueGraphData }

const LEGEND_ITEMS = [
    { label: "Gross Revenue", color: "#3b82f6", type: "bar" as const },
    { label: "Net Revenue", color: "#22c55e", type: "bar" as const },
    { label: "Refunds", color: "#f87171", type: "bar" as const },
    { label: "Tax", color: "#fbbf24", type: "bar" as const },
]

export default function RevenueChart({ data }: Props) {
    const chartData: ChartData<"bar"> = useMemo(() => ({
        labels: data.labels,
        datasets: [
            {
                type: "bar" as const,
                label: "Gross Revenue",
                data: data.grossRevenue,
                backgroundColor: "rgba(59,130,246,0.7)",
                borderColor: "#3b82f6",
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                type: "bar" as const,
                label: "Net Revenue",
                data: data.netRevenue,
                backgroundColor: "rgba(34,197,94,0.7)",
                borderColor: "#22c55e",
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                type: "bar" as const,
                label: "Refunds",
                data: data.refunds,
                backgroundColor: "rgba(248,113,113,0.7)",
                borderColor: "#f87171",
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                type: "bar" as const,
                label: "Tax",
                data: data.tax,
                backgroundColor: "rgba(251,191,36,0.7)",
                borderColor: "#fbbf24",
                borderWidth: 1,
                borderRadius: 4,
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
                    label: (ctx) => ` ${ctx.dataset.label}: $${ctx.parsed.y}K`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: "rgba(150,180,220,0.12)" },
                border: { display: false },
                ticks: { color: "#9ca3af", font: { size: 11 }, maxRotation: 0 },
            },
            y: {
                grid: { color: "rgba(150,180,220,0.12)" },
                border: { display: false },
                ticks: {
                    color: "#9ca3af",
                    font: { size: 11 },
                    callback: (v) => `$${v}K`,
                },
                min: 0,
            },
        },
    }), [])

    return (
        <>
            <div className="flex justify-between mb-1">
                <span className="text-[11px] text-gray-400">Amount, $K</span>
            </div>
            <div className="relative h-[300px] w-full min-w-0">
                <Chart type="bar" data={chartData} options={options} />
            </div>
            <ChartLegend items={LEGEND_ITEMS} />
        </>
    )
}