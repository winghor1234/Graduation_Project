"use client"

import { Supplier } from "@/modules/supplier/supplier.type"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Props = {
    suppliers: Supplier[]
    isLoading: boolean
    onEdit: (s: Supplier) => void
    onDelete: (id: string) => void
}

export function SupplierTable({ suppliers, isLoading, onEdit, onDelete }: Props) {

    if (isLoading) return <Card className="p-6">Loading...</Card>
    if (!suppliers.length) return <Card className="p-6">No suppliers</Card>

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {suppliers.map((s) => (
                        <TableRow key={s.supplier_id}>
                            <TableCell>{s.supplier_name}</TableCell>
                            <TableCell>{s.phone}</TableCell>
                            <TableCell>{s.address}</TableCell>
                            <TableCell className="text-right flex gap-2 justify-end">
                                <Button size="icon" variant="ghost" onClick={() => onEdit(s)}>
                                    <Edit className="w-4 h-4" />
                                </Button>

                                <Button size="icon" variant="ghost" onClick={() => onDelete(s.supplier_id)}>
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