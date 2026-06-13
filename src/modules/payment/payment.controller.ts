// modules/payment/payment.controller.ts

import { NextRequest } from "next/server"
import { successResponse, errorResponse, BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError } from "@/utils/response"
import { paymentService } from "./payment.service"
import { getPaginationMeta, getPaginationParams } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/utils/cookie"

export const paymentController = {

    async getPayments(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            // const where: Prisma.PaymentWhereInput = search
            //     ? {
            //         amount: {
            //             contains: search,
            //             mode: "insensitive"
            //         }
            //     }
            //     : {}
            const where: Prisma.PaymentWhereInput = search
                ? {
                    amount: Number(search)
                }
                : {}
            const [payments, total] = await Promise.all([
                paymentService.getPayments({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.payment.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: payments, meta }, "Get payments successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)


        }

    },

    async getPayment(id: string) {
        try {
            const payment = await paymentService.getPayment(id)
            return successResponse(payment, "Get payment successfully", 200)
        } catch (error) {
            console.log(error)

            if (
                error instanceof BadRequestError ||
                error instanceof NotFoundError ||
                error instanceof UnauthorizedError ||
                error instanceof ForbiddenError
            ) {
                return errorResponse(error.message, error.statusCode)
            }

            return errorResponse("Internal Server Error", 500)
        }
    },

    async createPayment(req: NextRequest) {
        try {
            const fd = await req.formData()
            const body = {
                order_id: fd.get("order_id") as string,
                amount: Number(fd.get("amount")),
                method: fd.get("method") as string,
                file: fd.get("slip") as File
            }
            const payment = await paymentService.createPayment(body)
            return successResponse(payment, "Payment created successfully", 201)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async verifyPayment(req: NextRequest, id: string) {
        try {
            const body = await req.json()
            const payload = getUserFromToken(req)
            const employeeId = (await payload).id
            const payment = await paymentService.verifyPayment(body, employeeId, id)
            return successResponse(payment, "Payment verified", 200)
        } catch (error) {
            console.log(error)
            if (
                error instanceof BadRequestError ||
                error instanceof NotFoundError ||
                error instanceof ForbiddenError ||
                error instanceof UnauthorizedError
            ) {
                return errorResponse(error.message, error.statusCode)
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async deletePayment(id: string) {
        try {
            const result = await paymentService.deletePayment(id)
            return successResponse(result, "Delete payment success", 200)
        } catch (error) {
            console.log(error)

            if (
                error instanceof BadRequestError ||
                error instanceof NotFoundError
            ) {
                return errorResponse(error.message, error.statusCode)
            }

            return errorResponse("Internal Server Error", 500)
        }
    }

}