// import { prisma } from "@/lib/prisma"
// import { CreateRefundInput } from "./refund.type"
// import { Prisma } from "@prisma/client"
// import { BadRequestError, NotFoundError } from "@/utils/response"
// import { generateRefundCode } from "@/utils/generateCode"

// export const RefundService = {
//     async createRefund(data: CreateRefundInput) {
//         return prisma.$transaction(async (tx) => {

//             // ✅ 2. validation
//             if (!data.refund_details || data.refund_details.length === 0) {
//                 throw new BadRequestError("Refund must have at least one item")
//             }

//             if (data.refund_details.some(i => i.quantity <= 0)) {
//                 throw new BadRequestError("Invalid quantity")
//             }

//             // 🔍 3. หา sale
//             const sale = await tx.sale.findUnique({
//                 where: { sale_id: data.sale_id },
//                 include: { sale_details: true }
//             })

//             if (!sale) {
//                 throw new NotFoundError("Sale not found")
//             }

//             // 🧠 map sale detail
//             const saleMap = new Map(
//                 sale.sale_details.map(d => [d.product_id, d])
//             )

//             // ✅ 4. validate refund
//             for (const item of data.refund_details) {
//                 const saleDetail = saleMap.get(item.product_id)

//                 if (!saleDetail) {
//                     throw new NotFoundError("Product not in sale")
//                 }

//                 if (item.quantity > saleDetail.quantity) {
//                     throw new BadRequestError("Refund exceeds sold quantity")
//                 }
//             }

//             // 💰 5. calculate total
//             const total = data.refund_details.reduce(
//                 (sum, item) => sum + item.price * item.quantity,
//                 0
//             )

//             // 🧾 6. create refund
//             const code = generateRefundCode()
//             const refund = await tx.refund.create({
//                 data: {
//                     sale_id: data.sale_id,
//                     refund_code: code,
//                     total_amount: total,
//                     refund_details: {
//                         create: data.refund_details
//                     }
//                 },
//                 include: {
//                     refund_details: true
//                 }
//             })

//             // 🔁 7. คืน stock
//             for (const item of data.refund_details) {
//                 await tx.product.update({
//                     where: { product_id: item.product_id },
//                     data: {
//                         stock_qty: {
//                             increment: item.quantity
//                         }
//                     }
//                 })
//             }

//             // 🎁 8. คืน point
//             if (sale.customer_id) {
//                 const point = Math.floor(total / 100)

//                 await tx.customer.update({
//                     where: { customer_id: sale.customer_id },
//                     data: {
//                         point: {
//                             decrement: point
//                         }
//                     }
//                 })
//             }
//             return refund
//         })
//     },

// async getRefunds(options: Prisma.RefundFindManyArgs = {}) {
//     const {
//         where,
//         skip = 0,
//         take = 10,
//         orderBy,
//     } = options

//     return prisma.refund.findMany({
//         where,
//         skip,
//         take,

//         orderBy:
//             (orderBy as Prisma.RefundOrderByWithRelationInput) ?? {
//                 createdAt: "desc",
//             },

//         include: {
//             refund_details: true,

//             sale: {
//                 select: {
//                     sale_id: true,
//                     customer_id: true,
//                     total_amount: true,
//                 },
//             },
//         },
//     })
// },

//     async getRefund(id: string) {
//         const refund = await prisma.refund.findUnique({
//             where: { refund_id: id },
//             include: {
//                 refund_details: true,
//                 sale: {
//                     include: {
//                         sale_details: true
//                     }
//                 }
//             }
//         })

//         if (!refund) {
//             throw new NotFoundError("Refund not found")
//         }

//         return refund
//     },

// }



import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { generateRefundCode } from "@/utils/generateCode"
import { CreateRefundInput } from "./refund.type"

const refundInclude = {
    sale: {
        include: {
            customer: true,
            sale_details: { include: { product: true, variant: true } }
        }
    },
    refund_details: { include: { product: { include: { images: true } } } }
} satisfies Prisma.RefundInclude

export const refundService = {

    async getRefunds(options: Prisma.RefundFindManyArgs = {}) {
        const { where, skip = 0, take = 10, orderBy } = options
        return prisma.refund.findMany({
            where,
            skip,
            take,
            orderBy: (orderBy as Prisma.RefundOrderByWithRelationInput) ?? { createdAt: "desc" },
            include: refundInclude,
        })
    },

    async getRefund(id: string) {
        const refund = await prisma.refund.findUnique({
            where: { refund_id: id },
            include: refundInclude,
        })
        if (!refund) throw new NotFoundError("Refund not found")
        return refund
    },

    async createRefund(data: CreateRefundInput) {
        return prisma.$transaction(async (tx) => {

            // ✅ ກວດ sale ມີຢູ່ ແລະ ຍັງບໍ່ມີ refund
            const sale = await tx.sale.findUnique({
                where: { sale_id: data.sale_id },
                include: { refund: true, sale_details: true },
            })
            if (!sale) throw new NotFoundError("Sale not found")
            if (sale.refund) throw new BadRequestError("This sale already has a refund")

            // ✅ ກວດ product ທຸກລາຍການຢູ່ໃນ sale ຈິງ
            for (const item of data.refund_details) {
                const saleDetail = sale.sale_details.find(
                    d => d.product_id === item.product_id
                )
                if (!saleDetail) {
                    throw new BadRequestError(`Product ${item.product_id} not in this sale`)
                }
                if (item.quantity > saleDetail.quantity) {
                    throw new BadRequestError(`Refund quantity exceeds sold quantity`)
                }
            }

            const total_amount = data.refund_details.reduce(
                (sum, d) => sum + d.price * d.quantity, 0
            )
            const code = generateRefundCode()

            const refund = await tx.refund.create({
                data: {
                    refund_code: code,
                    sale_id: data.sale_id,
                    total_amount,
                    refund_details: {
                        createMany: {
                            data: data.refund_details.map(d => ({
                                product_id: d.product_id,
                                quantity: d.quantity,
                                price: d.price,
                            }))
                        }
                    }
                },
                include: refundInclude,
            })

            // ✅ คืน stock variant
            for (const detail of sale.sale_details) {
                const refundItem = data.refund_details.find(
                    d => d.product_id === detail.product_id
                )
                if (refundItem) {
                    await tx.productVariant.update({
                        where: { variant_id: detail.variant_id },
                        data: { stock_qty: { increment: refundItem.quantity } },
                    })
                }
            }

            return refund
        })
    },

    async deleteRefund(id: string) {
        return prisma.$transaction(async (tx) => {
            const existing = await tx.refund.findUnique({
                where: { refund_id: id },
                include: { sale: { include: { sale_details: true } }, refund_details: true }
            })
            if (!existing) throw new NotFoundError("Refund not found")

            // ✅ rollback stock
            for (const detail of existing.refund_details) {
                const saleDetail = existing.sale.sale_details.find(
                    d => d.product_id === detail.product_id
                )
                if (saleDetail) {
                    await tx.productVariant.update({
                        where: { variant_id: saleDetail.variant_id },
                        data: { stock_qty: { decrement: detail.quantity } },
                    })
                }
            }

            await tx.refund.delete({ where: { refund_id: id } })
        })
    },
}