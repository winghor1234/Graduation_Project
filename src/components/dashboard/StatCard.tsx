// components/dashboard/StatCard.tsx
"use client"
type Props = {
    title: string
    value: number | string
    growth?: string
}

export function StatCard({ title, value, growth }: Props) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-sm text-gray-500">{title}</p>

            <div className="flex items-center justify-between mt-2">
                <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
                {growth && (
                    <span className="text-green-500 text-sm font-medium">
                        {growth}
                    </span>
                )}
            </div>

            {/* mini line */}
            <div className="mt-4 h-8 bg-gradient-to-r from-green-100 to-green-50 rounded-lg" />
        </div>
    )
}