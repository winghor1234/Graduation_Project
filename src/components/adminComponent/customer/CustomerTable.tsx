"use client"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Customer } from "@/modules/customer/customer.type"

type Props = {
    customers: Customer[]
    isLoading: boolean
    onEdit: (p: Customer) => void
    onDelete: (id: string) => void
}

export function CustomerTable({ customers, isLoading, onEdit, onDelete }: Props) {
    if (isLoading) {
        return <Card className="p-6 text-center">ກຳລັງໂຫຼດຂໍ້ມູນລູກຄ້າ...</Card>
    }
    if (!customers?.length) {
        return <Card className="p-6 text-center">ບໍ່ພົບຂໍ້ມູນລູກຄ້າ</Card>
    }
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ຊື່</TableHead>
                        <TableHead>ອີເມວ</TableHead>
                        <TableHead>ເບີໂທ</TableHead>
                        <TableHead>ຄະແນນ</TableHead>
                        <TableHead>ສະຖານະ</TableHead>
                        <TableHead className="text-right">ການຈັດການ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.customer_id}>
                            <TableCell>
                                {customer.customer_name}
                            </TableCell>
                            <TableCell>
                                {customer.email}
                            </TableCell>
                            <TableCell>
                                {/* <Badge>{customer.stock_qty}</Badge> */}
                                {customer.phone}
                            </TableCell>
                            <TableCell>
                                {customer.points?.map((p) => p.point_amount).reduce((a, b) => a + b, 0) || 0}
                            </TableCell>
                            <TableCell>
                                {customer.isActive
                                    ? <Badge>ໃຊ້ງານຢູ່</Badge>
                                    : <Badge variant="secondary">ປິດໃຊ້ງານ</Badge>
                                }
                            </TableCell>
                            <TableCell className="flex justify-end gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onEdit(customer)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onDelete(customer.customer_id)}
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