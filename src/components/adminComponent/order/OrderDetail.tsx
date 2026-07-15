"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Order } from "@/modules/order/order.type"
import { DeliveryStatus, OrderStatus } from "@prisma/client"
import { formatDate } from "@/utils/FormatDate"
import Image from "next/image"
import { BadgeComponent } from "../StatusComponent"
import { useUpdateOrderStatus } from "@/app/features/hooks/Order"
import { useUpdateDelivery } from "@/app/features/hooks/Delivery"
import { toast } from "sonner"

// ────────────────────────────────────────────────────────────
// Order status transitions
// ────────────────────────────────────────────────────────────

const NEXT_ORDER_STATUSES: Partial<Record<OrderStatus, { status: OrderStatus; label: string; className: string }[]>> = {
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

// ✅ COD — ຈ່າຍເງິນສົດຕອນສົ່ງ, ບໍ່ແມ່ນຕອນສັ່ງຊື້ — ຂ້າມຂັ້ນ "ຢືນຢັນການຊຳລະ" ປອມໆ, ສົ່ງອອກໄດ້ເລີຍ
const NEXT_ORDER_STATUSES_COD: Partial<Record<OrderStatus, { status: OrderStatus; label: string; className: string }[]>> = {
    WAITING_PAYMENT: [
        { status: "SHIPPED",   label: "ສົ່ງອອກ (ຈ່າຍປາຍທາງ)", className: "bg-blue-500 hover:bg-blue-600 text-white" },
        { status: "CANCELLED", label: "ຍົກເລີກ",               className: "bg-red-500 hover:bg-red-600 text-white" },
    ],
    PAID: [
        { status: "SHIPPED",   label: "ສົ່ງອອກ", className: "bg-blue-500 hover:bg-blue-600 text-white" },
        { status: "CANCELLED", label: "ຍົກເລີກ", className: "bg-red-500 hover:bg-red-600 text-white" },
    ],
    SHIPPED: [
        { status: "COMPLETED", label: "ຢືນຢັນເກັບເງິນສົດແລ້ວ", className: "bg-emerald-500 hover:bg-emerald-600 text-white" },
    ],
}

// ────────────────────────────────────────────────────────────
// Delivery status transitions
// ────────────────────────────────────────────────────────────

const NEXT_DELIVERY_STATUSES: Partial<Record<DeliveryStatus, { status: DeliveryStatus; label: string; className: string; needsTracking?: boolean }[]>> = {
    PENDING: [
        { status: "PROCESSING", label: "ກຽມຈັດສົ່ງ", className: "bg-violet-500 hover:bg-violet-600 text-white" },
        { status: "CANCELLED",  label: "ຍົກເລີກການສົ່ງ", className: "bg-red-500 hover:bg-red-600 text-white" },
    ],
    PROCESSING: [
        { status: "SHIPPED",   label: "ສົ່ງອອກ", className: "bg-blue-500 hover:bg-blue-600 text-white", needsTracking: true },
        { status: "CANCELLED", label: "ຍົກເລີກການສົ່ງ", className: "bg-red-500 hover:bg-red-600 text-white" },
    ],
    SHIPPED: [
        { status: "DELIVERED", label: "ສົ່ງເຖິງແລ້ວ", className: "bg-emerald-500 hover:bg-emerald-600 text-white" },
    ],
}

// ────────────────────────────────────────────────────────────

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: Order
}

