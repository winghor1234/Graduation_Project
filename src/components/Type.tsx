export type Table = {
    search: string
    setSort: (field: string) => void
    setOrder: (order: "asc" | "desc") => void
    setSearch: (search: string) => void
}

export type PropsTable = {
    table: Table
    onAdd: () => void
}



export type ViewMode = "W" | "M" | "Y"
export type ActiveTab = "Sales" | "Revenue" | "Inventory"

export type SalesGraphData = {
    labels: string[]
    unitsSold: number[]
    revenue: number[]
    cost: number[]
    profit: number[]
    expenses: number[]
    revenueBars: number[]
}

export type RevenueGraphData = {
    labels: string[]
    grossRevenue: number[]
    netRevenue: number[]
    refunds: number[]
    tax: number[]
}

export type InventoryGraphData = {
    labels: string[]
    inStock: number[]
    lowStock: number[]
    outOfStock: number[]
    received: number[]
}