'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
    const router = useRouter()

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back()
        } else {
            router.push("/admin/POS") // fallback
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
        >
            <ArrowLeft size={16} />
            ກັບຄືນ
        </Button>
    )
}