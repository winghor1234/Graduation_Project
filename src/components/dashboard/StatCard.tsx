'use client'
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type Props = {
    title: string
    value: number | string
    growth?: number
}

const StatCard = ({ title, value, growth = 0 }: Props) => {
    const isPositive = growth > 0
    const isZero = growth === 0

    const color = isPositive
        ? "text-green-500"
        : isZero
            ? "text-gray-400"
            : "text-red-500"

    const bg = isPositive
        ? "bg-green-500/10"
        : isZero
            ? "bg-gray-500/10"
            : "bg-red-500/10"

    return (
        <div className=" p-5 rounded-2xl shadow-md border border-white/5">

            <p className="text-sm text-gray-800 mb-1">{title}</p>

            <h2 className="text-2xl font-semibold text-gray-800">
                {value}
            </h2>

            <div className="mt-3 flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${bg}`}>

                    {isPositive && <ArrowUpRight size={14} />}
                    {!isPositive && !isZero && <ArrowDownRight size={14} />}

                    <span className={`text-xs font-medium ${color}`}>
                        {isPositive ? "+" : ""}
                        {growth.toFixed(2)}%
                    </span>
                </div>

                <span className="text-xs text-gray-800">
                    vs last month
                </span>
            </div>
        </div>
    )
}

export default StatCard