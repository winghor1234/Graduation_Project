"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CategoryItem } from "@/components/customerComponent/shop/shop.types"

function CategorySkeleton() {
    return <div className="h-16 bg-gray-100 rounded-xl" />
}

type Props = {
    categories: CategoryItem[]
    isLoading: boolean
}

export function HomeCategories({ categories, isLoading }: Props) {
    if (!isLoading && categories.length === 0) return null

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 max-w-7xl">

                <h2 className="text-2xl font-bold text-gray-900 mb-8">ເລືອກຊື້ຕາມໝວດໝູ່</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
                        : categories.map(cat => (
                            <Link
                                key={cat.category_id}
                                href={`/customer/shop?category_id=${cat.category_id}`}
                                className="group flex items-center justify-between px-4 py-3.5 bg-white border border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50/40 transition-colors"
                            >
                                <span className="font-medium text-gray-800 text-sm group-hover:text-orange-600 transition-colors">
                                    {cat.category_name}
                                </span>
                                <div className="flex items-center gap-2 text-gray-400">
                                    {typeof cat._count?.products === "number" && (
                                        <span className="text-xs">{cat._count.products} ລາຍການ</span>
                                    )}
                                    <ArrowRight className="size-3.5 group-hover:text-orange-500 transition-colors" />
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}
