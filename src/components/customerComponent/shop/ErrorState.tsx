// ErrorState.tsx
"use client"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="text-center py-28 bg-white rounded-2xl border border-dashed border-red-200 flex flex-col items-center gap-3">
            <AlertTriangle className="size-8 text-red-300" />
            <p className="text-gray-500 text-sm">ໂຫຼດສິນຄ້າບໍ່ສຳເລັດ</p>
            <Button variant="outline" onClick={onRetry}>ລອງໃໝ່</Button>
        </div>
    )
}