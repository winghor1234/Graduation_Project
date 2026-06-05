"use client"

import { useState } from "react"
import { toast } from "sonner"

import { useGetPayment, useVerifyPayment } from "@/app/features/hooks/Payment"
import { useDataTable } from "@/hooks/useDataTable"

import { AppPagination } from "@/components/AppPagination"
import { PaymentToolbar } from "@/components/payment/PaymentToolbar"
import { PaymentTable } from "@/components/payment/PaymentTable"
import { PaymentVerifyDialog } from "@/components/payment/PaymentVerifyDialog"
import { Payment } from "@/modules/payment/payment.type"


export default function PaymentPage() {
    const table = useDataTable()

    const { data, isLoading } = useGetPayment(table.params)
    const verifyPayment = useVerifyPayment()

    const [openDialog, setOpenDialog] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>()

    const handleVerify = (payment: Payment) => {
        setSelectedPayment(payment)
        setOpenDialog(true)
    }

    const handleSubmitVerify = (status: "VERIFIED" | "REJECTED") => {
        if (!selectedPayment) return
        verifyPayment.mutate(
            {
                id: selectedPayment.payment_id,
                data: { status }
            },
            {
                onSuccess: () => {
                    toast.success("Payment updated")
                    setOpenDialog(false)
                },
                onError: () => {
                    toast.error("Update failed")
                }
            }
        )
    }


    return (
        <div className="space-y-4">

            <PaymentToolbar
                table={table}
            />

            <PaymentTable
                payments={data?.data ?? []}
                isLoading={isLoading}
                onVerify={handleVerify}
            />

            <AppPagination
                page={table.page}
                totalPages={data?.meta.totalPages ?? 1}
                onPageChange={table.setPage}
            />

            <PaymentVerifyDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                payment={selectedPayment}
                onConfirm={handleSubmitVerify}
            />

        </div>
    )
}