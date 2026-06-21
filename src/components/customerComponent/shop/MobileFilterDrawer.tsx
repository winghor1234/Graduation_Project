// MobileFilterDrawer.tsx
"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterPanel } from "./FilterPanel"
import { CategoryItem } from "./shop.types"

type Props = {
    open:    boolean
    onClose: () => void
    panelProps: React.ComponentProps<typeof FilterPanel>
}

export function MobileFilterDrawer({ open, onClose, panelProps }: Props) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">ກອງສິນຄ້າ</h3>
                    <button onClick={onClose}><X className="size-5 text-gray-500" /></button>
                </div>
                <FilterPanel {...panelProps} />
                <Button
                    className="w-full mt-6 h-11 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-white font-bold"
                    onClick={onClose}
                >
                    ສະແດງຜົນລັບ
                </Button>
            </div>
        </div>
    )
}