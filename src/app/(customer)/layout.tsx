import { ReactNode } from "react"
import Link from "next/link"
import { CustomerProvider } from "@/components/customerComponent/CustomerContext"
import { CustomerNavbar } from "@/components/customerComponent/home/CustomerNavbar"

export const metadata = {
    title: "SPORTPRO",
    description: "ເຄື່ອງກີລາ ແລະ ເກີບຊັ້ນສູງ ສຳລັບນັກກີລາ.",
}

const FOOTER_LINKS = {
    ຮ້ານຄ້າ: [
        { label: "ສິນຄ້າທັງໝົດ", href: "/shop" },
        { label: "ໜ້າຫຼັກ",       href: "/home" },
        { label: "ກະຕ່າສິນຄ້າ",   href: "/cart" },
    ],
    ລູກຄ້າ: [
        { label: "ປະຫວັດການສັ່ງຊື້", href: "/order-history" },
        { label: "ຕິດຕໍ່ພວກເຮົາ",   href: null },
        { label: "ການຈັດສົ່ງ",       href: null },
    ],
    ກ່ຽວກັບ: [
        { label: "ກ່ຽວກັບພວກເຮົາ",        href: null },
        { label: "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ", href: null },
        { label: "ຮ່ວມງານກັບເຮົາ",          href: null },
    ],
}

export default function CustomerLayout({ children }: { children: ReactNode }) {
    return (
        <CustomerProvider>
            <div
                data-theme="customer"
                className="min-h-screen flex flex-col bg-brand-black"
            >
                <CustomerNavbar />

                <main className="flex-1">
                    {children}
                </main>

                {/* ── Footer ── */}
                <footer className="bg-brand-footer border-t border-brand-divider">
                    <div className="container mx-auto px-6 max-w-7xl py-16">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

                            {/* Brand */}
                            <div className="md:col-span-4 space-y-5">
                                <div className="flex items-baseline gap-0">
                                    <span className="text-2xl font-extrabold tracking-tight text-brand-white">SPORT</span>
                                    <span className="text-2xl font-extrabold tracking-tight text-brand-orange">PRO</span>
                                </div>
                                <p className="text-sm text-brand-muted leading-relaxed max-w-xs">
                                    ເຄື່ອງກີລາ ແລະ ເກີບຊັ້ນສູງ ອອກແບບ<br />
                                    ສຳລັບນັກກີລາທີ່ຮັກການເຄື່ອນໄຫວ
                                </p>
                                <p className="text-xs text-brand-divider font-medium tracking-widest uppercase">
                                    Performance · Style · Quality
                                </p>
                            </div>

                            <div className="hidden md:block md:col-span-1" />

                            {/* Links */}
                            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
                                <div key={group} className="md:col-span-2 space-y-4">
                                    <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-brand-muted">
                                        {group}
                                    </h4>
                                    <ul className="space-y-3 text-sm">
                                        {links.map(({ label, href }) => (
                                            <li key={label}>
                                                {href ? (
                                                    <Link
                                                        href={href}
                                                        className="text-brand-muted hover:text-brand-orange transition-colors duration-200"
                                                    >
                                                        {label}
                                                    </Link>
                                                ) : (
                                                    <span className="text-brand-divider cursor-default">{label}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-brand-divider">
                        <div className="container mx-auto px-6 max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
                            <p className="text-xs text-brand-muted">
                                © 2026 SportPro. ສະຫງວນລິຂະສິດທຸກຢ່າງ.
                            </p>
                            <p className="text-xs text-brand-muted">
                                Made in{" "}
                                <span className="text-brand-orange font-semibold">Laos 🇱🇦</span>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </CustomerProvider>
    )
}