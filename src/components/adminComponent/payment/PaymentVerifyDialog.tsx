// import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import { Payment } from "@/modules/payment/payment.type"

// type Props = {
//     open: boolean
//     onOpenChange: (v: boolean) => void
//     payment?: Payment
//     onConfirm: (status: "VERIFIED" | "REJECTED") => void
// }

// export function PaymentVerifyDialog({ open, onOpenChange, payment, onConfirm}: Props) {
//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
//                 <DialogHeader>
//                     <DialogTitle>Verify Payment</DialogTitle>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                     <div>
//                         Order code: {payment?.order.order_code}
//                     </div>
//                     <div>
//                         Amount: {payment?.amount}
//                     </div>
//                     {payment?.slip_url && (
//                         <Image
//                             src={payment.slip_url}
//                             className="w-full rounded"
//                             width={150}
//                             height={150}
//                             alt="slip"
//                         />
//                     )}
//                     <div className="flex gap-2">
//                         <Button
//                             className="w-1/2"
//                             onClick={() => onConfirm("VERIFIED")}

//                         >
//                             Approve
//                         </Button>

//                         <Button
//                             variant="destructive"
//                             className="w-1/2"
//                             onClick={() => onConfirm("REJECTED")}
//                         >
//                             Reject
//                         </Button>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }


"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Payment } from "@/modules/payment/payment.type"
import { useState, useEffect } from "react"

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
                    <DialogTitle>Verify Payment</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>Order code: {payment?.order.order_code}</div>
                    <div>Amount: {payment?.amount}</div>

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
                                    ? "bg-green-600 text-white"
                                    : ""
                                }`}
                            variant={selectedStatus === "VERIFIED" ? "default" : "outline"}
                            onClick={() => setSelectedStatus("VERIFIED")}
                        >
                            Approve
                        </Button>

                        <Button
                            type="button"
                            className={`w-1/2 ${selectedStatus === "REJECTED"
                                    ? "bg-red-600 text-white"
                                    : ""
                                }`}
                            variant={selectedStatus === "REJECTED" ? "destructive" : "outline"}
                            onClick={() => setSelectedStatus("REJECTED")}
                        >
                            Reject
                        </Button>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <Button
                        className="w-full"
                        disabled={!selectedStatus}
                        onClick={() => selectedStatus && onConfirm(selectedStatus)}
                    >
                        Submit
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}