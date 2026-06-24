import { promotionService } from "./promotion.service"
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
import { CreatePromotionInput, UpdatePromotionInput } from "./promotion.types"

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

export const promotionController = {

    async getPromotions(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)

            const where: Prisma.PromotionWhereInput = search
                ? {
                    OR: [
                        { promotion_name: { contains: search, mode: "insensitive" } },
                        { promotion_code: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {}

            const [promotions, total] = await Promise.all([
                promotionService.getPromotions({ where, skip, take: limit, orderBy }),
                prisma.promotion.count({ where }),
            ])

            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: promotions, meta }, "Get promotions successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async getAllPromotions() {
        try {
            const promotions = await promotionService.getAllPromotions()
            return successResponse(promotions, "Get all active promotions successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async getPromotion(id: string) {
        try {
            const promotion = await promotionService.getPromotion(id)
            return successResponse(promotion, "Get promotion successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async getPromotionByCode(req: NextRequest) {
        try {
            const { searchParams } = req.nextUrl
            const code = searchParams.get("code")
            if (!code) throw new BadRequestError("code is required")
            const promotion = await promotionService.getPromotionByCode(code)
            return successResponse(promotion, "Get promotion successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async createPromotion(req: NextRequest) {
        try {
            const body: CreatePromotionInput = await req.json()
            const promotion = await promotionService.createPromotion(body)
            return successResponse(promotion, "Create promotion successfully", 201)
        } catch (error) {
            return handleError(error)
        }
    },

    async updatePromotion(req: NextRequest, id: string) {
        try {
            const body: UpdatePromotionInput = await req.json()
            const promotion = await promotionService.updatePromotion(id, body)
            return successResponse(promotion, "Update promotion successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async toggleStatus(id: string) {
        try {
            const promotion = await promotionService.toggleStatus(id)
            return successResponse(promotion, "Toggle status successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async deletePromotion(id: string) {
        try {
            await promotionService.deletePromotion(id)
            return successResponse(null, "Delete promotion successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },
}