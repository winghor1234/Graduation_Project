

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from "./purchase.type"
import { generatePurchaseCode } from "@/utils/generateCode"

export const purchaseService = {
    async getPurchases(options?: Prisma.PurchaseOrderFindManyArgs) {
        const purchases = await prisma.purchaseOrder.findMany({
            ...options,
            include: {
                supplier: true,
                employee: true,
                purchase_details: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return purchases
    },

    async getPurchase(id: string) {
        const purchase = await prisma.purchaseOrder.findUnique({
            where: { purchase_id: id },
            include: {
                supplier: true,
                employee: true,
                purchase_details: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return purchase
    },



    async createPurchase(data: CreatePurchaseOrderInput, userId: string) {
        return prisma.$transaction(async (tx) => {
            if (!data.purchase_details.length) {
                throw new BadRequestError("Purchase must have at least one item")
            }
            const total = data.purchase_details.reduce((sum, item) => sum + item.price * item.quantity, 0)

            const code = generatePurchaseCode()
            const purchase = await tx.purchaseOrder.create({
                data: {
                    supplier_id: data.supplier_id,
                    purchase_code: code,
                    employee_id: userId,
                    purchase_date: new Date(),
                    total_amount: total,
                    status: "pending",
                    purchase_details: {
                        create: data.purchase_details
                    }
                },
                include: { purchase_details: true }
            })
            if (!purchase) {
                throw new NotFoundError("Failed to create purchase")
            }
            return purchase
        })
    },

    async updatePurchase(id: string, data: UpdatePurchaseOrderInput) {
        return prisma.$transaction(async (tx) => {
            const existing = await tx.purchaseOrder.findUnique({
                where: { purchase_id: id },
                include: {
                    imports: true,
                    purchase_details: true
                }
            })

            if (!existing) {
                throw new NotFoundError("Purchase not found")
            }


            if (existing.status !== "pending") {
                throw new BadRequestError("Only pending purchase can be updated")
            }

            // ✅ validation
            if (!data.purchase_details || data.purchase_details.length === 0) {
                throw new BadRequestError("Purchase must have at least one item")
            }

            if (data.purchase_details.some(item => item.quantity <= 0)) {
                throw new BadRequestError("Invalid quantity")
            }

            // ✅ check supplier
            const supplier = await tx.supplier.findUnique({
                where: { supplier_id: data.supplier_id }
            })

            if (!supplier) {
                throw new NotFoundError("Supplier not found")
            }

            // ✅ calculate total (สำคัญมาก)
            const total = data.purchase_details.reduce((sum, item) => sum + item.price * item.quantity, 0)

            // 🧨 delete old details
            await tx.purchaseDetail.deleteMany({
                where: { purchase_id: id }
            })

            // 🔁 update
            const purchase = await tx.purchaseOrder.update({
                where: { purchase_id: id },
                data: {
                    supplier_id: data.supplier_id,
                    employee_id: existing.employee_id, // ✅ fix
                    total_amount: total,               // ✅ fix
                    purchase_details: {
                        create: data.purchase_details
                    }
                },
                include: {
                    purchase_details: true
                }
            });
            if (!purchase) {
                throw new BadRequestError("Failed to update purchase")
            }
            return purchase
        })
    },

    async deletePurchase(id: string) {
         await prisma.$transaction(async (tx) => {

            // 🔍 1. หา purchase
            const existing = await tx.purchaseOrder.findUnique({
                where: { purchase_id: id },
                include: {
                    import: true
                }
            })

            if (!existing) {
                throw new NotFoundError("Purchase not found")
            }

            // // ❌ 2. ห้ามลบถ้ามี import
            // if (existing.imports.length > 0) {
            //     throw new BadRequestError("Cannot delete purchase with existing imports")
            // }

            // ❌ 3. optional: check status
            if (existing.status !== "pending") {
                throw new BadRequestError("Only pending purchase can be deleted")
            }

            // 🗑️ 4. delete purchase (details จะ cascade)
            await tx.purchaseOrder.delete({
                where: { purchase_id: id }
            })
            return { message: "Purchase deleted successfully" }
        })
    }

}