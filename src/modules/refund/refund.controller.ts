// import { getPaginationMeta, getPaginationParams } from "@/utils/pagination"
// import { getSearchParam } from "@/utils/search"
// import { getSortingParams } from "@/utils/sorting"
// import { Prisma } from "@prisma/client"
// import { NextRequest } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"
// import { refundService } from "./refund.service"

// export const refundController = {
//     async getRefunds(req: NextRequest) {
//         try {
//             const { page, limit, skip } = getPaginationParams(req)
//             const search = getSearchParam(req)
//             const orderBy = getSortingParams(req)
//             const where: Prisma.RefundWhereInput = search
//                 ? {
//                     sale: {
//                         sale_id: {
//                             contains: search,
//                             mode: "insensitive"
//                         }
//                     }
//                 }
//                 : {}
//             const [refund, total] = await Promise.all([
//                 refundService.getRefunds({
//                     where,
//                     skip,
//                     take: limit,
//                     orderBy
//                 }),
//                 prisma.refund.count({ where })
//             ])
//             const meta = getPaginationMeta(total, page, limit)
//             return successResponse({ data: refund, meta }, "Get refunds successfully", 200)
//         } catch (error) {
//             console.log(error)
//             if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//                 return errorResponse(error.message, error.statusCode);
//             }

//         }

//     },
//     async getRefund(id: string) {
//         try {
//             const refund = await refundService.getRefund(id)
//             return successResponse(refund, "Get refund successfully", 200)
//         } catch (error) {
//             console.log(error)
//             if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//                 return errorResponse(error.message, error.statusCode);
//             }
//             return errorResponse("Internal Server Error", 500)
//         }
//     },

//     async createRefund(req: NextRequest) {
//         try {
//             const body = await req.json()
//             const refund = await refundService.createRefund(body)
//             return successResponse(refund, "Create refund successfully", 201)
//         } catch (error) {
//             console.log(error)
//             if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//                 return errorResponse(error.message, error.statusCode);
//             }
//             return errorResponse("Internal Server Error", 500)
//         }
//     }

// }

import { refundService } from "./refund.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import {
    BadRequestError, errorResponse, ForbiddenError,
    NotFoundError, successResponse, UnauthorizedError,
} from "@/utils/response"
import { CreateRefundInput } from "./refund.type"

const handleError = (error: unknown) => {
    if (
        error instanceof BadRequestError  ||
        error instanceof NotFoundError    ||
        error instanceof ForbiddenError   ||
        error instanceof UnauthorizedError
    ) {
        return errorResponse(error.message, error.statusCode)
    }
    console.error(error)
    return errorResponse("Internal Server Error", 500)
}

export const refundController = {

    async getRefunds(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search  = getSearchParam(req)
            const orderBy = getSortingParams(req)

            const where: Prisma.RefundWhereInput = search
                ? {
                    OR: [
                        { refund_code: { contains: search, mode: "insensitive" } },
                        { sale: { customer: { customer_name: { contains: search, mode: "insensitive" } } } },
                    ],
                }
                : {}

            const [refunds, total] = await Promise.all([
                refundService.getRefunds({ where, skip, take: limit, orderBy }),
                prisma.refund.count({ where }),
            ])

            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: refunds, meta }, "Get refunds successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async getRefund(id: string) {
        try {
            const refund = await refundService.getRefund(id)
            return successResponse(refund, "Get refund successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async createRefund(req: NextRequest) {
        try {
            const body: CreateRefundInput = await req.json()
            const refund = await refundService.createRefund(body)
            return successResponse(refund, "Create refund successfully", 201)
        } catch (error) {
            return handleError(error)
        }
    },

    async deleteRefund(id: string) {
        try {
            await refundService.deleteRefund(id)
            return successResponse(null, "Delete refund successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },
}