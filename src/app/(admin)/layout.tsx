"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getRedirectPath } from "@/utils/auth"

import {
    LayoutDashboard,
    ShoppingCart,
    ShoppingBag,
    Package,
    Store,
    Users,
    UserCog,
    BarChart3,
    Settings
} from "lucide-react"

import { Sidebar } from "@/components/adminLayout/Sidebar"
import { Header } from "@/components/adminLayout/Header"
import { useAuth, useEmployeeLogout } from "../features/hooks/Auth"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN"] },
    { name: "Purchase", href: "/purchase", icon: ShoppingBag, roles: ["ADMIN", "STAFF"] },
    { name: "Import", href: "/import", icon: Package, roles: ["ADMIN", "STAFF"] },
    { name: "Supplier", href: "/supplier", icon: Users, roles: ["ADMIN"] },
    { name: "Category", href: "/category", icon: Store, roles: ["ADMIN"] },
    { name: "Point of Sale", href: "/POS", icon: ShoppingCart, roles: ["ADMIN", "STAFF"] },
    { name: "Orders", href: "/order", icon: ShoppingBag, roles: ["ADMIN", "STAFF"] },
    { name: "Product", href: "/product", icon: Package, roles: ["ADMIN"] },
    { name: "Customers", href: "/customer", icon: Users, roles: ["ADMIN"] },
    { name: "Employees", href: "/employee", icon: UserCog, roles: ["ADMIN"] },
    { name: "Locations", href: "/location", icon: Store, roles: ["ADMIN"] },
    { name: "Reports", href: "/report", icon: BarChart3, roles: ["ADMIN"] },
    { name: "Settings", href: "/setting", icon: Settings, roles: ["ADMIN"] },
] as const

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()

    const { user, isLoading } = useAuth()
    const { mutate: logout } = useEmployeeLogout()

    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        if (isLoading) return

        if (!user) return router.replace("/login")

        if (pathname === "/") {
            router.replace(getRedirectPath(user.role))
        }
    }, [user, isLoading, pathname])

    if (isLoading) return null

    return (
        <div className="
      flex h-screen
      bg-[#f8fafc]
      text-slate-900
    ">

            {/* SOFT BLUE GLOW */}
            <div className="
        fixed top-[-200px] left-[30%]
        w-[500px] h-[500px]
        bg-blue-500/10
        blur-[120px]
        rounded-full
        z-0
      " />

            {/* SIDEBAR */}
            <Sidebar
                navigation={navigation}
                user={user}
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                setCollapsed={setCollapsed}
                setMobileOpen={setMobileOpen}
                onLogout={() => {
                    if (confirm('Logout?')) logout()
                }}
            />

            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="
            fixed inset-0
            bg-black/20
            backdrop-blur-sm
            md:hidden
            z-30
          "
                />
            )}

            {/* CONTENT */}
            <div className="flex-1 flex flex-col relative z-10">

                {/* HEADER */}
                <Header
                    onOpenSidebar={() => setMobileOpen(true)}
                />

                {/* MAIN */}
                <main className="flex-1 overflow-auto p-5">

                    {/* CONTENT WRAPPER */}
                    <div className="
            min-h-full
            bg-white/80
            backdrop-blur-xl
            border border-gray-200
            rounded-3xl
            shadow-sm
            p-5
          ">
                        {children}
                    </div>

                </main>
            </div>
        </div>
    )
}