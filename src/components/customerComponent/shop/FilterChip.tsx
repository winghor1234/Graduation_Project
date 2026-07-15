"use client"

import { X } from "lucide-react"

export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 bg-brand-divider border border-brand-divider/60 rounded-full pl-3 pr-1.5 py-1 text-xs font-medium text-brand-muted">
            {label}
            <button
                onClick={onRemove}
                className="size-4 rounded-full flex items-center justify-center hover:bg-brand-white/10 transition-colors"
            >
                <X className="size-2.5 text-brand-muted" />
            </button>
        </span>
    )
}
