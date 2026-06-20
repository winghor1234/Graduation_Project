"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, ArrowLeft, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useGetProduct, useGetAllProducts } from "@/app/features/hooks/Product"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { formatCurrency } from "@/utils/FormatCurrency"

export default function ProductDetailPage() {

    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { addToCart } = useCustomer()

    const { data: product, isLoading } = useGetProduct(id)
    const { data: allProducts = [] } = useGetAllProducts()

    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)

    // ✅ ทุก hook ต้องอยู่ก่อน early return ทั้งหมด — ไม่มี if คั่นกลาง

    const variants = product?.variants ?? []
    const images = product?.images?.length
        ? product.images
        : [{ image_id: "0", image_url: "/placeholder.png" }]

    const colors = useMemo(
        () => Array.from(new Set(variants.map(v => v.color))),
        [variants]
    )

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
        return allProducts
            .filter(p => p.category_id === product.category_id && p.product_id !== product.product_id)
            .slice(0, 4)
    }, [allProducts, product])

    // ✅ Early returns ມາຫຼັງ hooks ທັງໝົດ
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center text-muted-foreground animate-pulse">
                ກຳລັງໂຫຼດ...
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">ບໍ່ພົບສິນຄ້ານີ້</h1>
                <Link href="/shop">
                    <Button>ກັບໄປໜ້າຮ້ານ</Button>
                </Link>
            </div>
        )
    }

    // ─── ສ່ວນທີ່ເຫຼືອ — ບໍ່ໃຊ່ hooks, ໃຊ້ໄດ້ປົກກະຕິ ───────────

    const prices = variants.map(v => v.sale_price)
    const minPrice = prices.length ? Math.min(...prices) : 0
    const maxPrice = prices.length ? Math.max(...prices) : 0
    const priceLabel = selectedVariant
        ? formatCurrency(selectedVariant.sale_price)
        : minPrice === maxPrice
            ? formatCurrency(minPrice)
            : `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`

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
            product_id: product.product_id,
            variant_id: selectedVariant.variant_id,
            product_name: product.product_name,
            image_url: product.images?.[0]?.image_url,
            color: selectedVariant.color,
            size: selectedVariant.size,
            sale_price: selectedVariant.sale_price,
            stock_qty: selectedVariant.stock_qty,
        }, quantity)

        toast.success(`ເພີ່ມ ${product.product_name} ລົງກະຕ່າແລ້ວ`)
        router.push("/cart")
    }

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto px-4">

                <Link href="/shop">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="size-4 mr-2" />
                        ກັບໄປໜ້າຮ້ານ
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

                    {/* Image gallery */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                            <Image
                                src={images[selectedImage]?.image_url ?? "/placeholder.png"}
                                alt={product.product_name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.image_id}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 relative transition-colors ${selectedImage === idx ? "border-black" : "border-transparent"
                                            }`}
                                    >
                                        <Image
                                            src={img.image_url}
                                            alt={`${product.product_name} ${idx + 1}`}
                                            fill
                                            sizes="100px"
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div>
                        <Badge className="mb-4">{product.category?.category_name}</Badge>
                        <h1 className="text-4xl font-bold mb-4">{product.product_name}</h1>
                        <p className="text-3xl font-bold mb-6">{priceLabel}</p>

                        <div className="mb-6">
                            {selectedVariant ? (
                                <Badge variant={selectedVariant.stock_qty > 0 ? "secondary" : "destructive"}>
                                    {selectedVariant.stock_qty > 0
                                        ? `ເຫຼືອ ${selectedVariant.stock_qty} ໂຕ`
                                        : "ໝົດສາງ"}
                                </Badge>
                            ) : (
                                <Badge variant="outline">ກະລຸນາເລືອກສີ ແລະ ຂະໜາດ</Badge>
                            )}
                        </div>

                        {product.description && (
                            <div className="prose mb-8">
                                <h3 className="text-lg font-semibold mb-2">ລາຍລະອຽດ</h3>
                                <p className="text-gray-600">{product.description}</p>
                            </div>
                        )}

                        {colors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold mb-3">
                                    ສີ {selectedColor && <span className="text-muted-foreground font-normal">— {selectedColor}</span>}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map(color => {
                                        const isSelected = selectedColor === color
                                        return (
                                            <button
                                                key={color}
                                                onClick={() => handleSelectColor(color)}
                                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1.5
                                                    ${isSelected
                                                        ? "border-black bg-black text-white"
                                                        : "border-gray-300 hover:border-gray-500"
                                                    }`}
                                            >
                                                {isSelected && <Check className="w-3.5 h-3.5" />}
                                                {color}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {selectedColor && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold mb-3">
                                    ຂະໜາດ {selectedSize && <span className="text-muted-foreground font-normal">— {selectedSize}</span>}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {sizesForColor.map(v => {
                                        const isSelected = selectedSize === v.size
                                        const outOfStock = v.stock_qty === 0
                                        return (
                                            <button
                                                key={v.variant_id}
                                                disabled={outOfStock}
                                                onClick={() => { setSelectedSize(v.size); setQuantity(1) }}
                                                className={`min-w-[52px] px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                                                    ${isSelected
                                                        ? "border-black bg-black text-white"
                                                        : outOfStock
                                                            ? "border-dashed text-gray-300 cursor-not-allowed line-through"
                                                            : "border-gray-300 hover:border-gray-500"
                                                    }`}
                                            >
                                                {v.size}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-sm font-semibold mb-3">ຈຳນວນ</h3>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline" size="icon"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={!selectedVariant || quantity <= 1}
                                >
                                    <Minus className="size-4" />
                                </Button>
                                <span className="text-xl font-semibold w-12 text-center">
                                    {quantity}
                                </span>
                                <Button
                                    variant="outline" size="icon"
                                    onClick={() => setQuantity(q => Math.min(selectedVariant?.stock_qty ?? 1, q + 1))}
                                    disabled={!selectedVariant || quantity >= (selectedVariant?.stock_qty ?? 0)}
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full text-lg py-6 gap-2"
                            onClick={handleAddToCart}
                            disabled={!selectedVariant || selectedVariant.stock_qty === 0}
                        >
                            <ShoppingCart className="size-5" />
                            {!selectedVariant
                                ? "ກະລຸນາເລືອກສີ/ຂະໜາດ"
                                : selectedVariant.stock_qty === 0
                                    ? "ໝົດສາງ"
                                    : "ເພີ່ມລົງກະຕ່າ"}
                        </Button>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-8">ສິນຄ້າທີ່ກ່ຽວຂ້ອງ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(rp => {
                                const rpPrices = rp.variants?.map(v => v.sale_price) ?? []
                                const rpMin = rpPrices.length ? Math.min(...rpPrices) : 0
                                const rpMax = rpPrices.length ? Math.max(...rpPrices) : 0
                                const rpLabel = rpPrices.length === 0
                                    ? "—"
                                    : rpMin === rpMax ? formatCurrency(rpMin) : `${formatCurrency(rpMin)}+`

                                return (
                                    <Card
                                        key={rp.product_id}
                                        className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-shadow"
                                    >
                                        <Link href={`/home/${rp.product_id}`}>
                                            <div className="aspect-square overflow-hidden bg-gray-100 rounded-t-lg relative">
                                                <Image
                                                    src={rp.images?.[0]?.image_url ?? "/placeholder.png"}
                                                    alt={rp.product_name}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold mb-2 group-hover:underline line-clamp-1">
                                                    {rp.product_name}
                                                </h3>
                                                <span className="text-lg font-bold">
                                                    {rpLabel}
                                                </span>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}