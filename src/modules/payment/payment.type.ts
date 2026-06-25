// modules/payment/payment.types.ts

import { Order } from "../order/order.type"

export type PaymentStatus =
    | "PENDING"
    | "VERIFIED"
    | "REJECTED"

export type Payment = {
    payment_id: string
    order: Order
    payment_date: string
    amount: number
    method?: string
    status: PaymentStatus
    slip_url?: string
    public_id?: string
    verified_by?: string
    verified_at?: string
    order_id: string
}

export type CreatePaymentInput = {
    order_id: string
    order_code?: string
    amount: number
    method: string
    slip_url?: string
    public_id?: string
    file?: File
}

export type VerifyPaymentInput = {
    status: "VERIFIED" | "REJECTED"
}