"use client"

import { ProductCard } from "./ProductCard"
import { ProductGridSkeleton } from "./ProductGridSkeleton"
import { EmptyState } from "./EmptyState"
import { ErrorState } from "./ErrorState"
import { Pagination } from "./Pagination"
import { ProductListItem } from "./shop.types"
import { Promotion } from "@/modules/promotion/promotion.types"

type Meta = {
    page: number
    total: number
    total_pages: number
}

type Props = {
    items: ProductListItem[]
    meta: Meta | undefined
    isLoading: boolean
    isFetching: boolean
    isError: boolean
    isFiltered: boolean
    promotionMap: Map<string, Promotion>
    onRetry: () => void
    onReset: () => void
    onPickVariant: (product: ProductListItem) => void
    onPageChange: (page: number) => void
}

export function ShopProductGrid({
    items, meta, isLoading, isFetching, isError,
    isFiltered, promotionMap, onRetry, onReset, onPickVariant, onPageChange,
}: Props) {
    if (isLoading) return <ProductGridSkeleton />
    if (isError) return <ErrorState onRetry={onRetry} />
    if (items.length === 0) return <EmptyState isFiltered={isFiltered} onReset={onReset} />

    return (
        <div className="space-y-8">
            <div className={`grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 transition-opacity duration-200 ${isFetching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                {items.map((product, index) => (
                    <ProductCard
                        key={product.product_id}
                        product={product}
                        onPickVariant={onPickVariant}
                        promotion={promotionMap.get(product.product_id) ?? null}
                        priority={index < 3}
                    />
                ))}
            </div>

            {meta && meta.total_pages > 1 && (
                <Pagination page={meta.page} totalPages={meta.total_pages} onChange={onPageChange} />
            )}
        </div>
    )
}