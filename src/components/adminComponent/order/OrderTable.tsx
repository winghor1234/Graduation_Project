// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Order, OrderStatus } from "@/modules/order/order.types"
// import { Eye, Trash2 } from "lucide-react"
// import { formatDate } from "@/utils/FormatDate"
// import { formatCurrency } from "@/utils/FormatCurrency"

// type Props = {
//     orders: Order[]
//     isLoading: boolean
//     onView: (order: Order) => void
//     onDelete: (id: string) => void
//     onUpdateStatus: (id: string, status: OrderStatus) => void
// }

// const getStatusBadge = (status: OrderStatus) => {
//     switch (status) {
//         case "WAITING_PAYMENT":
//             return <Badge className="bg-yellow-100 text-yellow-700">Waiting</Badge>
//         case "PAID":
//             return <Badge className="bg-blue-100 text-blue-700">Paid</Badge>
//         case "SHIPPED":
//             return <Badge className="bg-purple-100 text-purple-700">Shipped</Badge>
//         case "COMPLETED":
//             return <Badge className="bg-green-100 text-green-700">Completed</Badge>
//         case "CANCELLED":
//             return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>
//         default:
//             // return <Badge>{status}</Badge>
//             return null
//     }
// }

// export function OrderTable({ orders, isLoading, onView, onDelete, onUpdateStatus }: Props) {
//     return (
//         <Table>
//             <TableHeader>
//                 <TableRow>
//                     <TableHead>NO:</TableHead>
//                     <TableHead>Order code</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Total</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Action</TableHead>
//                     <TableHead />
//                 </TableRow>
//             </TableHeader>

//             <TableBody>
//                 {isLoading ? (
//                     <TableRow>
//                         <TableCell colSpan={6}>Loading...</TableCell>
//                     </TableRow>
//                 ) : orders.length === 0 ? (
//                     <TableRow>
//                         <TableCell colSpan={6}>No data</TableCell>
//                     </TableRow>
//                 ) : (
//                     orders.map((o,index) => (
//                         <TableRow key={o.order_id}>
//                             <TableCell>{index + 1}</TableCell>
//                             <TableCell>{o.order_code}</TableCell>
//                             <TableCell>
//                                 {o.customer?.customer_name}
//                             </TableCell>
//                             <TableCell>
//                                 {formatDate(o.order_date)}
//                             </TableCell>
//                             <TableCell>
//                                 {formatCurrency(o.total_amount)}
//                             </TableCell>
//                             <TableCell>
//                                 {getStatusBadge(o.status)}
//                             </TableCell>

//                             <TableCell className="flex gap-2">
//                                 <Button size="sm" variant="ghost" onClick={() => onView(o)}>
//                                     <Eye className="w-4 h-4" />
//                                 </Button>

//                                 <Button
//                                     size="sm"
//                                     variant="ghost"
//                                     onClick={() => onDelete(o.order_id)}
//                                 >
//                                     <Trash2 className="w-4 h-4 text-red-500" />
//                                 </Button>
//                             </TableCell>

//                         </TableRow>
//                     ))
//                 )}
//             </TableBody>
//         </Table>
//     )
// }



import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Order, OrderStatus } from "@/modules/order/order.types"
import { Payment } from "@/modules/payment/payment.type"
import { useState } from "react"
import { toast } from "sonner"
import { PaymentVerifyDialog } from "../payment/PaymentVerifyDialog"
import { DeliveryUpdateDialog } from "./DeliveryUpdateDialog"
import { Delivery } from "@/modules/delivery/delivery.type"
import { useVerifyPayment } from "@/app/features/hooks/Payment"
import { useUpdateDelivery } from "@/app/features/hooks/Delivery"

type Props = {
    data: Order[]
    isLoading: boolean
    onView: (order: Order) => void
    // onUpdateStatus: (id: string, status: OrderStatus) => void
    // onVerifyPayment: (p: Payment) => void
    // onUpdateDelivery: (id: string) => void
    // onDelete: (id: string) => void
}

export function OrderTable({ data, isLoading, onView }: Props) {
    const verifyPayment = useVerifyPayment()
    const updateDelivery = useUpdateDelivery()

    const [openDialog, setOpenDialog] = useState(false)
    const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>()
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | undefined>()
    if (isLoading) return <div>Loading...</div>

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



    const handleUpdateDeliveryDialog = (delivery: Delivery) => {
        setSelectedDelivery(delivery)
        setOpenDeliveryDialog(true)
    }


    const handleUpdateDelivery = (status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED") => {
        if (!selectedDelivery?.delivery_id) return
        updateDelivery.mutate(
            {
                id: selectedDelivery.delivery_id,
                data: { status }
            },
            {
                onSuccess: () => {
                    toast.success("Delivery updated")
                    setOpenDeliveryDialog(false)
                },
                onError: () => {
                    toast.error("Update failed")
                }
            }
        )

    }



    return (

        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NO:</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>

                        <TableHead>Payment</TableHead>
                        <TableHead>Slip</TableHead>

                        <TableHead>Delivery</TableHead>
                        <TableHead>Tracking</TableHead>

                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((o, index) => (
                        <TableRow key={o.order_id}>
                            {/* ORDER */}
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{o.order_code}</TableCell>
                            <TableCell>{o.customer?.customer_name}</TableCell>
                            <TableCell>{o.total_amount}</TableCell>

                            {/* PAYMENT */}
                            <TableCell>{o.payment?.status}</TableCell>

                            <TableCell>
                                {o.payment?.slip_url && (
                                    <Image
                                        src={o.payment.slip_url}
                                        width={40}
                                        height={40}
                                        alt="slip"
                                        className="rounded"
                                    />
                                )}
                            </TableCell>

                            {/* DELIVERY */}
                            <TableCell>{o.delivery?.status}</TableCell>
                            <TableCell>{o.delivery?.tracking_number || "-"}</TableCell>

                            {/* ACTION */}
                            <TableCell className="flex gap-2">

                                <Button size="sm" onClick={() => onView(o)}>
                                    View
                                </Button>

                                {/* verify payment */}
                                <Button
                                    size="sm"
                                    onClick={() => o.payment && handleVerify(o.payment)}
                                    disabled={o.payment?.status !== "PENDING" || !o.payment}
                                    className={
                                        o.payment?.status === "PENDING"
                                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                            : o.payment?.status === "REJECTED"
                                                ? "bg-red-500 hover:bg-red-600 text-white"
                                                : "bg-green-500 hover:bg-green-600 text-white"
                                    }
                                >
                                    {o.payment?.status === "PENDING"
                                        ? "Verify"
                                        : o.payment?.status === "REJECTED"
                                            ? "REJECTED"
                                            : "Verified"}
                                </Button>

                                {/* update delivery */}
                                <Button
                                    size="sm"
                                    onClick={() => o.delivery && handleUpdateDeliveryDialog(o.delivery)}
                                    disabled={!o.delivery}
                                >
                                    {o.delivery?.status}
                                </Button>

                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <PaymentVerifyDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                payment={selectedPayment}
                onConfirm={handleSubmitVerify}
            />
            <DeliveryUpdateDialog
                open={openDeliveryDialog}
                onOpenChange={setOpenDeliveryDialog}
                delivery={selectedDelivery}
                onUpdateStatus={handleUpdateDelivery}
            />
        </div>
    )
}