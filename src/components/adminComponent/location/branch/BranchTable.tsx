import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Branch } from "@/modules/location/location.type"
import { Edit, Eye, Trash2 } from "lucide-react"

type Props = {
    data: Branch[]
    isLoading: boolean
    onEdit: (b: Branch) => void
    onDelete: (id: string) => void
    onView: (b: Branch) => void
}

export function BranchTable({ data, isLoading, onEdit, onDelete ,onView }: Props) {

    if (isLoading) return <Card className="p-6 text-center">Loading...</Card>

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NO:</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((b, index) => (
                        <TableRow key={b.branch_id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{b.branch_name}</TableCell>
                            <TableCell>{b.district?.district_name}</TableCell>

                            <TableCell className="flex justify-end gap-2">
                                <Button size="icon" onClick={() => onView(b)}>
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="icon" onClick={() => onEdit(b)}>
                                    <Edit className="w-4 h-4" />
                                </Button>

                                <Button size="icon" onClick={() => onDelete(b.branch_id)}>
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