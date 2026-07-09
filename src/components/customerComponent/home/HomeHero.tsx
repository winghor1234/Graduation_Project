"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

type Props = {
    totalProducts: number
    totalCategories: number
    isLoading?: boolean
}

export function HomeHero({ totalProducts, totalCategories, isLoading }: Props) {
    return (
        <section className="relative h-115 lg:h-135 overflow-hidden bg-gray-950">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-35"
                style={{
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1556906781-9a412961a28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)",
                }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-gray-950/95 via-gray-950/70 to-transparent" />

            <div className="relative container mx-auto px-6 max-w-7xl h-full flex items-center">
                <div className="max-w-lg space-y-6">

                    <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                        ເຄື່ອງກີລາ<br />
                        <span className="text-orange-400">ຊັ້ນສູງ</span>
                    </h1>

                    <p className="text-gray-400 text-base leading-relaxed">
                        ສຳລັບນັກກີລາທີ່ຕ້ອງການທັງຄຸນນະພາບ, ຄວາມສະດວກສະບາຍ ແລະ ສໄຕລ໌ທີ່ທັນສະໄໝ
                    </p>

                    <div className="flex gap-3 pt-1">
                        <Link
                            href="/customer/shop"
                            className="inline-flex items-center gap-2 h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm"
                        >
                            ເລືອກຊື້ສິນຄ້າ <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="flex gap-10 pt-2 border-t border-white/10">
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {isLoading
                                    ? <span className="inline-block h-6 w-10 rounded bg-white/10" />
                                    : `${totalProducts}+`
                                }
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">ສິນຄ້າ</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {isLoading
                                    ? <span className="inline-block h-6 w-10 rounded bg-white/10" />
                                    : `${totalCategories}+`
                                }
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">ໝວດໝູ່</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
