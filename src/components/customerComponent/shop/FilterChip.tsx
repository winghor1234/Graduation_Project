"use client"

import { X } from "lucide-react"

export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full pl-3 pr-1.5 py-1 text-xs font-medium text-gray-600">
            {label}
            <button
                onClick={onRemove}
                className="size-4 rounded-full flex items-center justify-center hover:bg-gray-900/10 transition-colors"
            >
                <X className="size-2.5 text-gray-500" />
            </button>
        </span>
    )
}
