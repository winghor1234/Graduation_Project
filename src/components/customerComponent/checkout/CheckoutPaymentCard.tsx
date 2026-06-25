"use client"

import { CreditCard, Building2, Hash, User, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/FormatCurrency"

type Props = {
    total: number
}

export function CheckoutPaymentCard({ total }: Props) {
    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2.5 text-gray-900 text-base">
                    <div className="size-8 rounded-xl bg-blue-50 flex items-center justify-center">
                        <CreditCard className="size-4 text-blue-600" />
                    </div>
                    ຄຳແນະນຳການຊຳລະເງິນ
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                    <h4 className="font-semibold text-blue-900 text-sm">ຂໍ້ມູນບັນຊີທະນາຄານ</h4>
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                            <div className="size-7 rounded-lg bg-white border border-blue-100 flex items-center justify-center shrink-0">
                                <Building2 className="size-3.5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[11px] text-blue-400 leading-none mb-0.5">ທະນາຄານ</p>
                                <p className="text-sm font-medium text-blue-900">SportPro Bank</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="size-7 rounded-lg bg-white border border-blue-100 flex items-center justify-center shrink-0">
                                <Hash className="size-3.5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[11px] text-blue-400 leading-none mb-0.5">ເລກທີບັນຊີ</p>
                                <p className="text-sm font-mono font-bold text-blue-900 tracking-wider">123-456-7890</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="size-7 rounded-lg bg-white border border-blue-100 flex items-center justify-center shrink-0">
                                <User className="size-3.5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[11px] text-blue-400 leading-none mb-0.5">ຊື່ບັນຊີ</p>
                                <p className="text-sm font-medium text-blue-900">SportPro E-Commerce Co., Ltd.</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-blue-200 flex items-center justify-between">
                        <span className="text-sm text-blue-700">ຍອດເງິນທີ່ຕ້ອງໂອນ</span>
                        <span className="text-xl font-extrabold text-blue-700">{formatCurrency(total)}</span>
                    </div>
                </div>

                <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                    <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800 mb-0.5">
                            ກະລຸນາແນບຫຼັກຖານການໂອນທຸກຄັ້ງ
                        </p>
                        <p className="text-xs text-amber-600 leading-relaxed">
                            ລະບົບຈະກວດສອບ ແລະ ອະນຸມັດການຈັດສົ່ງພາຍໃນ 24 ຊົ່ວໂມງ
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}