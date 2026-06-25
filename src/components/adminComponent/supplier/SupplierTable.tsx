"use client"

import { Supplier } from "@/modules/supplier/supplier.type"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Phone, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type Props = {
    suppliers: Supplier[]
    isLoading: boolean
    onEdit: (s: Supplier) => void
    onDelete: (id: string) => void
}

function toWhatsAppNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.startsWith("856")) return cleaned
    if (cleaned.startsWith("0"))   return "856" + cleaned.slice(1)
    return "856" + cleaned
}

export function SupplierTable({ suppliers, isLoading, onEdit, onDelete }: Props) {
    if (isLoading) {
        return (
            <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            <TableHead className={theme.subText}>ຊື່ຜູ້ສະໜອງ</TableHead>
                            <TableHead className={theme.subText}>ເບີໂທລະສັບ</TableHead>
                            <TableHead className={theme.subText}>ທີ່ຢູ່</TableHead>
                            <TableHead className={cn("text-right", theme.subText)}>ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(4)].map((_, i) => (
                            <TableRow key={i} className="border-admin-border">
                                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                <TableCell className="flex justify-end gap-1">
                                    <Skeleton className="size-8 rounded-lg" />
                                    <Skeleton className="size-8 rounded-lg" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        )
    }

    if (!suppliers.length) {
        return (
            <Card className={cn("p-12 text-center rounded-2xl", theme.card)}>
                <p className={cn("text-sm", theme.subText)}>ຍັງບໍ່ມີຂໍ້ມູນຜູ້ສະໜອງ</p>
            </Card>
        )
    }

    return (
        <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
            <div className="w-full overflow-x-auto">
                <Table className="min-w-150">
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            <TableHead className={theme.subText}>ຊື່ຜູ້ສະໜອງ</TableHead>
                            <TableHead className={theme.subText}>ເບີໂທລະສັບ</TableHead>
                            <TableHead className={theme.subText}>ທີ່ຢູ່</TableHead>
                            <TableHead className={cn("text-right", theme.subText)}>ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {suppliers.map((s) => (
                            <TableRow
                                key={s.supplier_id}
                                className="border-admin-border hover:bg-brand-blue-soft/30 transition-colors"
                            >
                                <TableCell className={cn("font-medium", theme.text)}>{s.supplier_name}</TableCell>
                                <TableCell>
                                    {s.phone ? (
                                        <a
                                            href={`https://wa.me/${toWhatsAppNumber(s.phone)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline font-medium text-sm"
                                        >
                                            <Phone className="size-3.5" />
                                            {s.phone}
                                        </a>
                                    ) : (
                                        <span className={cn("text-sm", theme.subText)}>-</span>
                                    )}
                                </TableCell>
                                <TableCell className={theme.subText}>{s.address}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1 justify-end">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="size-8 hover:bg-brand-blue-soft hover:text-brand-blue"
                                            onClick={() => onEdit(s)}
                                        >
                                            <Edit className="size-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="size-8 hover:bg-red-50 hover:text-red-600"
                                            onClick={() => onDelete(s.supplier_id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}