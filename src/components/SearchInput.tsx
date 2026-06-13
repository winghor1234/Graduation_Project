"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function SearchInput({
    value,
    onChange,
    placeholder = "ຄົ້ນຫາ...",
    className = "w-[350px]",
}: SearchInputProps) {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 pr-10"
            />

            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}