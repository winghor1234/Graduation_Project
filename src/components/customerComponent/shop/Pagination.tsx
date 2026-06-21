// Pagination.tsx
"use client"
import { useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination({ page, totalPages, onChange }: {
    page: number; totalPages: number; onChange: (p: number) => void
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
        <div className="flex items-center justify-center gap-1.5 pt-6">
            <button disabled={page <= 1} onClick={() => onChange(page - 1)}
                className="size-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50">
                <ChevronLeft className="size-4" />
            </button>
            {pages.map((p, i) => p === "..." ? (
                <span key={`e-${i}`} className="px-1.5 text-gray-400 text-sm">...</span>
            ) : (
                <button key={p} onClick={() => onChange(p)}
                    className={`size-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page ? "bg-[#0a0f1d] text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}>
                    {p}
                </button>
            ))}
            <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}
                className="size-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50">
                <ChevronRight className="size-4" />
            </button>
        </div>
    )
}