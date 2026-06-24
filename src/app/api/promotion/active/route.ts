import { promotionController } from "@/modules/promotion/promotion.controller";

// app/api/promotion/active/route.ts
export async function GET() {
    return promotionController.getAllPromotions()
}