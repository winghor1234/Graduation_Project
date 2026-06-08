import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { District } from "@/modules/location/location.type"
import { Edit, Eye, Trash2 } from "lucide-react"

type Props = {
    data: District[]
    isLoading: boolean
    onEdit: (p: District) => void
    onDelete: (id: string) => void
    onView: (p: District) => void
}


export function DistrictTable({ data, isLoading, onEdit, onDelete, onView }: Props) {

    if (isLoading) return <Card className="p-6 text-center">Loading...</Card>

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NO:</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Province</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((d, index) => (
                        <TableRow
                            key={d.district_id}
                            className="cursor-pointer hover:bg-muted"
                        >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{d.district_name}</TableCell>
                            <TableCell>{d.province?.province_name}</TableCell>
                            <TableCell className="flex justify-end gap-2">
                                <Button size="icon" onClick={() => onView(d)}>
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="icon" onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(d)
                                }}>
                                    <Edit className="w-4 h-4" />
                                </Button>

                                <Button size="icon" onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(d.district_id)
                                }}>
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