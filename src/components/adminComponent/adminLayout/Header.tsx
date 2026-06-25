"use client"

import { useState } from "react"
import { Bell, Search, ChevronDown, User, Settings, LogOut, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
    onOpenSidebar: () => void
    user?: { name?: string; email?: string; avatar?: string }
    onLogout?: () => void
}

export function Header({ onOpenSidebar, user, onLogout }: Props) {
    const [openMenu, setOpenMenu] = useState(false)
    const [search, setSearch] = useState("")

    return (
        <div className="sticky top-0 z-30 bg-admin-card border-b border-admin-border px-6 py-3 flex items-center justify-between gap-4 shadow-sm">

            {/* Left */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
                {/* Mobile menu button */}
                <button
                    onClick={onOpenSidebar}
                    className="md:hidden size-9 rounded-xl flex items-center justify-center text-admin-muted hover:text-admin-text hover:bg-gray-100 transition-colors"
                >
                    <Menu className="size-5" />
                </button>

                {/* Search */}
                <div className="flex items-center w-full rounded-xl px-3 py-2 bg-gray-50 border border-admin-border focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue/20 transition-all duration-200">
                    <Search className="size-4 text-admin-muted shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ຄົ້ນຫາ..."
                        className="bg-transparent outline-none ml-2 w-full text-sm text-admin-text placeholder:text-admin-muted"
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

                {/* Bell */}
                <button className="relative size-9 rounded-xl flex items-center justify-center text-admin-muted hover:text-admin-text hover:bg-gray-100 transition-colors">
                    <Bell className="size-5" />
                    <span className="absolute top-2 right-2 size-2 rounded-full bg-brand-orange" />
                </button>

                {/* User dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="size-8 rounded-full bg-linear-to-br from-brand-navy to-brand-blue flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                        </div>
                        {user?.name && (
                            <span className="hidden sm:block text-sm font-medium text-admin-text max-w-28 truncate">
                                {user.name}
                            </span>
                        )}
                        <ChevronDown className={cn(
                            "size-4 text-admin-muted transition-transform duration-200",
                            openMenu && "rotate-180"
                        )} />
                    </button>

                    {openMenu && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenu(false)}
                            />
                            {/* Dropdown */}
                            <div className="absolute right-0 mt-2 w-56 z-20 rounded-xl bg-admin-card border border-admin-border shadow-lg overflow-hidden">
                                <div className="px-4 py-3 border-b border-admin-border bg-gray-50/60">
                                    <p className="text-sm font-semibold text-admin-text truncate">{user?.name}</p>
                                    <p className="text-xs text-admin-muted truncate mt-0.5">{user?.email}</p>
                                </div>

                                <div className="p-1.5">
                                    <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-admin-text hover:bg-gray-50 transition-colors">
                                        <User className="size-4 text-admin-muted" />
                                        ໂປຣໄຟລ໌
                                    </button>
                                    <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-admin-text hover:bg-gray-50 transition-colors">
                                        <Settings className="size-4 text-admin-muted" />
                                        ຕັ້ງຄ່າ
                                    </button>
                                    <div className="h-px bg-admin-border my-1" />
                                    <button
                                        onClick={onLogout}
                                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="size-4" />
                                        ອອກຈາກລະບົບ
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}