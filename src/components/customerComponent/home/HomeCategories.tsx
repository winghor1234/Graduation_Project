"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CategoryItem } from "@/components/customerComponent/shop/shop.types"

const PALETTES = [
    "from-violet-600 to-indigo-800",
    "from-rose-500  to-pink-800",
    "from-amber-500 to-orange-700",
    "from-emerald-600 to-teal-800",
    "from-sky-500  to-blue-800",
    "from-slate-700 to-gray-900",
] as const

function CategorySkeleton() {
    return <div className="h-52 bg-gray-100 rounded-2xl animate-pulse" />
}

type Props = {
    categories: CategoryItem[]
    isLoading: boolean
}

export function HomeCategories({ categories, isLoading }: Props) {
    if (!isLoading && categories.length === 0) return null

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="text-center mb-12">
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-500 mb-2">ສິນຄ້າ</p>
                    <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
                        ເລືອກຊື້ຕາມໝວດໝູ່
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
                        : categories.map((cat, i) => (
                            <Link
                                key={cat.category_id}
                                href={`/shop?category_id=${cat.category_id}`}
                                className={`group relative h-52 rounded-2xl overflow-hidden bg-gradient-to-br ${PALETTES[i % PALETTES.length]} flex flex-col justify-end p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                            >
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                <div className="relative space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-white">
                                            {cat.category_name}
                                        </h3>
                                        <ArrowRight className="size-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                                    </div>
                                    {typeof cat._count?.products === "number" && (
                                        <p className="text-sm text-white/60">
                                            {cat._count.products} ລາຍການ
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}
