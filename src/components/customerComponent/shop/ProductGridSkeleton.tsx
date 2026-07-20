"use client"

import { PAGE_SIZE } from "./constants"

export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-pulse">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                    <div className="aspect-3/4 bg-brand-card-dark rounded-xl w-full" />
                    <div className="space-y-2 px-0.5">
                        <div className="h-3 bg-brand-divider rounded w-3/4" />
                        <div className="h-3 bg-brand-divider rounded w-1/2" />
                        <div className="h-4 bg-brand-divider rounded w-1/3 mt-1" />
                    </div>
                </div>
            ))}
        </div>
    )
}
