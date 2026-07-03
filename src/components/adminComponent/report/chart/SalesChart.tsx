

"use client"

import { useMemo } from "react"
import { Chart } from "react-chartjs-2"
import { type ChartData, type ChartOptions } from "chart.js"
import ChartLegend from "./ChartLegend"
import { SalesGraphData } from "../../../Type"

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

    const options: ChartOptions<"bar" | "line"> = useMemo(() => ({
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
                <span className="text-[11px] text-admin-muted">Units Sold/M</span>
                <span className="text-[11px] text-admin-muted">Revenue, $k</span>
            </div>
            <div className="relative h-[300px] w-full min-w-0">
                <Chart<"bar" | "line"> type="bar" data={chartData} options={options} />
            </div>
            <ChartLegend items={LEGEND_ITEMS} />
        </>
    )
}