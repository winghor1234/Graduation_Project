"use client"

import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type Variant = "blue" | "green" | "purple" | "orange"

type Props = {
    title: string
    value: number | string
    growth?: number
    icon?: LucideIcon
    variant?: Variant
}

const variantIcon: Record<Variant, { bg: string; text: string }> = {
    blue:   { bg: "bg-brand-blue-soft",  text: "text-brand-blue" },
    green:  { bg: "bg-emerald-50",       text: "text-emerald-600" },
    purple: { bg: "bg-indigo-50",        text: "text-indigo-600" },
    orange: { bg: "bg-orange-50",        text: "text-orange-500" },
}

const StatCard = ({ title, value, growth = 0, icon: Icon, variant = "blue" }: Props) => {
    const isPositive = growth > 0
    const isZero = growth === 0
    const { bg: iconBg, text: iconText } = variantIcon[variant]

    const textColor = isPositive ? theme.successText : isZero ? theme.subText : theme.dangerText
    const badgeBg   = isPositive ? theme.successSoft : isZero ? "bg-gray-100 border border-gray-200" : theme.dangerSoft

    return (
        <div className={cn(
            "p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200",
            theme.card
        )}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className={cn("text-xs font-medium", theme.subText)}>{title}</p>
                    <h2 className={cn("text-2xl font-bold mt-1.5", theme.text)}>{value}</h2>
                </div>
                {Icon && (
                    <div className={cn("size-11 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
                        <Icon className={cn("size-5", iconText)} />
                    </div>
                )}
            </div>

            {growth !== 0 && (
                <div className="mt-3 flex items-center gap-2">
                    <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-medium", badgeBg)}>
                        {isPositive
                            ? <ArrowUpRight size={12} className={textColor} />
                            : <ArrowDownRight size={12} className={textColor} />
                        }
                        <span className={textColor}>{isPositive ? "+" : ""}{growth.toFixed(1)}%</span>
                    </div>
                    <span className={cn("text-xs", theme.subText)}>ທຽບເດືອນຜ່ານມາ</span>
                </div>
            )}
        </div>
    )
}

export default StatCard