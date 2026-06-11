'use client'
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { CartItemType } from "./type"


type Props = {
    item: CartItemType
    onUpdate: (product_id: string, delta: number) => void
    onRemove: (product_id: string) => void
}

export default function CartItem({ item, onUpdate, onRemove }: Props) {
    return (
        <div className="flex items-center justify-between gap-2 p-2 border rounded-lg">

            {/* LEFT */}
            <div className="flex items-center gap-2 flex-1">

                <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                    {item.images.length > 0 ? (
                        <Image
                            src={item.images[0].image_url}
                            alt={item.product_name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">
                            ບໍ່ມີຮູບ
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[120px]">
                        {item.product_name}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatCurrency(item.sale_price)}
                    </span>
                </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-1">

                {/* MINUS */}
                <button
                    onClick={() => onUpdate(item.product_id, -1)}
                    className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
                >
                    <Minus size={14} />
                </button>

                {/* QTY */}
                <span className="w-6 text-center text-sm">
                    {item.quantity}
                </span>

                {/* PLUS */}
                <button
                    onClick={() => onUpdate(item.product_id, 1)}
                    className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
                >
                    <Plus size={14} />
                </button>

                {/* DELETE */}
                <button
                    onClick={() => onRemove(item.product_id)}
                    className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded"
                >
                    <Trash2 size={14} />
                </button>

            </div>
        </div>
    )
}