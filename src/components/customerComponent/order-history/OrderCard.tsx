"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, MapPin, Truck, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Order } from "@/modules/order/order.type"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { ORDER_STATUS, PAYMENT_STATUS, DELIVERY_STATUS } from "./orderStatusConfig"
import { Package } from "lucide-react"

type Props = {
    order: Order
    onOpenUpload: (orderId: string) => void
}

export function OrderCard({ order, onOpenUpload }: Props) {
    const items    = order.order_details ?? []
    const payment  = order.payment
    const delivery = order.delivery

    const orderCfg   = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]
    const StatusIcon = orderCfg?.icon ?? Package
    const canUpload  = order.status === "WAITING_PAYMENT" || payment?.status === "REJECTED"

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
                <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">ລະຫັດອໍເດີ້</p>
                    <p className="font-bold font-mono text-gray-900 tracking-wide">{order.order_code}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.order_date)}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${orderCfg?.color ?? "bg-gray-100 text-gray-600"} border flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold shadow-none`}>
                        <StatusIcon className="size-3" />
                        {orderCfg?.label ?? order.status}
                    </Badge>

                    {payment && (
                        <Badge className={`${PAYMENT_STATUS[payment.status as keyof typeof PAYMENT_STATUS]?.color ?? "bg-gray-100"} border text-[11px] font-medium shadow-none px-2 py-0.5`}>
                            {PAYMENT_STATUS[payment.status as keyof typeof PAYMENT_STATUS]?.label ?? payment.status}
                        </Badge>
                    )}

                    {delivery && (() => {
                        const cfg = DELIVERY_STATUS[delivery.status as keyof typeof DELIVERY_STATUS]
                        const DIcon = cfg?.icon ?? Truck
                        return (
                            <Badge className={`${cfg?.color ?? "bg-gray-100 text-gray-600"} border flex items-center gap-1 text-[11px] font-medium shadow-none px-2 py-0.5`}>
                                <DIcon className="size-3" />
                                {cfg?.label ?? delivery.status}
                            </Badge>
                        )
                    })()}
                </div>
            </div>

            {/* Items (show first 2 only) */}
            <div className="px-6 py-4 divide-y divide-gray-50">
                {items.slice(0, 2).map(item => (
                    <div key={item.order_detail_id} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">
                        <div className="size-14 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative border border-gray-100">
                            <Image
                                src={item.product?.images?.[0]?.image_url ?? "/placeholder.png"}
                                alt={item.product?.product_name ?? ""}
                                fill sizes="56px" className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 truncate">{item.product?.product_name ?? "ສິນຄ້າ"}</p>
                            {item.variant && (
                                <p className="text-xs text-gray-400 mt-0.5">{item.variant.color} / {item.variant.size}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">{item.quantity} ຊິ້ນ × {formatCurrency(item.price)}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                ))}
                {items.length > 2 && (
                    <p className="text-xs text-gray-400 pt-2">+{items.length - 2} ລາຍການ</p>
                )}
            </div>

            {/* Delivery info */}
            {delivery?.address && (
                <div className="px-6 py-3 bg-gray-50/60 border-t border-gray-100 space-y-1.5">
                    <div className="flex items-start gap-2">
                        <MapPin className="size-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-500">
                            {[delivery.address.branch?.branch_name, delivery.address.district?.district_name, delivery.address.province?.province_name].filter(Boolean).join(", ")}
                        </p>
                    </div>
                    {delivery.tracking_number && (
                        <div className="flex items-center gap-2">
                            <Truck className="size-3.5 text-gray-400 shrink-0" />
                            <p className="text-xs text-gray-500">
                                ໝາຍເລກຕິດຕາມ: <span className="font-mono font-semibold text-gray-700">{delivery.tracking_number}</span>
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">ຍອດລວມທັງໝົດ</p>
                    <p className="text-xl font-extrabold text-gray-900">{formatCurrency(order.total_amount ?? 0)}</p>
                </div>

                <div className="flex gap-2 justify-end flex-wrap">
                    <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs gap-1.5 text-gray-300" asChild>
                        <Link href={`/customer/order-history/${order.order_id}`}>
                            <Eye className="size-3.5" />
                            ລາຍລະອຽດ
                        </Link>
                    </Button>

                    {payment?.slip_url && (
                        <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs gap-1.5 text-gray-300" asChild>
                            <a href={payment.slip_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="size-3.5" />
                                ເບິ່ງສະລິບ
                            </a>
                        </Button>
                    )}

                    {canUpload && (
                        <Button
                            size="sm"
                            className="h-9 rounded-xl text-xs gap-1.5 bg-gray-900 hover:bg-gray-700 text-white shadow-none"
                            onClick={() => onOpenUpload(order.order_id)}
                        >
                            <Upload className="size-3.5" />
                            {payment?.slip_url ? "ອັບໂຫຼດໃໝ່" : "ອັບໂຫຼດສະລິບ"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
