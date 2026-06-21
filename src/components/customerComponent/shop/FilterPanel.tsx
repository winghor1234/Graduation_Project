"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal, X } from "lucide-react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { ALL_CATEGORY_ID } from "./constants"
import { CategoryItem } from "./shop.types"

type Props = {
    categories: CategoryItem[] | undefined
    isLoadingCategories: boolean
    categoryId: string
    setCategoryId: (id: string) => void
    priceBounds: { min: number; max: number } | undefined
    priceRange: [number, number]
    setPriceRange: (v: [number, number]) => void
    isFiltered: boolean
    onReset: () => void
}

export function FilterPanel({
    categories, isLoadingCategories, categoryId, setCategoryId,
    priceBounds, priceRange, setPriceRange, isFiltered, onReset,
}: Props) {
    return (
        <div className="border border-gray-200/60 bg-white rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between text-gray-900">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4.5 stroke-[2.5]" />
                    <h3 className="text-xl font-bold tracking-tight">ການຕັ້ງຄ່າ</h3>
                </div>
                {isFiltered && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <X className="size-3" /> ລ້າງ
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-900 block mb-1">ໝວດໝູ່</Label>
                <div className="flex flex-col space-y-3 pt-1">
                    {isLoadingCategories ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        [{ category_id: ALL_CATEGORY_ID, category_name: "ສິນຄ້າທັງໝົດ" }, ...(categories ?? [])]
                            .map(item => {
                                const isActive = categoryId === item.category_id
                                const count = (item as CategoryItem)._count?.products
                                return (
                                    <button
                                        key={item.category_id}
                                        type="button"
                                        onClick={() => setCategoryId(item.category_id)}
                                        className="flex items-center justify-between text-left transition-all duration-200 group"
                                    >
                                        <span className="flex items-center">
                                            <span className={`text-xl leading-none mr-2 transition-all ${isActive ? "text-black opacity-100 scale-100" : "text-transparent opacity-0 scale-50"
                                                }`}>•</span>
                                            <span className={`text-sm font-semibold transition-colors ${isActive ? "text-black font-bold" : "text-gray-600 group-hover:text-black"
                                                }`}>
                                                {item.category_name}
                                            </span>
                                        </span>
                                        {typeof count === "number" && (
                                            <span className="text-xs text-gray-400">{count}</span>
                                        )}
                                    </button>
                                )
                            })
                    )}
                </div>
            </div>

            {/* <div className="space-y-3 pt-2">
                <Label className="text-sm font-bold text-gray-900 block">ຊ່ວງລາຄາ</Label>
                {priceBounds ? (
                    <>
                        <p className="text-xs text-gray-500">
                            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                        </p>
                        <Slider
                            min={priceBounds.min}
                            max={priceBounds.max}
                            step={Math.max(1, Math.round((priceBounds.max - priceBounds.min) / 100))}
                            value={priceRange}
                            onValueChange={(v) => setPriceRange(v as [number, number])}
                            className="py-2 cursor-pointer [&_[role=slider]]:bg-white [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-black [&_[role=slider]]:shadow-none [&_.bg-primary]:bg-slate-900 [&_.bg-secondary]:bg-gray-200"
                        />
                    </>
                ) : (
                    <div className="h-6 bg-gray-100 rounded animate-pulse" />
                )}
            </div> */}
            <div className="space-y-3 pt-2 border-2 border-red-500">
                <Label className="text-sm font-bold text-gray-900 block">ຊ່ວງລາຄາ</Label>

                {priceBounds ? (
                    priceBounds.min === priceBounds.max ? (
                        // ✅ ບໍ່ມີຊ່ວງລາຄາໃຫ້ກອງ
                        <p className="text-xs text-gray-400">
                            ທຸກສິນຄ້າມີລາຄາ {formatCurrency(priceBounds.min)}
                        </p>
                    ) : (
                        <>
                            <p className="text-xs text-gray-500  border-2 border-red-500">
                                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                            </p>
                            <Slider
                                min={priceBounds.min}
                                max={priceBounds.max}
                                step={Math.max(1, Math.round((priceBounds.max - priceBounds.min) / 100))}
                                value={priceRange}
                                onValueChange={(v) => setPriceRange(v as [number, number])}
                                className="py-2 cursor-pointer
                        [&_[data-slot=slider-track]]:bg-gray-200
                        [&_[data-slot=slider-range]]:bg-black
                        [&_[data-slot=slider-thumb]]:bg-white
                        [&_[data-slot=slider-thumb]]:border-2
                        [&_[data-slot=slider-thumb]]:border-black
                        [&_[data-slot=slider-thumb]]:shadow-none"
                            />
                        </>
                    )
                ) : (
                    <div className="h-6 bg-gray-100 rounded animate-pulse" />
                )}
            </div>
        </div>
    )
}