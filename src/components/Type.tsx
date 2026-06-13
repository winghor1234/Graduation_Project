type Order = "asc" | "desc"

export type PropsTable = {
  table: {
    search: string
    setSearch: (value: string) => void
    setSort: (field: string, order: Order) => void 
  }
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