import { prisma } from "@/lib/prisma"
import { notificationService } from "@/modules/notification/notification.service"
import { notificationEmitter } from "@/lib/notificationEmitter"

const DAY_MS = 24 * 60 * 60 * 1000
const CHECK_INTERVAL_MS = 60 * 60 * 1000 // ✅ ກວດທຸກ 1 ຊົ່ວໂມງ

// ✅ ຫາອໍເດີ້ທີ່ ARRIVED ແລ້ວ admin ຍັງບໍ່ອັບເດດເປັນ COMPLETED — ແຈ້ງເຕືອນລູກຄ້າຄັ້ງດຽວຕອນຄົບ 1 ມື້ ແລະ ຄັ້ງດຽວຕອນຄົບ 5 ມື້
export async function checkOverdueArrivedOrders() {
    const orders = await prisma.order.findMany({
        where: {
            status:     "ARRIVED",
            arrived_at: { not: null },
            OR: [
                { arrived_day1_notified: false },
                { arrived_day5_notified: false },
            ],
        },
        select: {
            order_id:              true,
            order_code:            true,
            customer_id:           true,
            arrived_at:            true,
            arrived_day1_notified: true,
            arrived_day5_notified: true,
        },
    })

    const now = Date.now()

    for (const order of orders) {
        if (!order.arrived_at || !order.customer_id) continue
        const daysSince = Math.floor((now - order.arrived_at.getTime()) / DAY_MS)

        if (daysSince >= 1 && !order.arrived_day1_notified) {
            await notificationService.createArrivedReminderNotification(
                order.customer_id, order.order_id, order.order_code, 1, prisma
            )
            await prisma.order.update({
                where: { order_id: order.order_id },
                data:  { arrived_day1_notified: true },
            })
            notificationEmitter.emit("notification", { customerId: order.customer_id })
        }

        if (daysSince >= 5 && !order.arrived_day5_notified) {
            await notificationService.createArrivedReminderNotification(
                order.customer_id, order.order_id, order.order_code, 5, prisma
            )
            await prisma.order.update({
                where: { order_id: order.order_id },
                data:  { arrived_day5_notified: true },
            })
            notificationEmitter.emit("notification", { customerId: order.customer_id })
        }
    }
}

// Singleton via globalThis — ກັນ HMR/instrumentation ຖືກເອີ້ນຫຼາຍຄັ້ງແລ້ວສ້າງ interval ຊ້ຳກັນ
const g = globalThis as unknown as { _arrivedCheckerStarted?: boolean }

export function startOverdueArrivedOrderChecker() {
    if (g._arrivedCheckerStarted) return
    g._arrivedCheckerStarted = true

    checkOverdueArrivedOrders().catch((err) => console.error("[ARRIVED_REMINDER] initial check failed:", err))
    setInterval(() => {
        checkOverdueArrivedOrders().catch((err) => console.error("[ARRIVED_REMINDER] check failed:", err))
    }, CHECK_INTERVAL_MS)
}
