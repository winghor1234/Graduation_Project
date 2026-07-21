"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SortBy } from "./shop.types"

type Props = {
    searchInput: string
    onSearchChange: (v: string) => void
    sortBy: SortBy
    onSortChange: (v: SortBy) => void
    isFiltered: boolean
    onOpenDrawer: () => void
}

export function ShopSearchBar({
    searchInput, onSearchChange, sortBy, onSortChange, isFiltered, onOpenDrawer,
}: Props) {
    return (
        <div className="flex gap-3 items-center">
            <Button
                variant="outline"
                onClick={onOpenDrawer}
                className="md:hidden h-11 px-4 rounded-xl flex items-center gap-2 shrink-0 border-gray-200 bg-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900"
            >
                <SlidersHorizontal className="size-4" />
                ກອງ
                {isFiltered && <span className="size-2 rounded-full bg-brand-orange" />}
            </Button>

            <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                <Input
                    placeholder="ຄົ້ນຫາສິນຄ້າ..."
                    value={searchInput}
                    onChange={e => onSearchChange(e.target.value)}
                    className="pl-10 h-11 bg-[#f1f3f5] border-none rounded-xl focus-visible:ring-0 text-sm shadow-none text-gray-900 placeholder:text-gray-400"
                />
            </div>

            <select
                value={sortBy}
                onChange={e => onSortChange(e.target.value as SortBy)}
                className="h-11 px-4 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 font-medium focus:outline-none cursor-pointer min-w-[150px]"
            >
                <option value="featured">ແນະນຳ</option>
                <option value="price-low">ລາຄາ: ຕ່ຳ → ສູງ</option>
                <option value="price-high">ລາຄາ: ສູງ → ຕ່ຳ</option>
                <option value="name">ຊື່: ກ → ຮ</option>
            </select>
        </div>
    )
}
