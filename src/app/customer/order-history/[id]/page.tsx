"use client"

import { use } from "react"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useGetOrder, useUploadPaymentSlip } from "@/app/features/hooks/Order"
import { OrderDetailCard } from "@/components/customerComponent/order-history/OrderDetailCard"
import { SlipUploadDialog } from "@/components/customerComponent/order-history/SlipUploadDialog"

function Skeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="h-8 w-44 bg-gray-200 rounded-lg mb-6" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 h-32" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data: order, isLoading, isError } = useGetOrder(id)
    const { mutate: uploadSlip, isPending: isUploading } = useUploadPaymentSlip()

    const [uploadOpen, setUploadOpen] = useState(false)

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

    if (isError || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-gray-500">ບໍ່ພົບຂໍ້ມູນອໍເດີ້</p>
                    <Button variant="outline" asChild>
                        <Link href="/customer/order-history">
                            <ArrowLeft className="size-4 mr-2" />
                            ກັບໄປປະຫວັດການສັ່ງຊື້
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <OrderDetailCard
                order={order}
                onOpenUpload={() => setUploadOpen(true)}
            />
            <SlipUploadDialog
                open={uploadOpen}
                onOpenChange={setUploadOpen}
                orderId={order.order_id}
                onUpload={handleUpload}
                isPending={isUploading}
            />
        </>
    )
}
