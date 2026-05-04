type Props = {
    title: string
    value: string
    sub?: string
    growth?: string
    icon: React.ReactNode
    color?: "green" | "blue" | "purple" | "orange"
}

const colorMap = {
    green: {
        bg: "bg-green-50",
        icon: "bg-green-100 text-green-600",
        accent: "border-green-200"
    },
    blue: {
        bg: "bg-blue-50",
        icon: "bg-blue-100 text-blue-600",
        accent: "border-blue-200"
    },
    purple: {
        bg: "bg-purple-50",
        icon: "bg-purple-100 text-purple-600",
        accent: "border-purple-200"
    },
    orange: {
        bg: "bg-orange-50",
        icon: "bg-orange-100 text-orange-600",
        accent: "border-orange-200"
    },
}

export default function StatCard({
    title,
    value,
    sub,
    growth,
    icon,
    color = "blue"
}: Props) {

    const theme = colorMap[color]

    return (
        <div className={`
            ${theme.bg}
            ${theme.accent}
            border
            p-3
            rounded-xl
            shadow-sm
            space-y-2
            hover:shadow-md
            transition
        `}>

            {/* TOP */}
            <div className="flex justify-between items-center">
                <div className={`p-2 rounded-lg ${theme.icon}`}>
                    {icon}
                </div>

                {growth && (
                    <span className="text-xs font-medium text-green-600">
                        ↑ {growth}
                    </span>
                )}
            </div>

            {/* TITLE */}
            <p className="text-xs text-gray-500">
                {title}
            </p>

            {/* VALUE */}
            <h2 className="text-lg font-semibold text-gray-800 leading-none">
                {value}
            </h2>

            {/* SUB */}
            {sub && (
                <p className="text-[11px] text-gray-400">
                    {sub}
                </p>
            )}
        </div>
    )
}