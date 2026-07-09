"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Promotion } from "@/modules/promotion/promotion.types"

type Props = {
    promotion?: Promotion
    isLoading?: boolean
}

export function HomePromoBanner({ promotion, isLoading }: Props) {
    if (isLoading) return <section className="h-72 bg-gray-900" />
    if (!promotion) return null

    const endDate = new Date(promotion.end_date).toLocaleDateString("lo-LA")

    return (
        <section className="py-20 bg-gray-900">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="max-w-lg mx-auto text-center space-y-5">

                    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-orange-400 border border-orange-400/30 px-3 py-1 rounded-full">
                        {promotion.promotion_code}
                    </span>

                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {promotion.promotion_name}
                    </h2>

                    <p className="text-gray-400 text-sm leading-relaxed">
                        {promotion.description ?? `ຫຼຸດ ${formatCurrency(promotion.discount_value)} · ໝົດ ${endDate}`}
                    </p>

                    <Button
                        asChild
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg gap-2 h-10 px-6"
                    >
                        <Link href="/customer/shop">
                            ຊື້ສິນຄ້າໂປໂມຊັນ <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
