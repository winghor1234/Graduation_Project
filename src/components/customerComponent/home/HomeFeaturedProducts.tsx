"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/customerComponent/shop/ProductCard"
import { ProductListItem } from "@/components/customerComponent/shop/shop.types"

function FeaturedSkeleton() {
    return (
        <div className="space-y-3">
            <div className="aspect-square bg-gray-100 rounded-xl" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-9 bg-gray-100 rounded-lg" />
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
        <section className="py-16 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">ສິນຄ້າແນະນຳ</h2>
                    <Link
                        href="/customer/shop"
                        className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors"
                    >
                        ເບິ່ງທັງໝົດ <ArrowRight className="size-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <FeaturedSkeleton key={i} />)
                    ) : products.length === 0 ? (
                        <p className="col-span-4 text-center text-gray-400 py-12">
                            ບໍ່ມີສິນຄ້າໃນຂະນະນີ້
                        </p>
                    ) : (
                        products.map((product, index) => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                                onPickVariant={onPickVariant}
                                priority={index < 4}
                            />
                        ))
                    )}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Button asChild variant="outline" className="rounded-lg gap-2 h-10 px-5 text-sm">
                        <Link href="/customer/shop">
                            ເບິ່ງສິນຄ້າທັງໝົດ <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
