import { productController } from "@/modules/product/product.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    // Shop requests always include `sort_by` or `page_size` — route to getAllProducts()
    // which handles category_id, min_price, max_price, sort_by, page, page_size correctly
    if (searchParams.has("sort_by") || searchParams.has("page_size")) {
        return productController.getAllProducts(req)
    }

    // Admin requests use search / page without shop-specific params
    if (searchParams.get("search") || searchParams.get("page")) {
        return productController.getProducts(req)
    }

    return productController.getAllProducts(req)
}

export async function POST(req: NextRequest) {
    return productController.createProduct(req)
}
