"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, Trash2, ToggleLeft, ToggleRight, Tag } from "lucide-react"
import { Promotion } from "@/modules/promotion/promotion.types"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"

type Props = {
    promotions: Promotion[]
    isLoading: boolean
    onEdit: (p: Promotion) => void
    onDelete: (id: string) => void
    onToggle: (id: string) => void
}

export function PromotionTable({ promotions, isLoading, onEdit, onDelete, onToggle }: Props) {

    if (isLoading) return <p className="text-center p-6">ກຳລັງໂຫຼດ...</p>

    if (!promotions?.length) return (
        <Card className="p-6 text-center text-muted-foreground">ບໍ່ມີໂປໂມຊັນ</Card>
    )
    console.log("promotions : ", promotions)

    return (
        <Card className="rounded-2xl border shadow-sm">
            <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>ລະຫັດ</TableHead>
                            <TableHead>ຊື່ໂປໂມຊັນ</TableHead>
                            <TableHead className="text-center">ສ່ວນຫຼຸດ</TableHead>
                            <TableHead className="text-center">ສິນຄ້າ</TableHead>
                            <TableHead className="text-center">ເລີ່ມ</TableHead>
                            <TableHead className="text-center">ສິ້ນສຸດ</TableHead>
                            <TableHead className="text-center">ສະຖານະ</TableHead>
                            <TableHead className="text-center">ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {promotions.map((item, index) => {
                            const isActive = item.status === "ACTIVE"
                            const isExpired = new Date(item.end_date) < new Date()
                            return (
                                <TableRow key={item.promotion_id}>
                                    <TableCell className="text-muted-foreground text-xs">{index + 1}</TableCell>
                                    <TableCell className="font-mono text-sm">{item.promotion_code}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{item.promotion_name}</p>
                                            {item.description && (
                                                <p className="text-xs text-muted-foreground">{item.description}</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-semibold text-green-600">
                                            -{formatCurrency(item.discount_value)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center gap-1 text-xs">
                                            <Tag className="w-3 h-3" />
                                            {item.promotion_products?.length ?? 0} ລາຍການ
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center text-sm">{formatDate(item.start_date)}</TableCell>
                                    <TableCell className="text-center text-sm">
                                        <span className={isExpired ? "text-red-500" : ""}>
                                            {formatDate(item.end_date)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${isActive
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : "bg-gray-100 text-gray-500 border-gray-200"
                                            }`}>
                                            {isActive ? "ໃຊ້ງານ" : "ປິດ"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-1">
                                            <Button size="icon" variant="ghost" className="hover:bg-amber-50"
                                                onClick={() => onEdit(item)} title="ແກ້ໄຂ">
                                                <Edit className="w-4 h-4 text-amber-500" />
                                            </Button>
                                            <Button size="icon" variant="ghost"
                                                onClick={() => onToggle(item.promotion_id)}
                                                title={isActive ? "ປິດໃຊ້ງານ" : "ເປີດໃຊ້ງານ"}
                                                className="hover:bg-blue-50"
                                            >
                                                {isActive
                                                    ? <ToggleRight className="w-4 h-4 text-emerald-600" />
                                                    : <ToggleLeft className="w-4 h-4 text-gray-400" />
                                                }
                                            </Button>
                                            <Button size="icon" variant="ghost" className="hover:bg-red-50"
                                                onClick={() => onDelete(item.promotion_id)} title="ລຶບ">
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}