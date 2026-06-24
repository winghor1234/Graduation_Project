"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Menu, Package, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import NavbarActions from "./NavbarActions"

const NAV_LINKS = [
    { href: "/home",          label: "ໜ້າຫຼັກ",          icon: Home },
    { href: "/shop",          label: "ຮ້ານຄ້າ",           icon: ShoppingBag },
    { href: "/order-history", label: "ປະຫວັດການສັ່ງຊື້", icon: Package },
] as const

function isActive(pathname: string, href: string) {
    return pathname === href || (href !== "/home" && pathname.startsWith(href + "/"))
}

export function CustomerNavbar() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
            <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center gap-6">

                {/* Logo */}
                <Link href="/home" className="flex items-baseline gap-0.5 shrink-0">
                    <span className="text-xl font-extrabold tracking-tight text-gray-900">SPORT</span>
                    <span className="text-xl font-extrabold tracking-tight text-amber-500">PRO</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1 flex-1">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = isActive(pathname, href)
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    active
                                        ? "bg-gray-100 text-gray-900 font-semibold"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                            >
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Right: actions + mobile trigger */}
                <div className="ml-auto flex items-center gap-1">
                    <NavbarActions />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden size-9 rounded-xl"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="size-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile Sheet */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="right" className="w-72 p-0 border-l border-gray-100">
                    <div className="flex flex-col h-full">
                        {/* Sheet header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <Link href="/home" onClick={() => setMobileOpen(false)} className="flex items-baseline gap-0.5">
                                <span className="text-lg font-extrabold tracking-tight text-gray-900">SPORT</span>
                                <span className="text-lg font-extrabold tracking-tight text-amber-500">PRO</span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-xl"
                                onClick={() => setMobileOpen(false)}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>

                        {/* Sheet nav */}
                        <nav className="flex flex-col gap-1 p-4 flex-1">
                            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                                const active = isActive(pathname, href)
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                            active
                                                ? "bg-gray-100 text-gray-900 font-semibold"
                                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Icon className="size-4 shrink-0" />
                                        {label}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Sheet footer */}
                        <div className="px-6 py-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">© 2026 SportPro</p>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    )
}
