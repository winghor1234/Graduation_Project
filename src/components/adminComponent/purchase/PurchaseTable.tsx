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

    if (isLoading) return <p>Loading...</p>

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NO: </TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
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
                            </TableCell>
                            <TableCell>
                                {formatDate(item.purchase_date)}
                            </TableCell>
                            <TableCell className="flex justify-center gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onView(purchases[index])}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onEdit(item)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onDelete(item.purchase_id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}