"use client"

import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils/FormatCurrency"
import { CategoryItem } from "./shop.types"
import { CLOTHING_SIZES, SHOE_SIZES } from "./constants"
import { getColorHex } from "./colorHex"

type Props = {
    categories: CategoryItem[] | undefined
    isLoadingCategories: boolean
    categoryIds: string[]
    onCategoryToggle: (id: string) => void
    priceBounds: { min: number; max: number } | undefined
    priceRange: [number, number]
    setPriceRange: (v: [number, number]) => void
    availableColors: string[]
    selectedColors: string[]
    onColorsChange: (colors: string[]) => void
    selectedSizes: string[]
    onSizesChange: (sizes: string[]) => void
    isFiltered: boolean
    onReset: () => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">
            {children}
        </p>
    )
}

export function FilterPanel({
    categories, isLoadingCategories, categoryIds, onCategoryToggle,
    priceBounds, priceRange, setPriceRange,
    availableColors, selectedColors, onColorsChange,
    selectedSizes, onSizesChange,
    isFiltered, onReset,
}: Props) {

    const toggleSize = (s: string) =>
        onSizesChange(selectedSizes.includes(s)
            ? selectedSizes.filter(x => x !== s)
            : [...selectedSizes, s])

    const toggleColor = (c: string) =>
        onColorsChange(selectedColors.includes(c)
            ? selectedColors.filter(x => x !== c)
            : [...selectedColors, c])

    return (
        <div className="space-y-7 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">ຕົວກອງ</p>
                {isFiltered && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="text-xs text-gray-400 hover:text-gray-900 underline underline-offset-2 transition-colors"
                    >
                        ລ້າງທັງໝົດ
                    </button>
                )}
            </div>

            {/* ── Categories ── */}
            <div>
                <SectionLabel>ໝວດໝູ່</SectionLabel>
                {isLoadingCategories ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {(categories ?? []).map(item => {
                            const active = categoryIds.includes(item.category_id)
                            const count = item._count?.products
                            return (
                                <button
                                    key={item.category_id}
                                    type="button"
                                    onClick={() => onCategoryToggle(item.category_id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-0 py-2 text-sm transition-colors text-left group",
                                        active
                                            ? "text-gray-900 font-semibold"
                                            : "text-gray-500 hover:text-gray-900"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className={cn(
                                            "size-3.5 rounded border transition-all shrink-0",
                                            active
                                                ? "bg-brand-orange border-brand-orange"
                                                : "border-gray-300 group-hover:border-gray-400"
                                        )}>
                                            {active && (
                                                <svg viewBox="0 0 10 10" className="w-full h-full text-white" fill="none">
                                                    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </span>
                                        <span>{item.category_name}</span>
                                    </div>
                                    {typeof count === "number" && (
                                        <span className="text-[11px] text-gray-400 tabular-nums">{count}</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Size ── */}
            <div className="pt-5 border-t border-gray-100">
                <SectionLabel>ຂະໜາດ</SectionLabel>

                <p className="text-[10px] text-gray-400 mb-2">ເສື້ອຜ້າ</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {CLOTHING_SIZES.map(s => {
                        const active = selectedSizes.includes(s)
                        return (
                            <button
                                key={s}
                                type="button"
                                onClick={() => toggleSize(s)}
                                className={cn(
                                    "h-8 min-w-9 px-2.5 rounded-lg border text-xs font-semibold transition-all",
                                    active
                                        ? "bg-gray-900 border-gray-900 text-white"
                                        : "bg-transparent border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900"
                                )}
                            >
                                {s}
                            </button>
                        )
                    })}
                </div>

                <p className="text-[10px] text-gray-400 mb-2">ເບີເກີບ</p>
                <div className="flex flex-wrap gap-1.5">
                    {SHOE_SIZES.map(s => {
                        const active = selectedSizes.includes(s)
                        return (
                            <button
                                key={s}
                                type="button"
                                onClick={() => toggleSize(s)}
                                className={cn(
                                    "h-8 min-w-9 px-2 rounded-lg border text-xs font-semibold transition-all",
                                    active
                                        ? "bg-gray-900 border-gray-900 text-white"
                                        : "bg-transparent border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900"
                                )}
                            >
                                {s}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ── Color ── */}
            {availableColors.length > 0 && (
                <div className="pt-5 border-t border-gray-100">
                    <SectionLabel>ສີ</SectionLabel>
                    <div className="flex flex-wrap gap-2.5">
                        {availableColors.map(c => {
                            const hex = getColorHex(c)
                            const active = selectedColors.includes(c)
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    title={c}
                                    onClick={() => toggleColor(c)}
                                    className={cn(
                                        "size-7 rounded-full transition-all",
                                        active
                                            ? "ring-2 ring-gray-900 ring-offset-2 ring-offset-white scale-110"
                                            : "ring-1 ring-gray-200 hover:scale-110"
                                    )}
                                    style={{ backgroundColor: hex }}
                                />
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── Price ── */}
            <div className="pt-5 border-t border-gray-100">
                <SectionLabel>ລາຄາ</SectionLabel>
                {priceBounds ? (
                    priceBounds.min === priceBounds.max ? (
                        <p className="text-xs text-gray-400">{formatCurrency(priceBounds.min)}</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{formatCurrency(priceRange[0])}</span>
                                <span>{formatCurrency(priceRange[1])}</span>
                            </div>
                            <Slider
                                min={priceBounds.min}
                                max={priceBounds.max}
                                step={Math.max(1, Math.round((priceBounds.max - priceBounds.min) / 100))}
                                value={priceRange}
                                onValueChange={v => setPriceRange(v as [number, number])}
                                className={cn(
                                    "py-1 cursor-pointer",
                                    "**:data-[slot=slider-track]:bg-gray-200!",
                                    "**:data-[slot=slider-range]:bg-brand-orange!",
                                    "**:data-[slot=slider-thumb]:bg-white!",
                                    "**:data-[slot=slider-thumb]:border-2!",
                                    "**:data-[slot=slider-thumb]:border-brand-orange!",
                                    "**:data-[slot=slider-thumb]:shadow-sm!",
                                )}
                            />
                        </div>
                    )
                ) : (
                    <div className="h-5 bg-gray-100 rounded animate-pulse" />
                )}
            </div>
        </div>
    )
}
