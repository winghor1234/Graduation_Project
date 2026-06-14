'use client'
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/FormatCurrency"
import CartItems from "./CartItems"
import { CartItemType } from "./type"


type Props = {
    cart: CartItemType[]
    update: (product_id: string, delta: number) => void
    remove: (product_id: string) => void
    subtotal: number
    tax: number
    total: number
    onCheckout: () => void
}

export default function CartPanel({ cart, update, remove, subtotal, tax, total, onCheckout}: Props) {
    return (
        <div className="flex flex-col flex-1">

            {/* LIST */}
            <div className="flex-1 overflow-auto p-2 space-y-2">
                {cart.map((i) => (
                    <CartItems key={i.product_id} item={i} onUpdate={update} onRemove={remove} />
                ))}
            </div>

            {/* SUMMARY */}
            <div className="p-4 border-t bg-gray-50 space-y-2 text-sm">

                {/* <div className="flex justify-between">
                    <span>ລວມຍ່ອຍ (Subtotal)</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div> */}

                {/* <div className="flex justify-between">
                    <span>ອາກອນ / Tax (8%)</span>
                    <span>{formatCurrency(tax)}</span>
                </div> */}

                <div className="flex justify-between font-semibold text-lg">
                    <span>ລວມທັງໝົດ (Total)</span>
                    <span>{formatCurrency(total)}</span>
                </div>

                <Button
                    className="w-full mt-2"
                    onClick={onCheckout}
                    disabled={!cart.length}
                >
                    ຊຳລະເງິນ (Checkout)
                </Button>
            </div>
        </div>
    )
}