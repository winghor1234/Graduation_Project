"use client"

import { PackageSearch } from "lucide-react"

export function EmptyState({ isFiltered, onReset }: { isFiltered: boolean; onReset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                <PackageSearch className="size-7 text-gray-400" />
            </div>
            <p className="text-gray-900 font-semibold mb-1">ບໍ່ພົບສິນຄ້າ</p>
            <p className="text-sm text-gray-400 mb-6">ລອງປ່ຽນຕົວກອງ ຫຼືຄົ້ນຫາດ້ວຍຄຳໃໝ່</p>
            {isFiltered && (
                <button
                    onClick={onReset}
                    className="px-6 h-10 rounded-lg border border-gray-200 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-900 transition-colors"
                >
                    ລ້າງຕົວກອງທັງໝົດ
                </button>
            )}
        </div>
    )
}
