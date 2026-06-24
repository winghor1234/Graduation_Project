"use client"

import Image from "next/image"
import { Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/customerComponent/CustomerContext"
import { Promotion } from "@/modules/promotion/promotion.types"
import { formatCurrency } from "@/utils/FormatCurrency"

type Props = {
    cart: CartItem[]
    cartTotal: number
    shipping: number
    discount: number
    total: number
    isSubmitting: boolean
    promoInput: string
    appliedPromo: Promotion | null
    promoError: string
    isCheckingPromo: boolean
    onPromoInputChange: (val: string) => void
    onApplyPromo: () => void
    onRemovePromo: () => void
}

export function CheckoutOrderSummary({
    cart, cartTotal, shipping, discount, total,
    isSubmitting, promoInput, appliedPromo, promoError,
    isCheckingPromo, onPromoInputChange, onApplyPromo, onRemovePromo,
}: Props) {
    return (
        <Card className="border shadow-sm bg-white">
            <CardHeader>
                <CardTitle className="text-gray-900">ສະຫຼຸບອໍເດີ້</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Cart items */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {cart.map(item => (
                        <div
                            key={item.variant_id}
                            className="flex gap-3 items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                            <div className="w-12 h-12 relative bg-gray-50 rounded border overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.image_url || "/placeholder.png"}
                                    alt={item.product_name}
                                    fill sizes="48px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate">
                                    {item.product_name}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    {item.color} / {item.size} · {item.quantity} ຊິ້ນ
                                </p>
                                <p className="text-xs font-bold text-gray-700 mt-0.5">
                                    {formatCurrency(item.sale_price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator className="bg-gray-100" />

                {/* Promo code */}
                {appliedPromo ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Tag className="size-4 text-emerald-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-emerald-700">{appliedPromo.promotion_code}</p>
                                <p className="text-xs text-emerald-600">{appliedPromo.promotion_name}</p>
                            </div>
                        </div>
                        <button type="button" onClick={onRemovePromo} className="text-gray-400 hover:text-gray-600 ml-2">
                            <X className="size-4" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm">ໂຄດສ່ວນຫຼຸດ</Label>
                        <div className="flex gap-2">
                            <Input
                                value={promoInput}
                                onChange={e => onPromoInputChange(e.target.value.toUpperCase())}
                                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), onApplyPromo())}
                                placeholder="ໃສ່ໂຄດ..."
                                className="text-sm h-9 uppercase"
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={onApplyPromo}
                                disabled={isCheckingPromo || !promoInput.trim()}
                                className="flex-shrink-0 h-9"
                            >
                                {isCheckingPromo ? "..." : "ໃຊ້"}
                            </Button>
                        </div>
                        {promoError && (
                            <p className="text-xs text-destructive">{promoError}</p>
                        )}
                    </div>
                )}

                <Separator className="bg-gray-100" />

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>ຍອດລວມສິນຄ້າ</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>ຄ່າຈັດສົ່ງ</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(shipping)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                            <span>ສ່ວນຫຼຸດ</span>
                            <span className="font-semibold">-{formatCurrency(discount)}</span>
                        </div>
                    )}
                </div>

                <Separator className="bg-gray-100" />

                <div className="flex justify-between items-end pt-1">
                    <span className="text-base font-bold text-gray-900">ຍອດຊຳລະສຸດທິ</span>
                    <span className="text-xl font-extrabold text-blue-600">{formatCurrency(total)}</span>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors mt-2 shadow-sm"
                >
                    {isSubmitting ? "ກຳລັງດຳເນີນການອໍເດີ້..." : "ຢືນຢັນການສັ່ງຊື້ສິນຄ້າ"}
                </Button>
            </CardContent>
        </Card>
    )
}
