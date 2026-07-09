"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Bell, CheckCheck } from "lucide-react"
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
import { useCustomerLogout, useAuthMe } from "@/app/features/hooks/Auth"
import { useGetNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from "@/app/features/hooks/Notification"

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return "ຫາກໍ່ນີ້"
    if (m < 60) return `${m} ນາທີກ່ອນ`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} ຊ.ກ່ອນ`
    return `${Math.floor(h / 24)} ວັນກ່ອນ`
}

export default function NavbarActions() {
    const { cart } = useCustomer()
    const router = useRouter()
    const { mutate: logout } = useCustomerLogout()
    const userData = useAuthMe()
    const isLoggedIn = !!userData?.user

    const [notifOpen, setNotifOpen] = useState(false)

    const { data: notifData } = useGetNotifications({ enabled: isLoggedIn })
    const { mutate: markRead } = useMarkNotificationRead()
    const { mutate: markAllRead } = useMarkAllNotificationsRead()

    const notifications = notifData?.data ?? []
    const unreadCount = notifData?.unread ?? 0

    const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

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

            {/* Notification bell */}
            {isLoggedIn && (
                <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative size-9 rounded-xl text-brand-muted hover:text-brand-white hover:bg-brand-card-dark transition-theme"
                        >
                            <Bell className="size-5" />
                            {unreadCount > 0 && (
                                <Badge className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center p-0 text-[10px] bg-red-500 hover:bg-red-500 border-2 border-brand-black text-white font-bold">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-80 rounded-xl bg-brand-card-dark border-brand-divider p-0 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-brand-divider">
                            <span className="text-sm font-semibold text-brand-white">ການແຈ້ງເຕືອນ</span>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllRead()}
                                    className="flex items-center gap-1 text-[11px] text-brand-muted hover:text-brand-orange transition-colors"
                                >
                                    <CheckCheck className="size-3.5" />
                                    ອ່ານທັງໝົດ
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-brand-divider">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center text-sm text-brand-muted">
                                    ຍັງບໍ່ມີການແຈ້ງເຕືອນ
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <button
                                        key={n.notification_id}
                                        onClick={() => {
                                            if (!n.is_read) markRead(n.notification_id)
                                            setNotifOpen(false)
                                            router.push("/customer/order-history")
                                        }}
                                        className={`w-full text-left px-4 py-3 hover:bg-brand-black/40 transition-colors ${
                                            !n.is_read ? "bg-brand-orange/5" : ""
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {!n.is_read && (
                                                <span className="mt-1.5 size-2 rounded-full bg-brand-orange shrink-0" />
                                            )}
                                            <div className={!n.is_read ? "" : "pl-4"}>
                                                <p className="text-xs font-semibold text-brand-white">{n.title}</p>
                                                <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed">{n.message}</p>
                                                <p className="text-[10px] text-brand-muted/60 mt-1">{timeAgo(n.createdAt)}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

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
                    {isLoggedIn ? (
                        <>
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
                        </>
                    ) : (
                        <DropdownMenuItem
                            asChild
                            className="rounded-lg cursor-pointer text-brand-muted hover:text-brand-white focus:bg-brand-black focus:text-brand-white"
                            onMouseEnter={() => router.prefetch("/login")}
                        >
                            <Link href="/login">ເຂົ້າສູ່ລະບົບ</Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}