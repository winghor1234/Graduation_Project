// "use client"

// import { useState } from "react"
// import { toast } from "sonner"
// import { useDataTable } from "@/hooks/useDataTable"
// import {  useGetOrders,  useCreateOrder, useDeleteOrder, useUpdateOrderStatus} from "@/app/features/hooks"
// import { AppPagination } from "@/components/AppPagination"
// import { Order, OrderStatus } from "@/modules/order/order.types"
// import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
// import { OrderToolbar } from "@/components/order/OrderToolbar"
// import { OrderTable } from "@/components/order/OrderTable"
// import { OrderDetail } from "@/components/order/OrderDetail"

// export default function OrderPage() {
//     const table = useDataTable()
//     const { data, isLoading } = useGetOrders(table.params)
//     const deleteOrder = useDeleteOrder()
//     const updateStatus = useUpdateOrderStatus()
//     const [openDetail, setOpenDetail] = useState(false)
//     const [selectedOrder, setSelectedOrder] = useState<Order | undefined>()

//     /* ---------------- handlers ---------------- */

//     const handleView = (order: Order) => {
//         setSelectedOrder(order)
//         setOpenDetail(true)
//     }

//     const handleDelete = (id: string) => {
//         if (!confirm("Delete order?")) return

//         deleteOrder.mutate(id, {
//             onSuccess: () => toast.success("Deleted successfully"),
//             onError: () => toast.error("Delete failed")
//         })
//     }

//     const handleUpdateStatus = (id: string, status: OrderStatus) => {
//     updateStatus.mutate(
//         { id, data: { status } },
//         {
//             onSuccess: () => toast.success("Status updated"),
//             onError: () => toast.error("Update failed")
//         }
//     )
// }

//     /* ---------------- UI ---------------- */

//     return (
//         <div className="space-y-4">

//             <OrderToolbar table={table} />

//             <OrderTable
//                 orders={data?.data ?? []}
//                 isLoading={isLoading}
//                 onView={handleView}
//                 onDelete={handleDelete}
//                 onUpdateStatus={handleUpdateStatus}
//             />

//             <AppPagination
//                 page={table.page}
//                 totalPages={data?.meta?.totalPages ?? 1}
//                 onPageChange={table.setPage}
//             />

//             {/* ✅ DETAIL DIALOG */}
//             <Dialog open={openDetail} onOpenChange={setOpenDetail}>
//                 <DialogContent className="max-w-4xl">
//                     <DialogHeader>
//                         <DialogTitle>Order Detail</DialogTitle>
//                     </DialogHeader>

//                     <OrderDetail order={selectedOrder} />
//                 </DialogContent>
//             </Dialog>

//         </div>
//     )
// }



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

    // const updateStatus = useUpdateOrderStatus()
    // const verifyPayment = useVerifyPayment()
    // const updateDelivery = useUpdateDelivery()

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