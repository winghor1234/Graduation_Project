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
    
    if (isLoading) return <div>ກຳລັງໂຫຼດຂໍ້ມູນ...</div>

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
                    toast.success("ອັບເດດການຊຳລະເງິນສຳເລັດແລ້ວ")
                    setOpenDialog(false)
                },
                onError: () => {
                    toast.error("ການອັບເດດລົ້ມເຫຼວ")
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
                    toast.success("ອັບເດດສະຖານະການຈັດສົ່ງສຳເລັດແລ້ວ")
                    setOpenDeliveryDialog(false)
                },
                onError: () => {
                    toast.error("ການອັບເດດລົ้มເຫຼວ")
                }
            }
        )
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ລຳດັບ:</TableHead>
                        <TableHead>ລະຫັດອໍເດີ້</TableHead>
                        <TableHead>ຊື່ລູກຄ້າ</TableHead>
                        <TableHead>ຍອດລວມ</TableHead>

                        <TableHead>ການຊຳລະເງິນ</TableHead>
                        <TableHead>ບິນໂອນ (Slip)</TableHead>

                        <TableHead>ການຈັດສົ່ງ</TableHead>
                        <TableHead>ເລກຕິດຕາມພັດສະດຸ</TableHead>

                        <TableHead>ການຈັດການ</TableHead>
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
                                    ເບິ່ງ
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
                                        ? "ກວດສອບ"
                                        : o.payment?.status === "REJECTED"
                                            ? "ປະຕິເສດແລ້ວ"
                                            : "ກວດສອບແລ້ວ"}
                                </Button>

                                {/* update delivery */}
                                <Button
                                    size="sm"
                                    onClick={() => o.delivery && handleUpdateDeliveryDialog(o.delivery)}
                                    disabled={!o.delivery}
                                >
                                    {o.delivery?.status || "ບໍ່ມີຂໍ້ມູນ"}
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