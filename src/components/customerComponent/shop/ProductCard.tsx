"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/FormatCurrency"
import { ProductListItem } from "./shop.types"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { toast } from "sonner"

type Props = {
    product:       ProductListItem
    onPickVariant: (product: ProductListItem) => void
}

export function ProductCard({ product, onPickVariant }: Props) {
    const { addToCart } = useCustomer()

    const hasMultipleVariants = (product.variants?.length ?? 0) > 1
    const totalStock   = product.variants?.reduce((total, variant) => total + variant.stock_qty, 0) ?? 0   // ✅ guard undefined → 0
    const isOutOfStock = totalStock <= 0
    console.log("product : ", product);

    const handleClick = (e: React.MouseEvent) => {
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
            toast.success(`ເພີ່ມ ${product.product_name} ລົງກະຕ່າແລ້ວ`)
        } else {
            onPickVariant(product)
        }
    }

    return (
        // ✅ ລຶບ debug border ອອກ
        <div className="flex flex-col justify-between">
            {/* ✅ ແກ້ path ໃຫ້ກົງ route /products/[id] */}
            <Link href={`/shop/${product.product_id}`} className="block flex-1">
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-50 group">
                    <Image
                        src={product.images?.[0]?.image_url || "/placeholder.png"}
                        alt={product.product_name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <Badge className="bg-gray-900 text-white border-none">ສິນຄ້າໝົດແລ້ວ</Badge>
                        </div>
                    )}
                </div>

                <div className="pt-4 pb-2 space-y-1">
                    <h3 className="font-bold text-[19px] text-gray-900 leading-tight line-clamp-2 min-h-[52px]">
                        {product.product_name}
                    </h3>
                    <p className="text-sm text-gray-400 font-normal line-clamp-2 min-h-[40px] leading-relaxed">
                        {product.description || "ເຄື່ອງກີລາຊັ້ນສູງ ອອກແບບດ້ວຍວັດສະດຸທີ່ທັນສະໄໝ"}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                        <span className="text-xl font-extrabold text-gray-900">
                            {product.min_price !== product.max_price && "ເລີ່ມຕົ້ນ "}
                            {formatCurrency(product.min_price)}
                        </span>

                        {/* ✅ ສະແດງຈຳນວນ stock ສະເໝີ — ບໍ່ວ່າຈະຫຼາຍຫຼືໜ້ອຍ */}
                        {!isOutOfStock && (
                            <Badge
                                className={`rounded-md text-[11px] px-2.5 py-1 border-none font-bold shadow-none tracking-wide ${
                                    totalStock <= 5
                                        ? "bg-amber-50 text-amber-700 hover:bg-amber-50"
                                        : "bg-[#eef1f6] text-gray-600 hover:bg-[#eef1f6]"
                                }`}
                            >
                                ເຫຼືອ {totalStock} ອັນ
                            </Badge>
                        )}
                    </div>
                </div>
            </Link>

            <div className="pt-2">
                <Button
                    className="w-full h-11 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-none tracking-wide"
                    disabled={isOutOfStock}
                    onClick={handleClick}
                >
                    {hasMultipleVariants ? "ເລືອກ ແລະ ເພີ່ມໃສ່ກະຕ່າ" : "ເພີ່ມໃສ່ກະຕ່າ"}
                </Button>
            </div>
        </div>
    )
}