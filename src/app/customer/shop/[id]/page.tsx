"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetProduct, useGetAllProducts } from "@/app/features/hooks/Product"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { useGetAllPromotions } from "@/app/features/hooks/promotion"
import { formatCurrency } from "@/utils/FormatCurrency"
import { ProductCard } from "@/components/customerComponent/shop/ProductCard"
import { ProductListItem } from "@/components/customerComponent/shop/shop.types"
import { VariantPickerDialog } from "@/components/customerComponent/shop/VariantPickerDialog"

// ────────────────────────────────────────────────────────────
// Skeleton
// ────────────────────────────────────────────────────────────
function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-6 max-w-7xl py-10 animate-pulse">
                <div className="h-4 w-40 bg-gray-100 rounded-full mb-10" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                    <div className="space-y-3">
                        <div className="aspect-square bg-gray-100 rounded-2xl" />
                        <div className="grid grid-cols-4 gap-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-xl" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-5 pt-2">
                        <div className="h-5 w-24 bg-gray-100 rounded-full" />
                        <div className="h-10 w-3/4 bg-gray-100 rounded-lg" />
                        <div className="h-8 w-1/3 bg-gray-100 rounded-lg" />
                        <div className="space-y-2 pt-2">
                            <div className="h-4 bg-gray-100 rounded w-full" />
                            <div className="h-4 bg-gray-100 rounded w-5/6" />
                            <div className="h-4 bg-gray-100 rounded w-4/6" />
                        </div>
                        <div className="flex gap-2 pt-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-10 w-20 bg-gray-100 rounded-xl" />)}
                        </div>
                        <div className="h-14 bg-gray-100 rounded-xl w-full mt-4" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { addToCart } = useCustomer()

    const { data: product, isLoading } = useGetProduct(id)
    const { data: relatedData } = useGetAllProducts(
        useMemo(() => ({ sort_by: "featured" as const, page_size: 8 }), [])
    )
    const { data: allPromotions = [] } = useGetAllPromotions()

    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize,  setSelectedSize]  = useState<string | null>(null)
    const [quantity,      setQuantity]      = useState(1)
    const [activeImage,   setActiveImage]   = useState(0)
    const [pickerProduct, setPickerProduct] = useState<ProductListItem | null>(null)

    const variants = product?.variants ?? []
    const images   = product?.images?.length
        ? product.images
        : [{ image_id: "0", image_url: "/placeholder.png" }]

    const colors = useMemo(() => Array.from(new Set(variants.map(v => v.color))), [variants])

    const sizesForColor = useMemo(
        () => variants.filter(v => v.color === selectedColor),
        [variants, selectedColor]
    )

    const selectedVariant = useMemo(
        () => variants.find(v => v.color === selectedColor && v.size === selectedSize),
        [variants, selectedColor, selectedSize]
    )

    const relatedProducts = useMemo(() => {
        if (!product) return []
        return (relatedData?.items ?? [] as ProductListItem[])
            .filter(p => p.category_id === product.category_id && p.product_id !== product.product_id)
            .slice(0, 4) as ProductListItem[]
    }, [relatedData, product])

    // ຕ້ອງ declare ກ່ອນ early return — Rules of Hooks
    const promotion = useMemo(() => {
        if (!product || !allPromotions.length) return null
        const now = new Date()
        return allPromotions.find(p => {
            if (p.status !== "ACTIVE") return false
            if (new Date(p.start_date) > now || new Date(p.end_date) < now) return false
            if (!p.promotion_products?.length) return true
            return p.promotion_products.some(pp => pp.product_id === product.product_id)
        }) ?? null
    }, [allPromotions, product])

    if (isLoading) return <ProductDetailSkeleton />

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-6xl">📦</p>
                    <h1 className="text-2xl font-bold text-gray-900">ບໍ່ພົບສິນຄ້ານີ້</h1>
                    <p className="text-gray-400">ສິນຄ້ານີ້ອາດຖືກລຶບຫຼືບໍ່ມີຢູ່ໃນລະບົບ</p>
                    <Button asChild className="rounded-xl mt-2">
                        <Link href="/customer/shop">ກັບໄປໜ້າຮ້ານ</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Derived values
    const prices = variants.map(v => v.sale_price)
    const minPrice = prices.length ? Math.min(...prices) : 0
    const maxPrice = prices.length ? Math.max(...prices) : 0
    const basePrice = selectedVariant?.sale_price ?? minPrice
    const discountedPrice = promotion ? Math.max(0, basePrice - promotion.discount_value) : null
    const priceLabel = selectedVariant
        ? formatCurrency(selectedVariant.sale_price)
        : minPrice === maxPrice
            ? formatCurrency(minPrice)
            : `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`

    const stockQty   = selectedVariant?.stock_qty ?? 0
    const inStock    = stockQty > 0
    const isLowStock = inStock && stockQty <= 5

    const handleSelectColor = (color: string) => {
        setSelectedColor(color)
        setSelectedSize(null)
        setQuantity(1)
    }

    const handleAddToCart = () => {
        if (!selectedVariant) {
            toast.error("ກະລຸນາເລືອກສີ ແລະ ຂະໜາດ")
            return
        }
        addToCart({
            product_id:   product.product_id,
            variant_id:   selectedVariant.variant_id,
            product_name: product.product_name,
            image_url:    product.images?.[0]?.image_url,
            color:        selectedVariant.color,
            size:         selectedVariant.size,
            sale_price:   selectedVariant.sale_price,
            stock_qty:    selectedVariant.stock_qty,
        }, quantity)
        toast.success(`ເພີ່ມ "${product.product_name}" ລົງກະຕ່າແລ້ວ`)
    }

    const addButtonLabel = !selectedVariant
        ? "ກະລຸນາເລືອກສີ / ຂະໜາດ"
        : !inStock
            ? "ໝົດສາງ"
            : "ເພີ່ມລົງກະຕ່າ"

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-6 max-w-7xl py-10">

                {/* Back + Breadcrumb */}
                <div className="flex items-center gap-2 mb-10 text-sm text-gray-400">
                    <Link href="/customer/shop" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors font-medium">
                        <ArrowLeft className="size-4" />
                        ໜ້າຮ້ານ
                    </Link>
                    {product.category?.category_name && (
                        <>
                            <span>/</span>
                            <Link
                                href={`/shop?category_id=${product.category_id}`}
                                className="hover:text-gray-900 transition-colors"
                            >
                                {product.category.category_name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-gray-900 font-medium line-clamp-1">{product.product_name}</span>
                </div>

                {/* Main layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-24">

                    {/* ── Gallery ── */}
                    <div className="space-y-3">
                        <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                            <Image
                                src={images[activeImage]?.image_url ?? "/placeholder.png"}
                                alt={product.product_name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover transition-opacity duration-300"
                                priority
                            />
                            {!inStock && selectedVariant && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Badge className="bg-white text-gray-900 border-none px-4 py-1.5 text-sm">
                                        ສິນຄ້າໝົດແລ້ວ
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.image_id}
                                        onClick={() => setActiveImage(idx)}
                                        className={`aspect-square relative rounded-xl overflow-hidden border-2 transition-all ${
                                            activeImage === idx
                                                ? "border-gray-900 shadow-sm"
                                                : "border-transparent hover:border-gray-300"
                                        }`}
                                    >
                                        <Image src={img.image_url} alt="" fill sizes="100px" className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Info Panel ── */}
                    <div className="lg:sticky lg:top-8 lg:self-start space-y-6">

                        {/* Category + Name */}
                        <div>
                            {product.category?.category_name && (
                                <Link href={`/shop?category_id=${product.category_id}`}>
                                    <Badge variant="secondary" className="mb-3 hover:bg-gray-200 cursor-pointer">
                                        {product.category.category_name}
                                    </Badge>
                                </Link>
                            )}
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                                {product.product_name}
                            </h1>
                        </div>

                        {/* Promotion banner */}
                        {promotion && (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                                <span className="text-lg">🎁</span>
                                <div>
                                    <p className="text-xs font-bold text-emerald-700">{promotion.promotion_code} · {promotion.promotion_name}</p>
                                    <p className="text-xs text-emerald-600">ສ່ວນຫຼຸດ -{formatCurrency(promotion.discount_value)} ສຳລັບສິນຄ້ານີ້</p>
                                </div>
                            </div>
                        )}

                        {/* Price */}
                        <div className="space-y-1">
                            {promotion && discountedPrice !== null ? (
                                <div className="flex items-baseline gap-3 flex-wrap">
                                    <span className="text-3xl font-extrabold text-emerald-600">
                                        {formatCurrency(discountedPrice)}
                                    </span>
                                    <span className="text-xl text-gray-400 line-through">
                                        {priceLabel}
                                    </span>
                                    <Badge className="bg-emerald-500 text-white border-none text-xs">
                                        -{formatCurrency(promotion.discount_value)} OFF
                                    </Badge>
                                </div>
                            ) : (
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-extrabold text-gray-900">{priceLabel}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                {selectedVariant && isLowStock && (
                                    <Badge className="bg-amber-500 text-white border-none">
                                        ເຫຼືອ {stockQty} ໂຕ
                                    </Badge>
                                )}
                                {selectedVariant && !inStock && (
                                    <Badge variant="destructive">ໝົດສາງ</Badge>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-[15px] text-gray-500 leading-relaxed border-t border-gray-100 pt-5">
                                {product.description}
                            </p>
                        )}

                        {/* Color Selector */}
                        {colors.length > 0 && (
                            <div className="border-t border-gray-100 pt-5 space-y-3">
                                <p className="text-sm font-bold text-gray-900">
                                    ສີ{selectedColor ? (
                                        <span className="font-normal text-gray-400 ml-1.5">— {selectedColor}</span>
                                    ) : null}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map(color => {
                                        const isActive = selectedColor === color
                                        return (
                                            <button
                                                key={color}
                                                onClick={() => handleSelectColor(color)}
                                                className={`h-10 px-5 rounded-xl border text-sm font-semibold flex items-center gap-1.5 transition-all ${
                                                    isActive
                                                        ? "bg-gray-900 border-gray-900 text-white"
                                                        : "border-gray-200 text-gray-700 hover:border-gray-400"
                                                }`}
                                            >
                                                {isActive && <Check className="size-3.5" />}
                                                {color}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        {selectedColor && (
                            <div className="space-y-3">
                                <p className="text-sm font-bold text-gray-900">
                                    ຂະໜາດ{selectedSize ? (
                                        <span className="font-normal text-gray-400 ml-1.5">— {selectedSize}</span>
                                    ) : null}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {sizesForColor.map(v => {
                                        const isActive   = selectedSize === v.size
                                        const outOfStock = v.stock_qty === 0
                                        return (
                                            <button
                                                key={v.variant_id}
                                                disabled={outOfStock}
                                                onClick={() => { setSelectedSize(v.size); setQuantity(1) }}
                                                className={`min-w-[52px] h-10 px-4 rounded-xl border text-sm font-semibold transition-all ${
                                                    isActive
                                                        ? "bg-gray-900 border-gray-900 text-white"
                                                        : outOfStock
                                                            ? "border-dashed border-gray-200 text-gray-300 line-through cursor-not-allowed"
                                                            : "border-gray-200 text-gray-700 hover:border-gray-400"
                                                }`}
                                            >
                                                {v.size}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity Stepper */}
                        <div className="space-y-3 border-t border-gray-100 pt-5">
                            <p className="text-sm font-bold text-gray-900">ຈຳນວນ</p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={!selectedVariant || quantity <= 1}
                                    className="size-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <Minus className="size-4" />
                                </button>
                                <span className="text-xl font-bold w-12 text-center tabular-nums">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(selectedVariant?.stock_qty ?? 1, q + 1))}
                                    disabled={!selectedVariant || quantity >= (selectedVariant?.stock_qty ?? 0)}
                                    className="size-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <Plus className="size-4" />
                                </button>
                                {selectedVariant && inStock && (
                                    <span className="text-xs text-gray-400 font-medium">
                                        ສາງ {selectedVariant.stock_qty} ໂຕ
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <Button
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={!selectedVariant || !inStock}
                            className="w-full h-14 text-base rounded-xl gap-2.5 bg-gray-900 hover:bg-gray-700 text-white font-bold transition-all disabled:opacity-50"
                        >
                            <ShoppingCart className="size-5" />
                            {addButtonLabel}
                        </Button>

                        {!selectedVariant && (
                            <p className="text-xs text-center text-gray-400">
                                ເລືອກສີ ແລະ ຂະໜາດທີ່ຕ້ອງການກ່ອນ
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Related Products ── */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-gray-100 pt-16">
                        <div className="mb-8">
                            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-500 mb-2">ສິນຄ້າ</p>
                            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900">
                                ສິນຄ້າທີ່ທ່ານອາດສົນໃຈ
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
                            {relatedProducts.map(rp => (
                                <ProductCard
                                    key={rp.product_id}
                                    product={rp}
                                    onPickVariant={setPickerProduct}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <VariantPickerDialog
                product={pickerProduct}
                open={!!pickerProduct}
                onOpenChange={v => { if (!v) setPickerProduct(null) }}
            />
        </div>
    )
}
