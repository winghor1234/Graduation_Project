"use client"

import { Banknote, Landmark } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type PaymentMethodOption = "TRANSFER" | "CASH"

type Props = {
    value: PaymentMethodOption
    onChange: (method: PaymentMethodOption) => void
}

const OPTIONS: { value: PaymentMethodOption; label: string; description: string; icon: typeof Landmark }[] = [
    {
        value: "TRANSFER",
        label: "ໂອນເງິນຜ່ານທະນາຄານ",
        description: "ໂອນເງິນລ່ວງໜ້າ ແລະ ແນບສະລິບ",
        icon: Landmark,
    },
    {
        value: "CASH",
        label: "ຈ່າຍເງິນປາຍທາງ (COD)",
        description: "ຈ່າຍເງິນສົດເມື່ອໄດ້ຮັບສິນຄ້າ",
        icon: Banknote,
    },
]

export function CheckoutMethodSelector({ value, onChange }: Props) {
    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="pb-3">
                <CardTitle className="text-gray-900 text-base font-semibold">ວິທີການຊຳລະເງິນ</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OPTIONS.map(opt => {
                    const Icon = opt.icon
                    const selected = value === opt.value
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className={`flex items-start gap-3 text-left rounded-xl border-2 px-4 py-3 transition-colors ${
                                selected
                                    ? "border-brand-orange bg-brand-orange/5"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
                                selected ? "bg-brand-orange text-white" : "bg-gray-100 text-gray-500"
                            }`}>
                                <Icon className="size-4.5" />
                            </div>
                            <div className="min-w-0">
                                <p className={`text-sm font-semibold ${selected ? "text-brand-orange" : "text-gray-900"}`}>
                                    {opt.label}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
                            </div>
                        </button>
                    )
                })}
            </CardContent>
        </Card>
    )
}
