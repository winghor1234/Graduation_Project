"use client"

import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal, X } from "lucide-react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { CategoryItem } from "./shop.types"

type Props = {
    categories: CategoryItem[] | undefined
    isLoadingCategories: boolean
    categoryIds: string[]
    onCategoryToggle: (id: string) => void
    priceBounds: { min: number; max: number } | undefined
    priceRange: [number, number]
    setPriceRange: (v: [number, number]) => void
    colors: string[] | undefined
    isLoadingColors: boolean
    selectedColors: string[]
    toggleColor: (color: string) => void
    isFiltered: boolean
    onReset: () => void
    availableColors: string[]
    selectedSizes: string[]
    onSizesChange: (sizes: string[]) => void
    selectedColors: string[]
    onColorsChange: (colors: string[]) => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-brand-muted mb-3">
            {children}
        </p>
    )
}

export function FilterPanel({
    categories, isLoadingCategories, categoryId, setCategoryId,
    priceBounds, priceRange, setPriceRange, isFiltered, onReset,
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
        <div className="space-y-7">

            {/* ── Categories ── */}
            <div>
                <SectionLabel>ໝວດໝູ່</SectionLabel>
                {isLoadingCategories ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-4 bg-brand-divider rounded animate-pulse w-3/4" />
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
                                            ? "text-brand-white font-semibold"
                                            : "text-brand-muted hover:text-brand-white"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        {/* Checkbox square indicator */}
                                        <span className={cn(
                                            "size-3.5 rounded border transition-all shrink-0",
                                            active
                                                ? "bg-brand-orange border-brand-orange"
                                                : "border-brand-divider group-hover:border-brand-white/40"
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
                                        <span className="text-[11px] text-brand-muted tabular-nums">{count}</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Size ── */}
            <div className="pt-5 border-t border-brand-divider">
                <SectionLabel>ຂະໜາດ</SectionLabel>

                {/* Clothing sizes */}
                <p className="text-[10px] text-brand-muted mb-2">ເສື້ອຜ້າ</p>
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
                                        ? "bg-brand-white border-brand-white text-brand-black"
                                        : "bg-transparent border-brand-divider text-brand-muted hover:border-brand-white/40 hover:text-brand-white"
                                )}
                            >
                                {s}
                            </button>
                        )
                    })}
                </div>

                {/* Shoe sizes */}
                <p className="text-[10px] text-brand-muted mb-2">ເບີເກີບ</p>
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
                                        ? "bg-brand-white border-brand-white text-brand-black"
                                        : "bg-transparent border-brand-divider text-brand-muted hover:border-brand-white/40 hover:text-brand-white"
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
                <div className="pt-5 border-t border-brand-divider">
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
                                            ? "ring-2 ring-brand-white ring-offset-2 ring-offset-brand-black scale-110"
                                            : "ring-1 ring-brand-divider hover:scale-110"
                                    )}
                                    style={{ backgroundColor: hex }}
                                />
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── Price ── */}
            <div className="pt-5 border-t border-brand-divider">
                <SectionLabel>ລາຄາ</SectionLabel>
                {priceBounds ? (
                    priceBounds.min === priceBounds.max ? (
                        <p className="text-xs text-brand-muted">{formatCurrency(priceBounds.min)}</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs text-brand-muted">
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
                                    "**:data-[slot=slider-track]:bg-brand-divider!",
                                    "**:data-[slot=slider-range]:bg-brand-orange!",
                                    "**:data-[slot=slider-thumb]:bg-white!",
                                    "**:data-[slot=slider-thumb]:border-2!",
                                    "**:data-[slot=slider-thumb]:border-brand-orange!",
                                    "**:data-[slot=slider-thumb]:shadow-none!",
                                )}
                            />
                        </div>
                    )
                ) : (
                    <div className="h-5 bg-brand-divider rounded animate-pulse" />
                )}
            </div>
        </div>
    )
}
