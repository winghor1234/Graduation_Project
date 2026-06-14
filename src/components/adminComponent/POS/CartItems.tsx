// components/CartItem.tsx
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { CartItemType } from "./type"


type Props = {
    item: CartItemType
    onUpdate: (product_id: string, quantity: number) => void
    onRemove: (product_id: string) => void
}

export default function CartItems({ item, onUpdate, onRemove }: Props) {
    // console.log("item : ", item)
    return (
        <div className=" flex justify-between items-center border-b py-2">

            <div className="flex gap-2 items-center">
                <div className="w-[40px] h-[40px] bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {item.images.map((image) => image.image_url) ? (
                        <Image
                            src={item.images[0].image_url}
                            alt={item.product_name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <span className="text-[10px] text-gray-400">ບໍ່ມີຮູບ</span>
                    )}
                </div>
                <div>
                    <p className="text-sm">{item.product_name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(item.sale_price)}</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <Button size="icon" onClick={() => onUpdate(item.product_id, -1)}>
                    <Minus />
                </Button>
                <span>{item.quantity}</span>
                <Button size="icon" onClick={() => onUpdate(item.product_id, 1)}>
                    <Plus />
                </Button>
                <Button size="icon" onClick={() => onRemove(item.product_id)}>
                    <Trash2 />
                </Button>
            </div>

        </div>
    )
}