// "use client"

// import { Button } from "@/components/ui/button"
// import { PurchaseOrder } from "@/modules/purchase/purchase.type"
// import { Card } from "../../ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
// import { Edit, Eye, Trash2 } from "lucide-react"
// import { formatDate } from "@/utils/FormatDate"
// import { formatCurrency } from "@/utils/FormatCurrency"
// import { getStatusBadge } from "./StatusBadge"

// type Props = {
//     purchases: PurchaseOrder[]
//     isLoading: boolean
//     onEdit: (p: PurchaseOrder) => void
//     onDelete: (id: string) => void
//     onView: (p: PurchaseOrder) => void
// }

// export function PurchaseOrderTable({ purchases, isLoading, onEdit, onDelete, onView }: Props) {
//     // console.log("purchase : ", purchases)

//     if (isLoading) return <Card className="p-12 text-center text-sm text-admin-muted rounded-2xl border border-admin-border bg-admin-card"><div className="animate-pulse">ກຳລັງໂຫຼດ...</div></Card>

//     return (
//         <Card className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-sm">
//             <Table>
//                 <TableHeader>
//                     <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
//                         <TableHead>ລຳດັບ</TableHead>
//                         <TableHead>ລະຫັດສັ່ງຊື້</TableHead>
//                         <TableHead>ຜູ້ສະໜອງ</TableHead>
//                         <TableHead>ຈຳນວນສິນຄ້າ</TableHead>
//                         <TableHead>ຍອດລວມທັງໝົດ</TableHead>
//                         <TableHead>ສະຖານະ</TableHead>
//                         <TableHead>ວັນທີ</TableHead>
//                         <TableHead className="text-center">ການຈັດການ</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {purchases.map((item, index) => (
//                         <TableRow key={item.purchase_id}>
//                             <TableCell>
//                                 {index + 1}
//                             </TableCell>
//                             <TableCell>
//                                 {item.purchase_code}
//                             </TableCell>
//                             <TableCell>
//                                 {item.supplier?.supplier_name}
//                             </TableCell>
//                             <TableCell>
//                                 {item.purchase_details?.map((d) => d.quantity).reduce((a, b) => a + b, 0)}
//                             </TableCell>
//                             <TableCell>
//                                 {formatCurrency(item.total_amount as number)}
//                             </TableCell>
//                             <TableCell>
//                                 {getStatusBadge(item.status)}
//                                 {item.payment_status}
//                             </TableCell>
//                             <TableCell>
//                                 {formatDate(item.purchase_date)}
//                             </TableCell>
//                             <TableCell className="text-center">
//                                 <div className="flex justify-center gap-1">
//                                     <Button
//                                         size="icon"
//                                         variant="ghost"
//                                         className="hover:bg-brand-blue-soft"
//                                         onClick={() => onView(purchases[index])}
//                                     >
//                                         <Eye className="w-4 h-4 text-admin-text hover:text-brand-blue" />
//                                     </Button>
//                                     <Button
//                                         size="icon"
//                                         variant="ghost"
//                                         className="hover:bg-amber-50"
//                                         onClick={() => onEdit(item)}
//                                     >
//                                         <Edit className="w-4 h-4 text-gray-600 hover:text-amber-600" />
//                                     </Button>
//                                     <Button
//                                         size="icon"
//                                         variant="ghost"
//                                         className="hover:bg-red-50"
//                                         onClick={() => onDelete(item.purchase_id)}
//                                     >
//                                         <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
//                                     </Button>
//                                 </div>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </Card>
//     )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "../../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Banknote, BadgeCheck, Edit, Eye, Trash2 } from "lucide-react"
import { formatDate } from "@/utils/FormatDate"
import { formatCurrency } from "@/utils/FormatCurrency"
import { PurchasePaymentDialog } from "./PurchasePaymentDialog"
import { PurchaseOrder } from "./PurchaseType"
import { BadgeComponent } from "../StatusComponent"

type Props = {
    purchases: PurchaseOrder[]
    isLoading: boolean
    onEdit: (p: PurchaseOrder) => void
    onDelete: (id: string) => void
    onView: (p: PurchaseOrder) => void
}

