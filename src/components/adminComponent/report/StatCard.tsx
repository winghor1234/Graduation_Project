

import { formatCurrency } from "@/utils/FormatCurrency"
import { ReactNode } from "react"

type Color = "blue" | "green" | "red" | "purple" | "amber"

type Props = {
    title: string
    value: number
    prefix?: string
    growth?: number
    sub?: string
    icon: ReactNode
    color?: Color
}

const colorMap: Record<Color, {
    iconBg: string
    iconText: string
    dot: string
}> = {
    blue: { iconBg: "bg-blue-50", iconText: "text-blue-500", dot: "bg-blue-400" },
    green: { iconBg: "bg-emerald-50", iconText: "text-emerald-500", dot: "bg-emerald-400" },
    red: { iconBg: "bg-red-50", iconText: "text-red-400", dot: "bg-red-400" },
    purple: { iconBg: "bg-violet-50", iconText: "text-violet-500", dot: "bg-violet-400" },
    amber: { iconBg: "bg-amber-50", iconText: "text-amber-500", dot: "bg-amber-400" },
}

// function formatValue(value: number, prefix?: string): string {
//     if (value >= 1_000_000) return `${prefix ?? ""}${(value / 1_000_000).toFixed(1)}M`
//     if (value >= 1_000) return `${prefix ?? ""}${(value / 1_000).toFixed(1)}K`
//     return `${prefix ?? ""}${value}`
// }

export default function StatCard({ title, value, prefix, growth, sub, icon, color = "blue" }: Props) {
    const theme = colorMap[color]
    const isPositive = (growth ?? 0) >= 0

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">

            {/* Top row */}
            <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${theme.iconBg} ${theme.iconText}`}>
                    {icon}
                </div>
                {growth !== undefined && (
                    <span className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isPositive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                        }`}>
                        {isPositive ? "↑" : "↓"} {Math.abs(growth)}%
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="space-y-0.5">
                <p className="text-[11px] font-medium text-admin-muted uppercase tracking-wide">{title}</p>
                <h2 className="text-2xl font-bold text-admin-text leading-tight">
                    {formatCurrency(value)}
                </h2>
                {sub && <p className="text-[11px] text-admin-muted">{sub}</p>}
            </div>

            {/* Accent bar */}
            <div className={`h-1 w-10 rounded-full ${theme.dot}`} />
        </div>
    )
}