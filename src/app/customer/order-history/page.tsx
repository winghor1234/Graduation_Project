"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useGetAllOrders, useUploadPaymentSlip } from "@/app/features/hooks/Order"
import { Order } from "@/modules/order/order.type"
import { OrderCard } from "@/components/customerComponent/order-history/OrderCard"
import { SlipUploadDialog } from "@/components/customerComponent/order-history/SlipUploadDialog"

function Skeleton() {
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
            onSuccess: () => { setUploadOpen(false); toast.success("ອັບໂຫຼດຫຼັກຖານສຳເລັດ") },
            onError:   (err) => toast.error(err?.message ?? "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່"),
        })
    }

    if (isLoading) return <Skeleton />

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
                    <Button asChild className="h-11 px-8 rounded-xl bg-gray-900 hover:bg-gray-700 text-white font-bold mt-2">
                        <Link href="/customer/home">ໄປໜ້າຮ້ານ</Link>
                    </Button>
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
                        <OrderCard
                            key={order.order_id}
                            order={order}
                            onOpenUpload={(id) => { setSelectedOrderId(id); setUploadOpen(true) }}
                        />
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
