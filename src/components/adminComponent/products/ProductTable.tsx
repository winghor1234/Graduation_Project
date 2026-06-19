"use client"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Product } from "./ProductType"

type Props = {
    products: Product[]
    isLoading: boolean
    onEdit:   (p: Product) => void
    onDelete: (id: string) => void
}

// ─── Helper: ຄຳນວນຈາກ variants ─────────────────────────────
function getTotalStock(product: Product): number {
    return product.variants?.reduce((sum, v) => sum + v.stock_qty, 0) ?? 0
}

function getPriceRange(product: Product): string {
    if (!product.variants?.length) return "—"
    const prices = product.variants.map(v => v.sale_price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max
        ? formatCurrency(min)
        : `${formatCurrency(min)} – ${formatCurrency(max)}`
}

function getPurchasePriceRange(product: Product): string {
    if (!product.variants?.length) return "—"
    const prices = product.variants.map(v => v.purchase_price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max
        ? formatCurrency(min)
        : `${formatCurrency(min)} – ${formatCurrency(max)}`
}
// ───────────────────────────────────────────────────────────

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
                <Table className="min-w-[900px]">

                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>ສິນຄ້າ</TableHead>
                            <TableHead className="hidden md:table-cell">ລະຫັດ</TableHead>
                            <TableHead className="text-center">ໝວດໝູ່</TableHead>
                            <TableHead className="text-center">ລາຄາຊື້</TableHead>
                            <TableHead className="text-center">ລາຄາຂາຍ</TableHead>
                            <TableHead className="text-center">ສາງທັງໝົດ</TableHead>
                            <TableHead className="text-center">Variants</TableHead>
                            <TableHead className="text-center">ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.map((product, index) => {
                            const totalStock = getTotalStock(product)

                            return (
                                <TableRow key={product.product_id} className="align-top">

                                    <TableCell className="text-muted-foreground text-xs">
                                        {index + 1}
                                    </TableCell>

                                    {/* ຊື່ + ຮູບ */}
                                    <TableCell>
                                        <div className="flex items-start gap-2 min-w-[160px]">
                                            <div className="w-9 h-9 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5">
                                                {product.images?.[0]?.image_url ? (
                                                    <Image
                                                        src={product.images[0].image_url}
                                                        alt={product.product_name}
                                                        width={36}
                                                        height={36}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <span className="text-[10px] text-gray-400">ບໍ່ມີຮູບ</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm truncate max-w-[180px]">
                                                    {product.product_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {product.variants?.length
                                                        ? `${product.variants.length} variants`
                                                        : <span className="text-red-400">ບໍ່ມີ variant</span>
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                        {product.product_code}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge variant="secondary">
                                            {product.category?.category_name}
                                        </Badge>
                                    </TableCell>

                                    {/* ລາຄາຊື້ — ດຶງຈາກ variants */}
                                    <TableCell className="text-center">
                                        <p className="text-sm">{getPurchasePriceRange(product)}</p>
                                        {product.variants?.length > 1 && (
                                            <p className="text-xs text-muted-foreground">ຕ່ຳສຸດ–ສູງສຸດ</p>
                                        )}
                                    </TableCell>

                                    {/* ລາຄາຂາຍ — ດຶງຈາກ variants */}
                                    <TableCell className="text-center">
                                        <p className="text-sm">{getPriceRange(product)}</p>
                                        {product.variants?.length > 1 && (
                                            <p className="text-xs text-muted-foreground">ຕ່ຳສຸດ–ສູງສຸດ</p>
                                        )}
                                    </TableCell>

                                    {/* ສາງທັງໝົດ — ລວມຈາກທຸກ variant */}
                                    <TableCell className="text-center">
                                        <Badge variant={totalStock > 0 ? "default" : "destructive"}>
                                            {totalStock}
                                        </Badge>
                                    </TableCell>

                                    {/* Variant chips */}
                                    <TableCell className="text-center">
                                        <div className="flex flex-wrap justify-center gap-1 max-w-[180px] mx-auto">
                                            {product.variants?.length
                                                ? product.variants.map(v => (
                                                    <span
                                                        key={v.variant_id}
                                                        className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-md border ${
                                                            v.stock_qty === 0
                                                                ? "bg-red-50 border-red-200 text-red-600"
                                                                : "bg-gray-50 border-gray-200 text-gray-600"
                                                        }`}
                                                    >
                                                        {v.color}/{v.size} · {v.stock_qty}
                                                    </span>
                                                ))
                                                : <span className="text-xs text-muted-foreground">—</span>
                                            }
                                        </div>
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
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}