"use client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { Order } from "@/modules/order/order.type"
import { Payment } from "@/modules/payment/payment.type"
import { Delivery } from "@/modules/delivery/delivery.type"
import { useState } from "react"
import { toast } from "sonner"
import { PaymentVerifyDialog } from "../payment/PaymentVerifyDialog"
import { DeliveryUpdateDialog } from "./DeliveryUpdateDialog"
import { useVerifyPayment } from "@/app/features/hooks/Payment"
import { useUpdateDelivery } from "@/app/features/hooks/Delivery"
import { BadgeComponent } from "../StatusComponent"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"
import { Eye } from "lucide-react"
import { formatCurrency } from "@/utils/FormatCurrency"

type Props = {
    data: Order[]
    isLoading: boolean
    onView: (order: Order) => void
}

export function OrderTable({ data, isLoading, onView }: Props) {
    const verifyPayment = useVerifyPayment()
    const updateDelivery = useUpdateDelivery()

    const [openDialog, setOpenDialog] = useState(false)
    const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>()
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | undefined>()

    // const handleVerify = (payment: Payment) => {
    //     setSelectedPayment(payment)
    //     setOpenDialog(true)
    // }

    // ✅ ARRIVED ເກີນ 1 ມື້ ແຕ່ຍັງບໍ່ COMPLETED — highlight ໃຫ້ admin ເຫັນວ່າຕ້ອງຮີບອັບເດດ
    const getOverdueDays = (order: Order) => {
        if (order.status !== "ARRIVED" || !order.arrived_at) return 0
        const days = Math.floor((Date.now() - new Date(order.arrived_at).getTime()) / (24 * 60 * 60 * 1000))
        return days >= 1 ? days : 0
    }

    const handleSubmitVerify = (status: "VERIFIED" | "REJECTED") => {
        if (!selectedPayment) return
        verifyPayment.mutate(
            { id: selectedPayment.payment_id, data: { status } },
            {
                onSuccess: () => { toast.success("ອັບເດດການຊຳລະເງິນສຳເລັດ"); setOpenDialog(false) },
                onError:   () => toast.error("ການອັບເດດລົ້ມເຫຼວ"),
            }
        )
    }

    // const handleUpdateDeliveryDialog = (delivery: Delivery) => {
    //     setSelectedDelivery(delivery)
    //     setOpenDeliveryDialog(true)
    // }

    const handleUpdateDelivery = (status: "PENDING" | "PROCESSING" | "SHIPPED" | "ARRIVED" | "DELIVERED" | "CANCELLED") => {
        if (!selectedDelivery?.delivery_id) return
        updateDelivery.mutate(
            { id: selectedDelivery.delivery_id, data: { status } },
            {
                onSuccess: () => { toast.success("ອັບເດດສະຖານະການຈັດສົ່ງສຳເລັດ"); setOpenDeliveryDialog(false) },
                onError:   () => toast.error("ການອັບເດດລົ້ມເຫຼວ"),
            }
        )
    }

    if (isLoading) {
        return (
            <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            {["#", "ລະຫັດ", "ລູກຄ້າ", "ຍອດລວມ", "ວິທີຊຳລະ", "ການຊຳລະ", "ສລິບ", "ຈັດສົ່ງ", "ເລກຕິດຕາມ", ""].map((h) => (
                                <TableHead key={h} className={theme.subText}>{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i} className="border-admin-border">
                                {[...Array(10)].map((__, j) => (
                                    <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        )
    }

    return (
        <>
            <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-225">
                        <TableHeader>
                            <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                                <TableHead className={theme.subText}>#</TableHead>
                                <TableHead className={theme.subText}>ລະຫັດອໍເດີ້</TableHead>
                                <TableHead className={theme.subText}>ລູກຄ້າ</TableHead>
                                <TableHead className={theme.subText}>ຍອດລວມ</TableHead>
                                <TableHead className={theme.subText}>ວິທີຊຳລະ</TableHead>
                                <TableHead className={theme.subText}>ການຊຳລະ</TableHead>
                                <TableHead className={theme.subText}>ສລິບ</TableHead>
                                <TableHead className={theme.subText}>ຈັດສົ່ງ</TableHead>
                                {/* <TableHead className={theme.subText}>ເລກຕິດຕາມ</TableHead> */}
                                <TableHead className={theme.subText}>ການຈັດການ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((o, index) => (
                                <TableRow
                                    key={o.order_id}
                                    className="border-admin-border hover:bg-brand-blue-soft/30 transition-colors"
                                >
                                    <TableCell className={cn("font-medium", theme.subText)}>{index + 1}</TableCell>
                                    <TableCell className={cn("font-mono text-xs", theme.text)}>{o.order_code}</TableCell>
                                    <TableCell className={theme.text}>{o.customer?.customer_name}</TableCell>
                                    <TableCell className={cn("font-semibold", theme.primary)}>{formatCurrency(o.total_amount ?? 0)}</TableCell>
                                    <TableCell><BadgeComponent status={o.payment?.method} /></TableCell>
                                    <TableCell><BadgeComponent status={o.payment?.status} /></TableCell>
                                    <TableCell>
                                        {o.payment?.slip_url ? (
                                            <Image
                                                src={o.payment.slip_url}
                                                width={40}
                                                height={40}
                                                alt="slip"
                                                className="rounded-lg object-cover"
                                            />
                                        ) : o.payment?.method === "CASH" ? (
                                            <span className={cn("text-xs", theme.subText)}>ຈ່າຍປາຍທາງ</span>
                                        ) : null}
                                    </TableCell>
                                    <TableCell>
                                        <BadgeComponent status={o.delivery?.status} />
                                        {getOverdueDays(o) > 0 && (
                                            <p className="text-[11px] font-semibold text-red-600 mt-1">
                                                ⚠ ເກີນກຳນົດ {getOverdueDays(o)} ມື້
                                            </p>
                                        )}
                                    </TableCell>
                                    {/* <TableCell className={cn("font-mono text-xs", theme.subText)}>
                                        {o.delivery?.tracking_number || "-"}
                                    </TableCell> */}
                                    <TableCell>
                                        <div className="flex gap-1.5">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 px-2 gap-1 text-xs border-admin-border hover:bg-brand-blue-soft hover:text-brand-blue hover:border-brand-blue"
                                                onClick={() => onView(o)}
                                            >
                                                <Eye className="size-3" />
                                                ເບິ່ງ
                                            </Button>
                                            {/* <Button
                                                size="sm"
                                                className={cn(
                                                    "h-7 px-2 text-xs",
                                                    o.payment?.status === "PENDING"
                                                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                                        : o.payment?.status === "REJECTED"
                                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                                            : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                )}
                                                // onClick={() => o.payment && handleVerify(o.payment)}
                                                disabled={o.payment?.status !== "PENDING" || !o.payment}
                                            >
                                                {o.payment?.status === "PENDING" ? "ກວດສອບ"
                                                    : o.payment?.status === "REJECTED" ? "ປະຕິເສດ"
                                                    : "ຢືນຢັນແລ້ວ"}
                                            </Button> */}
                                            {/* <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 px-2 text-xs border-admin-border"
                                                onClick={() => o.delivery && handleUpdateDeliveryDialog(o.delivery)}
                                                disabled={!o.delivery}
                                            >
                                                <BadgeComponent status={o.delivery?.status} />
                                            </Button> */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

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
        </>
    )
}