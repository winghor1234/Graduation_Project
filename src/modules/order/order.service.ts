import { prisma } from "@/lib/prisma"
import { OrderStatus, Prisma, PaymentStatus, DeliveryStatus, PaymentMethod } from "@prisma/client"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { generateOrderCode } from "@/utils/generateCode"
import { convertFileToBase64, uploadMultipleImages, deleteImages } from "@/utils/cloudinary"

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
    payment:  true,
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

    async getOrder(id: string) {
        const order = await prisma.order.findUnique({
            where:   { order_id: id },
            include: orderInclude,
        })

        if (!order) throw new NotFoundError("Order not found")  // ✅ ເພີ່ມ — ກ່ອນບໍ່ throw
        return order
    },

    async createOrder(formData: FormData) {

        const customer_id   = formData.get("customer_id") as string
        const method        = formData.get("method") as string
        const amount        = Number(formData.get("amount"))
        const province_id   = formData.get("province_id") as string
        const district_id   = formData.get("district_id") as string
        const branch_id     = formData.get("branch_id") as string
        const order_details: OrderDetailInput[] = JSON.parse(formData.get("order_details") as string)
        const file           = formData.get("file") as File | null

        if (!customer_id) throw new BadRequestError("customer_id is required")
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

            const total_amount = order_details.reduce(
                (acc, item) => acc + item.price * item.quantity, 0
            )

            const order = await tx.order.create({
                data: {
                    customer_id,
                    order_code:   generateOrderCode(),
                    total_amount,
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

            return { order, payment, delivery }

        }, { timeout: 10000 })
    },

    // ✅ ໃໝ່ — update status (admin verify payment, ship, complete, cancel)
    async updateOrderStatus(orderId: string, status: OrderStatus) {
        return prisma.$transaction(async (tx) => {

            const order = await tx.order.findUnique({
                where:   { order_id: orderId },
                include: { payment: true, order_details: true },
            })

            if (!order) throw new NotFoundError("Order not found")

            // ✅ ກວດການປ່ຽນສະຖານະທີ່ສົມເຫດສົມຜົນ
            const validTransitions: Record<OrderStatus, OrderStatus[]> = {
                WAITING_PAYMENT: ["PAID", "CANCELLED"],
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

            return tx.order.update({
                where:   { order_id: orderId },
                data:    { status },
                include: orderInclude,
            })
        })
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