// app/api/promotion/route.ts
import { promotionController } from "@/modules/promotion/promotion.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return promotionController.getPromotions(req)
}
export async function POST(req: NextRequest) {
    return promotionController.createPromotion(req)
}