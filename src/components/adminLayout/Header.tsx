// components/layout/Header.tsx

"use client"

import { Bell, Search } from "lucide-react"
import Image from "next/image"

type Props = {
    onOpenSidebar: () => void
}

export function Header({ onOpenSidebar }: Props) {
    return (
        <div className="sticky top-0 z-30 bg-white border-b px-6 py-4 flex items-center justify-between">

            {/* Left */}
            <div className="flex items-center gap-3 w-full max-w-md">
                <button
                    onClick={onOpenSidebar}
                    className="md:hidden p-2 rounded hover:bg-gray-100"
                >
                    ☰
                </button>

                <div className="flex items-center w-full bg-gray-100 rounded-xl px-3 py-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                        placeholder="Search..."
                        className="bg-transparent outline-none ml-2 w-full text-sm"
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-gray-600" />

                {/* <Image
                    width={40}
                    height={40}
                    alt="avatar"
                    
                    className="w-9 h-9 rounded-full"
                /> */}
            </div>
        </div>
    )
}