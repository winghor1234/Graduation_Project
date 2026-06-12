"use client"

import { Button } from "@/components/ui/button"
import { PurchaseOrder } from "@/modules/purchase/purchase.type"
import { Card } from "../../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Edit, Eye, Trash2 } from "lucide-react"
import { formatDate } from "@/utils/FormatDate"
import { formatCurrency } from "@/utils/FormatCurrency"
import { getStatusBadge } from "./StatusBadge"

type Props = {
    purchases: PurchaseOrder[]
    isLoading: boolean
    onEdit: (p: PurchaseOrder) => void
    onDelete: (id: string) => void
    onView: (p: PurchaseOrder) => void
}

export function PurchaseOrderTable({ purchases, isLoading, onEdit, onDelete, onView }: Props) {
    // console.log("purchase : ", purchases)

    if (isLoading) return <p className="text-center p-4">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ລຳດັບ</TableHead>
                        <TableHead>ຜູ້ສະໜອງ</TableHead>
                        <TableHead>ຈຳນວນສິນຄ້າ</TableHead>
                        <TableHead>ຍອດລວມທັງໝົດ</TableHead>
                        <TableHead>ສະຖານະ</TableHead>
                        <TableHead>ວັນທີ</TableHead>
                        <TableHead className="text-center">ການຈັດການ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {purchases.map((item, index) => (
                        <TableRow key={item.purchase_id}>
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                {item.supplier?.supplier_name}
                            </TableCell>
                            <TableCell>
                                {item.purchase_details?.map((d) => d.quantity).reduce((a, b) => a + b, 0)}
                            </TableCell>
                            <TableCell>
                                {formatCurrency(item.total_amount as number)}
                            </TableCell>
                            <TableCell>
                                {getStatusBadge(item.status)}
                                {item.payment_status}
                            </TableCell>
                            <TableCell>
                                {formatDate(item.purchase_date)}
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex justify-center gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="hover:bg-blue-50"
                                        onClick={() => onView(purchases[index])}
                                    >
                                        <Eye className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="hover:bg-amber-50"
                                        onClick={() => onEdit(item)}
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
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}