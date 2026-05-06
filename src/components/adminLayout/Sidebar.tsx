"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store, LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Employee } from "@/modules/employee/employee.type"
import { theme } from "@/styles/theme"

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
                "fixed md:relative z-40 h-screen transition-all duration-300",
                theme.sidebar,

                collapsed ? "w-20" : "w-64",

                mobileOpen
                    ? "left-0"
                    : "-left-64 md:left-0"
            )}
        >
            {/* LOGO */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">

                <div className="flex items-center gap-2">
                    <Store className={cn("h-8 w-8", theme.primary)} />

                    {!collapsed && (
                        <div>
                            <h1 className="font-bold text-lg tracking-wide text-slate-900">
                                SportWear
                            </h1>

                            <p className="text-xs text-slate-500">
                                Retail System
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "p-2 rounded-xl transition",
                        theme.hover
                    )}
                >
                    ☰
                </button>
            </div>

            {/* NAV */}
            <nav className="flex-1 space-y-1 px-2 py-4">

                {user &&
                    navigation
                        .filter((item) =>
                            item.roles.includes(user.role)
                        )
                        .map((item) => {
                            const isActive =
                                pathname.startsWith(item.href)

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",

                                        collapsed
                                            ? "justify-center"
                                            : "gap-3",

                                        isActive
                                            ? cn(
                                                theme.primarySoft,
                                                theme.primaryBorder,
                                                "text-blue-600"
                                            )
                                            : "text-slate-500 hover:text-slate-900 hover:bg-gray-100"
                                    )}
                                >
                                    {isActive && (
                                        <span
                                            className={cn(
                                                "absolute left-0 top-0 h-full w-1 rounded-r",
                                                theme.primaryBg
                                            )}
                                        />
                                    )}

                                    <item.icon className="h-5 w-5" />

                                    {!collapsed && item.name}
                                </Link>
                            )
                        })}
            </nav>

            {/* FOOTER */}
            <div className="border-t border-gray-200 p-4">

                <div
                    className={cn(
                        "flex items-center",
                        collapsed
                            ? "justify-center"
                            : "gap-3"
                    )}
                >
                    <div
                        className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold",
                            theme.avatarGradient
                        )}
                    >
                        {user?.employee_name?.charAt(0)}
                    </div>

                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm truncate text-slate-900">
                                    {user?.employee_name}
                                </p>

                                <p className="text-xs text-slate-500 truncate">
                                    {user?.email}
                                </p>
                            </div>

                            <button
                                onClick={onLogout}
                                className="text-xs text-red-500 hover:text-red-600 transition"
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