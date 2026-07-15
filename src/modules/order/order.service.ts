import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { Prisma as PrismaNS } from "@prisma/client"
import { OrderStatus, Prisma, PaymentStatus, DeliveryStatus, PaymentMethod } from "@prisma/client"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { generateOrderCode } from "@/utils/generateCode"
import { convertFileToBase64, uploadMultipleImages, deleteImages } from "@/utils/cloudinary"
import { hashPassword } from "@/utils/password"
import { notificationService } from "@/modules/notification/notification.service"
import { notificationEmitter } from "@/lib/notificationEmitter"

type OrderDetailInput = {
    product_id: string
    variant_id: string
    quantity:   number
    price:      number
}

// ✅ ໃຊ້ include ດຽວ reuse ໄດ້ທຸກບ່ອນ — ບໍ່ nested ຊ້ຳວົນຄືນ
const orderInclude = {
    customer: true,
    order_details: {
        include: {
            product: {
                include: {
                    category: true,
                    images: true,
                },
            },
            variant: true,
        },
    },
    payment:  {
        include: {
            order: {
                include: {
                    customer: true,
                    order_details: true,
                },
            },
        },
    },
    delivery: {
        include: {
            address: {
                include: {
                    province: true,
                    district: true,
                    branch:   true,
                },
            },
        },
    },
} satisfies Prisma.OrderInclude

