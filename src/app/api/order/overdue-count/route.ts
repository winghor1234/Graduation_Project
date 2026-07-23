import { orderController } from "@/modules/order/order.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return orderController.getOverdueArrivedCount(req)
}
