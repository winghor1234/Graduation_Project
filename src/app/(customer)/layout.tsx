import { ReactNode } from "react"
import Link from "next/link"
import { CustomerProvider } from "@/components/customerComponent/CustomerContext"
import { CustomerNavbar } from "@/components/customerComponent/home/CustomerNavbar"

export const metadata = {
    title: "SPORTPRO",
    description: "ເຄື່ອງກີລາ ແລະ ເກີບຊັ້ນສູງ ສຳລັບນັກກີລາ.",
}

export default function CustomerLayout({ children }: { children: ReactNode }) {
    return (
        <CustomerProvider>
            <div className="min-h-screen flex flex-col bg-white">

                <CustomerNavbar />

                <main className="flex-1">
                    {children}
                </main>

                {/* ── Footer ── */}
                <footer className="bg-gray-950 text-white">
                    <div className="container mx-auto px-6 max-w-7xl py-16">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

                            {/* Brand */}
                            <div className="md:col-span-4 space-y-4">
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-2xl font-extrabold tracking-tight text-white">SPORT</span>
                                    <span className="text-2xl font-extrabold tracking-tight text-amber-400">PRO</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                                    ເຄື່ອງກີລາ ແລະ ເກີບຊັ້ນສູງ ອອກແບບ ສຳລັບນັກກີລາທີ່ຮັກການເຄື່ອນໄຫວ
                                </p>
                                <p className="text-xs text-gray-600 font-medium tracking-widest uppercase">
                                    Performance · Style · Quality
                                </p>
                            </div>

                            {/* Spacer */}
                            <div className="hidden md:block md:col-span-2" />

                            {/* Links */}
                            <div className="md:col-span-2 space-y-4">
                                <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400">ຮ້ານຄ້າ</h4>
                                <ul className="space-y-3 text-sm">
                                    <li>
                                        <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">
                                            ສິນຄ້າທັງໝົດ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
                                            ໜ້າຫຼັກ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
                                            ກະຕ່າສິນຄ້າ
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400">ລູກຄ້າ</h4>
                                <ul className="space-y-3 text-sm">
                                    <li>
                                        <Link href="/order-history" className="text-gray-400 hover:text-white transition-colors">
                                            ປະຫວັດການສັ່ງຊື້
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="text-gray-600 cursor-default">ຕິດຕໍ່ພວກເຮົາ</span>
                                    </li>
                                    <li>
                                        <span className="text-gray-600 cursor-default">ຂໍ້ມູນການຈັດສົ່ງ</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400">ກ່ຽວກັບ</h4>
                                <ul className="space-y-3 text-sm">
                                    <li>
                                        <span className="text-gray-600 cursor-default">ກ່ຽວກັບພວກເຮົາ</span>
                                    </li>
                                    <li>
                                        <span className="text-gray-600 cursor-default">ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ</span>
                                    </li>
                                    <li>
                                        <span className="text-gray-600 cursor-default">ຮ່ວມງານກັບເຮົາ</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-white/5">
                        <div className="container mx-auto px-6 max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
                            <p className="text-xs text-gray-600">
                                © 2026 SportPro. ສະຫງວນລິຂະສິດທຸກຢ່າງ.
                            </p>
                            <p className="text-xs text-gray-600">
                                Made in <span className="text-amber-500 font-semibold">Laos 🇱🇦</span>
                            </p>
                        </div>
                    </div>
                </footer>

            </div>
        </CustomerProvider>
    )
}
