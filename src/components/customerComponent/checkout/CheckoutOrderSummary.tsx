"use client"

import Image from "next/image"
import { Sparkles, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/customerComponent/CustomerContext"
import { Promotion } from "@/modules/promotion/promotion.types"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"

type Props = {
    cart: CartItem[]
    cartTotal: number
    shipping: number
    discount: number
    total: number
    isSubmitting: boolean
    appliedPromotions: Promotion[]
    pointsUsed?: number
    pointsValue?: number
}

export function CheckoutOrderSummary({
    cart, cartTotal, shipping, discount, total,
    isSubmitting, appliedPromotions,
    pointsUsed = 0, pointsValue = 0,
}: Props) {
    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="pb-4">
                <CardTitle className="text-gray-900 text-base">ສະຫຼຸບອໍເດີ້</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Cart items */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {cart.map(item => (
                        <div
                            key={item.variant_id}
                            className="flex gap-3 items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                            <div className="w-12 h-12 relative bg-gray-100 rounded-xl border border-gray-200 overflow-hidden shrink-0">
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
                                <p className="text-xs font-bold text-brand-orange mt-0.5">
                                    {formatCurrency(item.sale_price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator className="bg-gray-100" />

                {/* Points used */}
                {pointsUsed > 0 && (
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2">
                            <Star className="size-4 text-amber-500 fill-amber-400 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-amber-700">ໃຊ້ {pointsUsed} ຄະແນນ</p>
                                <p className="text-[10px] text-amber-500">ຄະແນນສ່ວນຫຼຸດ</p>
                            </div>
                        </div>
                        <span className="text-sm font-extrabold text-amber-700">-{formatCurrency(pointsValue)}</span>
                    </div>
                )}

                {/* Auto-applied promotions */}
                {appliedPromotions.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles className="size-3.5 text-emerald-500" />
                            <span className="text-xs font-semibold text-emerald-600">ໂປໂມຊັນທີ່ໄດ້ຮັບ</span>
                        </div>
                        {appliedPromotions.map(promo => (
                            <div
                                key={promo.promotion_id}
                                className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <CheckCircle className="size-4 text-emerald-500 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-emerald-700 truncate">
                                            {promo.promotion_code}
                                        </p>
                                        <p className="text-[11px] text-emerald-600 truncate">
                                            {promo.promotion_name}
                                        </p>
                                        <p className="text-[10px] text-emerald-500 mt-0.5">
                                            ໝົດ {formatDate(promo.end_date)}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-extrabold text-emerald-600 shrink-0 ml-2">
                                    -{formatCurrency(promo.discount_value)}
                                </span>
                            </div>
                        ))}
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
                            <span>ສ່ວນຫຼຸດທັງໝົດ</span>
                            <span className="font-semibold">-{formatCurrency(discount)}</span>
                        </div>
                    )}
                </div>

                <Separator className="bg-gray-100" />

                <div className="flex justify-between items-end pt-1">
                    <span className="text-base font-bold text-gray-900">ຍອດຊຳລະສຸດທິ</span>
                    <span className="text-xl font-extrabold text-brand-orange">{formatCurrency(total)}</span>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold transition-all duration-200 mt-2 shadow-md active:scale-[0.98] rounded-xl"
                >
                    {isSubmitting ? "ກຳລັງດຳເນີນການ..." : "ຢືນຢັນການສັ່ງຊື້ສິນຄ້າ"}
                </Button>

            </CardContent>
        </Card>
    )
}