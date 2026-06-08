// import { Order } from "@/modules/order/order.types"

// type Props = {
//     order?: Order
// }

// export function OrderDetail({ order }: Props) {
//     if (!order) return <div>No data</div>

//     return (
//         <div className="space-y-4">

//             <div>
//                 <p><b>Order code:</b> {order.order_code}</p>
//                 <p><b>Status:</b> {order.status}</p>
//                 <p><b>Date:</b> {new Date(order.order_date).toLocaleString()}</p>
//             </div>

//             <div>
//                 <p className="font-semibold mb-2">Items</p>

//                 {order.order_details?.map((item) => (
//                     <div
//                         key={item.order_detail_id}
//                         className="flex justify-between border p-2 rounded"
//                     >
//                         <span>{item.product?.product_name}</span>
//                         <span>{item.quantity} x {item.price}</span>
//                     </div>
//                 ))}
//             </div>

//             <div className="text-right font-bold">
//                 Total: ${order.total_amount}
//             </div>

//         </div>
//     )
// }

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

                <h2 className="text-lg font-bold">Order Detail</h2>

                {/* ORDER */}
                <div>
                    <p>Order: {data.order_code}</p>
                    <p>Status: {data.status}</p>
                    <p>Date: {formatDate(data.order_date)}</p>
                </div>

                {/* PAYMENT */}
                <div>
                    <p>Payment: {data.payment?.status}</p>

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
                    <p>Delivery: {data.delivery?.status}</p>
                    <p>Tracking: {data.delivery?.tracking_number}</p>
                </div>
                <div>
                    <p>Province: {data.delivery.address.province?.province_name}</p>
                    <p>District: {data.delivery.address.district?.district_name}</p>
                    <p>Branch: {data.delivery.address.branch?.branch_name}</p>
                </div>

            </DialogContent>
        </Dialog>
    )
}