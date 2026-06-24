import { PromotionStatus } from "@prisma/client"
import { Product } from "../product/product.types"

export type PromotionProduct = {
    id:           string
    promotion_id: string
    product_id:   string
    product?:     Product
}

export type Promotion = {
    promotion_id:       string
    promotion_code:     string
    promotion_name:     string
    discount_value:     number
    start_date:         string
    end_date:           string
    status:             PromotionStatus
    description?:       string
    promotion_products?: PromotionProduct[]
    createdAt:          string
    updatedAt:          string
}

export type CreatePromotionInput = {
    promotion_name:  string
    discount_value:  number
    start_date:      string
    end_date:        string
    description?:    string
    product_ids?:    string[]
}

export type UpdatePromotionInput = Partial<CreatePromotionInput>