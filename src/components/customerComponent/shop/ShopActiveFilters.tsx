"use client"

import { formatCurrency } from "@/utils/FormatCurrency"
import { FilterChip } from "./FilterChip"
import { CategoryItem } from "./shop.types"

type Props = {
    isFiltered: boolean
    activeCategories: CategoryItem[]
    debouncedSearch: string
    priceBounds: { min: number; max: number } | undefined
    priceRange: [number, number]
    onRemoveCategory: (id: string) => void
    onRemoveSearch: () => void
    onRemovePrice: () => void
    onResetAll: () => void
}

export function ShopActiveFilters({
    isFiltered, activeCategories, debouncedSearch,
    priceBounds, priceRange,
    onRemoveCategory, onRemoveSearch, onRemovePrice, onResetAll,
}: Props) {
    if (!isFiltered) return null

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* One chip per selected category */}
            {activeCategories.map(c => (
                <FilterChip
                    key={c.category_id}
                    label={c.category_name}
                    onRemove={() => onRemoveCategory(c.category_id)}
                />
            ))}

            {debouncedSearch && (
                <FilterChip label={`"${debouncedSearch}"`} onRemove={onRemoveSearch} />
            )}

            {priceBounds && (priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max) && (
                <FilterChip
                    label={`${formatCurrency(priceRange[0])} – ${formatCurrency(priceRange[1])}`}
                    onRemove={onRemovePrice}
                />
            )}

            <button
                onClick={onResetAll}
                className="text-xs text-brand-muted hover:text-brand-white underline underline-offset-2 ml-1 transition-colors"
            >
                ລ້າງທັງໝົດ
            </button>
        </div>
    )
}
