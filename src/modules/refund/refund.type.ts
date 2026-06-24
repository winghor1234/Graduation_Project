import { Product } from "../product/product.types"
import { Sale } from "../sale/sale.type"


// export type RefundDetail = {
//   refund_detail_id: string
//   product_id: string
//   quantity: number
//   price: number

//   refund_id: string

//   product?: Product
// }

// export type Refund = {
//   refund_id: string
//   sale_id: string
//   total_amount: number

//   createdAt: string

//   sale?: Sale
//   refund_details?: RefundDetail[]
// }

// export type CreateRefundDetailInput = {
//   product_id: string
//   quantity: number
//   price: number
// }

// export type CreateRefundInput = {
//   sale_id: string
//   refund_details: CreateRefundDetailInput[]
// }


export type RefundDetail = {
    refund_detail_id: string
    product_id:       string
    quantity:         number
    price:            number
    refund_id:        string
    product?:         Product
}

export type Refund = {
    refund_id:      string
    refund_code:    string
    sale_id:        string
    total_amount:   number
    createdAt:      string
    sale?:          Sale
    refund_details?: RefundDetail[]
}

export type CreateRefundDetailInput = {
    product_id: string
    quantity:   number
    price:      number
}

export type CreateRefundInput = {
    sale_id:        string
    refund_details: CreateRefundDetailInput[]
}