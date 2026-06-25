// 'use client'
// import { Button } from "@/components/ui/button"
// import { formatCurrency } from "@/utils/FormatCurrency"
// import CartItems from "./CartItems"
// import { CartItemType } from "./type"


// type Props = {
//     cart: CartItemType[]
//     update: (product_id: string, delta: number) => void
//     remove: (product_id: string) => void
//     subtotal: number
//     tax: number
//     total: number
//     onCheckout: () => void
// }

// export default function CartPanel({ cart, update, remove, subtotal, tax, total, onCheckout}: Props) {
//     return (
//         <div className="flex flex-col flex-1">

//             {/* LIST */}
//             <div className="flex-1 overflow-auto p-2 space-y-2">
//                 {cart.map((i) => (
//                     <CartItems key={i.product_id} item={i} onUpdate={update} onRemove={remove} />
//                 ))}
//             </div>

//             {/* SUMMARY */}
//             <div className="p-4 border-t bg-admin-bg space-y-2 text-sm">

//                 {/* <div className="flex justify-between">
//                     <span>ລວມຍ່ອຍ (Subtotal)</span>
//                     <span>{formatCurrency(subtotal)}</span>
//                 </div> */}

//                 {/* <div className="flex justify-between">
//                     <span>ອາກອນ / Tax (8%)</span>
//                     <span>{formatCurrency(tax)}</span>
//                 </div> */}

//                 <div className="flex justify-between font-semibold text-lg">
//                     <span>ລວມທັງໝົດ (Total)</span>
//                     <span>{formatCurrency(total)}</span>
//                 </div>

//                 <Button
//                     className="w-full mt-2"
//                     onClick={onCheckout}
//                     disabled={!cart.length}
//                 >
//                     ຊຳລະເງິນ (Checkout)
//                 </Button>
//             </div>
//         </div>
//     )
// }


"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/FormatCurrency"
import CartItems from "./CartItems"
import { CartItemType } from "./type"
import { ShoppingCart } from "lucide-react"

type Props = {
    cart:       CartItemType[]
    update:     (variant_id: string, delta: number) => void
    remove:     (variant_id: string) => void
    subtotal:   number
    tax:        number
    total:      number
    onCheckout: () => void
}

export default function CartPanel({ cart, update, remove, subtotal, tax, total, onCheckout }: Props) {
    return (
        <div className="flex flex-col h-full">

            {/* Items */}
            <div className="flex-1 overflow-auto p-3 space-y-2">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                        <ShoppingCart className="w-10 h-10 opacity-20" />
                        <p className="text-sm">ກະຕ່າຫວ່າງ</p>
                    </div>
                ) : (
                    cart.map(i => (
                        // ✅ key = variant_id
                        <CartItems
                            key={i.variant_id}
                            item={i}
                            onUpdate={update}
                            onRemove={remove}
                        />
                    ))
                )}
            </div>

            {/* Summary */}
            <div className="p-4 border-t bg-admin-bg space-y-2 text-sm shrink-0">
                <div className="flex justify-between font-bold text-base">
                    <span>ລວມທັງໝົດ</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                </div>

                <Button
                    className="w-full mt-1 gap-2"
                    onClick={onCheckout}
                    disabled={!cart.length}
                >
                    <ShoppingCart className="w-4 h-4" />
                    ຊຳລະເງິນ ({cart.length} ລາຍການ)
                </Button>
            </div>
        </div>
    )
}