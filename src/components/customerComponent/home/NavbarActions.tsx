"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCustomer } from "../CustomerContext"
import { useCustomerLogout } from "@/app/features/hooks/Auth"

export default function NavbarActions() {
    const { cart } = useCustomer()
    const router = useRouter()
    const { mutate: logout } = useCustomerLogout()

    const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

    // ⚡ Cart icon is visible on every page — prefetch it eagerly on mount
    useEffect(() => {
        router.prefetch("/customer/cart")
    }, [router])

    return (
        <div className="flex items-center gap-1">
            {/* Cart */}
            <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative size-9 rounded-xl text-brand-muted hover:text-brand-white hover:bg-brand-card-dark transition-theme"
            >
                <Link href="/customer/cart">
                    <ShoppingCart className="size-5" />
                    {cartCount > 0 && (
                        <Badge className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center p-0 text-[10px] bg-brand-orange hover:bg-brand-orange border-2 border-brand-black text-white font-bold">
                            {cartCount > 9 ? "9+" : cartCount}
                        </Badge>
                    )}
                </Link>
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-xl text-brand-muted hover:text-brand-white hover:bg-brand-card-dark transition-theme"
                    >
                        <User className="size-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-xl bg-brand-card-dark border-brand-divider text-brand-white"
                >
                    <DropdownMenuItem
                        asChild
                        className="rounded-lg cursor-pointer text-brand-muted hover:text-brand-white focus:bg-brand-black focus:text-brand-white"
                        onMouseEnter={() => router.prefetch("/customer/order-history")}
                    >
                        <Link href="/customer/order-history">ປະຫວັດການສັ່ງຊື້</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-brand-divider" />
                    <DropdownMenuItem
                        className="rounded-lg cursor-pointer text-rose-400 focus:text-rose-300 focus:bg-rose-950/30"
                        onClick={() => {
                            if (confirm("ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ຫຼືບໍ່?")) logout()
                        }}
                    >
                        ອອກຈາກລະບົບ
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}