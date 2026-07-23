"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getRedirectPath } from "@/utils/auth"
import {
    LayoutDashboard, ShoppingCart, ShoppingBag, Package,
    Store, Users, UserCog, BarChart3, Settings, RotateCcw,
} from "lucide-react"

import { useAuthMe, useEmployeeLogout } from "../features/hooks/Auth"
import { useGetPendingOrderCount, useGetOverdueArrivedCount } from "../features/hooks/Order"
import { Sidebar } from "@/components/adminComponent/adminLayout/Sidebar"
import { Header } from "@/components/adminComponent/adminLayout/Header"

const navigation = [
    { name: "ໜ້າຫຼັກ",          href: "/admin/dashboard", icon: LayoutDashboard, roles: ["ADMIN"] },
    { name: "ການສັ່ງຊື້ສິນຄ້າ",  href: "/admin/purchase",  icon: ShoppingBag,    roles: ["ADMIN"] },
    { name: "ນຳເຂົ້າສິນຄ້າ",     href: "/admin/import",    icon: Package,        roles: ["ADMIN"] },
    { name: "ຜູ້ສະໜອງ",          href: "/admin/supplier",  icon: Users,          roles: ["ADMIN"] },
    { name: "ໝວດໝູ່ສິນຄ້າ",      href: "/admin/category",  icon: Store,          roles: ["ADMIN"] },
    { name: "ໜ້າຂາຍໜ້າຮ້ານ",    href: "/admin/POS",       icon: ShoppingCart,   roles: ["ADMIN", "STAFF"] },
    { name: "ຄືນສິນຄ້າ",          href: "/admin/refund",    icon: RotateCcw,      roles: ["ADMIN"] },
    { name: "ຄຳສັ່ງຊື້",          href: "/admin/order",     icon: ShoppingBag,    roles: ["ADMIN", "STAFF"] },
    { name: "ຈັດການສິນຄ້າ",       href: "/admin/product",   icon: Package,        roles: ["ADMIN"] },
    { name: "ຈັດການໂປໂມຊັນ",     href: "/admin/promotion", icon: ShoppingCart,   roles: ["ADMIN"] },
    { name: "ຈັດການລູກຄ້າ",       href: "/admin/customer",  icon: Users,          roles: ["ADMIN"] },
    { name: "ຈັດການພະນັກງານ",     href: "/admin/employee",  icon: UserCog,        roles: ["ADMIN"] },
    { name: "ຈັດການສາຂາ",         href: "/admin/location",  icon: Store,          roles: ["ADMIN"] },
    { name: "ລາຍງານ",            href: "/admin/report",    icon: BarChart3,      roles: ["ADMIN"] },
    { name: "ຕັ້ງຄ່າ",            href: "/admin/setting",   icon: Settings,       roles: ["ADMIN"] },
    { name: "ໂປຣໄຟລ໌",           href: "/admin/account",   icon: UserCog,        roles: ["ADMIN", "STAFF"] },
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, isLoading } = useAuthMe()
    const { mutate: logout } = useEmployeeLogout()
    const { data: pendingCount = 0 } = useGetPendingOrderCount({ enabled: !isLoading && !!user })
    // ✅ ອໍເດີ້ ARRIVED ເກີນ 1 ມື້ ແຕ່ຍັງບໍ່ COMPLETED — ຕ້ອງແຈ້ງເຕືອນ admin ນຳ
    const { data: overdueArrivedCount = 0 } = useGetOverdueArrivedCount({ enabled: !isLoading && !!user })
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        if (isLoading) return
        if (!user) return router.replace("/login")
        if (pathname === "/admin") router.replace(getRedirectPath(user.role))
    }, [user, isLoading, pathname])

    if (isLoading) return null

    return (
        <div className="flex h-screen bg-admin-bg text-admin-text overflow-hidden">

            {/* Sidebar */}
            <Sidebar
                navigation={navigation}
                user={user}
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                setCollapsed={setCollapsed}
                setMobileOpen={setMobileOpen}
                onLogout={() => { if (confirm("ຕ້ອງການອອກຈາກລະບົບ?")) logout() }}
                badges={{ "/admin/order": pendingCount + overdueArrivedCount }}
            />

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-30"
                />
            )}

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                <Header
                    onOpenSidebar={() => setMobileOpen(true)}
                    user={{ name: user?.employee_name, email: user?.email }}
                    onLogout={() => { if (confirm("ຕ້ອງການອອກຈາກລະບົບ?")) logout() }}
                />

                {/* Page */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="min-h-full bg-admin-card rounded-2xl border border-admin-border shadow-sm p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}