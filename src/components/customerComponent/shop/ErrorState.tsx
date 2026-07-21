"use client"

import { AlertTriangle } from "lucide-react"

export function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="size-16 rounded-full bg-rose-50 flex items-center justify-center mb-5">
                <AlertTriangle className="size-7 text-rose-500" />
            </div>
            <p className="text-gray-900 font-semibold mb-1">ໂຫຼດສິນຄ້າບໍ່ສຳເລັດ</p>
            <p className="text-sm text-gray-400 mb-6">ກວດສອບການເຊື່ອມຕໍ່ ແລ້ວລອງໃໝ່</p>
            <button
                onClick={onRetry}
                className="px-6 h-10 rounded-lg border border-gray-200 text-sm text-gray-500 hover:border-rose-300 hover:text-rose-500 transition-colors"
            >
                ລອງໃໝ່
            </button>
        </div>
    )
}