export function OrderDetailDialog({ open, onOpenChange, data }: Props) {
    const { mutate: updateOrderStatus, isPending: orderPending } = useUpdateOrderStatus()
    const { mutate: updateDelivery,    isPending: deliveryPending } = useUpdateDelivery()

    const [trackingNumber, setTrackingNumber] = useState("")
    const [pendingDeliveryStatus, setPendingDeliveryStatus] = useState<DeliveryStatus | null>(null)

    if (!data) return null

    const isCOD = data.payment?.method === "CASH"
    const nextOrderStatuses = (isCOD ? NEXT_ORDER_STATUSES_COD : NEXT_ORDER_STATUSES)[data.status] ?? []
    const nextDeliveryStatuses = data.delivery
        ? (NEXT_DELIVERY_STATUSES[data.delivery.status] ?? [])
        : []

    const handleUpdateOrderStatus = (status: OrderStatus) => {
        if (!confirm(`ຢືນຢັນການປ່ຽນສະຖານະອໍເດີ້ເປັນ "${status}"?`)) return
        updateOrderStatus(
            { id: data.order_id, data: { status } },
            {
                onSuccess: () => {
                    toast.success("ອັບເດດສະຖານະສຳເລັດ — ລູກຄ້າໄດ້ຮັບການແຈ້ງເຕືອນແລ້ວ")
                    onOpenChange(false)
                },
                onError: () => toast.error("ເກີດຂໍ້ຜິດພາດໃນການປ່ຽນສະຖານະ"),
            }
        )
    }

    const handleDeliveryStatusClick = (next: { status: DeliveryStatus; needsTracking?: boolean }) => {
        if (next.needsTracking) {
            // show tracking number input inline
            setPendingDeliveryStatus(next.status)
            return
        }
        confirmDeliveryUpdate(next.status)
    }

    const confirmDeliveryUpdate = (status: DeliveryStatus, tracking?: string) => {
        if (!data.delivery) return
        updateDelivery(
            {
                id:   data.delivery.delivery_id,
                data: { status, ...(tracking ? { tracking_number: tracking } : {}) },
            },
            {
                onSuccess: () => {
                    toast.success("ອັບເດດສະຖານະການຈັດສົ່ງສຳເລັດ")
                    setPendingDeliveryStatus(null)
                    setTrackingNumber("")
                    onOpenChange(false)
                },
                onError: () => toast.error("ເກີດຂໍ້ຜິດພາດໃນການອັບເດດການຈັດສົ່ງ"),
            }
        )
    }

    const isPending = orderPending || deliveryPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">

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
                        <div className="flex items-center gap-2">
                            <BadgeComponent status={data.payment?.method} />
                            <BadgeComponent status={data.payment?.status} />
                        </div>
                        {data.payment?.slip_url ? (
                            <div>
                                <p className="text-sm text-gray-500 my-2">ຫຼັກຖານການຊຳລະ</p>
                                <Image
                                    src={data.payment.slip_url}
                                    width={250}
                                    height={250}
                                    alt="slip"
                                    className="rounded-lg border"
                                />
                            </div>
                        ) : data.payment?.method === "CASH" ? (
                            <p className="text-sm text-gray-500">
                                {data.payment?.status === "VERIFIED"
                                    ? "ພະນັກງານຂົນສົ່ງເກັບເງິນສົດຈາກລູກຄ້າແລ້ວ"
                                    : "ລູກຄ້າຈະຈ່າຍເງິນສົດໃຫ້ພະນັກງານຂົນສົ່ງເມື່ອໄດ້ຮັບສິນຄ້າ — ບໍ່ຕ້ອງກວດສະລິບ"}
                            </p>
                        ) : null}
                    </div>

                    {/* DELIVERY */}
                    <div className="border rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold">ການຈັດສົ່ງ</h3>
                        <BadgeComponent status={data.delivery?.status} />

                        <p className="text-sm">
                            <span className="text-gray-500">Tracking: </span>
                            {data.delivery?.tracking_number ?? "-"}
                        </p>

                        <div className="text-sm space-y-1">
                            <p>ແຂວງ: {data.delivery?.address?.province?.province_name ?? "-"}</p>
                            <p>ເມືອງ: {data.delivery?.address?.district?.district_name ?? "-"}</p>
                            <p>ສາຂາ: {data.delivery?.address?.branch?.branch_name ?? "-"}</p>
                        </div>

                        {/* Delivery status actions */}
                        {nextDeliveryStatuses.length > 0 && (
                            <div className="pt-2 border-t space-y-2">
                                <p className="text-xs text-gray-500 font-medium">ອັບເດດການຈັດສົ່ງ:</p>
                                <div className="flex flex-wrap gap-2">
                                    {nextDeliveryStatuses.map(({ status, label, className, needsTracking }) => (
                                        <button
                                            key={status}
                                            disabled={isPending}
                                            onClick={() => handleDeliveryStatusClick({ status, needsTracking })}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 ${className}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Tracking number input — shown only when SHIPPED selected */}
                                {pendingDeliveryStatus === "SHIPPED" && (
                                    <div className="mt-2 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="ໝາຍເລກຕິດຕາມ (tracking number)"
                                            value={trackingNumber}
                                            onChange={e => setTrackingNumber(e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                disabled={isPending}
                                                onClick={() => confirmDeliveryUpdate("SHIPPED", trackingNumber || undefined)}
                                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                                            >
                                                {deliveryPending ? "ກຳລັງອັບເດດ..." : "ຢືນຢັນສົ່ງອອກ"}
                                            </button>
                                            <button
                                                onClick={() => { setPendingDeliveryStatus(null); setTrackingNumber("") }}
                                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                                            >
                                                ຍົກເລີກ
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* Order status actions */}
                {nextOrderStatuses.length > 0 && (
                    <div className="mt-5 pt-4 border-t flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-500 font-medium">ອັບເດດສະຖານະອໍເດີ້:</span>
                        {nextOrderStatuses.map(({ status, label, className }) => (
                            <button
                                key={status}
                                disabled={isPending}
                                onClick={() => handleUpdateOrderStatus(status)}
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
