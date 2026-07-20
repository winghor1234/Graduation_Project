"use client"

import { formatCurrency } from "@/utils/FormatCurrency"
import { FilterChip } from "./FilterChip"
import { CategoryItem } from "./shop.types"
import { ALL_CATEGORY_ID } from "./constants"

type Props = {
    isFiltered: boolean
    categoryId: string
    activeCategory: CategoryItem | undefined
    debouncedSearch: string
    priceBounds: { min: number; max: number } | undefined
    priceRange: [number, number]
    selectedColors: string[]
    onRemoveCategory: () => void
    onRemoveSearch: () => void
    onRemovePrice: () => void
    onRemoveColor: (color: string) => void
    onResetAll: () => void
}

export function ShopActiveFilters({
    isFiltered, categoryId, activeCategory, debouncedSearch,
    priceBounds, priceRange, selectedColors,
    onRemoveCategory, onRemoveSearch, onRemovePrice, onRemoveColor, onResetAll,
}: Props) {
    if (!isFiltered) return null

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {categoryId !== ALL_CATEGORY_ID && activeCategory && (
                <FilterChip label={activeCategory.category_name} onRemove={onRemoveCategory} />
            )}
            {debouncedSearch && (
                <FilterChip label={`"${debouncedSearch}"`} onRemove={onRemoveSearch} />
            )}
            {priceBounds && (priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max) && (
                <FilterChip
                    label={`${formatCurrency(priceRange[0])} – ${formatCurrency(priceRange[1])}`}
                    onRemove={onRemovePrice}
                />
            )}
            {selectedColors.map(color => (
                <FilterChip key={color} label={color} onRemove={() => onRemoveColor(color)} />
            ))}
            <button
                onClick={onResetAll}
                className="text-xs text-gray-400 hover:text-gray-900 underline underline-offset-2 ml-1 transition-colors"
            >
                ລ້າງທັງໝົດ
            </button>
        </div>
    )
}
