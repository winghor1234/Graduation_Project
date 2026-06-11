"use client"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Product } from "@/modules/product/product.types"
import { formatCurrency } from "@/utils/FormatCurrency"

type Props = {
    products: Product[]
    isLoading: boolean
    onEdit: (p: Product) => void
    onDelete: (id: string) => void
}

export function ProductTable({ products, isLoading, onEdit, onDelete }: Props) {
    if (isLoading) {
        return <Card className="p-6 text-center">ກຳລັງໂຫຼດຂໍ້ມູນສິນຄ້າ...</Card>
    }
    if (!products?.length) {
        return <Card className="p-6 text-center">ບໍ່ພົບຂໍ້ມູນສິນຄ້າ</Card>
    }
    return (
        <Card className="rounded-2xl border shadow-sm">
            <div className="w-full overflow-x-auto">

                <Table className="min-w-[750px]">

                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>ລຳດັບ</TableHead>
                            <TableHead>ສິນຄ້າ</TableHead>
                            <TableHead className="hidden md:table-cell">ລະຫັດສິນຄ້າ</TableHead>
                            <TableHead className="text-right">ລາຄາຕົ້ນທຶນ</TableHead>
                            <TableHead className="text-right">ລາຄາຂາຍ</TableHead>
                            <TableHead className="text-center">ຈຳນວນໃນສາງ</TableHead>
                            <TableHead className="text-center">ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={product.product_id}>

                                <TableCell>{index + 1}</TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2 min-w-[160px]">
                                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                                            {product.images?.[0]?.image_url ? (
                                                <Image
                                                    src={product.images[0].image_url}
                                                    alt={product.product_name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-[10px] text-gray-400">ບໍ່ມີຮູບ</span>
                                            )}
                                        </div>
                                        <span className="truncate">
                                            {product.product_name}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="hidden md:table-cell">
                                    {product.product_code}
                                </TableCell>

                                <TableCell className="text-right">
                                    {formatCurrency(product.purchase_price)}
                                </TableCell>

                                <TableCell className="text-right">
                                    {formatCurrency(product.sale_price)}
                                </TableCell>

                                <TableCell className="text-center">
                                    <Badge>{product.stock_qty}</Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="flex justify-center gap-1">
                                        <Button 
                                            size="icon" 
                                            variant="ghost"
                                            className="hover:bg-blue-50"
                                            onClick={() => onEdit(product)}
                                        >
                                            <Edit className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            variant="ghost"
                                            className="hover:bg-red-50"
                                            onClick={() => onDelete(product.product_id)}
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