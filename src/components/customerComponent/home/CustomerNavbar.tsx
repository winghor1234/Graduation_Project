"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Menu, Package, ShoppingBag, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import NavbarActions from "./NavbarActions"

const NAV_LINKS = [
    { href: "/home",          label: "ໜ້າຫຼັກ",          icon: Home },
    { href: "/shop",          label: "ຮ້ານຄ້າ",           icon: ShoppingBag },
    { href: "/order-history", label: "ປະຫວັດການສັ່ງຊື້", icon: Package },
    { href: "/profile",       label: "ໂປຣໄຟລ໌",           icon: User },
] as const

function isActive(pathname: string, href: string) {
    return pathname === href || (href !== "/home" && pathname.startsWith(href + "/"))
}

export function CustomerNavbar() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <header
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                "bg-brand-black",
                scrolled
                    ? "backdrop-blur-md border-b border-brand-divider shadow-lg shadow-black/20"
                    : "border-b border-brand-divider"
            )}
        >
            <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center gap-8">

                {/* Logo */}
                <Link href="/home" className="flex items-baseline gap-0 shrink-0 group">
                    <span className="text-xl font-extrabold tracking-tight text-brand-white transition-opacity group-hover:opacity-90">
                        SPORT
                    </span>
                    <span className="text-xl font-extrabold tracking-tight text-brand-orange transition-opacity group-hover:opacity-90">
                        PRO
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1 flex-1">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = isActive(pathname, href)
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium transition-all duration-200",
                                    active
                                        ? "text-brand-white"
                                        : "text-brand-muted hover:text-brand-white"
                                )}
                            >
                                {label}
                                {active && (
                                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-orange rounded-full" />
                                )}
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
                        className="md:hidden size-9 rounded-xl text-brand-muted hover:text-brand-white hover:bg-brand-card-dark"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="size-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile Sheet */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent
                    side="right"
                    className="w-72 p-0 bg-brand-card-dark border-l border-brand-divider"
                >
                    <div className="flex flex-col h-full">
                        {/* Sheet header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-divider">
                            <Link href="/home" onClick={() => setMobileOpen(false)} className="flex items-baseline gap-0">
                                <span className="text-lg font-extrabold tracking-tight text-brand-white">SPORT</span>
                                <span className="text-lg font-extrabold tracking-tight text-brand-orange">PRO</span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-xl text-brand-muted hover:text-brand-white hover:bg-brand-black"
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
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                            active
                                                ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/20"
                                                : "text-brand-muted hover:text-brand-white hover:bg-brand-black"
                                        )}
                                    >
                                        <Icon className="size-4 shrink-0" />
                                        {label}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Sheet footer */}
                        <div className="px-6 py-4 border-t border-brand-divider">
                            <p className="text-xs text-brand-muted">© 2026 SportPro. Made in Laos 🇱🇦</p>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    )
}