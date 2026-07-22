

"use client"

import { useMemo, useState } from "react"
import { useDataTable } from "@/hooks/useDataTable"
import { useGetOrders } from "@/app/features/hooks/Order"
import { AppPagination } from "@/components/AppPagination"
import { Order } from "@/modules/order/order.type"
import { OrderDetailDialog } from "@/components/adminComponent/order/OrderDetail"
import { OrderTable } from "@/components/adminComponent/order/OrderTable"
import { OrderToolbar } from "@/components/adminComponent/order/OrderToolbar"


export default function UnifiedOrderPage() {
    const table = useDataTable()
    const { data, isLoading } = useGetOrders(table.params)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    // derive from fresh query data — auto-updates when query refetches
    const selected = useMemo(
        () => data?.data.find(o => o.order_id === selectedId),
        [data, selectedId]
    )

    const handleView = (order: Order) => {
        setSelectedId(order.order_id)
        setOpen(true)
    }



    return (
        <div className="space-y-4">

            <OrderToolbar table={table} onAdd={() => {}} />

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