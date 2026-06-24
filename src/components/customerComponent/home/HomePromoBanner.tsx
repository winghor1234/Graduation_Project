"use client"

import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HomePromoBanner() {
    return (
        <section className="py-28 bg-gray-950 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative">
                <div className="max-w-xl mx-auto text-center space-y-7">

                    <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-full px-4 py-2 text-sm font-semibold">
                        <Zap className="size-4" />
                        SportPro Rewards
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                        ເຂົ້າຮ່ວມໂປຣແກຣມ<br />
                        <span className="text-amber-400">ສະມາຊິກ SportPro</span>
                    </h2>

                    <p className="text-gray-400 text-[17px] leading-relaxed">
                        ຮັບໂປໂມຊັ່ນພິເສດ, ສ່ວນຫຼຸດສຸດພິເສດ ແລະ ສິດ​ເຂົ້າ​ເຖິງ<br />
                        ສິນຄ້າ​ໃໝ່​ກ່ອນ​ໃຜກ່ອນ
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                        <Link href="/shop">
                            <Button
                                size="lg"
                                className="h-12 px-8 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold rounded-xl gap-2"
                            >
                                ສະໝັກສະມາຊິກຕອນນີ້ <ArrowRight className="size-4" />
                            </Button>
                        </Link>
                        <Link href="/shop">
                            <Button
                                size="lg"
                                variant="ghost"
                                className="h-12 px-8 text-gray-400 hover:text-white rounded-xl"
                            >
                                ຫຼືເລືອກຊື້ສິນຄ້າ
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
