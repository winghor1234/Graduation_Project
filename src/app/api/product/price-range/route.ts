import { productController } from "@/modules/product/product.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return productController.getPriceRange(req)
}
