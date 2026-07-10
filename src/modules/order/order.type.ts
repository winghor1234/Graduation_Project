import { PaymentMethod, OrderStatus as PrismaOrderStatus } from "@prisma/client"
import { Customer } from "../customer/customer.type"
import { Product, ProductVariant } from "../product/product.types"
import { Payment } from "../payment/payment.type"
import { Delivery } from "../delivery/delivery.type"

// ✅ ໃຊ້ enum ຈາກ Prisma ໂດຍກົງ — ບໍ່ duplicate ນິຍາມ
export type OrderStatus = PrismaOrderStatus

export type OrderDetail = {
    order_detail_id: string
    quantity:         number
    price:            number
    order_id:         string
    product_id:       string
    variant_id:       string         // ✅ ຕ້ອງມີ — Schema ຮຽກຮ້ອງ
    product?:         Product
    variant?:         ProductVariant // ✅ ສຳລັບ include
    createdAt:        string
    updatedAt:        string
}

export type Order = {
    order_id:      string
    order_date:    string
    order_code:    string
    status:        OrderStatus
    total_amount:  number | null   // ✅ Schema: Int? (optional)
    customer_id:   string
    customer?:     Customer
    order_details?: OrderDetail[]
    payment?:      Payment          // ✅ optional — 1:1 relation ບໍ່ສະເໝີໄປມີ
    delivery?:     Delivery         // ✅ optional
    createdAt:     string
    updatedAt:     string
}

// ─── Inputs ────────────────────────────────────────────────

export type CreateOrderDetailInput = {
    product_id: string
    variant_id: string   // ✅ ຕ້ອງມີ
    quantity:   number
    price:      number
}

export type CreateOrderInput = {
    customer_id:    string
    method:         PaymentMethod
    amount:         number
    province_id:    string
    district_id:    string
    branch_id:      string
    order_details:  CreateOrderDetailInput[]
    file?:          File
}

export type UpdateOrderStatusInput = {
    status: OrderStatus
}

// ✅ /api/order (POST) ຕອບກັບ { order, payment, delivery } — ບໍ່ແມ່ນ Order ດຽວໆ
export type CreateOrderResult = {
    order:    Order
    payment:  Payment
    delivery: Delivery
}

export type UploadPaymentSlipInput = {
    order_id: string
    file:     File
}