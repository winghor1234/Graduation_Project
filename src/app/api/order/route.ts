import { orderController } from "@/modules/order/order.controller"
import { NextRequest } from "next/server"
import { verifyAccessToken } from "@/utils/jwt"

export async function GET(req: NextRequest) {
    // Customer: return only their own orders
    try {
        const payload = verifyAccessToken(req)
        if (payload.role === "CUSTOMER") {
            return orderController.getMyOrders(req)
        }
    } catch { /* not authenticated or not customer — fall through to admin path */ }

    const { searchParams } = new URL(req.url)
    if (searchParams.get("search") || searchParams.get("page")) {
        return orderController.getOrders(req)
    }
    return orderController.getAllOrders(req)
}

export async function POST(req: NextRequest) {
    return orderController.createOrder(req)
}
