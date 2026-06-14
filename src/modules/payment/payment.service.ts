// modules/payment/payment.service.ts

import { prisma } from "@/lib/prisma"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { CreatePaymentInput, VerifyPaymentInput, Payment } from './payment.type';
import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client"
import { convertFileToBase64, uploadMultipleImages } from "@/utils/cloudinary"

export const paymentService = {
async getPayments(options: Prisma.PaymentFindManyArgs = {}) {
    const {
        where,
        skip = 0,
        take = 10,
        orderBy,
    } = options

    return prisma.payment.findMany({
        where,
        skip,
        take,

        orderBy:
            (orderBy as Prisma.PaymentOrderByWithRelationInput) ?? {
                createdAt: "desc",
            },

        include: {
            order: true,
        },
    })
},

    async getPayment(id: string) {
        const payment = await prisma.payment.findUnique({
            where: { payment_id: id },
            include: {
                order: {
                    include: {
                        customer: true,
                        order_details: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        })

        if (!payment) {
            throw new NotFoundError("Payment not found")
        }

        return payment
    },

    // async createPayment(data: CreatePaymentInput) {
    //     return prisma.$transaction(async (tx) => {
    //         const order = await tx.order.findUnique({
    //             where: { order_id: data.order_id }
    //         })
    //         if (!order) {
    //             throw new NotFoundError("Order not found")
    //         }
    //         if (order.status !== "WAITING_PAYMENT") {
    //             throw new BadRequestError("Order is not waiting for payment")
    //         }
    //         const existingPayment = await tx.payment.findUnique({
    //             where: { order_id: data.order_id }
    //         })
    //         if (existingPayment) {
    //             throw new BadRequestError("Payment already exists for this order")
    //         }

    //         const payment = await tx.payment.create({
    //             data: {
    //                 order_id: data.order_id,
    //                 amount: data.amount,
    //                 method: data.method,
    //                 slip_url: data.slip_url,
    //                 public_id: data.public_id,
    //                 status: "PENDING"
    //             }
    //         })

    //         return payment
    //     })
    // },

    async createPayment(data: CreatePaymentInput) {
        return prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { order_id: data.order_id }
            })
            if (!order) {
                throw new NotFoundError("Order not found")
            }
            if (order.status !== OrderStatus.WAITING_PAYMENT) {
                throw new BadRequestError("Order is not waiting for payment")
            }
            const existingPayment = await tx.payment.findUnique({
                where: { order_id: data.order_id }
            })

            if (existingPayment) {
                throw new BadRequestError("Payment already exists")
            }

            // 🔥 upload slip
            let slip_url: string | undefined
            let public_id: string | undefined

            if (data.file) {
                const base64 = await convertFileToBase64(data.file)
                const uploaded = await uploadMultipleImages([base64], "payments")
                slip_url = uploaded[0]?.url
                public_id = uploaded[0]?.publicId
            }

            const payment = await tx.payment.create({
                data: {
                    order_id: data.order_id,
                    method: data.method as PaymentMethod,
                    amount: data.amount,
                    slip_url,
                    public_id,
                    status: PaymentStatus.PENDING
                }
            })

            return payment
        })
    },

    async verifyPayment(data: VerifyPaymentInput, employeeId: string, id: string) {
        return prisma.$transaction(async (tx) => {
            const payment = await tx.payment.findUnique({
                where: { payment_id: id }
            })
            if (!payment) {
                throw new NotFoundError("Payment not found")
            }
            if (payment.status !== PaymentStatus.PENDING) {
                throw new BadRequestError("Payment already processed")
            }
            const updatedPayment = await tx.payment.update({
                where: { payment_id: id },
                data: {
                    status: data.status,
                    verified_by: employeeId,
                    verified_at: new Date()
                }
            })

            // 🔥 ถ้า verified → update order
            if (data.status === PaymentStatus.VERIFIED) {
                await tx.order.update({
                    where: { order_id: payment.order_id },
                    data: {
                        status: OrderStatus.PAID
                    }
                })
            }
            return updatedPayment
        })
    },

    async deletePayment(id: string) {
        const payment = await prisma.payment.findUnique({
            where: { payment_id: id }
        })

        if (!payment) {
            throw new NotFoundError("Payment not found")
        }

        if (payment.status === PaymentStatus.VERIFIED) {
            throw new BadRequestError("Cannot delete verified payment")
        }

        await prisma.payment.delete({
            where: { payment_id: id }
        })
        return { message: "Payment deleted" }
    }

}