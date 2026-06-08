"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Trash2 } from "lucide-react"
import { Import } from "@/modules/import/import.type"
import { formatDate } from "@/utils/FormatDate"

type Props = {
    imports: Import[]
    isLoading: boolean
    onDelete: (id: string) => void
    onView: (i: Import) => void

}

export function ImportTable({ imports, isLoading, onView, onDelete }: Props) {

    if (isLoading) return <Card className="p-6 text-center">Loading...</Card>

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NO:</TableHead>
                        <TableHead>Import code</TableHead>
                        <TableHead>Purchase code</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {imports.map((i,index) => (
                        <TableRow key={i.import_id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{i.import_code}</TableCell>
                            <TableCell>{i.purchase?.purchase_code}</TableCell>
                            <TableCell>
                           {formatDate(i.import_date)}
                            </TableCell>
                            <TableCell>{i.employee?.employee_name}</TableCell>

                            <TableCell className="flex gap-2 justify-end">
                                <Button size="icon" onClick={() => onView(i)}>
                                    <Eye className="w-4 h-4" />
                                </Button>

                                <Button
                                    size="icon"
                                    onClick={() => onDelete(i.import_id)}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}