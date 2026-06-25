"use client"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Category } from "@/modules/category/category.type"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type Props = {
    categories: Category[]
    isLoading: boolean
    onEdit: (p: Category) => void
    onDelete: (id: string) => void
}

export function CategoryTable({ categories, isLoading, onEdit, onDelete }: Props) {
    if (isLoading) {
        return (
            <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            <TableHead className={theme.subText}>ລຳດັບ</TableHead>
                            <TableHead className={cn("text-center", theme.subText)}>ຊື່ປະເພດສິນຄ້າ</TableHead>
                            <TableHead className={cn("text-center", theme.subText)}>ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i} className="border-admin-border">
                                <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                                <TableCell className="flex justify-center"><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-1">
                                        <Skeleton className="size-8 rounded-lg" />
                                        <Skeleton className="size-8 rounded-lg" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        )
    }

    if (!categories?.length) {
        return (
            <Card className={cn("p-12 text-center rounded-2xl", theme.card)}>
                <p className={cn("text-sm", theme.subText)}>ຍັງບໍ່ມີຂໍ້ມູນປະເພດສິນຄ້າ</p>
            </Card>
        )
    }

    return (
        <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
            <div className="w-full overflow-x-auto">
                <Table className="min-w-150">
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            <TableHead className={theme.subText}>ລຳດັບ</TableHead>
                            <TableHead className={cn("text-center", theme.subText)}>ຊື່ປະເພດສິນຄ້າ</TableHead>
                            <TableHead className={cn("text-center", theme.subText)}>ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category, index) => (
                            <TableRow
                                key={category.category_id}
                                className="border-admin-border hover:bg-brand-blue-soft/30 transition-colors"
                            >
                                <TableCell className={cn("w-16", theme.subText)}>{index + 1}</TableCell>
                                <TableCell className={cn("text-center font-medium", theme.text)}>
                                    {category.category_name}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="size-8 hover:bg-brand-blue-soft hover:text-brand-blue"
                                            onClick={() => onEdit(category)}
                                        >
                                            <Edit className="size-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="size-8 hover:bg-red-50 hover:text-red-600"
                                            onClick={() => onDelete(category.category_id)}
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