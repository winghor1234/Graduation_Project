"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Pencil } from "lucide-react"
import { Delivery } from "@/modules/delivery/delivery.type"
import { Badge } from "@/components/ui/badge"

type Props = {
    data: Delivery[]
    isLoading: boolean
    onView: (d: Delivery) => void
    onEdit: (d: Delivery) => void
}

export function DeliveryTable({ data, isLoading, onView, onEdit }: Props) {

    if (isLoading) return <Card className="p-12 text-center text-sm text-admin-muted rounded-2xl border border-admin-border bg-admin-card"><div className="animate-pulse">ກຳລັງໂຫຼດ...</div></Card>

    return (
        <Card className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-sm">

            <Table>

                <TableHeader>
                    <TableRow>
                        <TableHead>ອໍເດີ້</TableHead>
                        <TableHead>ສະຖານະ</TableHead>
                        <TableHead>ຜູ້ຂົນສົ່ງ</TableHead>
                        <TableHead>ເລກຕິດຕາມພັດສະດຸ</TableHead>
                        <TableHead className="text-right">ການຈັດການ</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map(d => (
                        <TableRow key={d.delivery_id}>

                            <TableCell>{d.order_id}</TableCell>

                            <TableCell>
                                <Badge>{d.status}</Badge>
                            </TableCell>

                            <TableCell>{d.provider}</TableCell>

                            <TableCell>
                                {d.tracking_number || "-"}
                            </TableCell>

                            <TableCell className="text-right flex justify-end gap-2">

                                <Button size="icon" onClick={() => onView(d)}>
                                    <Eye className="w-4 h-4" />
                                </Button>

                                <Button size="icon" onClick={() => onEdit(d)}>
                                    <Pencil className="w-4 h-4" />
                                </Button>

                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>

            </Table>

        </Card>
    )
}