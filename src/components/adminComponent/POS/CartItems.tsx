// // components/CartItem.tsx
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Minus, Plus, Trash2 } from "lucide-react"
// import { formatCurrency } from "@/utils/FormatCurrency"
// import { CartItemType } from "./type"


// type Props = {
//     item: CartItemType
//     onUpdate: (product_id: string, quantity: number) => void
//     onRemove: (product_id: string) => void
// }

// export default function CartItems({ item, onUpdate, onRemove }: Props) {
//     // console.log("item : ", item)
//     return (
//         <div className=" flex justify-between items-center border-b py-2">

//             <div className="flex gap-2 items-center">
//                 <div className="w-[40px] h-[40px] bg-gray-100 rounded overflow-hidden flex items-center justify-center">
//                     {item.images.map((image) => image.image_url) ? (
//                         <Image
//                             src={item.images[0].image_url}
//                             alt={item.product_name}
//                             width={40}
//                             height={40}
//                             className="object-cover w-full h-full"
//                         />
//                     ) : (
//                         <span className="text-[10px] text-admin-muted">ບໍ່ມີຮູບ</span>
//                     )}
//                 </div>
//                 <div>
//                     <p className="text-sm">{item.product_name}</p>
//                     <p className="text-xs text-gray-500">{formatCurrency(item.sale_price)}</p>
//                 </div>
//             </div>

//             <div className="flex items-center gap-1">
//                 <Button size="icon" onClick={() => onUpdate(item.product_id, -1)}>
//                     <Minus />
//                 </Button>
//                 <span>{item.quantity}</span>
//                 <Button size="icon" onClick={() => onUpdate(item.product_id, 1)}>
//                     <Plus />
//                 </Button>
//                 <Button size="icon" onClick={() => onRemove(item.product_id)}>
//                     <Trash2 />
//                 </Button>
//             </div>

//         </div>
//     )
// }

"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { CartItemType } from "./type"
import Image from "next/image"

type Props = {
    item:     CartItemType
    onUpdate: (variant_id: string, delta: number) => void
    onRemove: (variant_id: string) => void
}

export default function CartItems({ item, onUpdate, onRemove }: Props) {
    return (
        <div className="flex gap-2 p-2 rounded-lg border bg-white">

            {/* Image */}
            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image_url ? (
                    <Image
                        src={item.image_url}
                        alt={item.product_name}
                        width={48} height={48}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-admin-muted">
                        ບໍ່ມີຮູບ
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product_name}</p>
                {/* ✅ ສະແດງ variant */}
                <p className="text-xs text-muted-foreground">
                    {item.color} / {item.size}
                </p>
                <p className="text-xs font-semibold text-primary">
                    {formatCurrency(item.sale_price)}
                </p>
            </div>

            <div className="flex flex-col items-end justify-between gap-1">
                {/* Qty controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onUpdate(item.variant_id, -1)}
                        className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => onUpdate(item.variant_id, 1)}
                        disabled={item.quantity >= item.stock_qty}
                        className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">
                        {formatCurrency(item.sale_price * item.quantity)}
                    </span>
                    <button
                        onClick={() => onRemove(item.variant_id)}
                        className="text-red-400 hover:text-red-600"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}