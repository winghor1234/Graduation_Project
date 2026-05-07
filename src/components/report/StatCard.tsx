// // type Props = {
// //     title: string
// //     value: string
// //     sub?: string
// //     growth?: string
// //     icon: React.ReactNode
// //     color?: "green" | "blue" | "purple" | "orange"
// // }

// // const colorMap = {
// //     green: {
// //         bg: "bg-green-50",
// //         icon: "bg-green-100 text-green-600",
// //         accent: "border-green-200"
// //     },
// //     blue: {
// //         bg: "bg-blue-50",
// //         icon: "bg-blue-100 text-blue-600",
// //         accent: "border-blue-200"
// //     },
// //     purple: {
// //         bg: "bg-purple-50",
// //         icon: "bg-purple-100 text-purple-600",
// //         accent: "border-purple-200"
// //     },
// //     orange: {
// //         bg: "bg-orange-50",
// //         icon: "bg-orange-100 text-orange-600",
// //         accent: "border-orange-200"
// //     },

// // }

// // export default function StatCard({
// //     title,
// //     value,
// //     sub,
// //     growth,
// //     icon,
// //     color = "blue"
// // }: Props) {

// //     const theme = colorMap[color]

// //     return (
// //         <div className={`
// //             ${theme.bg}
// //             ${theme.accent}
// //             border
// //             p-3
// //             rounded-xl
// //             shadow-sm
// //             space-y-2
// //             hover:shadow-md
// //             transition
// //         `}>

// //             {/* TOP */}
// //             <div className="flex justify-between items-center">
// //                 <div className={`p-2 rounded-lg ${theme.icon}`}>
// //                     {icon}
// //                 </div>

// //                 {growth && (
// //                     <span className="text-xs font-medium text-green-600">
// //                         ↑ {growth}
// //                     </span>
// //                 )}
// //             </div>

// //             {/* TITLE */}
// //             <p className="text-xs text-gray-500">
// //                 {title}
// //             </p>

// //             {/* VALUE */}
// //             <h2 className="text-lg font-semibold text-gray-800 leading-none">
// //                 {value}
// //             </h2>

// //             {/* SUB */}
// //             {sub && (
// //                 <p className="text-[11px] text-gray-400">
// //                     {sub}
// //                 </p>
// //             )}
// //         </div>
// //     )
// // }



// type Props = {
//     title: string
//     value: string
//     sub?: string
//     growth?: string
//     icon: React.ReactNode
//     color?: "green" | "blue" | "purple" | "orange" 
// }

// const colorMap = {
//     green: {
//         iconBg: "bg-emerald-50",
//         iconColor: "text-emerald-500",
//         dot: "bg-emerald-400",
//     },
//     blue: {
//         iconBg: "bg-blue-50",
//         iconColor: "text-blue-500",
//         dot: "bg-blue-400",
//     },
//     purple: {
//         iconBg: "bg-violet-50",
//         iconColor: "text-violet-500",
//         dot: "bg-violet-400",
//     },
//     orange: {
//         iconBg: "bg-amber-50",
//         iconColor: "text-amber-500",
//         dot: "bg-amber-400",
//     },
// }

// export default function StatCard({
//     title,
//     value,
//     sub,
//     growth,
//     icon,
//     color = "blue",
// }: Props) {
//     const theme = colorMap[color]

//     return (
//         <div className="
//             bg-white
//             border border-gray-100
//             rounded-2xl
//             p-5
//             shadow-sm
//             hover:shadow-md
//             hover:-translate-y-0.5
//             transition-all duration-200
//             flex flex-col gap-4
//         ">
//             {/* TOP ROW */}
//             <div className="flex items-center justify-between">
//                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.iconBg} ${theme.iconColor}`}>
//                     {icon}
//                 </div>
//                 {growth && (
//                     <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
//                         ↑ {growth}
//                     </span>
//                 )}
//             </div>

//             {/* BODY */}
//             <div className="space-y-1">
//                 <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
//                     {title}
//                 </p>
//                 <h2 className="text-2xl font-bold text-gray-800 leading-tight">
//                     {value}
//                 </h2>
//                 {sub && (
//                     <p className="text-xs text-gray-400">{sub}</p>
//                 )}
//             </div>

//             {/* BOTTOM ACCENT BAR */}
//             <div className={`h-1 w-10 rounded-full ${theme.dot}`} />
//         </div>
//     )
// }


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

function formatValue(value: number, prefix?: string): string {
    if (value >= 1_000_000) return `${prefix ?? ""}${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${prefix ?? ""}${(value / 1_000).toFixed(1)}K`
    return `${prefix ?? ""}${value}`
}

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
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{title}</p>
                <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                    {formatValue(value, prefix)}
                </h2>
                {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
            </div>

            {/* Accent bar */}
            <div className={`h-1 w-10 rounded-full ${theme.dot}`} />
        </div>
    )
}