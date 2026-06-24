"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/customerComponent/shop/ProductCard"
import { ProductListItem } from "@/components/customerComponent/shop/shop.types"

function FeaturedSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            <div className="aspect-square bg-gray-100 rounded-2xl" />
            <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
            <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
            <div className="h-9 bg-gray-100 rounded-xl" />
        </div>
    )
}

type Props = {
    products: ProductListItem[]
    isLoading: boolean
    onPickVariant: (product: ProductListItem) => void
}

export function HomeFeaturedProducts({ products, isLoading, onPickVariant }: Props) {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-500 mb-2">SportPro</p>
                        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
                            ສິນຄ້າແນະນຳ
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors group"
                    >
                        ເບິ່ງທັງໝົດ
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <FeaturedSkeleton key={i} />)
                    ) : products.length === 0 ? (
                        <p className="col-span-4 text-center text-gray-400 py-12">
                            ບໍ່ມີສິນຄ້າໃນຂະນະນີ້
                        </p>
                    ) : (
                        products.map(product => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                                onPickVariant={onPickVariant}
                            />
                        ))
                    )}
                </div>

                <div className="mt-10 text-center sm:hidden">
                    <Link href="/shop">
                        <Button variant="outline" className="rounded-xl gap-2 h-11 px-6">
                            ເບິ່ງສິນຄ້າທັງໝົດ <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
