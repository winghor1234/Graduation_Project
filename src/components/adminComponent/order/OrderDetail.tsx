"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Order } from "@/modules/order/order.types"
import { formatDate } from "@/utils/FormatDate"
import Image from "next/image"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: Order
}

export function OrderDetailDialog({ open, onOpenChange, data }: Props) {

    if (!data) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">

                <h2 className="text-lg font-bold">ລາຍລະອຽດອໍເດີ້</h2>

                {/* ORDER */}
                <div>
                    <p>ອໍເດີ້: {data.order_code}</p>
                    <p>ສະຖານະ: {data.status}</p>
                    <p>ວັນທີ: {formatDate(data.order_date)}</p>
                </div>

                {/* PAYMENT */}
                <div>
                    <p>ການຊຳລະເງິນ: {data.payment?.status}</p>

                    {data.payment?.slip_url && (
                        <Image
                            src={data.payment.slip_url}
                            width={200}
                            height={200}
                            alt="slip"
                        />
                    )}
                </div>

                {/* DELIVERY */}
                <div>
                    <p>ການຈັດສົ່ງ: {data.delivery?.status}</p>
                    <p>ເລກຕິດຕາມພັດສະດຸ: {data.delivery?.tracking_number}</p>
                </div>
                <div>
                    <p>ແຂວງ: {data.delivery.address.province?.province_name}</p>
                    <p>ເມືອງ: {data.delivery.address.district?.district_name}</p>
                    <p>ສາຂາ: {data.delivery.address.branch?.branch_name}</p>
                </div>

            </DialogContent>
        </Dialog>
    )
}