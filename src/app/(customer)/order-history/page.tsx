"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    CheckCircle2, Clock, MapPin, Package,
    ShoppingBag, Truck, Upload, X, XCircle, Eye,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetAllOrders, useUploadPaymentSlip } from "@/app/features/hooks/Order"
import { Order } from "@/modules/order/order.type"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"

// ────────────────────────────────────────────────────────────
// Status config
// ────────────────────────────────────────────────────────────

const ORDER_STATUS = {
    WAITING_PAYMENT: { label: "ລໍຖ້າຊຳລະ",  color: "bg-amber-50 text-amber-700 border-amber-200",    icon: Clock },
    PAID:            { label: "ຊຳລະແລ້ວ",    color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    SHIPPED:         { label: "ກຳລັງຈັດສົ່ງ", color: "bg-blue-50 text-blue-700 border-blue-200",         icon: Truck },
    COMPLETED:       { label: "ສຳເລັດ",        color: "bg-gray-100 text-gray-600 border-gray-200",        icon: CheckCircle2 },
    CANCELLED:       { label: "ຍົກເລີກ",       color: "bg-rose-50 text-rose-600 border-rose-200",         icon: XCircle },
} as const

const PAYMENT_STATUS = {
    PENDING:  { label: "ກຳລັງກວດສອບ", color: "bg-amber-50 text-amber-700 border-amber-200" },
    VERIFIED: { label: "ຢືນຢັນແລ້ວ",   color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    REJECTED: { label: "ຖືກປະຕິເສດ",  color: "bg-rose-50 text-rose-600 border-rose-200" },
} as const

const DELIVERY_STATUS = {
    PENDING:    { label: "ລໍຖ້າຈັດສົ່ງ",    color: "bg-gray-50 text-gray-500 border-gray-200",          icon: Package },
    PROCESSING: { label: "ກຳລັງກຽມສົ່ງ",   color: "bg-violet-50 text-violet-700 border-violet-200",    icon: Package },
    SHIPPED:    { label: "ກຳລັງຈັດສົ່ງ",    color: "bg-blue-50 text-blue-700 border-blue-200",          icon: Truck },
    DELIVERED:  { label: "ສົ່ງເຖິງແລ້ວ",    color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    CANCELLED:  { label: "ຍົກເລີກການສົ່ງ",  color: "bg-rose-50 text-rose-600 border-rose-200",          icon: XCircle },
} as const

// ────────────────────────────────────────────────────────────
// Skeleton
// ────────────────────────────────────────────────────────────

function OrderHistorySkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-10 animate-pulse">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="h-8 w-48 bg-gray-200 rounded-lg mb-8" />
                <div className="space-y-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                            <div className="flex justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 w-36 bg-gray-100 rounded" />
                                    <div className="h-3 w-24 bg-gray-100 rounded" />
                                </div>
                                <div className="h-6 w-24 bg-gray-100 rounded-full" />
                            </div>
                            <div className="h-px bg-gray-100" />
                            <div className="flex gap-3 items-center">
                                <div className="size-14 bg-gray-100 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/2 bg-gray-100 rounded" />
                                    <div className="h-3 w-1/3 bg-gray-100 rounded" />
                                </div>
                                <div className="h-4 w-20 bg-gray-100 rounded" />
                            </div>
                            <div className="h-px bg-gray-100" />
                            <div className="flex justify-between items-center">
                                <div className="h-5 w-28 bg-gray-100 rounded" />
                                <div className="h-9 w-28 bg-gray-100 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ────────────────────────────────────────────────────────────
// Slip upload dialog
// ────────────────────────────────────────────────────────────

type UploadDialogProps = {
    open: boolean
    onOpenChange: (v: boolean) => void
    orderId: string | null
    onUpload: (orderId: string, file: File) => void
    isPending: boolean
}

function SlipUploadDialog({ open, onOpenChange, orderId, onUpload, isPending }: UploadDialogProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    const handleSubmit = () => {
        if (!file || !orderId) return
        onUpload(orderId, file)
    }

    const handleClose = (v: boolean) => {
        if (!v) { setPreview(null); setFile(null) }
        onOpenChange(v)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-sm rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold">ອັບໂຫຼດສະລິບການໂອນ</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-1">
                    {preview ? (
                        <div className="relative">
                            <div className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                <Image src={preview} alt="slip preview" fill className="object-contain" />
                            </div>
                            <button
                                onClick={() => { setPreview(null); setFile(null) }}
                                className="absolute top-2 right-2 size-7 bg-white/90 border border-gray-200 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <X className="size-3.5 text-gray-600" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="w-full border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl p-10 text-center transition-colors group"
                        >
                            <Upload className="size-8 mx-auto mb-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                            <p className="text-sm font-semibold text-gray-700 mb-1">ກົດເພື່ອເລືອກໄຟລ໌</p>
                            <p className="text-xs text-gray-400">PNG, JPG ສູງສຸດ 10MB</p>
                        </button>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleSelect}
                        className="hidden"
                    />

                    {!preview && (
                        <Button
                            variant="outline"
                            className="w-full rounded-xl"
                            onClick={() => inputRef.current?.click()}
                        >
                            ເລືອກໄຟລ໌
                        </Button>
                    )}

                    {preview && (
                        <Button
                            className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-700 text-white font-bold gap-2"
                            onClick={handleSubmit}
                            disabled={isPending}
                        >
                            <Upload className="size-4" />
                            {isPending ? "ກຳລັງອັບໂຫຼດ..." : "ຢືນຢັນອັບໂຫຼດ"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ────────────────────────────────────────────────────────────
// Order card
// ────────────────────────────────────────────────────────────

type OrderCardProps = {
    order: Order
    onOpenUpload: (orderId: string) => void
}

function OrderCard({ order, onOpenUpload }: OrderCardProps) {
    const items   = order.order_details ?? []
    const payment = order.payment
    const delivery = order.delivery

    const orderCfg  = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]
    const StatusIcon = orderCfg?.icon ?? Package

    const canUpload =
        order.status === "WAITING_PAYMENT" ||
        payment?.status === "REJECTED"

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
                    {/* Order status */}
                    <Badge className={`${orderCfg?.color ?? "bg-gray-100 text-gray-600"} border flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold shadow-none`}>
                        <StatusIcon className="size-3" />
                        {orderCfg?.label ?? order.status}
                    </Badge>

                    {/* Payment status */}
                    {payment && (
                        <Badge className={`${PAYMENT_STATUS[payment.status as keyof typeof PAYMENT_STATUS]?.color ?? "bg-gray-100"} border text-[11px] font-medium shadow-none px-2 py-0.5`}>
                            {PAYMENT_STATUS[payment.status as keyof typeof PAYMENT_STATUS]?.label ?? payment.status}
                        </Badge>
                    )}

                    {/* Delivery status */}
                    {delivery && (() => {
                        const cfg = DELIVERY_STATUS[delivery.status as keyof typeof DELIVERY_STATUS]
                        const DeliveryIcon = cfg?.icon ?? Truck
                        return (
                            <Badge className={`${cfg?.color ?? "bg-gray-100 text-gray-600"} border flex items-center gap-1 text-[11px] font-medium shadow-none px-2 py-0.5`}>
                                <DeliveryIcon className="size-3" />
                                {cfg?.label ?? delivery.status}
                            </Badge>
                        )
                    })()}
                </div>
            </div>

            {/* Items */}
            <div className="px-6 py-4 divide-y divide-gray-50">
                {items.map(item => (
                    <div key={item.order_detail_id} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">
                        <div className="size-14 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative border border-gray-100">
                            <Image
                                src={item.product?.images?.[0]?.image_url ?? "/placeholder.png"}
                                alt={item.product?.product_name ?? ""}
                                fill sizes="56px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 truncate">
                                {item.product?.product_name ?? "ສິນຄ້າ"}
                            </p>
                            {item.variant && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {item.variant.color} / {item.variant.size}
                                </p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">
                                {item.quantity} ຊິ້ນ × {formatCurrency(item.price)}
                            </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 shrink-0">
                            {formatCurrency(item.price * item.quantity)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Delivery info */}
            {delivery && (
                <div className="px-6 py-3 bg-gray-50/60 border-t border-gray-100 space-y-1.5">
                    {delivery.address && (
                        <div className="flex items-start gap-2">
                            <MapPin className="size-3.5 text-gray-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-gray-500">
                                {[
                                    delivery.address.branch?.branch_name,
                                    delivery.address.district?.district_name,
                                    delivery.address.province?.province_name,
                                ].filter(Boolean).join(", ")}
                            </p>
                        </div>
                    )}
                    {delivery.tracking_number && (
                        <div className="flex items-center gap-2">
                            <Truck className="size-3.5 text-gray-400 shrink-0" />
                            <p className="text-xs text-gray-500">
                                ໝາຍເລກຕິດຕາມ: <span className="font-mono font-semibold text-gray-700">{delivery.tracking_number}</span>
                            </p>
                        </div>
                    )}
                    {delivery.provider && (
                        <p className="text-[11px] text-gray-400 pl-5">{delivery.provider}</p>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">ຍອດລວມທັງໝົດ</p>
                    <p className="text-xl font-extrabold text-gray-900">
                        {formatCurrency(order.total_amount ?? 0)}
                    </p>
                </div>

                <div className="flex gap-2 justify-end flex-wrap">
                    {payment?.slip_url && (
                        <Dialog>
                            <Dialog>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 rounded-xl text-xs gap-1.5 text-gray-600"
                                    asChild
                                >
                                    <a href={payment.slip_url} target="_blank" rel="noopener noreferrer">
                                        <Eye className="size-3.5" />
                                        ເບິ່ງສະລິບ
                                    </a>
                                </Button>
                            </Dialog>
                        </Dialog>
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

// ────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────

export default function OrderHistoryPage() {
    const { data: apiOrders, isLoading } = useGetAllOrders()
    const { mutate: uploadSlip, isPending: isUploading } = useUploadPaymentSlip()

    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const [uploadOpen, setUploadOpen] = useState(false)

    const orders: Order[] = apiOrders ?? []

    const handleUpload = (orderId: string, file: File) => {
        const fd = new FormData()
        fd.append("order_id", orderId)
        fd.append("file", file)
        uploadSlip(fd, {
            onSuccess: () => {
                setUploadOpen(false)
                toast.success("ອັບໂຫຼດຫຼັກຖານສຳເລັດ")
            },
            onError: (err) => {
                toast.error(err?.message ?? "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່")
            },
        })
    }

    const openUpload = (orderId: string) => {
        setSelectedOrderId(orderId)
        setUploadOpen(true)
    }

    if (isLoading) return <OrderHistorySkeleton />

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-xs">
                    <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="size-10 text-gray-300" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">ຍັງບໍ່ມີການສັ່ງຊື້</h1>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        ທ່ານຍັງບໍ່ໄດ້ສັ່ງຊື້ສິນຄ້າ — ເລີ່ມຊື້ເພື່ອເບິ່ງປະຫວັດໄດ້ທີ່ນີ້
                    </p>
                    <Link href="/shop">
                        <Button className="h-11 px-8 rounded-xl bg-gray-900 hover:bg-gray-700 text-white font-bold mt-2">
                            ໄປໜ້າຮ້ານ
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-6 max-w-3xl">

                <div className="mb-8">
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-500 mb-1">SportPro</p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">ປະຫວັດການສັ່ງຊື້</h1>
                    <p className="text-sm text-gray-400 mt-1">{orders.length} ລາຍການທັງໝົດ</p>
                </div>

                <div className="space-y-5">
                    {orders.map(order => (
                        <OrderCard key={order.order_id} order={order} onOpenUpload={openUpload} />
                    ))}
                </div>
            </div>

            <SlipUploadDialog
                open={uploadOpen}
                onOpenChange={setUploadOpen}
                orderId={selectedOrderId}
                onUpload={handleUpload}
                isPending={isUploading}
            />
        </div>
    )
}
