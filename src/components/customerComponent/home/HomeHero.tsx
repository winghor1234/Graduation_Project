"use client"

import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HomeHero() {
    return (
        <section className="relative h-[620px] lg:h-[720px] overflow-hidden bg-gray-950">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1556906781-9a412961a28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-gray-950/20" />

            <div className="relative container mx-auto px-6 max-w-7xl h-full flex items-center">
                <div className="max-w-lg space-y-7">
                    <span className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase text-amber-400 bg-amber-400/10 border border-amber-400/25 px-4 py-1.5 rounded-full">
                        ຄໍເລັກຊັ່ນໃໝ່ 2025
                    </span>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight">
                        ເຄື່ອງກີລາ<br />
                        <span className="text-amber-400">ຊັ້ນສູງ</span>
                    </h1>
                    <p className="text-[17px] text-gray-300 leading-relaxed font-light max-w-md">
                        ສຳລັບນັກກີລາທີ່ຕ້ອງການທັງຄຸນນະພາບ, ຄວາມສະດວກສະບາຍ ແລະ ສໄຕລ໌ທີ່ທັນສະໄໝ
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                        <Link href="/shop">
                            <Button
                                size="lg"
                                className="h-12 px-8 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold rounded-xl gap-2 transition-all"
                            >
                                ເລືອກຊື້ສິນຄ້າ <ArrowRight className="size-4" />
                            </Button>
                        </Link>
                        <Link href="/shop">
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 px-8 rounded-xl border-white/25 bg-white/5 text-white hover:bg-white/15 gap-2 transition-all"
                            >
                                <ShoppingBag className="size-4" /> ໝວດໝູ່ທັງໝົດ
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </section>
    )
}
