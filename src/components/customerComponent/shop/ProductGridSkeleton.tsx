// ProductGridSkeleton.tsx
"use client";
import { PAGE_SIZE } from "./constants"
export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 animate-pulse">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-2xl w-full" />
                    <div className="h-5 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-11 bg-gray-100 rounded-xl w-full" />
                </div>
            ))}
        </div>
    )
}