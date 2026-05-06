"use client"

import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type TopProduct = {
    productName: string
    product_code: string
    price: number
    sold: number
}

type Props = {
    products: TopProduct[]
}

export function TopProducts({ products }: Props) {
    return (
        <div
            className={cn(
                "p-5 rounded-2xl shadow-sm border",
                theme.card
            )}
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">
                    Top Products
                </h3>

                <button
                    className={cn(
                        "text-xs px-3 py-1 rounded-lg transition",
                        theme.primarySoft,
                        theme.primary
                    )}
                >
                    View All
                </button>
            </div>

            {/* LIST */}
            <div className="space-y-3">
                {products.map((p, i) => (
                    <div
                        key={i}
                        className="
              flex items-center justify-between
              p-3 rounded-xl
              hover:bg-gray-50
              transition
            "
                    >
                        {/* LEFT */}
                        <div className="min-w-0">
                            <p className="font-medium text-slate-800 truncate">
                                {p.productName}
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className={cn(
                                        "text-xs",
                                        theme.subText
                                    )}
                                >
                                    {p.product_code}
                                </span>

                                <span className="text-gray-300">
                                    •
                                </span>

                                <span
                                    className={cn(
                                        "text-xs",
                                        theme.subText
                                    )}
                                >
                                    {p.sold} sold
                                </span>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="text-right">
                            <p
                                className={cn(
                                    "font-semibold",
                                    theme.primary
                                )}
                            >
                                ${p.price}
                            </p>

                            <p className="text-xs text-slate-400">
                                Revenue
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}