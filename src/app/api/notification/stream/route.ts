import { NextRequest } from "next/server"
import { verifyAccessToken } from "@/utils/jwt"
import { notificationEmitter } from "@/lib/notificationEmitter"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    let customerId: string | null = null
    try {
        const payload = verifyAccessToken(req)
        customerId = payload.role === "CUSTOMER" ? payload.userId : null
    } catch {
        return new Response("Unauthorized", { status: 401 })
    }

    if (!customerId) return new Response("Unauthorized", { status: 401 })

    const id = customerId
    const encoder = new TextEncoder()

    console.log("[SSE] customer", id, "connected")

    const stream = new ReadableStream({
        start(ctrl) {
            // send initial ping so browser confirms connection
            ctrl.enqueue(encoder.encode(": connected\n\n"))

            const listener = (data: { customerId: string }) => {
                console.log("[SSE] event fired — listener", id, "| event for", data.customerId, "| match:", data.customerId === id)
                if (data.customerId !== id) return
                try {
                    ctrl.enqueue(encoder.encode("data: new\n\n"))
                    console.log("[SSE] sent 'data: new' to", id)
                } catch { }
            }

            notificationEmitter.on("notification", listener)

            // heartbeat every 25s to keep connection alive
            const heartbeat = setInterval(() => {
                try {
                    ctrl.enqueue(encoder.encode(": ping\n\n"))
                } catch {
                    clearInterval(heartbeat)
                }
            }, 25_000)

            req.signal.addEventListener("abort", () => {
                console.log("[SSE] customer", id, "disconnected")
                clearInterval(heartbeat)
                notificationEmitter.off("notification", listener)
                try { ctrl.close() } catch { }
            })
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type":  "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection":    "keep-alive",
            "X-Accel-Buffering": "no",
        },
    })
}
