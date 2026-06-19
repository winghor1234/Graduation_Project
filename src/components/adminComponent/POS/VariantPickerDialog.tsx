"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Product } from "@/modules/product/product.types"
import { CartItemType } from "./type"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"

type Props = {
    product:      Product | null
    open:         boolean
    onOpenChange: (open: boolean) => void
    onAdd:        (item: CartItemType) => void
}

export function VariantPickerDialog({ product, open, onOpenChange, onAdd }: Props) {

    const [selectedVariantId, setSelectedVariantId] = useState<string>("")

    if (!product) return null

    const selectedVariant = product.variants?.find(v => v.variant_id === selectedVariantId)

    const handleAdd = () => {
        if (!selectedVariant) return
        onAdd({
            product_id:     product.product_id,
            product_name:   product.product_name,
            product_code:   product.product_code,
            image_url:      product.images?.[0]?.image_url,
            variant_id:     selectedVariant.variant_id,
            color:          selectedVariant.color,
            size:           selectedVariant.size,
            sale_price:     selectedVariant.sale_price,
            purchase_price: selectedVariant.purchase_price,
            stock_qty:      selectedVariant.stock_qty,
            quantity:       1,
        })
        setSelectedVariantId("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={(v) => {
            if (!v) setSelectedVariantId("")
            onOpenChange(v)
        }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-base">ເລືອກຕົວເລືອກສິນຄ້າ</DialogTitle>
                </DialogHeader>

                <div className="flex gap-3 items-start">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images?.[0]?.image_url ? (
                            <Image
                                src={product.images[0].image_url}
                                alt={product.product_name}
                                width={64} height={64}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                ບໍ່ມີຮູບ
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-sm">{product.product_name}</p>
                        <p className="text-xs text-muted-foreground">{product.product_code}</p>
                    </div>
                </div>

                {/* Variant list */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {product.variants?.length ? (
                        product.variants.map(v => {
                            const isSelected  = selectedVariantId === v.variant_id
                            const outOfStock  = v.stock_qty === 0

                            return (
                                <button
                                    key={v.variant_id}
                                    type="button"
                                    disabled={outOfStock}
                                    onClick={() => setSelectedVariantId(v.variant_id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-colors
                                        ${isSelected
                                            ? "border-primary bg-primary/5"
                                            : outOfStock
                                                ? "border-dashed opacity-40 cursor-not-allowed"
                                                : "hover:border-primary/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full border-2 ${
                                            isSelected ? "border-primary bg-primary" : "border-gray-300"
                                        }`} />
                                        <span>{v.color} / {v.size}</span>
                                        {outOfStock && (
                                            <span className="text-xs text-red-400">(ໝົດ)</span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-primary">
                                            {formatCurrency(v.sale_price)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            ເຫຼືອ {v.stock_qty}
                                        </p>
                                    </div>
                                </button>
                            )
                        })
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            ສິນຄ້ານີ້ບໍ່ມີ variant
                        </p>
                    )}
                </div>

                <Button
                    className="w-full gap-2"
                    disabled={!selectedVariantId}
                    onClick={handleAdd}
                >
                    <ShoppingCart className="w-4 h-4" />
                    ເພີ່ມລົງກະຕ່າ
                </Button>
            </DialogContent>
        </Dialog>
    )
}