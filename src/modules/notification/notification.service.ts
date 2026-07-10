import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"

const STATUS_LABELS: Record<string, { title: string; message: (code: string) => string }> = {
    WAITING_PAYMENT: { title: "ລໍຖ້າການຊຳລະ",    message: (c) => `ອໍເດີ້ #${c} ກຳລັງລໍຖ້າການຊຳລະ ກະລຸນາຊຳລະພາຍໃນເວລາທີ່ກຳນົດ` },
    PAID:            { title: "ຢືນຢັນການຊຳລະ",    message: (c) => `ອໍເດີ້ #${c} ຢືນຢັນການຊຳລະແລ້ວ ຂອງທ່ານກຳລັງຖືກດຳເນີນການ` },
    SHIPPED:         { title: "ສິນຄ້າຖືກສົ່ງອອກ",  message: (c) => `ອໍເດີ້ #${c} ຖືກສົ່ງອອກແລ້ວ ກະລຸນາລໍຖ້າຮັບສິນຄ້າ` },
    COMPLETED:       { title: "ສຳເລັດ",            message: (c) => `ອໍເດີ້ #${c} ສຳເລັດແລ້ວ ຂອບໃຈທີ່ໃຊ້ບໍລິການ` },
    CANCELLED:       { title: "ອໍເດີ້ຖືກຍົກເລີກ",  message: (c) => `ອໍເດີ້ #${c} ຖືກຍົກເລີກ ກະລຸນາຕິດຕໍ່ເຮົາຖ້າມີຂໍ້ສົງໄສ` },
}

export const notificationService = {
    async createOrderStatusNotification(
        customerId: string,
        orderId: string,
        orderCode: string,
        status: OrderStatus,
        tx: typeof prisma
    ) {
        const label = STATUS_LABELS[status]
        if (!label || !customerId) return
        await (tx as typeof prisma).notification.create({
            data: {
                customer_id: customerId,
                order_id:    orderId,
                title:       label.title,
                message:     label.message(orderCode),
            },
        })
    },

    async getForCustomer(customerId: string) {
        return prisma.notification.findMany({
            where:   { customer_id: customerId },
            orderBy: { createdAt: "desc" },
            take:    50,
        })
    },

    async countUnread(customerId: string) {
        return prisma.notification.count({
            where: { customer_id: customerId, is_read: false },
        })
    },

    async markRead(notificationId: string, customerId: string) {
        return prisma.notification.updateMany({
            where: { notification_id: notificationId, customer_id: customerId },
            data:  { is_read: true },
        })
    },

    async markAllRead(customerId: string) {
        return prisma.notification.updateMany({
            where: { customer_id: customerId, is_read: false },
            data:  { is_read: true },
        })
    },
}
