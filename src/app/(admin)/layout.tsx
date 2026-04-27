"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getRedirectPath } from "@/utils/auth"
import { BarChart3, CreditCard, LayoutDashboard, LucideIcon, Package, Settings, ShoppingBag, ShoppingCart, Store, UserCog, Users, } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useAuth, useAdminLogout } from "../features/hooks"


type NavItem = {
    name: string
    href: string
    icon: LucideIcon
    roles: ("ADMIN" | "STAFF")[]
}

const navigation: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN"] },
    { name: "Point of Sale", href: "/POS", icon: ShoppingCart, roles: ["ADMIN", "STAFF"] },
    { name: "Orders", href: "/order", icon: ShoppingBag, roles: ["ADMIN", "STAFF"] },
    { name: "Purchases", href: "/purchase", icon: ShoppingBag, roles: ["ADMIN"] },
    { name: "Imports", href: "/import", icon: ShoppingBag, roles: ["ADMIN"] },
    { name: "Product", href: "/product", icon: Package, roles: ["ADMIN"] },
    { name: "Categories", href: "/category", icon: Store, roles: ["ADMIN"] },
    { name: "Suppliers", href: "/supplier", icon: Store, roles: ["ADMIN"] },
    { name: "Customers", href: "/customer", icon: Users, roles: ["ADMIN"] },
    { name: "Employees", href: "/employee", icon: UserCog, roles: ["ADMIN"] },
    { name: "Locations", href: "/location", icon: Store, roles: ["ADMIN"] },
    { name: "Reports", href: "/report", icon: BarChart3, roles: ["ADMIN"] },
    { name: "Settings", href: "/setting", icon: Settings, roles: ["ADMIN"] },
]

export default function AdminLayout({ children, }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, isLoading } = useAuth()
    const { mutate: logout, isPending } = useAdminLogout()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.replace("/login");
            return;
        }
       const target = getRedirectPath(user.role);

        if (pathname === "/") {
            router.replace(target);
        }
    }, [user, isLoading, pathname]);
    if (isLoading) return null
    return (
        <div className="flex h-screen bg-gray-50 ">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed md:relative z-40 h-screen bg-gray-900 text-white transition-all duration-300",
                    collapsed ? "w-20" : "w-64",
                    mobileOpen ? "left-0" : "-left-64 md:left-0"
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
                    <div className="flex items-center gap-2">
                        <Store className="h-8 w-8 text-blue-500" />
                        {!collapsed && (
                            <div>
                                <h1 className="font-bold text-lg">SportWear</h1>
                                <p className="text-xs text-gray-400">Retail System</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded hover:bg-gray-800"
                    >
                        ☰
                    </button>
                </div>
                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-2 py-4">
                    {user && navigation
                        .filter((item) => item.roles.includes(user.role))
                        .map((item) => {
                            const isActive = pathname.startsWith(item.href)
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    title={collapsed ? item.name : ""}
                                    className={cn(
                                        "relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                        collapsed ? "justify-center" : "gap-3",
                                        isActive
                                            ? "bg-gray-800 text-white"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    )}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r" />
                                    )}
                                    <item.icon className="h-5 w-5" />
                                    {!collapsed && item.name}
                                </Link>
                            )
                        })}

                </nav>
                {/* Footer */}
                <div className="border-t border-gray-800 p-4">
                    <div className={cn(
                        "flex items-center",
                        collapsed ? "justify-center" : "gap-3"
                    )}>
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-semibold">
                            {user && user.name?.charAt(0)}
                        </div>
                        {!collapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user && user.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user && user.email}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        if (confirm("Are you sure to logout?")) logout()
                                    }}
                                    className="text-xs text-red-400 hover:text-red-300"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </aside>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 bg-black/50 md:hidden z-30"
                />
            )}
            {/* Main */}
            <main className="flex-1 overflow-auto my-8 mx-8">
                {/* Mobile menu button */}
                <div className="p-3 md:hidden">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded hover:bg-gray-200"
                    >
                        ☰
                    </button>
                </div>
                {children}
            </main>
        </div>
    )
}