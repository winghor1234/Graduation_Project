import { promotionController } from "@/modules/promotion/promotion.controller";
import { NextRequest } from "next/server";

// app/api/promotion/code/route.ts
export async function GET(req: NextRequest) {
    return promotionController.getPromotionByCode(req)
}