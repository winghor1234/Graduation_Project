"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

type Props = {
    search: string
    onSearchChange: (value: string) => void
}

export function POSToolbar({ search, onSearchChange }: Props) {
    return (
        <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="ຄົ້ນຫາສິນຄ້າ..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-9"
            />
            {search && (
                <button
                    type="button"
                    onClick={() => onSearchChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}
