"use client"

import Link from "next/link"
import Image from "next/image"
import { Flame } from "lucide-react"
import { useGetBestSellers } from "@/app/features/hooks/Product"
import { formatCurrency } from "@/utils/FormatCurrency"

function BestSellerSkeleton() {
    return (
        <div className="w-44 sm:w-52 shrink-0 space-y-3 animate-pulse">
            <div className="aspect-square bg-gray-100 rounded-xl" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
    )
}

export function BestSellersRail() {
    const { data: bestSellers, isLoading } = useGetBestSellers(10)

    // ✅ ບໍ່ມີຍອດຂາຍຈິງ — ບໍ່ສະແດງ section ນີ້ (ບໍ່ແຕ່ງຂໍ້ມູນຂຶ້ນມາ)
    if (!isLoading && !bestSellers?.length) return null

    return (
        <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
                <div className="size-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                    <Flame className="size-4 text-brand-orange" />
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-gray-900">ສິນຄ້າຂາຍດີ</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-none">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <BestSellerSkeleton key={i} />)
                ) : (
                    bestSellers!.map((product, index) => (
                        <Link
                            key={product.product_id}
                            href={`/customer/shop/${product.product_id}`}
                            className="group w-44 sm:w-52 shrink-0 snap-start bg-brand-card-dark rounded-xl overflow-hidden border border-brand-divider hover:border-brand-orange/50 transition-colors"
                        >
                            <div className="aspect-square relative overflow-hidden bg-brand-black">
                                <Image
                                    src={product.images?.[0]?.image_url || "/placeholder.png"}
                                    alt={product.product_name}
                                    fill
                                    sizes="220px"
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    priority={index < 3}
                                />
                                <span className="absolute top-2 left-2 flex items-center justify-center size-6 rounded-full bg-brand-orange text-white text-xs font-extrabold">
                                    {index + 1}
                                </span>
                            </div>
                            <div className="p-3 space-y-1">
                                <h3 className="text-sm font-semibold text-brand-white line-clamp-1">
                                    {product.product_name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-brand-orange">
                                        {formatCurrency(product.min_price)}
                                    </p>
                                    <p className="text-[10px] text-brand-muted">ຂາຍແລ້ວ {product.sold_count}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
    )
}
