"use client"

import { CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/FormatCurrency"

type Props = {
    total: number
}

export function CheckoutPaymentCard({ total }: Props) {
    return (
        <Card className="border shadow-sm bg-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                    <CreditCard className="size-5 text-blue-600" />
                    ຄຳແນະນຳການຊຳລະເງິນ
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5">
                    <h4 className="font-semibold text-blue-900 mb-2">ຂໍ້ມູນບັນຊີທະນາຄານ:</h4>
                    <div className="space-y-1.5 text-sm text-blue-800">
                        <p>ທະນາຄານ: SportPro Bank</p>
                        <p>ເລກທີບັນຊີ: 123-456-7890</p>
                        <p>ຊື່ບັນຊີ: SportPro E-Commerce Co., Ltd.</p>
                        <p className="font-bold text-base text-gray-900 mt-3 pt-2 border-t border-blue-200/50">
                            ຍອດເງິນທີ່ຕ້ອງໂອນ:{" "}
                            <span className="text-blue-600 text-lg">{formatCurrency(total)}</span>
                        </p>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-900 mb-1">
                        ⚠️ ກະລຸນາແນບຫຼັກຖານການໂອນເງິນ (ສະລິບ) ທຸກຄັ້ງຫຼັງໂອນສຳເລັດ
                    </p>
                    <p className="text-xs text-amber-800 font-light leading-relaxed">
                        ລະບົບຈະກວດສອບ ແລະ ອະນຸມັດການຈັດສົ່ງພາຍໃນ 24 ຊົ່ວໂມງ
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
