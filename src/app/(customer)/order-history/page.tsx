
"use client"

import { useState } from "react"
import Image from "next/image"
import { Package, Upload, Eye } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useGetAllOrders, useUploadPaymentSlip } from '@/app/features/hooks/Order';
import { Order } from "@/modules/order/order.types"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"

// ─── Status maps — ກົງກັບ Prisma enum ແທ້ ──────────────────

const statusColors: Record<string, string> = {
    WAITING_PAYMENT: "bg-amber-50 text-amber-700 border-amber-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
    COMPLETED: "bg-gray-100 text-gray-700 border-gray-300",
    CANCELLED: "bg-rose-50 text-rose-600 border-rose-200",
}

const statusLabels: Record<string, string> = {
    WAITING_PAYMENT: "ລໍຖ້າຊຳລະ",
    PAID: "ຊຳລະແລ້ວ",
    SHIPPED: "ກຳລັງຈັດສົ່ງ",
    COMPLETED: "ສຳເລັດ",
    CANCELLED: "ຍົກເລີກ",
}

const paymentStatusColors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    VERIFIED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-rose-50 text-rose-600",
}

const paymentStatusLabels: Record<string, string> = {
    PENDING: "ກຳລັງກວດສອບ",
    VERIFIED: "ຢືນຢັນແລ້ວ",
    REJECTED: "ຖືກປະຕິເສດ",
}

export default function OrderHistoryPage() {

    const { data: apiOrders, isLoading } = useGetAllOrders()
    const uploadSlip = useUploadPaymentSlip()   // ✅ hook ແຍກ — ບໍ່ໃຊ້ createOrder ຊ້ຳ

    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const [uploadOpen, setUploadOpen] = useState(false)

    const orders: Order[] = apiOrders ?? []

    const handleFileUpload = (orderId: string, file: File) => {
        const fd = new FormData()
        fd.append("order_id", orderId)
        fd.append("file", file)

        uploadSlip.mutate(fd, {
            onSuccess: () => {
                setUploadOpen(false)
                toast.success("ອັບໂຫຼດຫຼັກຖານສຳເລັດແລ້ວ! 🎉")
            },
            onError: (error) => {
                toast.error(error?.message || "ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫຼດ ❌")
            },
        })
    }

    const openUploadDialog = (orderId: string) => {
        setSelectedOrderId(orderId)
        setUploadOpen(true)
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-md font-medium text-muted-foreground animate-pulse">
                ກຳລັງໂຫຼດປະຫວັດການສັ່ງຊື້... 📦
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <Package className="size-20 mx-auto mb-6 text-gray-300" />
                <h1 className="text-3xl font-bold mb-4 text-gray-900">ຍັງບໍ່ມີປະຫວັດການສັ່ງຊື້</h1>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-light">
                    ທ່ານຍັງບໍ່ໄດ້ສັ່ງຊື້ສິນຄ້າ — ເລີ່ມຊື້ເພື່ອເບິ່ງປະຫວັດໄດ້ທີ່ນີ້
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">ປະຫວັດການສັ່ງຊື້</h1>

                <div className="space-y-6">
                    {orders.map(order => {

                        const items = order.order_details ?? []
                        const payment = order.payment   // ✅ object ດຽວ, ບໍ່ແມ່ນ array

                        const canUpload =
                            order.status === "WAITING_PAYMENT" ||
                            payment?.status === "REJECTED"

                            console.log("item : ", items)

                        return (
                            <Card key={order.order_id} className="border shadow-sm bg-white overflow-hidden">

                                <CardHeader className="bg-gray-50/50 border-b">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-lg text-gray-900">
                                                ລະຫັດອໍເດີ້:{" "}
                                                <span className="font-mono text-blue-600">{order.order_code}</span>
                                            </CardTitle>
                                            <p className="text-xs text-gray-400 font-light mt-1">
                                                ສັ່ງເມື່ອ {formatDate(order.order_date)}
                                            </p>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end gap-2">
                                            <Badge className={`${statusColors[order.status] ?? "bg-gray-100"} border text-xs shadow-none`}>
                                                {statusLabels[order.status] ?? order.status}
                                            </Badge>
                                            {payment && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    ການຊຳລະ:
                                                    <Badge variant="secondary" className={`${paymentStatusColors[payment.status] ?? "bg-gray-100"} text-[10px] px-1.5 py-0 shadow-none`}>
                                                        {paymentStatusLabels[payment.status] ?? payment.status}
                                                    </Badge>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6 space-y-4">

                                    {/* Items */}
                                    <div className="divide-y divide-gray-100">
                                        {items.map(item => (
                                            <div key={item.order_detail_id} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">

                                                <div className="w-16 h-16 bg-gray-50 rounded-lg border overflow-hidden flex-shrink-0 relative">
                                                    <Image
                                                        src={item.product?.images?.[0]?.image_url ?? "/placeholder.png"}
                                                        alt={item.product?.product_name ?? "Product"}
                                                        fill
                                                        sizes="64px"
                                                        className="object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-gray-900 truncate">
                                                        {item.product?.product_name ?? "ບໍ່ຮູ້ຈັກສິນຄ້າ"}
                                                    </p>
                                                    {/* ✅ variant info */}
                                                    {item.variant && (
                                                        <p className="text-xs text-gray-400">
                                                            {item.variant.color} / {item.variant.size}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {item.quantity} ຊິ້ນ × {formatCurrency(item.price)}
                                                    </p>
                                                </div>

                                                <p className="font-bold text-sm text-gray-900">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Summary + actions */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400 font-light">ຍອດລວມທັງໝົດ</p>
                                            <p className="text-xl font-extrabold text-gray-900">
                                                {formatCurrency(order.total_amount ?? 0)}
                                            </p>
                                        </div>

                                        <div className="flex gap-3 justify-end">

                                            {payment?.slip_url && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-gray-600 text-xs h-9 gap-1.5">
                                                            <Eye className="size-3.5" />
                                                            ເບິ່ງສະລິບ
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-md rounded-xl">
                                                        <DialogHeader>
                                                            <DialogTitle>ສະລິບການໂອນເງິນ</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="relative h-96 w-full mt-2 border rounded-lg overflow-hidden bg-gray-50">
                                                            <Image
                                                                src={payment.slip_url}
                                                                alt="Payment slip"
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}

                                            {canUpload && (
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 gap-1.5 shadow-sm"
                                                    onClick={() => openUploadDialog(order.order_id)}
                                                >
                                                    <Upload className="size-3.5" />
                                                    {payment?.slip_url ? "ອັບໂຫຼດສະລິບໃໝ່" : "ອັບໂຫຼດສະລິບ"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Upload dialog */}
                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                    <DialogContent className="max-w-md rounded-xl">
                        <DialogHeader>
                            <DialogTitle>ອັບໂຫຼດສະລິບການໂອນເງິນ</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl p-8 text-center bg-gray-50/50 transition-colors">
                                <input
                                    type="file"
                                    id="slip-upload"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file && selectedOrderId) handleFileUpload(selectedOrderId, file)
                                    }}
                                    className="hidden"
                                />
                                <label htmlFor="slip-upload" className="cursor-pointer block">
                                    <Upload className="size-10 mx-auto mb-3 text-gray-400" />
                                    <p className="text-sm font-semibold text-gray-800 mb-1">
                                        ກົດເພື່ອອັບໂຫຼດໄຟລ໌ສະລິບ
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        PNG, JPG ຂະໜາດສູງສຸດ 10MB
                                    </p>
                                </label>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}