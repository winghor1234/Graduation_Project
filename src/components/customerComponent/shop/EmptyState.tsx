// EmptyState.tsx
"use client"
import { PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState({ isFiltered, onReset }: { isFiltered: boolean; onReset: () => void }) {
    return (
        <div className="text-center py-28 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center gap-3">
            <PackageSearch className="size-8 text-gray-300" />
            <p className="text-gray-400 text-sm">ບໍ່ພົບສິນຄ້າທີ່ກົງກັບເງື່ອນໄຂ</p>
            {isFiltered && <Button variant="outline" onClick={onReset}>ລ້າງເງື່ອນໄຂການກອງ</Button>}
        </div>
    )
}