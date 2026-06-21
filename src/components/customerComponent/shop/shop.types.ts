import { Product } from "@/modules/product/product.types"

export type ProductListItem = Product & {
    min_price: number
    max_price: number
    total_stock: number
}

export type CategoryItem = {
    category_id: string
    category_name: string
    _count?: { products: number }
}

export type SortBy = "featured" | "price-low" | "price-high" | "name"

export type ShopFilters = {
    category_id?: string
    search?: string
    min_price?: number
    max_price?: number
    sort_by?: SortBy
    page?: number
    page_size?: number
}