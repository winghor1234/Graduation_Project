"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Order } from "@/modules/order/order.type"
import { formatDate } from "@/utils/FormatDate"
import Image from "next/image"
import {  BadgeComponent } from "../StatusComponent"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: Order
}





export function OrderDetailDialog({ open, onOpenChange, data }: Props) {
    if (!data) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">

                <DialogTitle className="text-xl font-bold">
                    ລາຍລະອຽດອໍເດີ້
                </DialogTitle>

                {/* TOP INFO GRID */}
                <div className="grid md:grid-cols-3 gap-4 border-b pb-4 mt-4">

                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">ເລກອໍເດີ້</p>
                        <p className="font-semibold">{data.order_code}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">ສະຖານະອໍເດີ້</p>
                        <BadgeComponent status={data.status} />
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">ວັນທີ</p>
                        <p className="font-semibold">{formatDate(data.order_date)}</p>
                    </div>
                </div>

                {/* PAYMENT + DELIVERY GRID */}
                <div className="grid md:grid-cols-2 gap-6 mt-5">

                    {/* PAYMENT */}
                    <div className="border rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold">ການຊຳລະເງິນ</h3>

                        <BadgeComponent status={data.payment?.status} />

                        {data.payment?.slip_url && (
                            <div>
                                <p className="text-sm text-gray-500 my-2">
                                    ຫຼັກຖານການຊຳລະ
                                </p>

                                <Image
                                    src={data.payment.slip_url}
                                    width={250}
                                    height={250}
                                    alt="slip"
                                    className="rounded-lg border"
                                />
                            </div>
                        )}
                    </div>

                    {/* DELIVERY */}
                    <div className="border rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold">ການຈັດສົ່ງ</h3>

                        <BadgeComponent status={data.delivery?.status} />

                        <p className="text-sm mt-2">
                            <span className="text-gray-500">Tracking: </span>
                            {data.delivery?.tracking_number ?? "-"}
                        </p>

                        <div className="text-sm space-y-1">
                            <p>ແຂວງ: {data.delivery?.address?.province?.province_name ?? "-"}</p>
                            <p>ເມືອງ: {data.delivery?.address?.district?.district_name ?? "-"}</p>
                            <p>ສາຂາ: {data.delivery?.address?.branch?.branch_name ?? "-"}</p>
                        </div>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    )
}