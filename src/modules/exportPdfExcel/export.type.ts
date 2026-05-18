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

export type ExportConfig<T extends Record<string, any>> = {
    title: string
    data: T[]
    columns: ExportColumn<T>[]
    fileName?: string
}

export type ReportType =
    | "purchase"
    | "import"
    | "sales"
    | "customer"
    | "revenue"
    | "cost"
    | "topProduct"
    | "lowProduct"
    | "saleQuantity"
    | "monthlyRevenue"
    | "order"
