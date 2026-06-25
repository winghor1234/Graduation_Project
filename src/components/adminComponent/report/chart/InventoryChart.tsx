"use client"

import { useMemo } from "react"
import { Chart, Line } from "react-chartjs-2"
import { type ChartData, type ChartOptions } from "chart.js"
import ChartLegend from "./ChartLegend"
import { InventoryGraphData } from "../../../Type"

type Props = { data: InventoryGraphData }

const LEGEND_ITEMS = [
    { label: "In Stock", color: "#3b82f6", type: "line" as const },
    { label: "Low Stock", color: "#fbbf24", type: "line" as const },
    { label: "Out of Stock", color: "#f87171", type: "line" as const },
    { label: "Received", color: "#22c55e", type: "bar" as const },
]

export default function InventoryChart({ data }: Props) {
    const chartData: ChartData<"bar" | "line"> = useMemo(() => ({
        labels: data.labels,
        datasets: [
            {
                type: "bar" as const,
                label: "Received",
                data: data.received,
                backgroundColor: "rgba(34,197,94,0.2)",
                borderColor: "rgba(34,197,94,0.4)",
                borderWidth: 0.5,
                yAxisID: "y2",
                order: 4,
                borderRadius: 3,
            },
            {
                type: "line" as const,
                label: "In Stock",
                data: data.inStock,
                borderColor: "#3b82f6",
                borderWidth: 2.5,
                backgroundColor: "rgba(59,130,246,0.08)",
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#3b82f6",
                tension: 0.4,
                yAxisID: "y1",
                order: 1,
            },
            {
                type: "line" as const,
                label: "Low Stock",
                data: data.lowStock,
                borderColor: "#fbbf24",
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#fbbf24",
                tension: 0.4,
                yAxisID: "y1",
                order: 2,
            },
            {
                type: "line" as const,
                label: "Out of Stock",
                data: data.outOfStock,
                borderColor: "#f87171",
                borderWidth: 2,
                borderDash: [5, 4],
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#f87171",
                tension: 0.4,
                yAxisID: "y1",
                order: 3,
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
                    label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} units`,
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
                ticks: { color: "#9ca3af", font: { size: 11 }, callback: (v) => `${v}` },
                min: 0,
            },
            y2: {
                position: "right",
                grid: { drawOnChartArea: false },
                border: { display: false },
                ticks: { color: "#9ca3af", font: { size: 11 }, callback: (v) => `+${v}` },
                min: 0,
            },
        },
    }), [])

    return (
        <>
            <div className="flex justify-between mb-1">
                <span className="text-[11px] text-admin-muted">Stock Units</span>
                <span className="text-[11px] text-admin-muted">Received</span>
            </div>
            <div className="relative h-[300px] w-full min-w-0">
                <Chart type="bar" data={chartData} options={options} />
            </div>
            <ChartLegend items={LEGEND_ITEMS} />
        </>
    )
}