// components/layout/Sidebar.tsx

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Employee } from "@/modules/employee/employee.type"

type Role = "ADMIN" | "STAFF"

type NavItem = {
  name: string
  href: string
  icon: LucideIcon
  roles: readonly Role[]   
}

type Props = {
    navigation: readonly NavItem[]
    user: Employee
    collapsed: boolean
    mobileOpen: boolean
    setCollapsed: (v: boolean) => void
    setMobileOpen: (v: boolean) => void
    onLogout: () => void
}

export function Sidebar({
    navigation,
    user,
    collapsed,
    mobileOpen,
    setCollapsed,
    setMobileOpen,
    onLogout,
}: Props) {
    const pathname = usePathname()

    return (
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

            {/* Nav */}
            <nav className="flex-1 space-y-1 px-2 py-4">
                {user &&
                    navigation
                        .filter((item) => item.roles.includes(user.role))
                        .map((item) => {
                            const isActive = pathname.startsWith(item.href)

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition",
                                        collapsed ? "justify-center" : "gap-3",
                                        isActive
                                            ? "bg-gray-800 text-white"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    )}
                                >
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
                        {user?.employee_name?.charAt(0)}
                    </div>

                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{user?.employee_name}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            </div>

                            <button
                                onClick={onLogout}
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}