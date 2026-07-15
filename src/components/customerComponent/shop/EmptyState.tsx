"use client"

import { PackageSearch } from "lucide-react"

export function EmptyState({ isFiltered, onReset }: { isFiltered: boolean; onReset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="size-16 rounded-full bg-brand-divider flex items-center justify-center mb-5">
                <PackageSearch className="size-7 text-brand-muted" />
            </div>
            <p className="text-brand-white font-semibold mb-1">ບໍ່ພົບສິນຄ້າ</p>
            <p className="text-sm text-brand-muted mb-6">ລອງປ່ຽນຕົວກອງ ຫຼືຄົ້ນຫາດ້ວຍຄຳໃໝ່</p>
            {isFiltered && (
                <button
                    onClick={onReset}
                    className="px-6 h-10 rounded-lg border border-brand-divider text-sm text-brand-muted hover:border-brand-white/40 hover:text-brand-white transition-colors"
                >
                    ລ້າງຕົວກອງທັງໝົດ
                </button>
            )}
        </div>
    )
}
