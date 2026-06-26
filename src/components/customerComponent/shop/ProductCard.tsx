"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Tag } from "lucide-react"
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
}

export function ProductCard({ product, onPickVariant, promotion = null }: Props) {
    const { addToCart } = useCustomer()

    const totalStock = useMemo(
        () => product.variants?.reduce((sum, v) => sum + v.stock_qty, 0) ?? 0,
        [product.variants]
    )
    const isOutOfStock = totalStock <= 0
    const hasMultipleVariants = (product.variants?.length ?? 0) > 1
    const isLowStock = !isOutOfStock && totalStock <= 5
    const isNew = useMemo(() => {
        if (!product.createdAt) return false
        return Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 14
    }, [product.createdAt])

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
        <div className="group relative flex flex-col bg-brand-card-dark rounded-2xl overflow-hidden border border-brand-divider hover:border-brand-orange/50 transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,107,0,0.12)]">

            <Link href={`/shop/${product.product_id}`} className="block">
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-brand-black">
                    <Image
                        src={product.images?.[0]?.image_url || "/placeholder.png"}
                        alt={product.product_name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Out of stock overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-brand-black/70 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-xs font-bold text-brand-muted bg-brand-card-dark border border-brand-divider px-3 py-1.5 rounded-full">
                                ສິນຄ້າໝົດແລ້ວ
                            </span>
                        </div>
                    )}

                    {/* Badges — top-left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {isNew && !isOutOfStock && (
                            <span className="text-[10px] font-extrabold tracking-wider text-brand-black bg-brand-gold px-2 py-0.5 rounded-md">
                                NEW
                            </span>
                        )}
                        {isLowStock && (
                            <span className="text-[10px] font-bold text-white bg-brand-orange px-2 py-0.5 rounded-md">
                                ໃກ້ໝົດ
                            </span>
                        )}
                        {promotion && !isOutOfStock && (
                            <span className="text-[10px] font-extrabold text-white bg-emerald-500 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Tag className="size-2.5" />
                                SALE
                            </span>
                        )}
                    </div>

                    {/* Promotion discount tag — top-right */}
                    {promotion && !isOutOfStock && (
                        <div className="absolute top-3 right-3">
                            <span className="text-[10px] font-extrabold text-white bg-brand-orange/90 backdrop-blur-sm px-2 py-0.5 rounded-md">
                                -{formatCurrency(promotion.discount_value)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-brand-white leading-snug line-clamp-2 min-h-10">
                        {product.product_name}
                    </h3>
                    <p className="text-xs text-brand-muted line-clamp-2 min-h-8 leading-relaxed">
                        {product.description || "ເຄື່ອງກີລາຊັ້ນສູງ ອອກແບບດ້ວຍວັດສະດຸທີ່ທັນສະໄໝ"}
                    </p>

                    {/* Promotion name banner */}
                    {promotion && !isOutOfStock && (
                        <div className="flex items-center gap-1.5 bg-emerald-900/30 border border-emerald-700/40 rounded-lg px-2 py-1">
                            <Tag className="size-3 text-emerald-400 shrink-0" />
                            <span className="text-[10px] text-emerald-300 font-semibold truncate">
                                {promotion.promotion_name}
                            </span>
                        </div>
                    )}

                    <div className="flex items-end justify-between pt-1">
                        <div>
                            {promotion && discountedPrice !== null ? (
                                <>
                                    <span className="text-xs text-brand-muted line-through">
                                        {formatCurrency(product.min_price)}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-lg font-extrabold text-emerald-400">
                                            {formatCurrency(discountedPrice)}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {product.min_price !== product.max_price && (
                                        <p className="text-[10px] text-brand-muted mb-0.5">ເລີ່ມຕົ້ນ</p>
                                    )}
                                    <span className="text-lg font-extrabold text-brand-orange">
                                        {formatCurrency(product.min_price)}
                                    </span>
                                </>
                            )}
                        </div>
                        {!isOutOfStock && (
                            <span className="text-[10px] text-brand-muted font-medium">
                                {totalStock} ອັນ
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Add to cart button */}
            <div className="px-4 pb-4">
                <button
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className="w-full h-10 flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover disabled:bg-brand-divider disabled:text-brand-muted disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98]"
                >
                    {isOutOfStock ? (
                        "ສິນຄ້າໝົດ"
                    ) : (
                        <>
                            <ShoppingCart className="size-4" />
                            {hasMultipleVariants ? "ເລືອກຕົວເລືອກ" : "ເພີ່ມໃສ່ກະຕ່າ"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}