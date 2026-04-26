export type ReceiptItem = {
    product_id: string
    product_name: string
    sale_price: number
    quantity: number
}

export type ReceiptPayload = {
    customer?: string | null
    date: string
    items: ReceiptItem[]
    total: number
}