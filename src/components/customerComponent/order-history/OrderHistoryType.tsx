import { OrderStatus, PaymentStatus, PaymentMethod, DeliveryStatus } from "@prisma/client"

export type OrderDetail = {
    order_detail_id: string
    quantity: number
    price: number
    product_id: string
    variant_id: string
    product?: {
        product_id: string
        product_name: string
        images?: { image_url: string }[]
    }
    variant?: {
        color: string
        size: string
    }
}

export type Payment = {
    payment_id: string
    amount: number
    method: PaymentMethod
    status: PaymentStatus
    slip_url?: string
    public_id?: string
    payment_date: string
}

export type Order = {
    order_id: string
    order_code: string
    order_date: string
    status: OrderStatus
    total_amount: number | null
    order_details: OrderDetail[]
    payment?: Payment        // ✅ ດຽວ, ບໍ່ແມ່ນ array
    createdAt: string
}