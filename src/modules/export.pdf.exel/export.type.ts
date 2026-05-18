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

export type ExportColumn<T> = {
    key: keyof T
    header: string
}

export type ExportConfig<T extends Record<string, unknown>> = {
    title: string
    data: T[]
    columns: ExportColumn<T>[]
    fileName?: string
}