"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/customerComponent/CustomerContext"
import { Promotion } from "@/modules/promotion/promotion.types"
import { formatCurrency } from "@/utils/FormatCurrency"

type Props = {
    cart: CartItem[]
    cartTotal: number
    discount: number
    total: number
    isSubmitting: boolean
    appliedPromotions: Promotion[]
    pointsUsed?: number
    pointsValue?: number
}

export function CheckoutOrderSummary({
    cart, cartTotal, discount, total,
    isSubmitting, appliedPromotions,
    pointsUsed = 0, pointsValue = 0,
}: Props) {
    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="pb-3">
                <CardTitle className="text-gray-900 text-base font-semibold">ສະຫຼຸບອໍເດີ້</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Cart items */}
                <div className="space-y-3 max-h-56 overflow-y-auto">
                    {cart.map(item => (
                        <div
                            key={item.variant_id}
                            className="flex gap-3 items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                            <div className="w-11 h-11 relative bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                                <Image
                                    src={item.image_url || "/placeholder.png"}
                                    alt={item.product_name}
                                    fill sizes="44px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate">{item.product_name}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    {item.color} / {item.size} · {item.quantity} ຊິ້ນ
                                </p>
                                <p className="text-xs font-bold text-orange-500 mt-0.5">
                                    {formatCurrency(item.sale_price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Promotions */}
                {appliedPromotions.length > 0 && (
                    <div className="space-y-1.5 text-xs">
                        <p className="text-gray-500 font-medium">ໂປໂມຊັນທີ່ໄດ້ຮັບ</p>
                        {appliedPromotions.map(promo => (
                            <div
                                key={promo.promotion_id}
                                className="flex justify-between text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2"
                            >
                                <span>{promo.promotion_code} · {promo.promotion_name}</span>
                                <span className="font-semibold">-{formatCurrency(promo.discount_value)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Points */}
                {pointsUsed > 0 && (
                    <div className="flex justify-between text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                        <span>ຄະແນນສ່ວນຫຼຸດ ({pointsUsed} pts)</span>
                        <span className="font-semibold">-{formatCurrency(pointsValue)}</span>
                    </div>
                )}

                <Separator />

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>ຍອດສິນຄ້າ</span>
                        <span className="text-gray-900">{formatCurrency(cartTotal)}</span>
                    </div>
                    {/* <div className="flex justify-between text-gray-400 text-xs">
                        <span>ຄ່າຂົນສົ່ງ</span>
                        <span>ລູກຄ້າຮັບຜິດຊອບເອງ</span>
                    </div> */}
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>ສ່ວນຫຼຸດທັງໝົດ</span>
                            <span>-{formatCurrency(discount)}</span>
                        </div>
                    )}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">ຍອດຊຳລະ</span>
                    <span className="text-xl font-bold text-orange-500">{formatCurrency(total)}</span>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg h-11"
                >
                    {isSubmitting ? "ກຳລັງດຳເນີນການ..." : "ຢືນຢັນການສັ່ງຊື້"}
                </Button>

            </CardContent>
        </Card>
    )
}
