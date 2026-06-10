import { prisma } from "@/lib/prisma"
import { OrderStatus, Prisma, PaymentStatus, DeliveryStatus, PaymentMethod } from "@prisma/client"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { generateOrderCode } from "@/utils/generateCode"
import { convertFileToBase64, uploadMultipleImages } from "@/utils/cloudinary"
import { Product } from "../product/product.types"
type OrderDetail = {
    price: number;
    quantity: number;
    product_id: string
}

export const orderService = {

    async getOrders(options?: Prisma.OrderFindManyArgs) {
        const orders = await prisma.order.findMany({
            ...options,
            // include: {
            //     customer: true,
            //     order_details: {
            //         include: {
            //             product: true
            //         }
            //     },
            //     payment: true,
            //     delivery: true
            // }
            include: {
                customer: true,
                payment: {
                    include: {
                        order: true
                    }
                },
                delivery: {
                    include: {
                        address: {
                            include: {
                                province: true,
                                district: true,
                                branch: true
                            }
                        }
                    }
                }
            }
        })
        return orders
    },

    async gerAllOrders() {
        const orders = await prisma.order.findMany({
            include: {
                customer: true,
                order_details: {
                    include: {
                        product: true
                    }
                },
                payment: true,
                delivery: true
            }
        })
        return orders
    },

    async getOrder(id: string) {

        const order = await prisma.order.findUnique({
            where: { order_id: id },
            include: {
                customer: true,
                order_details: {
                    include: {
                        product: true
                    }
                },
                payment: true,
                delivery: true
            }
        })
        return order

    },

    async createOrder(formData: FormData) {

        /* ------------------ 1. PARSE DATA ------------------ */

        const customer_id = formData.get("customer_id") as string
        const method = formData.get("method") as string
        const amount = Number(formData.get("amount"))
        const province_id = formData.get("province_id") as string
        const district_id = formData.get("district_id") as string
        const branch_id = formData.get("branch_id") as string

        const order_details = JSON.parse(
            formData.get("order_details") as string
        )

        const file = formData.get("file") as File | null

        /* ------------------ 2. UPLOAD (ย้ายออกนอก TX) ------------------ */

        let slip_url: string | undefined
        let public_id: string | undefined

        if (file) {
            const base64 = await convertFileToBase64(file)
            const uploaded = await uploadMultipleImages([base64], "payments")

            slip_url = uploaded[0]?.url
            public_id = uploaded[0]?.publicId
        }

        /* ------------------ 3. TRANSACTION ------------------ */

        return prisma.$transaction(async (tx) => {

            /* ---------- CHECK PRODUCT ---------- */

            const productIds = order_details.map((i: Product) => i.product_id)

            const products = await tx.product.findMany({
                where: { product_id: { in: productIds } },
                select: { product_id: true, stock_qty: true }
            })

            const productMap = new Map(products.map(p => [p.product_id, p]))

            for (const item of order_details) {
                const product = productMap.get(item.product_id)

                if (!product) throw new Error("Product not found")
                if (product.stock_qty < item.quantity) {
                    throw new Error("Insufficient stock")
                }
            }

            const total_amount = order_details.reduce(
                (acc: number, item: OrderDetail) => acc + item.price * item.quantity,
                0
            )

            /* ---------- CREATE ORDER ---------- */

            const order = await tx.order.create({
                data: {
                    customer_id,
                    order_code: generateOrderCode(),
                    total_amount,
                    status: OrderStatus.WAITING_PAYMENT,
                }
            })

            /* ---------- CREATE ORDER DETAILS (batch) ---------- */

            await tx.orderDetail.createMany({
                data: order_details.map((orderItem: OrderDetail) => ({
                    order_id: order.order_id,
                    product_id: orderItem.product_id,
                    quantity: orderItem.quantity,
                    price: orderItem.price
                }))
            })

            /* ---------- CREATE PAYMENT ---------- */

            const payment = await tx.payment.create({
                data: {
                    order_id: order.order_id,
                    method: method as PaymentMethod,
                    amount,
                    slip_url,
                    public_id,
                    status: PaymentStatus.PENDING
                }
            })

            /* ---------- ADDRESS UPSERT ---------- */

            const address = await tx.addressBranch.upsert({
                where: {
                    address_unique: {
                        province_id,
                        district_id,
                        branch_id
                    }
                },
                update: {},
                create: {
                    province_id,
                    district_id,
                    branch_id
                }
            })

            /* ---------- CREATE DELIVERY ---------- */

            const delivery = await tx.delivery.create({
                data: {
                    order_id: order.order_id,
                    address_id: address.address_id,
                    status: DeliveryStatus.PENDING,
                    provider: "Anousith Express"
                }
            })

            /* ---------- UPDATE STOCK (parallel) ---------- */

            await Promise.all(
                order_details.map((item: OrderDetail) =>
                    tx.product.update({
                        where: { product_id: item.product_id },
                        data: {
                            stock_qty: { decrement: item.quantity }
                        }
                    })
                )
            )

            return {
                order,
                payment,
                delivery
            }
        }, {
            timeout: 10000 // ✅ เพิ่ม timeout กันพลาด
        })
    },

    // async createOrder(formData: FormData) {
    //     return prisma.$transaction(async (tx) => {

    //         /* ------------------ 1. PARSE DATA ------------------ */

    //         const customer_id = formData.get("customer_id") as string
    //         const method = formData.get("method") as string
    //         const amount = Number(formData.get("amount"))
    //         const province_id = formData.get("province_id") as string
    //         const district_id = formData.get("district_id") as string
    //         const branch_id = formData.get("branch_id") as string

    //         const order_details = JSON.parse(
    //             formData.get("order_details") as string
    //         )

    //         const file = formData.get("file") as File | null

    //         /* ------------------ 2. CHECK PRODUCT ------------------ */

    //         const productIds = order_details.map((i: Product) => i.product_id)

    //         const products = await tx.product.findMany({
    //             where: { product_id: { in: productIds } }
    //         })

    //         const productMap = new Map(products.map(p => [p.product_id, p]))

    //         for (const item of order_details) {
    //             const product = productMap.get(item.product_id)

    //             if (!product) throw new Error("Product not found")
    //             if (product.stock_qty < item.quantity) {
    //                 throw new Error("Insufficient stock")
    //             }
    //         }

    //         const total_amount = order_details.reduce(
    //             (acc: number, item: OrderDetail) => acc + item.price * item.quantity,
    //             0
    //         )

    //         /* ------------------ 3. CREATE ORDER ------------------ */

    //         const order = await tx.order.create({
    //             data: {
    //                 customer_id,
    //                 order_code: generateOrderCode(),
    //                 total_amount,
    //                 status: OrderStatus.WAITING_PAYMENT,
    //                 order_details: {
    //                     create: order_details
    //                 }
    //             }
    //         })

    //         /* ------------------ 4. UPLOAD SLIP ------------------ */

    //         let slip_url: string | undefined
    //         let public_id: string | undefined

    //         if (file) {
    //             const base64 = await convertFileToBase64(file)
    //             const uploaded = await uploadMultipleImages([base64], "payments")

    //             slip_url = uploaded[0]?.url
    //             public_id = uploaded[0]?.publicId
    //         }

    //         /* ------------------ 5. CREATE PAYMENT ------------------ */

    //         const payment = await tx.payment.create({
    //             data: {
    //                 order_id: order.order_id,
    //                 method: method as PaymentMethod,
    //                 amount,
    //                 slip_url,
    //                 public_id,
    //                 status: PaymentStatus.PENDING
    //             }
    //         })

    //         /* ------------------ 6. ADDRESS UPSERT ------------------ */

    //         const address = await tx.addressBranch.upsert({
    //             where: {
    //                 address_unique: {
    //                     province_id,
    //                     district_id,
    //                     branch_id
    //                 }
    //             },
    //             update: {},
    //             create: {
    //                 province_id,
    //                 district_id,
    //                 branch_id
    //             }
    //         })

    //         /* ------------------ 7. CREATE DELIVERY ------------------ */

    //         const delivery = await tx.delivery.create({
    //             data: {
    //                 order_id: order.order_id,
    //                 address_id: address.address_id,
    //                 status: DeliveryStatus.PENDING,
    //                 provider: "Anousith Express"
    //             }
    //         })

    //         /* ------------------ 8. UPDATE STOCK ------------------ */

    //         for (const item of order_details) {
    //             await tx.product.update({
    //                 where: { product_id: item.product_id },
    //                 data: {
    //                     stock_qty: { decrement: item.quantity }
    //                 }
    //             })
    //         }

    //         return {
    //             order,
    //             payment,
    //             delivery
    //         }
    //     })
    // },

    // async createOrder(data: CreateOrderInput) {
    //     return prisma.$transaction(async (tx) => {

    //         if (!data.order_details.length) {
    //             throw new BadRequestError("Order must have at least one item")
    //         }

    //         // 🔍 fetch products (optimize)
    //         const productIds = data.order_details.map(i => i.product_id)

    //         const products = await tx.product.findMany({
    //             where: { product_id: { in: productIds } }
    //         })

    //         const productMap = new Map(
    //             products.map(p => [p.product_id, p])
    //         )

    //         // ✅ check stock
    //         for (const item of data.order_details) {
    //             const product = productMap.get(item.product_id)

    //             if (!product) {
    //                 throw new NotFoundError("Product not found")
    //             }

    //             if (product.stock_qty < item.quantity) {
    //                 throw new BadRequestError("Insufficient stock")
    //             }
    //         }

    //         // 💰 calculate total
    //         const total_amount = data.order_details.reduce(
    //             (acc, item) => acc + item.price * item.quantity,
    //             0
    //         )

    //         const code = generateOrderCode()
    //         // 🧾 create order
    //         const order = await tx.order.create({
    //             data: {
    //                 customer_id: data.customer_id,
    //                 order_code: code ,
    //                 total_amount,
    //                 status: OrderStatus.WAITING_PAYMENT,
    //                 order_details: {
    //                     create: data.order_details
    //                 }
    //             },
    //             include: {
    //                 order_details: true
    //             }
    //         })

    //         // 🔁 deduct stock
    //         for (const item of data.order_details) {
    //             await tx.product.update({
    //                 where: { product_id: item.product_id },
    //                 data: {
    //                     stock_qty: {
    //                         decrement: item.quantity
    //                     }
    //                 }
    //             })
    //         }

    //         return order
    //     })
    // },

    async deleteOrder(id: string) {
        return prisma.$transaction(async (tx) => {

            const existing = await tx.order.findUnique({
                where: { order_id: id },
                include: {
                    payment: true,
                    delivery: true,
                    order_details: true
                }
            })

            if (!existing) {
                throw new NotFoundError("Order not found")
            }

            if (existing.payment) {
                throw new BadRequestError("Cannot delete paid order")
            }

            if (existing.delivery) {
                throw new BadRequestError("Cannot delete order with delivery")
            }

            if (existing.status !== OrderStatus.WAITING_PAYMENT) {
                throw new BadRequestError("Only waiting payment order can be deleted")
            }

            // 🔁 rollback stock
            for (const item of existing.order_details) {
                await tx.product.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock_qty: {
                            increment: item.quantity
                        }
                    }
                })
            }

            await tx.order.delete({
                where: { order_id: id }
            })

            return { message: "Order deleted successfully" }
        })
    }

}