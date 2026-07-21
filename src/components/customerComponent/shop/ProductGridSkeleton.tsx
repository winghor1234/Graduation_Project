"use client"

import { PAGE_SIZE } from "./constants"

export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-pulse">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-brand-divider bg-brand-card-dark">
                    <div className="aspect-3/4 bg-brand-divider w-full" />
                    <div className="space-y-2 p-3">
                        <div className="h-3 bg-brand-divider rounded w-3/4" />
                        <div className="h-3 bg-brand-divider rounded w-1/2" />
                        <div className="h-4 bg-brand-divider rounded w-1/3 mt-1" />
                    </div>
                </div>
            ))}
        </div>
    )
}
