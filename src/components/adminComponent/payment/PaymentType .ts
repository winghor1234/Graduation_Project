import { Order } from "@/modules/order/order.types"


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


export type VerifyPaymentInput = {
    status: "VERIFIED" | "REJECTED"
}