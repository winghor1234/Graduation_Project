"use client"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Product } from "./ProductType"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type Props = {
    products: Product[]
    isLoading: boolean
    onEdit:   (p: Product) => void
    onDelete: (id: string) => void
}

function getTotalStock(product: Product): number {
    return product.variants?.reduce((sum, v) => sum + v.stock_qty, 0) ?? 0
}

function getPriceRange(product: Product): string {
    if (!product.variants?.length) return "—"
    const prices = product.variants.map(v => v.sale_price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? formatCurrency(min) : `${formatCurrency(min)} – ${formatCurrency(max)}`
}

function getPurchasePriceRange(product: Product): string {
    if (!product.variants?.length) return "—"
    const prices = product.variants.map(v => v.purchase_price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? formatCurrency(min) : `${formatCurrency(min)} – ${formatCurrency(max)}`
}

export function ProductTable({ products, isLoading, onEdit, onDelete }: Props) {
    if (isLoading) {
        return (
            <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            {["#", "ສິນຄ້າ", "ລະຫັດ", "ໝວດໝູ່", "ລາຄາຊື້", "ລາຄາຂາຍ", "ສາງ", "Variants", ""].map((h) => (
                                <TableHead key={h} className={theme.subText}>{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i} className="border-admin-border">
                                <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="size-9 rounded-lg shrink-0" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-10 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
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

    if (!products?.length) {
        return (
            <Card className={cn("p-12 text-center rounded-2xl", theme.card)}>
                <p className={cn("text-sm", theme.subText)}>ຍັງບໍ່ມີຂໍ້ມູນສິນຄ້າ</p>
            </Card>
        )
    }

    return (
        <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
            <div className="w-full overflow-x-auto">
                <Table className="min-w-225">
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            <TableHead className={cn("w-10", theme.subText)}>#</TableHead>
                            <TableHead className={theme.subText}>ສິນຄ້າ</TableHead>
                            <TableHead className={cn("hidden md:table-cell", theme.subText)}>ລະຫັດ</TableHead>
                            <TableHead className={cn("text-center", theme.subText)}>ໝວດໝູ່</TableHead>
                            <TableHead className={cn("text-center", theme.subText)}>ລາຄາຊື້</TableHead>
                            <TableHead className={cn("text-center", theme.subText)}>ລາຄາຂາຍ</TableHead>
                            <TableHead className={cn("text-center", theme.subText)}>ສາງ</TableHead>
                            <TableHead className={cn("text-center", theme.subText)}>Variants</TableHead>
                            <TableHead className={cn("text-center", theme.subText)}>ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.map((product, index) => {
                            const totalStock = getTotalStock(product)
                            return (
                                <TableRow
                                    key={product.product_id}
                                    className="border-admin-border hover:bg-brand-blue-soft/30 transition-colors align-top"
                                >
                                    <TableCell className={cn("text-xs", theme.subText)}>{index + 1}</TableCell>

                                    <TableCell>
                                        <div className="flex items-start gap-2 min-w-40">
                                            <div className="size-9 bg-admin-bg rounded-lg overflow-hidden flex items-center justify-center shrink-0 mt-0.5 border border-admin-border">
                                                {product.images?.[0]?.image_url ? (
                                                    <Image
                                                        src={product.images[0].image_url}
                                                        alt={product.product_name}
                                                        width={36}
                                                        height={36}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <span className={cn("text-[10px]", theme.subText)}>ບໍ່ມີຮູບ</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className={cn("font-medium text-sm truncate max-w-44", theme.text)}>
                                                    {product.product_name}
                                                </p>
                                                <p className={cn("text-xs mt-0.5", theme.subText)}>
                                                    {product.variants?.length
                                                        ? `${product.variants.length} variants`
                                                        : <span className="text-red-400">ບໍ່ມີ variant</span>
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className={cn("hidden md:table-cell text-xs font-mono", theme.subText)}>
                                        {product.product_code}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="bg-brand-blue-soft text-brand-blue border-0">
                                            {product.category?.category_name}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <p className={cn("text-sm", theme.text)}>{getPurchasePriceRange(product)}</p>
                                        {product.variants?.length > 1 && (
                                            <p className={cn("text-xs", theme.subText)}>ຕ່ຳ–ສູງ</p>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <p className={cn("text-sm font-semibold", theme.primary)}>{getPriceRange(product)}</p>
                                        {product.variants?.length > 1 && (
                                            <p className={cn("text-xs", theme.subText)}>ຕ່ຳ–ສູງ</p>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge
                                            className={totalStock > 0
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                                : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-50"
                                            }
                                        >
                                            {totalStock}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <div className="flex flex-wrap justify-center gap-1 max-w-44 mx-auto">
                                            {product.variants?.length
                                                ? product.variants.map(v => (
                                                    <span
                                                        key={v.variant_id}
                                                        className={cn(
                                                            "inline-flex items-center text-[11px] px-2 py-0.5 rounded-md border",
                                                            v.stock_qty === 0
                                                                ? "bg-red-50 border-red-200 text-red-600"
                                                                : "bg-admin-bg border-admin-border text-admin-muted"
                                                        )}
                                                    >
                                                        {v.color}/{v.size} · {v.stock_qty}
                                                    </span>
                                                ))
                                                : <span className={cn("text-xs", theme.subText)}>—</span>
                                            }
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex justify-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-8 hover:bg-brand-blue-soft hover:text-brand-blue"
                                                onClick={() => onEdit(product)}
                                            >
                                                <Edit className="size-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-8 hover:bg-red-50 hover:text-red-600"
                                                onClick={() => onDelete(product.product_id)}
                                            >
                                                <Trash2 className="size-4" />
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