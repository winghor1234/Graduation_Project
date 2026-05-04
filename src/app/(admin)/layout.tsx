


"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getRedirectPath } from "@/utils/auth"
import { useAuth, useAdminLogout } from "../features/hooks"
import {  LayoutDashboard, ShoppingCart, ShoppingBag, Package, Store, Users, UserCog, BarChart3, Settings} from "lucide-react"
import { Sidebar } from "@/components/adminLayout/Sidebar"
import { Header } from "@/components/adminLayout/Header"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN"] },
    { name: "Point of Sale", href: "/POS", icon: ShoppingCart, roles: ["ADMIN", "STAFF"] },
    { name: "Orders", href: "/order", icon: ShoppingBag, roles: ["ADMIN", "STAFF"] },
    { name: "Product", href: "/product", icon: Package, roles: ["ADMIN"] },
    { name: "Customers", href: "/customer", icon: Users, roles: ["ADMIN"] },
    { name: "Employees", href: "/employee", icon: UserCog, roles: ["ADMIN"] },
    {name : "Locations", href: "/location", icon: Store, roles: ["ADMIN"]},
    { name: "Reports", href: "/report", icon: BarChart3, roles: ["ADMIN"] },
    { name: "Settings", href: "/setting", icon: Settings, roles: ["ADMIN"] },
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    const { user, isLoading } = useAuth()
    const { mutate: logout } = useAdminLogout()

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
        <div className="flex h-screen bg-gray-100">

            <Sidebar
                navigation={navigation}
                user={user}
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                setCollapsed={setCollapsed}
                setMobileOpen={setMobileOpen}
                onLogout={() => {
                    if (confirm("Logout?")) logout()
                }}
            />

            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 bg-black/50 md:hidden z-30"
                />
            )}

            <div className="flex-1 flex flex-col">
                <Header onOpenSidebar={() => setMobileOpen(true)} />

                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}