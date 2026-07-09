"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { ProductListItem } from "./shop.types"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { Promotion } from "@/modules/promotion/promotion.types"
import { toast } from "sonner"
import { useMemo } from "react"

type Props = {
    product: ProductListItem
    onPickVariant: (product: ProductListItem) => void
    promotion?: Promotion | null
    priority?: boolean
}

export function ProductCard({ product, onPickVariant, promotion = null, priority = false }: Props) {
    const { addToCart } = useCustomer()

    const totalStock = useMemo(
        () => product.variants?.reduce((sum, v) => sum + v.stock_qty, 0) ?? 0,
        [product.variants]
    )
    const isOutOfStock = totalStock <= 0
    const hasMultipleVariants = (product.variants?.length ?? 0) > 1
    const isLowStock = !isOutOfStock && totalStock <= 5
    const discountedPrice = promotion
        ? Math.max(0, product.min_price - promotion.discount_value)
        : null

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
        <div className="group flex flex-col bg-brand-card-dark rounded-xl overflow-hidden border border-brand-divider hover:border-brand-orange/50 transition-colors">

            <Link href={`/customer/shop/${product.product_id}`} className="block">
                {/* Image */}
                <div className="aspect-[4/3] relative overflow-hidden bg-brand-black">
                    <Image
                        src={product.images?.[0]?.image_url || "/placeholder.png"}
                        alt={product.product_name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={priority}
                    />

                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-[11px] font-bold text-white bg-black/70 px-3 py-1 rounded-full">
                                ສິນຄ້າໝົດ
                            </span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {isLowStock && (
                            <span className="text-[10px] font-bold text-white bg-brand-orange px-1.5 py-0.5 rounded">
                                ໃກ້ໝົດ
                            </span>
                        )}
                        {promotion && !isOutOfStock && (
                            <span className="text-[10px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded">
                                -{formatCurrency(promotion.discount_value)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="p-3 space-y-1.5">
                    <h3 className="text-sm font-semibold text-brand-white line-clamp-2 leading-snug min-h-[2.5rem]">
                        {product.product_name}
                    </h3>

                    <div className="flex items-center justify-between">
                        <div>
                            {promotion && discountedPrice !== null ? (
                                <>
                                    <span className="text-[11px] text-brand-muted line-through">
                                        {formatCurrency(product.min_price)}
                                    </span>
                                    <p className="text-base font-bold text-emerald-400">
                                        {formatCurrency(discountedPrice)}
                                    </p>
                                </>
                            ) : (
                                <p className="text-base font-bold text-brand-orange">
                                    {formatCurrency(product.min_price)}
                                </p>
                            )}
                        </div>
                        {!isOutOfStock && (
                            <span className="text-[10px] text-brand-muted">{totalStock} ອັນ</span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Add to cart */}
            <div className="px-3 pb-3 mt-auto">
                <button
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className="w-full h-9 flex items-center justify-center gap-1.5 bg-brand-orange hover:bg-brand-orange-hover disabled:bg-brand-divider disabled:text-brand-muted disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors"
                >
                    {isOutOfStock ? "ສິນຄ້າໝົດ" : (
                        <>
                            <ShoppingCart className="size-3.5" />
                            {hasMultipleVariants ? "ເລືອກຕົວເລືອກ" : "ເພີ່ມໃສ່ກະຕ່າ"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
