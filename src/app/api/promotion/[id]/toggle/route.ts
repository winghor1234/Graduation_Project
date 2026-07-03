import { promotionController } from "@/modules/promotion/promotion.controller";
import { NextRequest } from "next/server";

// app/api/promotion/[id]/toggle/route.ts
export async function PATCH(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return promotionController.toggleStatus(id)
}