"use client"

import { formatCurrency } from "@/utils/FormatCurrency"
import Link from "next/link"
import { TrendingUp } from "lucide-react"

type TopProduct = {
    productName: string
    product_code: string
    price: number
    sold: number
}

type Props = {
    products?: TopProduct[]
}

const rankColor = ["#f59e0b", "#94a3b8", "#cd7c48"]

export function TopProducts({ products = [] }: Props) {
    const maxSold = Math.max(...products.map((p) => p.sold), 1)

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="font-semibold text-gray-800">ສິນຄ້າຍອດນິຍົມ</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Top {products.length} ສິນຄ້າຂາຍດີ</p>
                </div>
                <Link
                    href="/report/product"
                    className="text-xs text-blue-500 hover:text-blue-600 hover:underline transition"
                >
                    ເບິ່ງທັງໝົດ →
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                    ຍັງບໍ່ມີຂໍ້ມູນ
                </div>
            ) : (
                <div className="space-y-4">
                    {products.map((p, i) => {
                        const pct = Math.round((p.sold / maxSold) * 100)
                        const isTop3 = i < 3
                        return (
                            <div key={i} className="group">
                                <div className="flex items-center gap-3 mb-1.5">
                                    {/* Rank */}
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                                        style={
                                            isTop3
                                                ? { backgroundColor: rankColor[i] + "22", color: rankColor[i] }
                                                : { backgroundColor: "#f3f4f6", color: "#9ca3af" }
                                        }
                                    >
                                        {i + 1}
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{p.productName}</p>
                                        <p className="text-[11px] text-gray-400">{p.product_code}</p>
                                    </div>

                                    {/* Right */}
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-blue-600">{formatCurrency(p.price)}</p>
                                        <div className="flex items-center gap-1 justify-end mt-0.5">
                                            <TrendingUp size={10} className="text-emerald-500" />
                                            <span className="text-[11px] text-emerald-600 font-medium">{p.sold} ຊິ້ນ</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="ml-9 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${pct}%`,
                                            backgroundColor: isTop3 ? rankColor[i] : "#93c5fd",
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
