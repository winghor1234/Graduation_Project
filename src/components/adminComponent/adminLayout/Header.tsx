"use client"

import { useState } from "react"
import {
    Bell,
    Search,
    ChevronDown,
    User,
    Settings,
    LogOut,
} from "lucide-react"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type Props = {
    onOpenSidebar: () => void
    user?: {
        name?: string
        email?: string
        avatar?: string
    }
    onLogout?: () => void
}

export function Header({
    onOpenSidebar,
    user,
    onLogout,
}: Props) {
    const [openMenu, setOpenMenu] = useState(false)
    const [search, setSearch] = useState("")

    return (
        <div
            className={cn(
                "sticky top-0 z-30 px-6 py-4 flex items-center justify-between",
                theme.header,
                theme.text
            )}
        >
            {/* LEFT */}
            <div className="flex items-center gap-3 w-full max-w-md">

                <button
                    onClick={onOpenSidebar}
                    className={cn(
                        "md:hidden p-2 rounded-xl transition",
                        theme.hover
                    )}
                >
                    ☰
                </button>

                {/* SEARCH */}
                <div
                    className={cn(
                        "flex items-center w-full rounded-xl px-3 py-2 transition-all duration-200",
                        theme.input,
                        theme.glow
                    )}
                >
                    <Search className="w-4 h-4 text-slate-400" />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search product, order..."
                        className="
              bg-transparent outline-none ml-2 w-full text-sm
              text-slate-700 placeholder:text-slate-400
            "
                    />
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

                {/* NOTIFICATION */}
                <button
                    className={cn(
                        "relative p-2 rounded-xl transition",
                        theme.hover
                    )}
                >
                    <Bell className="w-5 h-5 text-slate-500" />

                    <span
                        className={cn(
                            "absolute top-1 right-1 w-2 h-2 rounded-full",
                            theme.primaryBg
                        )}
                    />
                </button>

                {/* USER MENU */}
                <div className="relative">

                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className={cn(
                            "flex items-center gap-2 px-2 py-1 rounded-xl transition",
                            theme.hover
                        )}
                    >
                        {user?.avatar ? (
                            <Image
                                src={user.avatar}
                                width={36}
                                height={36}
                                alt="avatar"
                                className="rounded-full border border-gray-200"
                            />
                        ) : (
                            <div
                                className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold",
                                    theme.avatarGradient
                                )}
                            >
                                {user?.name?.charAt(0) || "U"}
                            </div>
                        )}

                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>

                    {/* DROPDOWN */}
                    {openMenu && (
                        <div
                            className={cn(
                                "absolute right-0 mt-2 w-56 rounded-2xl p-2 shadow-lg",
                                theme.card
                            )}
                        >
                            {/* USER INFO */}
                            <div className="px-3 py-2 border-b border-gray-200">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    {user?.name}
                                </p>

                                <p className="text-xs text-slate-500 truncate">
                                    {user?.email}
                                </p>
                            </div>

                            {/* MENU */}
                            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-gray-100 transition">
                                <User size={16} />
                                Profile
                            </button>

                            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-gray-100 transition">
                                <Settings size={16} />
                                Settings
                            </button>

                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}