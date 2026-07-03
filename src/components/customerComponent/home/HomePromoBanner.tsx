"use client"

import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Promotion } from "@/modules/promotion/promotion.types"

type Props = {
    promotion?: Promotion
    isLoading?: boolean
}

export function HomePromoBanner({ promotion, isLoading }: Props) {
    if (isLoading) {
        return <section className="py-28 bg-gray-950 h-[420px] animate-pulse" />
    }

    const badgeLabel = promotion ? promotion.promotion_code : "SportPro Rewards"
    const heading = promotion ? promotion.promotion_name : "ເຂົ້າຮ່ວມໂປຣແກຣມ"
    const subHeading = promotion
        ? `ຫຼຸດ ${formatCurrency(promotion.discount_value)} ກີບ`
        : "ສະມາຊິກ SportPro"
    const description = promotion
        ? (promotion.description ?? "ໃຊ້ໄດ້ກັບສິນຄ້າທີ່ເຂົ້າຮ່ວມໂປຣໂມຊັ່ນ ຮອດວັນທີ " + new Date(promotion.end_date).toLocaleDateString("lo-LA"))
        : "ຮັບໂປໂມຊັ່ນພິເສດ, ສ່ວນຫຼຸດສຸດພິເສດ ແລະ ສິດເຂົ້າເຖິງສິນຄ້າໃໝ່ກ່ອນໃຜກ່ອນ"
    const ctaLabel = promotion ? "ຊື້ສິນຄ້າໂປຣໂມຊັ່ນ" : "ເລືອກຊື້ສິນຄ້າ"

    return (
        <section className="py-28 bg-gray-950 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative">
                <div className="max-w-xl mx-auto text-center space-y-7">

                    <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-full px-4 py-2 text-sm font-semibold">
                        <Zap className="size-4" />
                        {badgeLabel}
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                        {heading}<br />
                        <span className="text-amber-400">{subHeading}</span>
                    </h2>

                    <p className="text-gray-400 text-[17px] leading-relaxed">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 px-8 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold rounded-xl gap-2"
                        >
                            <Link href="/shop">
                                {ctaLabel} <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
