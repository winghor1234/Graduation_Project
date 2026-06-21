

import { Category } from "@/modules/category/category.type"

// ─── Variant ───────────────────────────────────────────────

export type ProductVariantInput = {
  sku: string
  color: string
  size: string
  purchase_price: number
  sale_price: number
  stock_qty: number  // ✅ required — ບໍ່ optional (ແກ້ Zod error ເກົ່າ)
}

export type ProductVariant = {
  variant_id: string
  product_id: string
  sku: string
  color: string
  size: string
  purchase_price: number
  sale_price: number
  stock_qty: number
  createdAt: string
  updatedAt: string
}

// ─── Image ─────────────────────────────────────────────────

export type ProductImageInput = {
  image_url: string
  public_id: string
}

export type ProductImage = {
  image_id: string
  image_url: string
  public_id: string
}

// ─── Product ───────────────────────────────────────────────

export type CreateProductInput = {
  product_name: string
  purchase_price?: number      // product-level base price (optional)
  description?: string
  category_id: string
  variants?: ProductVariantInput[]
  files?: File[]
  folder?: string

}

export type UpdateProductInput = Partial<CreateProductInput>

export type Product = {
  product_id: string
  product_code: string
  product_name: string
  purchase_price: number | null  // Schema: Int? → nullable
  description?: string
  category_id: string
  category: Category       // ✅ relation
  images: ProductImage[] // ✅
  variants: ProductVariant[] // ✅ ຕ້ອງມີ
  createdAt: string
  updatedAt: string
  // ❌ sale_price ລຶບ — ຢູ່ໃນ ProductVariant
  // ❌ stock_qty ລຶບ — ຢູ່ໃນ ProductVariant
}