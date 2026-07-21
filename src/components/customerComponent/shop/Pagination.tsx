"use client"

import { useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination({ page, totalPages, onChange }: {
    page: number
    totalPages: number
    onChange: (p: number) => void
}) {
    const pages = useMemo(() => {
        const win = 1
        const list: (number | "...")[] = []
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - win && i <= page + win)) {
                list.push(i)
            } else if (list[list.length - 1] !== "...") {
                list.push("...")
            }
        }
        return list
    }, [page, totalPages])

    return (
        <div className="flex items-center justify-center gap-1 pt-10">
            <button
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className="size-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
                <ChevronLeft className="size-4" />
            </button>

            {pages.map((p, i) => p === "..." ? (
                <span key={`e-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
            ) : (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`size-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                            ? "bg-brand-orange text-white border border-brand-orange"
                            : "border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900"
                    }`}
                >
                    {p}
                </button>
            ))}

            <button
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                className="size-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
                <ChevronRight className="size-4" />
            </button>
        </div>
    )
}
