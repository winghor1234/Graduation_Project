import { Product } from "@/modules/product/product.types"

export type CartItemType = Product & {
    quantity: number
}