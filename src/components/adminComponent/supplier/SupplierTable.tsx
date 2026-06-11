"use client"

import { Supplier } from "@/modules/supplier/supplier.type"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"

type Props = {
    suppliers: Supplier[]
    isLoading: boolean
    onEdit: (s: Supplier) => void
    onDelete: (id: string) => void
}

export function SupplierTable({ suppliers, isLoading, onEdit, onDelete }: Props) {

    if (isLoading) return <Card className="p-6 text-center">ກຳລັງໂຫຼດຂໍ້ມູນຜູ້ສະໜອງ...</Card>
    if (!suppliers.length) return <Card className="p-6 text-center">ບໍ່ມີຂໍ້ມູນຜູ້ສະໜອງ</Card>

    return (
        <Card className="rounded-2xl border shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead>ຊື່ຜູ້ສະໜອງ</TableHead>
                        <TableHead>ເບີໂທລະສັບ</TableHead>
                        <TableHead>ທີ່ຢູ່</TableHead>
                        <TableHead className="text-right">ການຈັດການ</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {suppliers.map((s) => (
                        <TableRow key={s.supplier_id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">{s.supplier_name}</TableCell>
                            <TableCell>{s.phone}</TableCell>
                            <TableCell>{s.address}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="hover:bg-blue-50"
                                        onClick={() => onEdit(s)}
                                    >
                                        <Edit className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                                    </Button>

                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="hover:bg-red-50"
                                        onClick={() => onDelete(s.supplier_id)}
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