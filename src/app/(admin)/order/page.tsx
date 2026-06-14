

"use client"

import { useState } from "react"
import { useDataTable } from "@/hooks/useDataTable"
import { useGetOrders } from "@/app/features/hooks/Order"
import { AppPagination } from "@/components/AppPagination"
import { Order } from "@/modules/order/order.types"
import { OrderDetailDialog } from "@/components/adminComponent/order/OrderDetail"
import { OrderTable } from "@/components/adminComponent/order/OrderTable"


export default function UnifiedOrderPage() {
    const table = useDataTable()
    const { data, isLoading } = useGetOrders(table.params)
    const [selected, setSelected] = useState<Order | undefined>()
    const [open, setOpen] = useState(false)

    const handleView = (order: Order) => {
        setSelected(order)
        setOpen(true)
    }



    return (
        <div className="space-y-4">

            <OrderTable
                data={data?.data ?? []}
                isLoading={isLoading}
                onView={handleView}

            // onUpdateStatus={(id, status) => {
            //     updateStatus.mutate({ id, data: { status } })
            // }}

            // onVerifyPayment={(id) => {
            //     verifyPayment.mutate({
            //         id,
            //         data: { status: "VERIFIED" }
            //     }, {
            //         onSuccess: () => toast.success("Payment verified")
            //     })
            // }}

            // onUpdateDelivery={(id) => {
            //     updateDelivery.mutate( id )
            // }}
            />

            <AppPagination
                page={table.page}
                totalPages={data?.meta?.totalPages ?? 1}
                onPageChange={table.setPage}
            />
            <OrderDetailDialog data={selected as Order} open={open} onOpenChange={setOpen} />

        </div>
    )
}