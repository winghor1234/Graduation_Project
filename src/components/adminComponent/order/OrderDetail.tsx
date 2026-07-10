"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Order } from "@/modules/order/order.type"
import { formatDate } from "@/utils/FormatDate"
import Image from "next/image"
import { BadgeComponent } from "../StatusComponent"
import { useUpdateOrderStatus } from "@/app/features/hooks/Order"
import { toast } from "sonner"
import { OrderStatus } from "@prisma/client"

const NEXT_STATUSES: Partial<Record<OrderStatus, { status: OrderStatus; label: string; className: string }[]>> = {
    WAITING_PAYMENT: [
        { status: "PAID",      label: "ຢືນຢັນການຊຳລະ", className: "bg-emerald-500 hover:bg-emerald-600 text-white" },
        { status: "CANCELLED", label: "ຍົກເລີກ",         className: "bg-red-500 hover:bg-red-600 text-white" },
    ],
    PAID: [
        { status: "SHIPPED",   label: "ສົ່ງອອກ",   className: "bg-blue-500 hover:bg-blue-600 text-white" },
        { status: "CANCELLED", label: "ຍົກເລີກ",   className: "bg-red-500 hover:bg-red-600 text-white" },
    ],
    SHIPPED: [
        { status: "COMPLETED", label: "ສຳເລັດ", className: "bg-emerald-500 hover:bg-emerald-600 text-white" },
    ],
}

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: Order
}





export function OrderDetailDialog({ open, onOpenChange, data }: Props) {
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus()

    if (!data) return null

    const nextStatuses = NEXT_STATUSES[data.status] ?? []

    const handleUpdateStatus = (status: OrderStatus) => {
        if (!confirm(`ຢືນຢັນການປ່ຽນສະຖານະເປັນ "${status}"?`)) return
        updateStatus(
            { id: data.order_id, data: { status } },
            {
                onSuccess: () => {
                    toast.success("ອັບເດດສະຖານະສຳເລັດ — ລູກຄ້າໄດ້ຮັບການແຈ້ງເຕືອນແລ້ວ")
                    onOpenChange(false)
                },
                onError: () => toast.error("ເກີດຂໍ້ຜິດພາດ"),
            }
        )
    }

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

                {/* CUSTOMER INFO */}
                {data.customer && (
                    <div className="border rounded-lg p-4 mt-4 space-y-2 bg-gray-50">
                        <h3 className="font-semibold text-sm">ຂໍ້ມູນລູກຄ້າ</h3>
                        <div className="grid sm:grid-cols-3 gap-2 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs">ຊື່</p>
                                <p className="font-medium">{data.customer.customer_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">ເບີໂທ</p>
                                <p className="font-medium">{data.customer.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">ອີເມວ</p>
                                <p className="font-medium">{data.customer.email}</p>
                            </div>
                        </div>
                    </div>
                )}

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

                {/* Status actions */}
                {nextStatuses.length > 0 && (
                    <div className="mt-5 pt-4 border-t flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-500 font-medium">ອັບເດດສະຖານະ:</span>
                        {nextStatuses.map(({ status, label, className }) => (
                            <button
                                key={status}
                                disabled={isPending}
                                onClick={() => handleUpdateStatus(status)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 ${className}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

            </DialogContent>
        </Dialog>
    )
}