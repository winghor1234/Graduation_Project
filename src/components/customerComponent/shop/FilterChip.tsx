// FilterChip.tsx
"use client"
import { X } from "lucide-react"

export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full pl-3 pr-2 py-1.5 text-xs font-medium text-gray-700">
            {label}
            <button onClick={onRemove} className="hover:text-gray-900">
                <X className="size-3" />
            </button>
        </span>
    )
}