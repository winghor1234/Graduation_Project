import { orderService } from "./order.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import {
    BadRequestError, errorResponse, ForbiddenError,
    NotFoundError, successResponse, UnauthorizedError,
} from "@/utils/response"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { UpdateOrderStatusInput } from "./order.types"

const handleError = (error: unknown) => {
    if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof ForbiddenError ||
        error instanceof UnauthorizedError
    ) {
        return errorResponse(error.message, error.statusCode)
    }
    console.error(error)
    return errorResponse("Internal Server Error", 500)
}

export const orderController = {

    async getOrders(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search  = getSearchParam(req)
            const orderBy = getSortingParams(req)

            const where: Prisma.OrderWhereInput = search
                ? {
                    OR: [
                        { customer: { customer_name: { contains: search, mode: "insensitive" } } },
                        { order_code: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {}

            const [orders, total] = await Promise.all([
                orderService.getOrders({ where, skip, take: limit, orderBy }),
                prisma.order.count({ where }),
            ])

            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: orders, meta }, "Get orders successfully", 200)
        } catch (error) {
            return handleError(error)   // ✅ ແກ້ — ກ່ອນບໍ່ມີ fallback return
        }
    },

    async getAllOrders(req: NextRequest) {
        try {
            const orders = await orderService.getAllOrders()  // ✅ ແກ້ typo
            return successResponse(orders, "Get all orders successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async getOrder(id: string) {
        try {
            const order = await orderService.getOrder(id)
            return successResponse(order, "Get order successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async createOrder(req: NextRequest) {
        try {
            const formData = await req.formData()
            const order = await orderService.createOrder(formData)
            return successResponse(order, "Create order successfully", 201)
        } catch (error) {
            return handleError(error)
        }
    },

    // ✅ ໃໝ່ — update order status
    async updateOrderStatus(req: NextRequest, id: string) {
        try {
            const body: UpdateOrderStatusInput = await req.json()
            const order = await orderService.updateOrderStatus(id, body.status)
            return successResponse(order, "Update order status successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    // ✅ ໃໝ່ — re-upload payment slip
    async uploadPaymentSlip(req: NextRequest, id: string) {
        try {
            const formData = await req.formData()
            const file = formData.get("file") as File | null

            if (!file) throw new BadRequestError("file is required")

            const payment = await orderService.uploadPaymentSlip(id, file)
            return successResponse(payment, "Upload payment slip successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async deleteOrder(id: string) {
        try {
            await orderService.deleteOrder(id)
            return successResponse(null, "Delete order successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },
}