"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/FormatCurrency"

type Props = {
    total: number
}

export function CheckoutPaymentCard({ total }: Props) {
    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="pb-3">
                <CardTitle className="text-gray-900 text-base font-semibold">ຂໍ້ມູນການໂອນເງິນ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 text-sm">
                    <div className="flex justify-between px-4 py-2.5">
                        <span className="text-gray-500">ທະນາຄານ</span>
                        <span className="font-medium text-gray-900">BCEL ONE Bank</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5">
                        <span className="text-gray-500">ເລກທີບັນຊີ</span>
                        <span className="font-mono font-semibold text-gray-900">1631243388522</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5">
                        <span className="text-gray-500">ຊື່ບັນຊີ</span>
                        <span className="font-medium text-gray-900">VANXAYSPORTWARE</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5 bg-gray-50 rounded-b-lg">
                        <span className="font-semibold text-gray-700">ຍອດທີ່ຕ້ອງໂອນ</span>
                        <span className="font-bold text-orange-500">{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
                    ກະລຸນາແນບສະລິບທຸກຄັ້ງ · ລະບົບຈະກວດສອບ ແລະ ອະນຸມັດພາຍໃນ 24 ຊົ່ວໂມງ
                </p> */}
            </CardContent>
        </Card>
    )
}
