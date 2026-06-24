"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { ProductListItem } from "./shop.types"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { toast } from "sonner"

type Props = {
    product: ProductListItem
    onPickVariant: (product: ProductListItem) => void
}

export function ProductCard({ product, onPickVariant }: Props) {
    const { addToCart } = useCustomer()

    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock_qty, 0) ?? 0
    const isOutOfStock = totalStock <= 0
    const hasMultipleVariants = (product.variants?.length ?? 0) > 1
    const isLowStock = !isOutOfStock && totalStock <= 5

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        const single = product.variants?.length === 1 ? product.variants[0] : null
        if (single) {
            addToCart({
                product_id:   product.product_id,
                variant_id:   single.variant_id,
                product_name: product.product_name,
                image_url:    product.images?.[0]?.image_url,
                color:        single.color,
                size:         single.size,
                sale_price:   single.sale_price,
                stock_qty:    single.stock_qty,
            })
            toast.success(`ເພີ່ມ "${product.product_name}" ລົງກະຕ່າແລ້ວ`)
        } else {
            onPickVariant(product)
        }
    }

    return (
        <div className="flex flex-col group">
            <Link href={`/shop/${product.product_id}`} className="block flex-1">

                {/* Image */}
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-50">
                    <Image
                        src={product.images?.[0]?.image_url || "/placeholder.png"}
                        alt={product.product_name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[1px]">
                            <Badge className="bg-gray-900 text-white border-none text-xs px-3 py-1">
                                ສິນຄ້າໝົດແລ້ວ
                            </Badge>
                        </div>
                    )}
                    {isLowStock && (
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-amber-500 text-white border-none text-[11px] px-2.5 py-0.5">
                                ເຫຼືອໜ້ອຍ
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="pt-3.5 pb-2 space-y-1">
                    <h3 className="font-bold text-[15px] text-gray-900 leading-snug line-clamp-2 min-h-[44px]">
                        {product.product_name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 min-h-[36px] leading-relaxed">
                        {product.description || "ເຄື່ອງກີລາຊັ້ນສູງ ອອກແບບດ້ວຍວັດສະດຸທີ່ທັນສະໄໝ"}
                    </p>

                    <div className="flex items-center justify-between pt-1.5">
                        <span className="text-lg font-extrabold text-gray-900">
                            {product.min_price !== product.max_price && (
                                <span className="text-xs font-normal text-gray-400 mr-1">ເລີ່ມ</span>
                            )}
                            {formatCurrency(product.min_price)}
                        </span>
                        {!isOutOfStock && !isLowStock && (
                            <span className="text-[11px] text-gray-400 font-medium">
                                ເຫຼືອ {totalStock} ອັນ
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Button */}
            <div className="pt-2">
                <Button
                    className="w-full h-10 rounded-xl bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold transition-colors gap-2"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="size-4" />
                    {hasMultipleVariants ? "ເລືອກຕົວເລືອກ" : "ເພີ່ມໃສ່ກະຕ່າ"}
                </Button>
            </div>
        </div>
    )
}