export function PurchaseOrderTable({ purchases, isLoading, onEdit, onDelete, onView }: Props) {

    // ✅ state สำหรับ dialog payment
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseOrder | null>(null)
    const [paymentOpen, setPaymentOpen] = useState(false)

    const handleOpenPayment = (purchase: PurchaseOrder) => {
        setSelectedPurchase(purchase)
        setPaymentOpen(true)
    }

    if (isLoading) return <Card className="p-12 text-center text-sm text-admin-muted rounded-2xl border border-admin-border bg-admin-card"><div className="animate-pulse">ກຳລັງໂຫຼດ...</div></Card>

    return (
        <>
            <Card className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            <TableHead>ລຳດັບ</TableHead>
                            <TableHead>ລະຫັດສັ່ງຊື້</TableHead>
                            <TableHead>ຜູ້ສະໜອງ</TableHead>
                            <TableHead>ຈຳນວນສິນຄ້າ</TableHead>
                            <TableHead>ຍອດລວມທັງໝົດ</TableHead>
                            <TableHead>ສະຖານະ</TableHead>
                            <TableHead>ການຊຳລະ</TableHead>
                            <TableHead>ວັນທີ</TableHead>
                            <TableHead className="text-center">ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.map((item, index) => {

                            // ✅ canPay condition
                            const canPay = item.status === "COMPLETED" && item.payment_status === "UNPAID"
                            const canEdit = item.status === "PENDING" && item.payment_status === "UNPAID"

                            return (
                                <TableRow key={item.purchase_id}>
                                    <TableCell>{index + 1}</TableCell>

                                    <TableCell>{item.purchase_code}</TableCell>

                                    <TableCell>{item.supplier?.supplier_name}</TableCell>

                                    <TableCell>
                                        {item.purchase_details
                                            ?.map((d) => d.quantity)
                                            .reduce((a, b) => a + b, 0)}
                                    </TableCell>

                                    <TableCell>
                                        {formatCurrency(item.total_amount as number)}
                                    </TableCell>

                                    <TableCell>
                                        {BadgeComponent({ status: item.status })}
                                    </TableCell>

                                    {/* ✅ Payment status column */}
                                    <TableCell>
                                        {item.payment_status === "PAID" ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <BadgeCheck className="w-3 h-3" />
                                                ຊຳລະແລ້ວ
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                                                <Banknote className="w-3 h-3" />
                                                ຍັງບໍ່ຊຳລະ
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell>{formatDate(item.purchase_date)}</TableCell>

                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="hover:bg-brand-blue-soft"
                                                onClick={() => onView(item)}
                                            >
                                                <Eye className="w-4 h-4 text-admin-text hover:text-brand-blue" />
                                            </Button>

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="hover:bg-amber-50"
                                                onClick={() => onEdit(item)}
                                                disabled={!canEdit}
                                            >
                                                <Edit className="w-4 h-4 text-gray-600 hover:text-amber-600" />
                                            </Button>

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="hover:bg-red-50"
                                                onClick={() => onDelete(item.purchase_id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                                            </Button>

                                            {/* ✅ ปุ่ม Payment */}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="hover:bg-green-50"
                                                onClick={() => handleOpenPayment(item)}
                                                disabled={!canPay}
                                                title={
                                                    !canPay
                                                        ? "ຕ້ອງມີໃບນຳເຂົ້າກ່ອນ"
                                                        : item.status !== "COMPLETED"
                                                            ? "ຍັງບໍ່ຮັບສິນຄ້າ"
                                                            : item.payment_status === "PAID"
                                                                ? "ຊຳລະແລ້ວ"
                                                                : "ຊຳລະເງິນ"
                                                }
                                            >
                                                <Banknote className={`w-4 h-4 ${canPay ? "text-green-600" : "text-gray-500 cursor-not-allowed"}`} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* ✅ Dialog — อยู่นอก Card แต่ใน Fragment */}
            <PurchasePaymentDialog
                open={paymentOpen}
                onOpenChange={setPaymentOpen}
                purchase={selectedPurchase ?? undefined}
            />
        </>
    )
}