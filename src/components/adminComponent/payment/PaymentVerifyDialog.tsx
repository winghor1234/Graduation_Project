"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Payment } from "@/modules/payment/payment.type"
import { useState } from "react"

type Props = {
    open: boolean
    onOpenChange: (v: boolean) => void
    payment?: Payment
    onConfirm: (status: "VERIFIED" | "REJECTED") => void
}

export function PaymentVerifyDialog({
    open,
    onOpenChange,
    payment,
    onConfirm
}: Props) {

    const [selectedStatus, setSelectedStatus] = useState<"VERIFIED" | "REJECTED" | null>(null)

    const handleOpenChange = (v: boolean) => {
        if (v) {
            setSelectedStatus(null)
        }
        onOpenChange(v)
    }
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>ກວດສອບການຊຳລະເງິນ</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>ລະຫັດອໍເດີ້: {payment?.order.order_code}</div>
                    <div>ຈຳນວນເງິນ: {payment?.amount}</div>

                    {payment?.slip_url && (
                        <Image
                            src={payment.slip_url}
                            className="w-full rounded"
                            width={150}
                            height={150}
                            alt="slip"
                        />
                    )}

                    {/* SELECT BUTTON */}
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            className={`w-1/2 ${selectedStatus === "VERIFIED"
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : ""
                                }`}
                            variant={selectedStatus === "VERIFIED" ? "default" : "outline"}
                            onClick={() => setSelectedStatus("VERIFIED")}
                        >
                            ອະນຸມັດ
                        </Button>

                        <Button
                            type="button"
                            className={`w-1/2 ${selectedStatus === "REJECTED"
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : ""
                                }`}
                            variant={selectedStatus === "REJECTED" ? "destructive" : "outline"}
                            onClick={() => setSelectedStatus("REJECTED")}
                        >
                            ປະຕິເສດ
                        </Button>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <Button
                        className="w-full"
                        disabled={!selectedStatus}
                        onClick={() => selectedStatus && onConfirm(selectedStatus)}
                    >
                        ຢືນຢັນ
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}