"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type Props = {
    title: string
    value: number | string
    growth?: number
}

const StatCard = ({
    title,
    value,
    growth = 0,
}: Props) => {
    const isPositive = growth > 0
    const isZero = growth === 0

    const textColor = isPositive
        ? theme.successText
        : isZero
            ? theme.subText
            : theme.dangerText

    const badgeBg = isPositive
        ? theme.successSoft
        : isZero
            ? "bg-gray-100 border border-gray-200"
            : theme.dangerSoft

    return (
        <div
            className={cn(
                "p-4 rounded-2xl border shadow-sm transition-all duration-200",
                "hover:shadow-md",
                theme.card
            )}
        >
            {/* TITLE */}
            <p className={cn("text-xs mb-1", theme.subText)}>
                {title}
            </p>

            {/* VALUE */}
            <h2 className="text-xl font-semibold text-slate-900">
                {value}
            </h2>

            {/* GROWTH */}
            <div className="mt-3 flex items-center gap-2">

                <div
                    className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg border",
                        badgeBg
                    )}
                >
                    {isPositive && (
                        <ArrowUpRight
                            size={14}
                            className={textColor}
                        />
                    )}

                    {!isPositive && !isZero && (
                        <ArrowDownRight
                            size={14}
                            className={textColor}
                        />
                    )}

                    <span
                        className={cn(
                            "text-xs font-medium",
                            textColor
                        )}
                    >
                        {isPositive ? "+" : ""}
                        {growth.toFixed(2)}%
                    </span>
                </div>

                <span
                    className={cn(
                        "text-xs",
                        theme.subText
                    )}
                >
                    vs last month
                </span>
            </div>
        </div>
    )
}

export default StatCard