import { NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/modules/notification/notification.service"
import { verifyAccessToken } from "@/utils/jwt"

function getCustomerId(req: NextRequest): string | null {
    try {
        const payload = verifyAccessToken(req)
        return payload.role === "CUSTOMER" ? payload.userId : null
    } catch {
        return null
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const customerId = getCustomerId(req)
    if (!customerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    try {
        const { id } = await params
        await notificationService.markRead(id, customerId)
        return NextResponse.json({ message: "ອ່ານແລ້ວ" })
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
