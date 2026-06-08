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
        return <Card className="p-6 text-center">Loading customers...</Card>
    }
    if (!customers?.length) {
        return <Card className="p-6 text-center">No customers found</Card>
    }
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                                    ? <Badge>Active</Badge>
                                    : <Badge variant="secondary">Disabled</Badge>
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