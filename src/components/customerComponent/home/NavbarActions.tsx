"use client"

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

    return (
        <div className="flex items-center gap-1">
            {/* Cart */}
            <Button
                variant="ghost"
                size="icon"
                className="relative size-9 rounded-xl"
                onClick={() => router.push("/cart")}
            >
                <ShoppingCart className="size-5" />
                {cartCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center p-0 text-[10px] bg-amber-500 hover:bg-amber-500 border-2 border-white">
                        {cartCount > 9 ? "9+" : cartCount}
                    </Badge>
                )}
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-9 rounded-xl">
                        <User className="size-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem
                        className="rounded-lg cursor-pointer"
                        onClick={() => router.push("/order-history")}
                    >
                        ປະຫວັດການສັ່ງຊື້
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="rounded-lg cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
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
