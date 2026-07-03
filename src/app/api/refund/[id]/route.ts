import { refundController } from "@/modules/refund/refund.controller"
import { NextRequest } from "next/server"


// export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params
//     return refundController.getRefund(id)
// }

// app/api/refund/[id]/route.ts
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return refundController.getRefund(id)
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return refundController.deleteRefund(id)
}