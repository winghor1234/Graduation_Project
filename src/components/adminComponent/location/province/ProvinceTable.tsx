import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Province } from "@/modules/location/location.type"
import { Edit, Eye, Trash2 } from "lucide-react"

type Props = {
    data: Province[]
    isLoading: boolean
    onEdit: (p: Province) => void
    onDelete: (id: string) => void
    onView: (p: Province) => void
}

export function ProvinceTable({ data, isLoading, onEdit, onDelete, onView }: Props) {

    if (isLoading) return <Card className="p-6 text-center">Loading...</Card>

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NO:</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((p, index) => (
                        <TableRow key={p.province_id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{p.province_name}</TableCell>
                            <TableCell className="flex justify-end gap-2">
                                <Button size="icon" onClick={() => onView(p)}>
                                    <Eye className="w-4 h-4" />
                                </Button>

                                <Button size="icon" onClick={() => onEdit(p)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" onClick={() => onDelete(p.province_id)}>
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