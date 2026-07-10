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

export async function GET(req: NextRequest) {
    const customerId = getCustomerId(req)
    console.log("[NOTIF API] GET — customerId =", customerId)
    if (!customerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    try {
        const notifications = await notificationService.getForCustomer(customerId)
        const unread = await notificationService.countUnread(customerId)
        console.log("[NOTIF API] found", notifications.length, "rows, unread =", unread)
        return NextResponse.json({ data: notifications, unread })
    } catch (err) {
        console.error("[NOTIF API] DB error:", err)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const customerId = getCustomerId(req)
    if (!customerId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    try {
        await notificationService.markAllRead(customerId)
        return NextResponse.json({ message: "ອ່ານທັງໝົດແລ້ວ" })
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
