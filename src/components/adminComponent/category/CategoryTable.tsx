"use client"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Category } from "@/modules/category/category.type"

type Props = {
    categories: Category[]
    isLoading: boolean
    onEdit: (p: Category) => void
    onDelete: (id: string) => void
}

export function CategoryTable({ categories, isLoading, onEdit, onDelete }: Props) {
    if (isLoading) {
        return <Card className="p-6 text-center">ກຳລັງໂຫຼດຂໍ້ມູນສິນຄ້າ...</Card>
    }
    if (!categories?.length) {
        return <Card className="p-6 text-center">ບໍ່ພົບຂໍ້ມູນສິນຄ້າ</Card>
    }
    return (
        <Card className="rounded-2xl border shadow-sm">
            <div className="w-full overflow-x-auto">

                <Table className="min-w-[750px]">

                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>ລຳດັບ</TableHead>
                            <TableHead className="text-center">ຊື່ປະເພດສິນຄ້າ</TableHead>
                            <TableHead className="text-center">ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {categories.map((category, index) => (
                            <TableRow key={category.category_id}>
                                <TableCell>{index + 1}</TableCell>

                                <TableCell className="text-center">
                                    {category.category_name}
                                </TableCell>

                                <TableCell>
                                    <div className="flex justify-center gap-1">
                                        <Button 
                                            size="icon" 
                                            variant="ghost"
                                            className="hover:bg-blue-50"
                                            onClick={() => onEdit(category)}
                                        >
                                            <Edit className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            variant="ghost"
                                            className="hover:bg-red-50"
                                            onClick={() => onDelete(category.category_id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
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