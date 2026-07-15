"use client"

import { AlertTriangle } from "lucide-react"

export function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="size-16 rounded-full bg-rose-950/30 flex items-center justify-center mb-5">
                <AlertTriangle className="size-7 text-rose-400" />
            </div>
            <p className="text-brand-white font-semibold mb-1">ໂຫຼດສິນຄ້າບໍ່ສຳເລັດ</p>
            <p className="text-sm text-brand-muted mb-6">ກວດສອບການເຊື່ອມຕໍ່ ແລ້ວລອງໃໝ່</p>
            <button
                onClick={onRetry}
                className="px-6 h-10 rounded-lg border border-brand-divider text-sm text-brand-muted hover:border-rose-500/50 hover:text-rose-400 transition-colors"
            >
                ລອງໃໝ່
            </button>
        </div>
    )
}
