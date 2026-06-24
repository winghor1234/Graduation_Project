import { prisma } from "@/lib/prisma"
import { PromotionStatus, Prisma } from "@prisma/client"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { CreatePromotionInput, UpdatePromotionInput } from "./promotion.types"
import { generatePromotionCode } from "@/utils/generateCode"

const promotionInclude = {
    promotion_products: { include: { product: { include: { images: true } } } }
} satisfies Prisma.PromotionInclude

export const promotionService = {

    async getPromotions(options: Prisma.PromotionFindManyArgs = {}) {
        const { where, skip = 0, take = 10, orderBy } = options
        return prisma.promotion.findMany({
            where,
            skip,
            take,
            orderBy: (orderBy as Prisma.PromotionOrderByWithRelationInput) ?? { createdAt: "desc" },
            include: promotionInclude,
        })
    },

    async getAllPromotions() {
        // ✅ ດຶງສະເພາະ ACTIVE ທີ່ຍັງໃນຊ່ວງເວລາ — ໃຊ້ໃນ customer side
        return prisma.promotion.findMany({
            where: {
                status: PromotionStatus.ACTIVE,
                start_date: { lte: new Date() },
                end_date: { gte: new Date() },
            },
            include: promotionInclude,
            orderBy: { createdAt: "desc" },
        })
    },

    async getPromotion(id: string) {
        const promo = await prisma.promotion.findUnique({
            where: { promotion_id: id },
            include: promotionInclude,
        })
        if (!promo) throw new NotFoundError("Promotion not found")
        return promo
    },

    async getPromotionByCode(code: string) {
        const promo = await prisma.promotion.findUnique({
            where: { promotion_code: code },
            include: promotionInclude,
        })
        if (!promo) throw new NotFoundError("Promotion code not found")
        if (promo.status !== PromotionStatus.ACTIVE) throw new BadRequestError("Promotion is inactive")
        const now = new Date()
        if (now < promo.start_date) throw new BadRequestError("Promotion has not started yet")
        if (now > promo.end_date) throw new BadRequestError("Promotion has expired")
        return promo
    },

    async createPromotion(data: CreatePromotionInput) {
        const code = generatePromotionCode()
        return prisma.promotion.create({
            data: {
                promotion_code: code,
                promotion_name: data.promotion_name,
                discount_value: data.discount_value,
                start_date: new Date(data.start_date),
                end_date: new Date(data.end_date),
                description: data.description,
                status: PromotionStatus.ACTIVE,
                promotion_products: data.product_ids?.length ? {
                    createMany: {
                        data: data.product_ids.map(product_id => ({ product_id }))
                    }
                } : undefined,
            },
            include: promotionInclude,
        })
    },

    async updatePromotion(id: string, data: UpdatePromotionInput) {
        const existing = await prisma.promotion.findUnique({ where: { promotion_id: id } })
        if (!existing) throw new NotFoundError("Promotion not found")

        return prisma.$transaction(async (tx) => {
            // ✅ ຖ້າ product_ids ໃໝ່ → ລຶບເກົ່າ ແລ້ວສ້າງໃໝ່
            if (data.product_ids !== undefined) {
                await tx.promotionProduct.deleteMany({ where: { promotion_id: id } })
                if (data.product_ids.length) {
                    await tx.promotionProduct.createMany({
                        data: data.product_ids.map(product_id => ({ promotion_id: id, product_id }))
                    })
                }
            }

            return tx.promotion.update({
                where: { promotion_id: id },
                data: {
                    promotion_name: data.promotion_name,
                    discount_value: data.discount_value,
                    start_date: data.start_date ? new Date(data.start_date) : undefined,
                    end_date: data.end_date ? new Date(data.end_date) : undefined,
                    description: data.description,
                },
                include: promotionInclude,
            })
        })
    },

    async toggleStatus(id: string) {
        const existing = await prisma.promotion.findUnique({ where: { promotion_id: id } })
        if (!existing) throw new NotFoundError("Promotion not found")
        return prisma.promotion.update({
            where: { promotion_id: id },
            data: { status: existing.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
        })
    },

    async deletePromotion(id: string) {
        const existing = await prisma.promotion.findUnique({ where: { promotion_id: id } })
        if (!existing) throw new NotFoundError("Promotion not found")
        await prisma.promotion.delete({ where: { promotion_id: id } })
    },
}