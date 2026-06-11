import { prisma } from "@/lib/prisma"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { CreateDeliveryInput, UpdateDeliveryInput } from "./delivery.type"
import { DeliveryStatus, Prisma } from "@prisma/client"
import { generateTrackingCode } from "@/utils/generateCode"

export const deliveryService = {

    async getDeliveries(options?: Prisma.DeliveryFindManyArgs) {
        return prisma.delivery.findMany({
            ...options,
            include: {
                order: true,
                address: {
                    include: {
                        province: true,
                        district: true,
                        branch: true
                    }
                }
            }
        })
    },

    async getDelivery(id: string) {
        return prisma.delivery.findUnique({
            where: { delivery_id: id },
            include: {
                order: true,
                address: {
                    include: {
                        province: true,
                        district: true,
                        branch: true
                    }
                }
            }
        })
    },

    // async createDelivery(data: CreateDeliveryInput) {
    //     return prisma.$transaction(async (tx) => {

    //         const order = await tx.order.findUnique({
    //             where: { order_id: data.order_id },
    //             include: { payment: true }
    //         })

    //         if (!order) throw new NotFoundError("Order not found")

    //         if (order.payment?.status !== PaymentStatus.VERIFIED) {
    //             throw new BadRequestError("Payment required before delivery")
    //         }

    //         const code  = generateTrackingCode()
    //         return tx.delivery.create({
    //             data: {
    //                 order_id: data.order_id,
    //                 address_id: data.address_id,
    //                 tracking_number: code,
    //                 status: DeliveryStatus.PENDING,
    //                 provider: "Anousith Express"
    //             }
    //         })
    //     })
    // },

    async createDelivery(data: CreateDeliveryInput) {
        return prisma.$transaction(async (tx) => {

            // 1. check order
            const order = await tx.order.findUnique({
                where: { order_id: data.order_id },
                include: { payment: true }
            })

            if (!order) throw new Error("Order not found")

            // 2. check payment
            if (order.payment?.status !== "VERIFIED") {
                throw new Error("Payment not verified")
            }

            // 🔥 3. validate location
            const province = await tx.province.findFirst({
                where: {
                    province_id: data.province_id,
                }
            })

            if (!province) throw new Error("Invalid province")

            // 🔥 3. validate location
            const district = await tx.district.findFirst({
                where: {
                    district_id: data.district_id,
                }
            })

            if (!district) throw new Error("Invalid district")

            const branch = await tx.branch.findFirst({
                where: {
                    branch_id: data.branch_id,
                }
            })

            if (!branch) throw new Error("Invalid branch")

            // 🔥 4. upsert address
            const address = await tx.addressBranch.upsert({
                where: {
                    address_unique: {
                        province_id: data.province_id,
                        district_id: data.district_id,
                        branch_id: data.branch_id
                    }
                },
                update: {},
                create: {
                    province_id: data.province_id,
                    district_id: data.district_id,
                    branch_id: data.branch_id
                }
            })

            const code = generateTrackingCode()
            // 5. create delivery
            return tx.delivery.create({
                data: {
                    order_id: data.order_id,
                    address_id: address.address_id,
                    // tracking_number: code,
                    status: "PENDING",
                    provider: "Anousith Express"
                }
            })
        })
    },

    async updateDelivery(id: string, data: UpdateDeliveryInput) {

        const delivery = await prisma.delivery.findUnique({
            where: { delivery_id: id }
        })
        // console.log(data)
        if (!delivery) throw new NotFoundError("Delivery not found")
        // if (data.status === DeliveryStatus.SHIPPED) {
        //     throw new BadRequestError("Tracking number required before shipping")
        // }
        return prisma.delivery.update({
            where: { delivery_id: id },
            data
        })
    }
}