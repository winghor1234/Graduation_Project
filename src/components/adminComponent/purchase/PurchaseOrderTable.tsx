// "use client"

// import { Button } from "@/components/ui/button"
// import { PurchaseOrder } from "@/modules/purchase/purchase.type"

// type Props = {
//     purchases: PurchaseOrder[]
//     isLoading: boolean
//     onEdit: (p: PurchaseOrder) => void
//     onDelete: (id: string) => void
// }

// export function PurchaseOrderTable({ purchases, isLoading, onEdit, onDelete }: Props) {

//     if (isLoading) return <p className="text-center p-4">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>

//     return (
//         <table className="w-full text-sm border">
//             <thead>
//                 <tr className="border-b bg-gray-50">
//                     <th className="p-3 text-left">ຜູ້ສະໜອງ (Supplier)</th>
//                     <th className="p-3 text-left">ຍອດລວມ (Total)</th>
//                     <th className="p-3 text-left">ສະຖານະ (Status)</th>
//                     <th className="p-3 text-left">ການຈັດການ (Actions)</th>
//                 </tr>
//             </thead>

//             <tbody>
//                 {purchases.map((p) => (
//                     <tr key={p.purchase_id} className="border-b hover:bg-gray-50/50">
//                         <td className="p-3">{p.supplier?.supplier_name}</td>
//                         <td className="p-3">{p.total_amount}</td>
//                         <td className="p-3">{p.status}</td>

//                         <td className="p-3 flex gap-2">
//                             <Button size="sm" onClick={() => onEdit(p)}>
//                                 ແກ້ໄຂ
//                             </Button>

//                             <Button
//                                 size="sm"
//                                 variant="destructive"
//                                 onClick={() => onDelete(p.purchase_id)}
//                             >
//                                 ລຶບ
//                             </Button>
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
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

    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseOrder | null>(null)
    const [paymentOpen, setPaymentOpen] = useState(false)

    if (isLoading) return <p className="text-center p-4">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>

    if (!purchases?.length) return (
        <Card className="p-6 text-center text-muted-foreground">
            ບໍ່ພົບຂໍ້ມູນໃບສັ່ງຊື້
        </Card>
    )

    return (
        <>
            <Card className="rounded-2xl border shadow-sm">
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-[860px]">

                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-10">#</TableHead>
                                <TableHead>ລະຫັດສັ່ງຊື້</TableHead>
                                <TableHead>ຜູ້ສະໜອງ</TableHead>
                                <TableHead className="text-center">ລາຍການ</TableHead>
                                <TableHead className="text-center">ຍອດລວມ</TableHead>
                                <TableHead className="text-center">ສະຖານະ</TableHead>
                                <TableHead className="text-center">ການຊຳລະ</TableHead>
                                <TableHead className="text-center">ວັນທີ</TableHead>
                                <TableHead className="text-center">ການຈັດການ</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {purchases.map((item, index) => {

                                const totalItems = item.purchase_details?.reduce((a, b) => a + b.quantity, 0) ?? 0

                                // ✅ Permission conditions
                                const canEdit = item.status === "PENDING" && item.payment_status === "UNPAID"
                                const canDelete = item.status === "PENDING"
                                const canPay = item.status === "COMPLETED" && item.payment_status === "UNPAID"

                                return (
                                    <TableRow key={item.purchase_id}>

                                        <TableCell className="text-muted-foreground text-xs">
                                            {index + 1}
                                        </TableCell>

                                        <TableCell className="font-mono text-sm">
                                            {item.purchase_code}
                                        </TableCell>

                                        <TableCell>
                                            {item.supplier?.supplier_name}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <span className="text-sm">{totalItems} ລາຍການ</span>
                                        </TableCell>

                                        <TableCell className="text-center font-medium">
                                            {formatCurrency(item.total_amount ?? 0)}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            {BadgeComponent({ status: item.status })}
                                        </TableCell>

                                        {/* Payment status */}
                                        <TableCell className="text-center">
                                            {item.payment_status === "PAID" ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <BadgeCheck className="w-3 h-3" />
                                                    ຊຳລະແລ້ວ
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-200">
                                                    <Banknote className="w-3 h-3" />
                                                    ຍັງບໍ່ຊຳລະ
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-center text-sm">
                                            {formatDate(item.purchase_date)}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex justify-center gap-1">

                                                {/* View */}
                                                <Button size="icon" variant="ghost"
                                                    className="hover:bg-blue-50"
                                                    onClick={() => onView(item)}
                                                >
                                                    <Eye className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                                                </Button>

                                                {/* Edit — PENDING only */}
                                                <Button size="icon" variant="ghost"
                                                    className="hover:bg-amber-50"
                                                    onClick={() => onEdit(item)}
                                                    disabled={!canEdit}
                                                    title={!canEdit ? "ແກ້ໄຂໄດ້ສະເພາະ PENDING" : "ແກ້ໄຂ"}
                                                >
                                                    <Edit className={`w-4 h-4 ${canEdit ? "text-amber-600" : "text-gray-300"}`} />
                                                </Button>

                                                {/* Delete — PENDING only */}
                                                <Button size="icon" variant="ghost"
                                                    className="hover:bg-red-50"
                                                    onClick={() => onDelete(item.purchase_id)}
                                                    disabled={!canDelete}
                                                    title={!canDelete ? "ລຶບໄດ້ສະເພາະ PENDING" : "ລຶບ"}
                                                >
                                                    <Trash2 className={`w-4 h-4 ${canDelete ? "text-red-500" : "text-gray-300"}`} />
                                                </Button>

                                                {/* Pay — COMPLETED + UNPAID only */}
                                                <Button size="icon" variant="ghost"
                                                    className="hover:bg-green-50"
                                                    onClick={() => {
                                                        setSelectedPurchase(item)
                                                        setPaymentOpen(true)
                                                    }}
                                                    disabled={!canPay}
                                                    title={
                                                        item.payment_status === "PAID" ? "ຊຳລະແລ້ວ" :
                                                            item.status !== "COMPLETED" ? "ຕ້ອງຮັບສິນຄ້າກ່ອນ" :
                                                                "ຊຳລະເງິນ"
                                                    }
                                                >
                                                    <Banknote className={`w-4 h-4 ${canPay ? "text-green-600" : "text-gray-300"}`} />
                                                </Button>

                                            </div>
                                        </TableCell>

                                    </TableRow>
                                )
                            })}
                        </TableBody>

                    </Table>
                </div>
            </Card>

            <PurchasePaymentDialog
                open={paymentOpen}
                onOpenChange={setPaymentOpen}
                purchase={selectedPurchase ?? undefined}
            />
        </>
    )
}