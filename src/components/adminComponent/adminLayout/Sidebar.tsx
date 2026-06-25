"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon, Store, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
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

export function Sidebar(props: Props) {
    const { navigation, user, collapsed, mobileOpen, setCollapsed, setMobileOpen, onLogout } = props
    const pathname = usePathname()

    function handleNavClick() {
        setMobileOpen(false)
    }

    return (
        <aside
            className={cn(
                "fixed md:relative z-40 h-screen flex flex-col transition-all duration-300",
                "bg-brand-navy border-r border-brand-navy-dark",
                collapsed ? "w-20" : "w-64",
                mobileOpen ? "left-0" : "-left-64 md:left-0"
            )}
        >
            {/* ── Logo ── */}
            <div className={cn(
                "flex h-16 items-center border-b border-brand-navy-dark px-4",
                collapsed ? "justify-center" : "justify-between"
            )}>
                {!collapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
                        <div className="size-8 rounded-xl bg-brand-orange flex items-center justify-center shrink-0">
                            <Store className="size-4 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-extrabold text-white tracking-wide leading-none">SportPro</p>
                            <p className="text-[10px] text-white/40 mt-0.5">ລະບົບຈັດການ</p>
                        </div>
                    </Link>
                )}

                {collapsed && (
                    <div className="size-8 rounded-xl bg-brand-orange flex items-center justify-center">
                        <Store className="size-4 text-white" />
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="size-7 rounded-lg flex items-center justify-center bg-brand-navy-dark hover:bg-brand-navy-hover text-white/60 hover:text-white transition-colors"
                >
                    {collapsed
                        ? <ChevronRight className="size-4" />
                        : <ChevronLeft className="size-4" />
                    }
                </button>
            </div>

            {/* ── Nav ── */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
                {user && navigation
                    .filter((item) => item.roles.includes(user.role))
                    .map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={handleNavClick}
                                title={collapsed ? item.name : undefined}
                                className={cn(
                                    "relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                    collapsed ? "justify-center" : "gap-3",
                                    isActive
                                        ? "bg-brand-blue/15 text-white"
                                        : "text-white/50 hover:text-white hover:bg-brand-navy-hover"
                                )}
                            >
                                {isActive && (
                                    <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r-full bg-brand-blue" />
                                )}
                                <item.icon className={cn(
                                    "size-5 shrink-0",
                                    isActive ? "text-brand-blue" : "text-white/50"
                                )} />
                                {!collapsed && (
                                    <span className="truncate">{item.name}</span>
                                )}
                            </Link>
                        )
                    })}
            </nav>

            {/* ── User ── */}
            <div className="border-t border-brand-navy-dark p-3">
                <div className={cn(
                    "flex items-center gap-3 px-2 py-2 rounded-xl",
                    collapsed ? "justify-center" : ""
                )}>
                    <div className="size-9 rounded-full bg-linear-to-br from-brand-navy-hover to-brand-blue flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {user?.employee_name?.charAt(0)?.toUpperCase() ?? "U"}
                    </div>
                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate leading-none">
                                    {user?.employee_name}
                                </p>
                                <p className="text-[11px] text-white/40 truncate mt-0.5">
                                    {user?.role}
                                </p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="size-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="ອອກຈາກລະບົບ"
                            >
                                <LogOut className="size-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}