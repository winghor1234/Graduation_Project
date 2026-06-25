"use client"

import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"

export function HomeHero() {
    return (
        <section className="relative h-160 lg:h-185 overflow-hidden bg-brand-black">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1556906781-9a412961a28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)",
                }}
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-linear-to-r from-brand-black/96 via-brand-black/75 to-brand-black/20" />
            <div className="absolute inset-0 bg-linear-to-t from-brand-black/60 via-transparent to-transparent" />

            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-orange/8 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative container mx-auto px-6 max-w-7xl h-full flex items-center">
                <div className="max-w-xl space-y-8">

                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-brand-orange bg-brand-orange/10 border border-brand-orange/25 px-4 py-1.5 rounded-full">
                        <span className="size-1.5 rounded-full bg-brand-orange animate-pulse" />
                        ຄໍເລັກຊັ່ນໃໝ່ 2025
                    </span>

                    {/* Headline */}
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-white leading-[1.05] tracking-tight">
                        ເຄື່ອງກີລາ<br />
                        <span className="text-brand-orange">ຊັ້ນສູງ</span>
                    </h1>

                    {/* Sub */}
                    <p className="text-lg text-brand-muted leading-relaxed font-light max-w-md">
                        ສຳລັບນັກກີລາທີ່ຕ້ອງການທັງຄຸນນະພາບ,<br />
                        ຄວາມສະດວກສະບາຍ ແລະ ສໄຕລ໌ທີ່ທັນສະໄໝ
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link href="/shop">
                            <button className="inline-flex items-center gap-2 h-13 px-8 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-brand-orange/25 text-sm">
                                ເລືອກຊື້ສິນຄ້າ <ArrowRight className="size-4" />
                            </button>
                        </Link>
                        <Link href="/shop">
                            <button className="inline-flex items-center gap-2 h-13 px-8 text-brand-white font-semibold rounded-xl border border-brand-white/20 bg-brand-white/5 hover:bg-brand-white/12 transition-all duration-200 text-sm">
                                <ShoppingBag className="size-4" /> ໝວດໝູ່ທັງໝົດ
                            </button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 pt-4 border-t border-brand-white/10">
                        {[
                            { value: "500+", label: "ສິນຄ້າ" },
                            { value: "50+", label: "ຍີ່ຫໍ້" },
                            { value: "99%", label: "ພໍໃຈ" },
                        ].map((s) => (
                            <div key={s.label}>
                                <p className="text-2xl font-extrabold text-brand-white">{s.value}</p>
                                <p className="text-xs text-brand-muted mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom fade to page bg */}
            <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-brand-black to-transparent" />
        </section>
    )
}