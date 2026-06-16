

import { prisma } from "@/lib/prisma"
import { Prisma, PurchaseOrderStatus } from "@prisma/client"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { CreatePurchaseOrderInput, PurchasePaymentSummary, UpdatePurchaseOrderInput } from "./purchase.type"
import { generatePurchaseCode } from "@/utils/generateCode"
function calcActualTotal(
    details: { quantity: number; received_qty: number; price: number }[]
): { ordered_total: number; actual_total: number } {
    return details.reduce(
        (acc, d) => ({
            ordered_total: acc.ordered_total + d.quantity * d.price,
            actual_total: acc.actual_total + d.received_qty * d.price,
        }),
        { ordered_total: 0, actual_total: 0 }
    );
}

export const purchaseService = {
    async getPurchases(options: Prisma.PurchaseOrderFindManyArgs = {}) {
        const {
            where,
            skip = 0,
            take = 10,
            orderBy,
            include,
        } = options

        return prisma.purchaseOrder.findMany({
            where,
            skip,
            take,

            orderBy:
                (orderBy as Prisma.PurchaseOrderOrderByWithRelationInput) ?? {
                    createdAt: "desc",
                },

            include: {
                supplier: true,
                employee: true,
                purchase_details: {
                    include: {
                        product: true,
                    },
                },

                // allow override if needed
                ...(include ?? {}),
            },
        })
    },

    async getAllPurchases() {
        return prisma.purchaseOrder.findMany({
            include: {
                supplier: true,
                employee: true,
                purchase_details: {
                    include: {
                        product: true,
                    },
                },
                import: true
            },
        })
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



    // async createPurchase(data: CreatePurchaseOrderInput, userId: string) {
    //     return prisma.$transaction(async (tx) => {
    //         if (!data.purchase_details.length) {
    //             throw new BadRequestError("Purchase must have at least one item")
    //         }
    //         const total = data.purchase_details.reduce((sum, item) => sum + item.price * item.quantity, 0)

    //         const code = generatePurchaseCode()
    //         const purchase = await tx.purchaseOrder.create({
    //             data: {
    //                 supplier_id: data.supplier_id,
    //                 purchase_code: code,
    //                 employee_id: userId,
    //                 purchase_date: new Date(),
    //                 total_amount: total,
    //                 status: "pending",
    //                 purchase_details: {
    //                     create: data.purchase_details
    //                 }
    //             },
    //             include: { purchase_details: true }
    //         })
    //         if (!purchase) {
    //             throw new NotFoundError("Failed to create purchase")
    //         }
    //         return purchase
    //     })
    // },


    async createPurchase(data: CreatePurchaseOrderInput, userId: string) {
        return prisma.$transaction(async (tx) => {

            if (!data.purchase_details.length) {
                throw new BadRequestError(
                    "Purchase must have at least one item"
                );
            }

            // ❗ แยกเป็น estimated cost เท่านั้น
            const estimated_total = data.purchase_details.reduce(
                (sum, item) => sum + item.price * item.quantity, 0
            );

            const code = generatePurchaseCode();

            const purchase = await tx.purchaseOrder.create({
                data: {
                    supplier_id: data.supplier_id,
                    purchase_code: code,
                    employee_id: userId,
                    purchase_date: new Date(),

                    // 🔥 เปลี่ยนเป็น estimated เท่านั้น
                    total_amount: estimated_total,

                    // 🔥 payment ยังไม่เกิด
                    paid_amount: 0,
                    payment_status: PurchaseOrderStatus.UNPAID,

                    status: PurchaseOrderStatus.PENDING,

                    purchase_details: {
                        create: data.purchase_details
                    }
                },
                include: {
                    purchase_details: true
                }
            });

            if (!purchase) {
                throw new BadRequestError(
                    "Failed to create purchase"
                );
            }

            return purchase;
        });
    },

    // async updatePurchase(id: string, data: UpdatePurchaseOrderInput) {
    //     return prisma.$transaction(async (tx) => {
    //         const existing = await tx.purchaseOrder.findUnique({
    //             where: { purchase_id: id },
    //             include: {
    //                 imports: true,
    //                 purchase_details: true
    //             }
    //         })

    //         if (!existing) {
    //             throw new NotFoundError("Purchase not found")
    //         }


    //         if (existing.status !== "pending") {
    //             throw new BadRequestError("Only pending purchase can be updated")
    //         }

    //         // ✅ validation
    //         if (!data.purchase_details || data.purchase_details.length === 0) {
    //             throw new BadRequestError("Purchase must have at least one item")
    //         }

    //         if (data.purchase_details.some(item => item.quantity <= 0)) {
    //             throw new BadRequestError("Invalid quantity")
    //         }

    //         // ✅ check supplier
    //         const supplier = await tx.supplier.findUnique({
    //             where: { supplier_id: data.supplier_id }
    //         })

    //         if (!supplier) {
    //             throw new NotFoundError("Supplier not found")
    //         }

    //         // ✅ calculate total (สำคัญมาก)
    //         const total = data.purchase_details.reduce((sum, item) => sum + item.price * item.quantity, 0)

    //         // 🧨 delete old details
    //         await tx.purchaseDetail.deleteMany({
    //             where: { purchase_id: id }
    //         })

    //         // 🔁 update
    //         const purchase = await tx.purchaseOrder.update({
    //             where: { purchase_id: id },
    //             data: {
    //                 supplier_id: data.supplier_id,
    //                 employee_id: existing.employee_id, // ✅ fix
    //                 total_amount: total,               // ✅ fix
    //                 purchase_details: {
    //                     create: data.purchase_details
    //                 }
    //             },
    //             include: {
    //                 purchase_details: true
    //             }
    //         });
    //         if (!purchase) {
    //             throw new BadRequestError("Failed to update purchase")
    //         }
    //         return purchase
    //     })
    // },


    async updatePurchase(
        id: string,
        data: UpdatePurchaseOrderInput
    ) {
        return prisma.$transaction(async (tx) => {

            const existing = await tx.purchaseOrder.findUnique({
                where: { purchase_id: id },
                include: {
                    import: true,
                    purchase_details: true
                }
            });

            if (!existing) {
                throw new NotFoundError("Purchase not found");
            }

            if (existing.status !== PurchaseOrderStatus.PENDING) {
                throw new BadRequestError(
                    "Only pending purchase can be updated"
                );
            }

            // validation
            if (
                !data.purchase_details ||
                data.purchase_details.length === 0
            ) {
                throw new BadRequestError(
                    "Purchase must have at least one item"
                );
            }

            if (
                data.purchase_details.some(
                    item => item.quantity <= 0
                )
            ) {
                throw new BadRequestError("Invalid quantity");
            }

            // check supplier
            const supplier = await tx.supplier.findUnique({
                where: { supplier_id: data.supplier_id }
            });

            if (!supplier) {
                throw new NotFoundError("Supplier not found");
            }

            // calculate estimated total
            const total = data.purchase_details.reduce(
                (sum, item) =>
                    sum + item.price * item.quantity,
                0
            );

            // ❗ safer than deleteMany (soft reset logic)
            await tx.purchaseDetail.deleteMany({
                where: { purchase_id: id }
            });

            const purchase = await tx.purchaseOrder.update({
                where: { purchase_id: id },
                data: {
                    supplier_id: data.supplier_id,
                    employee_id: existing.employee_id,
                    total_amount: total,
                    status: PurchaseOrderStatus.PENDING,
                    purchase_details: {
                        create: data.purchase_details
                    }
                },
                include: {
                    purchase_details: true
                }
            });

            if (!purchase) {
                throw new BadRequestError(
                    "Failed to update purchase"
                );
            }

            return purchase;
        });
    },

    async createPurchasePayment(id: string) {
        return prisma.$transaction(async (tx) => {

            const purchase = await tx.purchaseOrder.findUnique({
                where: { purchase_id: id },
                include: {
                    purchase_details: true,
                    import: true,
                },
            });

            if (!purchase) {
                throw new NotFoundError("Purchase not found");
            }

            if (purchase.status === PurchaseOrderStatus.PENDING) {
                throw new BadRequestError(
                    "Cannot pay — goods have not been received yet (status: PENDING)"
                );
            }

            if (purchase.payment_status === PurchaseOrderStatus.PAID) {
                throw new BadRequestError("This purchase is already fully paid");
            }

            if (!purchase.import) {
                throw new BadRequestError(
                    "No import record found for this purchase"
                );
            }

            const { ordered_total, actual_total } = calcActualTotal(
                purchase.purchase_details
            );

            const alreadyPaid = purchase.paid_amount ?? 0;
            const remaining = actual_total - alreadyPaid;

            if (remaining <= 0) {
                throw new BadRequestError("No remaining balance to pay");
            }

            // ✅ จ่ายครบตามรับจริงทั้งหมด
            const newPaidAmount = actual_total;
            const newPaymentStatus = PurchaseOrderStatus.PAID;

            const updated = await tx.purchaseOrder.update({
                where: { purchase_id: id },
                data: {
                    paid_amount: newPaidAmount,
                    payment_status: newPaymentStatus,
                },
                include: {
                    supplier: true,
                    employee: true,
                    purchase_details: true,
                    import: true,
                },
            });

            const summary: PurchasePaymentSummary = {
                purchase_id: updated.purchase_id,
                purchase_code: updated.purchase_code,
                ordered_total,
                actual_total,
                paid_amount: updated.paid_amount,
                remaining: 0,  // ✅ จ่ายครบแล้วเสมอ
                payment_status: updated.payment_status,
                items: purchase.purchase_details.map((d) => ({
                    product_id: d.product_id,
                    ordered_qty: d.quantity,
                    received_qty: d.received_qty,
                    price: d.price,
                    ordered_cost: d.quantity * d.price,
                    received_cost: d.received_qty * d.price,
                })),
            };

            return { purchase: updated, summary };
        });
    },

    // ================= GET PAYMENT SUMMARY =================

    async getPurchasePaymentSummary(
        purchaseId: string
    ): Promise<PurchasePaymentSummary> {

        const purchase = await prisma.purchaseOrder.findUnique({
            where: { purchase_id: purchaseId },
            include: { purchase_details: true, import: true },
        });

        if (!purchase) throw new NotFoundError("Purchase not found");

        const { ordered_total, actual_total } = calcActualTotal(
            purchase.purchase_details
        );

        const paid = purchase.paid_amount ?? 0;
        const remaining = actual_total - paid;

        return {
            purchase_id: purchase.purchase_id,
            purchase_code: purchase.purchase_code,
            ordered_total,
            actual_total,
            paid_amount: paid,
            remaining,
            payment_status: purchase.payment_status,
            items: purchase.purchase_details.map((d) => ({
                product_id: d.product_id,
                ordered_qty: d.quantity,
                received_qty: d.received_qty,
                price: d.price,
                ordered_cost: d.quantity * d.price,
                received_cost: d.received_qty * d.price,
            })),
        };
    },

    // ================= RESET PAYMENT (Admin) =================

    async resetPurchasePayment(purchaseId: string) {
        return prisma.$transaction(async (tx) => {

            const purchase = await tx.purchaseOrder.findUnique({
                where: { purchase_id: purchaseId },
            });

            if (!purchase) throw new NotFoundError("Purchase not found");

            if (
                purchase.payment_status === PurchaseOrderStatus.UNPAID &&
                purchase.paid_amount === 0
            ) {
                throw new BadRequestError("Payment is already at zero");
            }

            return tx.purchaseOrder.update({
                where: { purchase_id: purchaseId },
                data: {
                    paid_amount: 0,
                    payment_status: PurchaseOrderStatus.UNPAID,
                },
            });
        });
    },

    // async paymentPurchase()

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
            if (existing.status !== PurchaseOrderStatus.PENDING) {
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