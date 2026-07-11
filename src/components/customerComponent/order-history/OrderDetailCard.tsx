"use client"

import Image from "next/image"
import { ArrowLeft, Eye, MapPin, Package, Truck, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Order } from "@/modules/order/order.type"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { ORDER_STATUS, PAYMENT_STATUS, DELIVERY_STATUS } from "./orderStatusConfig"
import Link from "next/link"

type Props = {
    order: Order
    onOpenUpload: (orderId: string) => void
}

export function OrderDetailCard({ order, onOpenUpload }: Props) {
    const items    = order.order_details ?? []
    const payment  = order.payment
    const delivery = order.delivery

    const orderCfg   = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]
    const StatusIcon = orderCfg?.icon ?? Package
    const canUpload  = order.status === "WAITING_PAYMENT" || payment?.status === "REJECTED"

    const payCfg      = payment  ? PAYMENT_STATUS[payment.status  as keyof typeof PAYMENT_STATUS]  : null
    const deliveryCfg = delivery ? DELIVERY_STATUS[delivery.status as keyof typeof DELIVERY_STATUS] : null
    const DeliveryIcon = deliveryCfg?.icon ?? Truck

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">

                {/* Back */}
                <Button variant="ghost" size="sm" className="mb-6 gap-2 text-gray-500 hover:text-gray-900 pl-0" asChild>
                    <Link href="/customer/order-history">
                        <ArrowLeft className="size-4" />
                        ກັບໄປປະຫວັດການສັ່ງຊື້
                    </Link>
                </Button>

                {/* Header card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                                <p className="text-xs text-gray-400 font-medium mb-1">ລະຫັດອໍເດີ້</p>
                                <p className="text-2xl font-extrabold font-mono text-gray-900 tracking-wide">{order.order_code}</p>
                                <p className="text-sm text-gray-400 mt-1">{formatDate(order.order_date)}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge className={`${orderCfg?.color ?? "bg-gray-100 text-gray-600"} border flex items-center gap-1.5 px-3 py-1 text-sm font-semibold shadow-none`}>
                                    <StatusIcon className="size-3.5" />
                                    {orderCfg?.label ?? order.status}
                                </Badge>
                                {payCfg && (
                                    <Badge className={`${payCfg.color} border text-xs font-medium shadow-none px-2.5 py-1`}>
                                        {payCfg.label}
                                    </Badge>
                                )}
                                {deliveryCfg && (
                                    <Badge className={`${deliveryCfg.color} border flex items-center gap-1 text-xs font-medium shadow-none px-2.5 py-1`}>
                                        <DeliveryIcon className="size-3" />
                                        {deliveryCfg.label}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
                        <p className="text-sm text-gray-500">ຍອດລວມທັງໝົດ</p>
                        <p className="text-2xl font-extrabold text-gray-900">{formatCurrency(order.total_amount ?? 0)}</p>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">ລາຍການສິນຄ້າ ({items.length} ລາຍການ)</h2>
                    </div>
                    <div className="divide-y divide-gray-50 px-6">
                        {items.map(item => (
                            <div key={item.order_detail_id} className="flex gap-4 py-4 items-center">
                                <div className="size-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative border border-gray-100">
                                    <Image
                                        src={item.product?.images?.[0]?.image_url ?? "/placeholder.png"}
                                        alt={item.product?.product_name ?? ""}
                                        fill sizes="64px" className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900">{item.product?.product_name ?? "ສິນຄ້າ"}</p>
                                    {item.variant && (
                                        <p className="text-sm text-gray-400 mt-0.5">{item.variant.color} / {item.variant.size}</p>
                                    )}
                                    <p className="text-sm text-gray-400 mt-1">{item.quantity} ຊິ້ນ × {formatCurrency(item.price)}</p>
                                </div>
                                <p className="font-bold text-gray-900 shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment */}
                {payment && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-900">ການຊຳລະເງິນ</h2>
                        </div>
                        <div className="px-6 py-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">ສະຖານະ</span>
                                <Badge className={`${payCfg?.color ?? "bg-gray-100"} border text-xs font-medium shadow-none`}>
                                    {payCfg?.label ?? payment.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">ຈຳນວນທັງໝົດ</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                            </div>
                            {payment.slip_url && (
                                <div className="pt-2">
                                    <p className="text-sm text-gray-500 mb-2">ຫຼັກຖານການຊຳລະ</p>
                                    <div className="relative h-48 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                        <Image src={payment.slip_url} alt="slip" fill className="object-contain" />
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-2 h-8 text-xs gap-1.5" asChild>
                                        <a href={payment.slip_url} target="_blank" rel="noopener noreferrer">
                                            <Eye className="size-3.5" />
                                            ເບິ່ງຕົ້ນສະບັບ
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Delivery */}
                {delivery && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-900">ການຈັດສົ່ງ</h2>
                        </div>
                        <div className="px-6 py-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">ສະຖານະ</span>
                                {deliveryCfg && (
                                    <Badge className={`${deliveryCfg.color} border flex items-center gap-1 text-xs font-medium shadow-none`}>
                                        <DeliveryIcon className="size-3" />
                                        {deliveryCfg.label}
                                    </Badge>
                                )}
                            </div>
                            {delivery.tracking_number && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">ເລກຕິດຕາມ</span>
                                    <span className="font-mono font-semibold text-gray-900">{delivery.tracking_number}</span>
                                </div>
                            )}
                            {delivery.provider && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">ຜູ້ໃຫ້ບໍລິການ</span>
                                    <span className="text-gray-700">{delivery.provider}</span>
                                </div>
                            )}
                            {delivery.address && (
                                <div className="flex items-start gap-2 pt-1">
                                    <MapPin className="size-4 text-gray-400 mt-0.5 shrink-0" />
                                    <div className="text-gray-600 space-y-0.5">
                                        {delivery.address.branch?.branch_name && <p>{delivery.address.branch.branch_name}</p>}
                                        {delivery.address.district?.district_name && <p>{delivery.address.district.district_name}</p>}
                                        {delivery.address.province?.province_name && <p>{delivery.address.province.province_name}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Upload slip action */}
                {canUpload && (
                    <Button
                        className="w-full h-12 rounded-2xl bg-gray-900 hover:bg-gray-700 text-white font-bold gap-2"
                        onClick={() => onOpenUpload(order.order_id)}
                    >
                        <Upload className="size-4" />
                        {payment?.slip_url ? "ອັບໂຫຼດສະລິບໃໝ່" : "ອັບໂຫຼດຫຼັກຖານການໂອນ"}
                    </Button>
                )}
            </div>
        </div>
    )
}
