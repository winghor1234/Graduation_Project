import { promotionController } from "@/modules/promotion/promotion.controller"
import { NextRequest } from "next/server"

// app/api/promotion/[id]/route.ts
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return promotionController.getPromotion(id)
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return promotionController.updatePromotion(req, id)
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return promotionController.deletePromotion(id)
}