export const orderService = {

    async getOrders(options: Prisma.OrderFindManyArgs = {}) {
        const { where, skip = 0, take = 10, orderBy } = options

        return prisma.order.findMany({
            where,
            skip,
            take,
            orderBy: (orderBy as Prisma.OrderOrderByWithRelationInput) ?? { createdAt: "desc" },
            include: orderInclude,   // ✅ ແກ້ — ບໍ່ nested ຊ້ຳວົນຄືນອີກຕໍ່ໄປ
        })
    },

    async getAllOrders() {   // ✅ ແກ້ typo ຈາກ gerAllOrders
        return prisma.order.findMany({
            include: orderInclude,
            orderBy: { createdAt: "desc" },
        })
    },

    async getMyOrders(customerId: string) {
        return prisma.order.findMany({
            where:   { customer_id: customerId },
            include: orderInclude,
            orderBy: { createdAt: "desc" },
        })
    },

    async getOrder(id: string) {
        const order = await prisma.order.findUnique({
            where:   { order_id: id },
            include: orderInclude,
        })

        if (!order) throw new NotFoundError("Order not found")  // ✅ ເພີ່ມ — ກ່ອນບໍ່ throw
        return order
    },

    async createOrder(formData: FormData) {

        let customer_id     = formData.get("customer_id") as string | null
        const guestName      = formData.get("customer_name") as string | null
        const guestPhone     = formData.get("phone") as string | null
        const guestEmail     = formData.get("email") as string | null
        const method        = formData.get("method") as string
        const amount        = Number(formData.get("amount"))
        const province_id   = formData.get("province_id") as string
        const district_id   = formData.get("district_id") as string
        const branch_id     = formData.get("branch_id") as string
        const order_details: OrderDetailInput[] = JSON.parse(formData.get("order_details") as string)
        const file           = formData.get("file") as File | null
        const points_used    = Number(formData.get("points_used") ?? 0)

        // ✅ Guest checkout — ບໍ່ login/register, ແຕ່ຕ້ອງປ້ອນຂໍ້ມູນລູກຄ້າ
        if (!customer_id) {
            if (!guestName?.trim() || !guestPhone?.trim() || !guestEmail?.trim()) {
                throw new BadRequestError("ກະລຸນາປ້ອນຊື່, ເບີໂທ ແລະ ອີເມວ ສຳລັບການສັ່ງຊື້ແບບບໍ່ເຂົ້າສູ່ລະບົບ")
            }
        }
        if (!order_details?.length) throw new BadRequestError("Order must have at least one item")

        let slip_url:  string | undefined
        let public_id: string | undefined

        if (file) {
            const base64   = await convertFileToBase64(file)
            const uploaded = await uploadMultipleImages([base64], "payments")
            slip_url  = uploaded[0]?.url
            public_id = uploaded[0]?.publicId
        }

        return prisma.$transaction(async (tx) => {

            // ✅ ຊອກຫາ customer ຈາກເບີໂທເກົ່າ (guest ທີ່ເຄີຍສັ່ງມາກ່ອນ) ຫຼືສ້າງໃໝ່
            if (!customer_id) {
                const existing = await tx.customer.findUnique({
                    where:  { phone: guestPhone! },
                    select: { customer_id: true },
                })

                if (existing) {
                    customer_id = existing.customer_id
                } else {
                    try {
                        const randomPassword = crypto.randomBytes(16).toString("hex")
                        const created = await tx.customer.create({
                            data: {
                                customer_name: guestName!,
                                phone:         guestPhone!,
                                email:         guestEmail!,
                                password:      await hashPassword(randomPassword),
                                isActive:      true,
                            },
                            select: { customer_id: true },
                        })
                        customer_id = created.customer_id
                    } catch (err) {
                        if (err instanceof PrismaNS.PrismaClientKnownRequestError && err.code === "P2002") {
                            throw new BadRequestError("ອີເມວ ຫຼື ເບີໂທນີ້ຖືກໃຊ້ໄປແລ້ວ ກະລຸນາເຂົ້າສູ່ລະບົບເພື່ອສັ່ງຊື້")
                        }
                        throw err
                    }
                }
            }

            if (!customer_id) throw new BadRequestError("Failed to resolve customer for this order")

            const variantIds = order_details.map(i => i.variant_id)

            const variants = await tx.productVariant.findMany({
                where:  { variant_id: { in: variantIds } },
                select: { variant_id: true, stock_qty: true, product_id: true },
            })

            const variantMap = new Map(variants.map(v => [v.variant_id, v]))

            for (const item of order_details) {
                const variant = variantMap.get(item.variant_id)
                if (!variant)
                    throw new NotFoundError(`Variant ${item.variant_id} not found`)
                if (variant.product_id !== item.product_id)
                    throw new BadRequestError(`Variant ${item.variant_id} does not belong to product ${item.product_id}`)
                if (variant.stock_qty < item.quantity)
                    throw new BadRequestError(`Insufficient stock for variant ${item.variant_id}`)
            }

            const cart_total = order_details.reduce(
                (acc, item) => acc + item.price * item.quantity, 0
            )

            // ✅ ກວດ points ທີ່ໃຊ້ — ຕ້ອງໄດ້ຮັບການຢືນຢັນຈາກ DB
            let validatedPoints = 0
            if (points_used > 0) {
                const customer = await tx.customer.findUnique({
                    where: { customer_id },
                    select: { point: true },
                })
                if (!customer) throw new NotFoundError("Customer not found")
                const maxRedeem = Math.floor(cart_total * 0.3 / 100) // 30% of cart, 1pt=100₭
                const available = Math.floor(customer.point)
                validatedPoints = Math.min(points_used, available, maxRedeem)
                if (validatedPoints < 10) validatedPoints = 0
            }

            const point_discount = validatedPoints * 100
            const total_amount   = Math.max(0, cart_total - point_discount)

            const order = await tx.order.create({
                data: {
                    customer_id,
                    order_code:   generateOrderCode(),
                    total_amount,
                    points_used:  validatedPoints,
                    status:       OrderStatus.WAITING_PAYMENT,
                },
            })

            await tx.orderDetail.createMany({
                data: order_details.map(item => ({
                    order_id:   order.order_id,
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity:   item.quantity,
                    price:      item.price,
                })),
            })

            const payment = await tx.payment.create({
                data: {
                    order_id: order.order_id,
                    method:   method as PaymentMethod,
                    amount,
                    slip_url,
                    public_id,
                    status:   PaymentStatus.PENDING,
                },
            })

            const address = await tx.addressBranch.upsert({
                where:  { address_unique: { province_id, district_id, branch_id } },
                update: {},
                create: { province_id, district_id, branch_id },
            })

            const delivery = await tx.delivery.create({
                data: {
                    order_id:   order.order_id,
                    address_id: address.address_id,
                    status:     DeliveryStatus.PENDING,
                    provider:   "Anousith Express",
                },
            })

            for (const item of order_details) {
                await tx.productVariant.update({
                    where: { variant_id: item.variant_id },
                    data:  { stock_qty: { decrement: item.quantity } },
                })
            }

            // ✅ ຫັກຄະແນນທີ່ໃຊ້ + log ປະຫວັດ
            if (validatedPoints > 0) {
                await tx.customer.update({
                    where: { customer_id },
                    data:  { point: { decrement: validatedPoints } },
                })
                await tx.pointTransaction.create({
                    data: {
                        customer_id,
                        type:        "REDEEM",
                        points:      -validatedPoints,
                        description: `ໃຊ້ຄະແນນສ່ວນຫຼຸດ ${validatedPoints * 100}₭ ສຳລັບ order ${order.order_code}`,
                        order_id:    order.order_id,
                    },
                })
            }

            return { order, payment, delivery }

        }, { timeout: 10000 })
    },

    // ✅ ໃໝ່ — update status (admin verify payment, ship, complete, cancel)
    async updateOrderStatus(orderId: string, status: OrderStatus) {
        let notifyCustomerId: string | null = null

        const result = await prisma.$transaction(async (tx) => {

            const order = await tx.order.findUnique({
                where:   { order_id: orderId },
                include: { payment: true, order_details: true },
            })

            if (!order) throw new NotFoundError("Order not found")

            // ✅ COD — ຈ່າຍເງິນສົດຕອນສົ່ງ, ບໍ່ແມ່ນຕອນສັ່ງຊື້ — ອະນຸຍາດໃຫ້ສົ່ງເລີຍໂດຍບໍ່ຕ້ອງ "ຢືນຢັນການຊຳລະ" ປອມໆ
            const isCOD = order.payment?.method === "CASH"

            // ✅ ກວດການປ່ຽນສະຖານະທີ່ສົມເຫດສົມຜົນ
            const validTransitions: Record<OrderStatus, OrderStatus[]> = {
                WAITING_PAYMENT: isCOD ? ["SHIPPED", "CANCELLED"] : ["PAID", "CANCELLED"],
                PAID:            ["SHIPPED", "CANCELLED"],
                SHIPPED:         ["COMPLETED"],
                COMPLETED:       [],
                CANCELLED:       [],
            }

            if (!validTransitions[order.status].includes(status)) {
                throw new BadRequestError(
                    `Cannot change status from ${order.status} to ${status}`
                )
            }

            // ✅ ຖ້າ cancel ຫຼັງຈ່າຍແລ້ວ → rollback stock
            if (status === "CANCELLED") {
                for (const item of order.order_details) {
                    await tx.productVariant.update({
                        where: { variant_id: item.variant_id },
                        data:  { stock_qty: { increment: item.quantity } },
                    })
                }
            }

            // ✅ ຖ້າ verify ເປັນ PAID → update payment status ດ້ວຍ
            if (status === "PAID" && order.payment) {
                await tx.payment.update({
                    where: { order_id: orderId },
                    data:  { status: "VERIFIED" },
                })
            }

            // ✅ COD — ຢືນຢັນວ່າເກັບເງິນສົດແລ້ວ ຕອນອໍເດີ້ສຳເລັດ (ຂ້າມຂັ້ນ PAID ມາກ່ອນໜ້ານີ້)
            if (status === "COMPLETED" && isCOD && order.payment?.status !== "VERIFIED") {
                await tx.payment.update({
                    where: { order_id: orderId },
                    data:  { status: "VERIFIED" },
                })
            }

            // ✅ ເມື່ອ COMPLETED → ໃຫ້ຄະແນນລູກຄ້າ (10,000₭ = 1 ຄະແນນ)
            if (status === "COMPLETED" && order.customer_id) {
                const baseAmount = (order.total_amount ?? 0)
                const earned = Math.floor(baseAmount / 10000)
                if (earned > 0) {
                    await tx.customer.update({
                        where: { customer_id: order.customer_id },
                        data:  { point: { increment: earned } },
                    })
                    await tx.pointTransaction.create({
                        data: {
                            customer_id: order.customer_id,
                            type:        "EARN",
                            points:      earned,
                            description: `ໄດ້ຮັບຄະແນນຈາກ order ${order.order_code}`,
                            order_id:    orderId,
                        },
                    })
                }
            }

            const updated = await tx.order.update({
                where:   { order_id: orderId },
                data:    { status },
                include: orderInclude,
            })

            // ✅ ສ້າງ notification ໃຫ້ລູກຄ້າທຸກຄັ້ງທີ່ status ປ່ຽນ
            console.log("[NOTIF] order.customer_id =", order.customer_id, "| status =", status)
            if (order.customer_id) {
                await notificationService.createOrderStatusNotification(
                    order.customer_id,
                    orderId,
                    order.order_code,
                    status,
                    tx as unknown as typeof prisma
                )
                notifyCustomerId = order.customer_id
                console.log("[NOTIF] notification created for", order.customer_id)
            } else {
                console.log("[NOTIF] ⚠️  order.customer_id is null/empty — notification skipped")
            }

            return updated
        })

        // Emit ຫຼັງ transaction commit ສຳເລັດ — ກັນ race condition
        if (notifyCustomerId) {
            console.log("[NOTIF] emitting SSE for", notifyCustomerId)
            notificationEmitter.emit("notification", { customerId: notifyCustomerId })
        }

        return result
    },

    // ✅ ໃໝ່ — re-upload payment slip
    async uploadPaymentSlip(orderId: string, file: File) {
        return prisma.$transaction(async (tx) => {

            const order = await tx.order.findUnique({
                where:   { order_id: orderId },
                include: { payment: true },
            })

            if (!order) throw new NotFoundError("Order not found")
            if (!order.payment) throw new BadRequestError("Payment record not found")

            if (
                order.status !== "WAITING_PAYMENT" &&
                order.payment.status !== "REJECTED"
            ) {
                throw new BadRequestError("Cannot re-upload slip for this order")
            }

            if (order.payment.public_id) {
                await deleteImages([order.payment.public_id])
            }

            const base64   = await convertFileToBase64(file)
            const uploaded = await uploadMultipleImages([base64], "payments")

            return tx.payment.update({
                where: { order_id: orderId },
                data: {
                    slip_url:  uploaded[0]?.url,
                    public_id: uploaded[0]?.publicId,
                    status:    "PENDING",
                },
            })
        })
    },

    async deleteOrder(id: string) {
        return prisma.$transaction(async (tx) => {

            const existing = await tx.order.findUnique({
                where:   { order_id: id },
                include: { payment: true, delivery: true, order_details: true },
            })

            if (!existing) throw new NotFoundError("Order not found")
            if (existing.payment)  throw new BadRequestError("Cannot delete paid order")
            if (existing.delivery) throw new BadRequestError("Cannot delete order with delivery")
            if (existing.status !== OrderStatus.WAITING_PAYMENT) {
                throw new BadRequestError("Only waiting payment order can be deleted")
            }

            for (const item of existing.order_details) {
                await tx.productVariant.update({
                    where: { variant_id: item.variant_id },
                    data:  { stock_qty: { increment: item.quantity } },
                })
            }

            await tx.order.delete({ where: { order_id: id } })
        })
    },
}