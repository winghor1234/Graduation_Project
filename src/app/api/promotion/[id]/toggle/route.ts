import { promotionController } from "@/modules/promotion/promotion.controller";
import { NextRequest } from "next/server";

// app/api/promotion/[id]/toggle/route.ts
export async function PATCH(_: NextRequest, { params }: { params: { id: string } }) {
    return promotionController.toggleStatus(params.id)
}