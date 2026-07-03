import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateSaleInput } from "./sale.type"
import { BadRequestError, NotFoundError } from "@/utils/response"

export const saleService = {
    async getSales(options: Prisma.SaleFindManyArgs = {}) {
        const {
            where,
            skip = 0,
            take = 10,
            orderBy,
        } = options

        return prisma.sale.findMany({
            where,
            skip,
            take,

            orderBy:
                (orderBy as Prisma.SaleOrderByWithRelationInput) ?? {
                    createdAt: "desc",
                },

            include: {
                employee: true,

                customer: true,

                sale_details: {
                    include: {
                        product: true,
                    },
                },

                refund: true,
            },
        })
    },
    async getSale(id: string) {

        const sale = await prisma.sale.findUnique({
            where: { sale_id: id },
            include: {
                employee: true,
                customer: true,
                sale_details: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return sale

    },

    // async createSale(data: CreateSaleInput, userId: string) {
    //     return prisma.$transaction(async (tx) => {

    //         // ✅ 1. validation
    //         if (!data.sale_details || data.sale_details.length === 0) {
    //             throw new BadRequestError("Sale must have at least one item")
    //         }
    //         const items = data.sale_details

    //         if (items.some(i => i.quantity <= 0)) {
    //             throw new BadRequestError("Invalid quantity")
    //         }

    //         // 🔍 2. fetch products
    //         const productIds = items.map(i => i.product_id)

    //         const products = await tx.product.findMany({
    //             where: { product_id: { in: productIds } }
    //         })

    //         const productMap = new Map(
    //             products.map(p => [p.product_id, p])
    //         )

    //         // ✅ 3. check stock
    //         for (const item of items) {
    //             const product = productMap.get(item.product_id)

    //             if (!product) {
    //                 throw new NotFoundError("Product not found")
    //             }

    //             if (product.stock_qty < item.quantity) {
    //                 throw new BadRequestError(
    //                     `Insufficient stock for product ${product.product_name}`
    //                 )
    //             }
    //         }

    //         // 💰 4. calculate total (ห้ามใช้จาก client)
    //         const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    //         // 🧾 5. create sale
    //         const result = await tx.sale.create({
    //             data: {
    //                 employee_id: userId,
    //                 ...(data.customer_id && { customer_id: data.customer_id }),
    //                 total_amount: total,
    //                 sale_details: {
    //                     create: items
    //                 }
    //             },
    //             include: {
    //                 sale_details: true
    //             }
    //         })

    //         // 🔁 6. deduct stock
    //         for (const item of items) {
    //             await tx.product.update({
    //                 where: { product_id: item.product_id },
    //                 data: {
    //                     stock_qty: {
    //                         decrement: item.quantity
    //                     }
    //                 }
    //             })
    //         }

    //         // 🎁 7. add point (fix logic)
    //         if (result.customer_id) {

    //             // const point = Math.floor((total || 0) / 10000)
    //             const point = Number((((total ?? 0) / 10000).toFixed(2)))

    //             await tx.customer.update({
    //                 where: { customer_id: result.customer_id },
    //                 data: {
    //                     point: {
    //                         increment: point
    //                     }
    //                 }
    //             })
    //         }
    //         if (!result) {
    //             throw new BadRequestError("Failed to create sale")
    //         }
    //         return result
    //     })
    // },


    async createSale(data: CreateSaleInput, userId: string) {
        return prisma.$transaction(async (tx) => {

            // ✅ 1. validation
            if (!data.sale_details || data.sale_details.length === 0) {
                throw new BadRequestError("Sale must have at least one item")
            }
            const items = data.sale_details

            if (items.some(i => i.quantity <= 0)) {
                throw new BadRequestError("Invalid quantity")
            }

            // 🔍 2. fetch variants
            // ❗ stock_qty ແລະ sale_price ຢູ່ໃນ ProductVariant, ບໍ່ແມ່ນ Product
            const variantIds = items.map(i => i.variant_id)

            const variants = await tx.productVariant.findMany({
                where: { variant_id: { in: variantIds } },
                include: { product: true }
            })

            const variantMap = new Map(
                variants.map(v => [v.variant_id, v])
            )

            // ✅ 3. validate existence + stock, build authoritative line items
            //    ❗ price ມາຈາກ variant.sale_price ໃນ server, ບໍ່ໃຊ້ price ຈາກ client
            const saleDetailsInput = items.map(item => {
                const variant = variantMap.get(item.variant_id)

                if (!variant) {
                    throw new NotFoundError(
                        `Product variant not found: ${item.variant_id}`
                    )
                }

                if (variant.stock_qty < item.quantity) {
                    throw new BadRequestError(
                        `Insufficient stock for ${variant.product.product_name} (${variant.color}/${variant.size})`
                    )
                }

                return {
                    product_id: variant.product_id,
                    variant_id: variant.variant_id,
                    quantity: item.quantity,
                    price: variant.sale_price,
                }
            })

            // 💰 4. calculate total ຈາກ price ທີ່ server ກຳນົດເອງ
            const total = saleDetailsInput.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            )

            // 🧾 5. create sale
            const result = await tx.sale.create({
                data: {
                    employee_id: userId,
                    ...(data.customer_id && { customer_id: data.customer_id }),
                    total_amount: total,
                    sale_details: {
                        create: saleDetailsInput
                    }
                },
                include: {
                    sale_details: true
                }
            })

            // 🔁 6. deduct stock ແບບ atomic (ກັນ overselling ກໍລະນີຂາຍພ້ອມກັນ)
            for (const item of saleDetailsInput) {
                const updated = await tx.productVariant.updateMany({
                    where: {
                        variant_id: item.variant_id,
                        stock_qty: { gte: item.quantity }, // ກວດ stock ໃນ query ດຽວກັນ
                    },
                    data: {
                        stock_qty: { decrement: item.quantity }
                    }
                })

                if (updated.count === 0) {
                    throw new BadRequestError(
                        `Insufficient stock for variant ${item.variant_id}`
                    )
                }
            }

            // 🎁 7. add point
            if (result.customer_id) {
                const point = Math.round((total / 10000) * 100) / 100 // round 2 decimal

                await tx.customer.update({
                    where: { customer_id: result.customer_id },
                    data: {
                        point: {
                            increment: point
                        }
                    }
                })
            }

            return result
        })
    },

}