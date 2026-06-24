import { promotionController } from "@/modules/promotion/promotion.controller"
import { NextRequest } from "next/server"

// app/api/promotion/[id]/route.ts
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    return promotionController.getPromotion(params.id)
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    return promotionController.updatePromotion(req, params.id)
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    return promotionController.deletePromotion(params.id)
}