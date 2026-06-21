"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/FormatCurrency"
import { ProductListItem } from "./shop.types"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { toast } from "sonner"
import { ShoppingCart } from "lucide-react"

type Props = {
    product: ProductListItem | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function VariantPickerDialog({ product, open, onOpenChange }: Props) {
    const { addToCart } = useCustomer()
    const [variantId, setVariantId] = useState("")

    if (!product) return null

    const variant = product.variants?.find(v => v.variant_id === variantId)

    const handleAdd = () => {
        if (!variant) return
        addToCart({
            product_id: product.product_id,
            variant_id: variant.variant_id,
            product_name: product.product_name,
            image_url: product.images?.[0]?.image_url,
            color: variant.color,
            size: variant.size,
            sale_price: variant.sale_price,
            stock_qty: variant.stock_qty,
        })
        toast.success(`ເພີ່ມ ${product.product_name} (${variant.color}/${variant.size}) ລົງກະຕ່າແລ້ວ`)
        setVariantId("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={v => { if (!v) setVariantId(""); onOpenChange(v) }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-base">ເລືອກຕົວເລືອກສິນຄ້າ</DialogTitle>
                </DialogHeader>

                <div className="flex gap-3 items-start">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <Image
                            src={product.images?.[0]?.image_url || "/placeholder.png"}
                            alt={product.product_name}
                            fill sizes="56px"
                            className="object-cover"
                        />
                    </div>
                    <p className="font-medium text-sm">{product.product_name}</p>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                    {product.variants?.length ? (
                        product.variants.map(v => {
                            const isSelected = variantId === v.variant_id
                            const outOfStock = v.stock_qty === 0
                            return (
                                <button
                                    key={v.variant_id}
                                    type="button"
                                    disabled={outOfStock}
                                    onClick={() => setVariantId(v.variant_id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-colors
                                        ${isSelected ? "border-primary bg-primary/5" :
                                            outOfStock ? "opacity-40 cursor-not-allowed border-dashed" :
                                                "hover:border-primary/50"}`}
                                >
                                    <span>{v.color} / {v.size}</span>
                                    <span className="text-right">
                                        <span className="font-semibold text-primary block">
                                            {formatCurrency(v.sale_price)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {outOfStock ? "ໝົດສາງ" : `ເຫຼືອ ${v.stock_qty}`}
                                        </span>
                                    </span>
                                </button>
                            )
                        })
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            ສິນຄ້ານີ້ບໍ່ມີ variant
                        </p>
                    )}
                </div>

                <Button className="w-full gap-2" disabled={!variantId} onClick={handleAdd}>
                    <ShoppingCart className="w-4 h-4" />
                    ເພີ່ມລົງກະຕ່າ
                </Button>
            </DialogContent>
        </Dialog>
    )
}