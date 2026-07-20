"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { useState, useMemo } from "react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { ProductListItem } from "./shop.types"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { Promotion } from "@/modules/promotion/promotion.types"
import { toast } from "sonner"

const COLOR_HEX: Record<string, string> = {
    red: "#EF4444", ແດງ: "#EF4444",
    blue: "#3B82F6", ຟ້າ: "#3B82F6",
    green: "#22C55E", ຂຽວ: "#22C55E",
    black: "#111111", ດຳ: "#111111",
    white: "#E5E7EB", ຂາວ: "#E5E7EB",
    yellow: "#EAB308", ເຫຼືອງ: "#EAB308",
    orange: "#FF6B00", ສົ້ມ: "#FF6B00",
    purple: "#A855F7", ມ່ວງ: "#A855F7",
    pink: "#EC4899", ບົວ: "#EC4899",
    gray: "#6B7280", ເທົາ: "#6B7280",
    brown: "#92400E", ນ້ຳຕານ: "#92400E",
    navy: "#1E3A5F", ກ່ຳ: "#1E3A5F",
    beige: "#D4B896", ຄີມ: "#D4B896",
}

function getColorHex(name: string) {
    return COLOR_HEX[name.toLowerCase()] ?? COLOR_HEX[name] ?? "#6B7280"
}

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

type Props = {
    product: ProductListItem
    onPickVariant: (product: ProductListItem) => void
    promotion?: Promotion | null
    priority?: boolean
}

export function ProductCard({ product, onPickVariant, promotion = null, priority = false }: Props) {
    const { addToCart } = useCustomer()
    const [wished, setWished] = useState(false)

    const totalStock = useMemo(
        () => product.variants?.reduce((sum, v) => sum + v.stock_qty, 0) ?? 0,
        [product.variants]
    )
    const isOutOfStock = totalStock <= 0
    const hasMultipleVariants = (product.variants?.length ?? 0) > 1
    const isNew = product.createdAt
        ? Date.now() - new Date(product.createdAt).getTime() < THIRTY_DAYS
        : false

    const discountedPrice = promotion
        ? Math.max(0, product.min_price - promotion.discount_value)
        : null
    const discountPct = promotion && product.min_price > 0
        ? Math.round((promotion.discount_value / product.min_price) * 100)
        : null

    const colors = useMemo(() => {
        const seen = new Set<string>()
        return (product.variants ?? [])
            .map(v => v.color)
            .filter((c): c is string => !!c && !seen.has(c) && seen.add(c) !== undefined)
            .slice(0, 4)
    }, [product.variants])

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
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
        <div className="group relative flex flex-col">

            {/* Image container */}
            <Link href={`/customer/shop/${product.product_id}`} className="block relative overflow-hidden rounded-xl bg-[#111]">
                <div className="aspect-3/4 relative w-full">
                    <Image
                        src={product.images?.[0]?.image_url || "/placeholder.png"}
                        alt={product.product_name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={priority}
                    />

                    {/* Dark gradient overlay on hover for button reveal */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-xs font-bold text-white tracking-widest uppercase px-3 py-1.5 border border-white/30 rounded-full backdrop-blur-sm">
                                ໝົດສະຕ໋ອກ
                            </span>
                        </div>
                    )}
                </div>

                {/* Badges — top left */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {discountPct !== null && discountPct > 0 && !isOutOfStock && (
                        <span className="text-[11px] font-bold text-white bg-brand-orange px-2.5 py-0.5 rounded-full">
                            -{discountPct}%
                        </span>
                    )}
                    {isNew && !isOutOfStock && (
                        <span className="text-[11px] font-bold text-white bg-emerald-500 px-2.5 py-0.5 rounded-full">
                            ໃໝ່
                        </span>
                    )}
                </div>

                {/* Wishlist — top right */}
                <button
                    type="button"
                    onClick={e => { e.preventDefault(); e.stopPropagation(); setWished(w => !w) }}
                    className="absolute top-3 right-3 size-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/70 z-10"
                    aria-label="wishlist"
                >
                    <Heart className={`size-4 transition-colors ${wished ? "fill-rose-500 text-rose-500" : "text-white/80"}`} />
                </button>

                {/* Quick-add button — slides up from bottom on hover */}
                {!isOutOfStock && (
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
                        <button
                            onClick={handleAddToCart}
                            className="w-full h-10 bg-white hover:bg-brand-orange text-black hover:text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <ShoppingCart className="size-3.5" />
                            {hasMultipleVariants ? "ເລືອກຕົວເລືອກ" : "ເພີ່ມໃສ່ກະຕ່າ"}
                        </button>
                    </div>
                )}
            </Link>

            {/* Info below image */}
            <div className="mt-3 space-y-1.5 px-0.5">
                {/* Color swatches */}
                {colors.length > 0 && (
                    <div className="flex gap-1.5">
                        {colors.map(c => (
                            <span
                                key={c}
                                title={c}
                                style={{ backgroundColor: getColorHex(c) }}
                                className="size-3 rounded-full border border-brand-divider shrink-0"
                            />
                        ))}
                    </div>
                )}

                <Link href={`/customer/shop/${product.product_id}`}>
                    <h3 className="text-sm font-medium text-brand-white line-clamp-2 leading-snug hover:text-brand-orange transition-colors">
                        {product.product_name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    {promotion && discountedPrice !== null ? (
                        <>
                            <span className="text-sm font-bold text-brand-white">
                                {formatCurrency(discountedPrice)}
                            </span>
                            <span className="text-xs text-brand-muted line-through">
                                {formatCurrency(product.min_price)}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm font-bold text-brand-white">
                            {formatCurrency(product.min_price)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
