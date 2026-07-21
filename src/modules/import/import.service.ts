
import { prisma } from "@/lib/prisma"
import { ImportStatus, Prisma, PurchaseOrderStatus } from "@prisma/client"
import { CreateImportInput } from "./import.type"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { generateImportCode } from "@/utils/generateCode"

export const importService = {

    async getImports(options: Prisma.ImportFindManyArgs = {}) {
        const {
            where,
            skip = 0,
            take = 10,
            orderBy,
        } = options

        return prisma.import.findMany({
            where,
            skip,
            take,

            orderBy:
                (orderBy as Prisma.ImportOrderByWithRelationInput) ?? {
                    createdAt: "desc",
                },

            include: {
                employee: true,

                purchase: {
                    include: {
                        supplier: true,

                        purchase_details: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },

                import_details: {
                    include: {
                        product: true,
                    },
                },
            },
        })
    },

    async getImport(id: string) {
        const record = await prisma.import.findUnique({
            where: { import_id: id },
            include: {
                employee: true,
                purchase: {
                    include: {
                        purchase_details: true
                    }
                },
                import_details: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return record
    },

    // async createImport(data: CreateImportInput, employeeId: string) {
    //     return prisma.$transaction(async (tx) => {
    //         // 🔍 1. หา purchase
    //         const purchase = await tx.purchaseOrder.findUnique({
    //             where: { purchase_id: data.purchase_id },
    //             include: {
    //                 purchase_details: true
    //             }
    //         })

    //         if (!purchase) {
    //             throw new NotFoundError("Purchase not found")
    //         }

    //         if (purchase.status !== "pending") {
    //             throw new BadRequestError("Only pending purchase can be imported")
    //         }

    //         // 🔍 map purchase detail
    //         const detailMap = new Map(purchase.purchase_details.map(d => [d.product_id, d]))


    //         // ✅ 2. validate import
    //         for (const item of data.import_details) {
    //             const purchaseDetail = detailMap.get(item.product_id)

    //             if (!purchaseDetail) {
    //                 throw new NotFoundError("Product not in purchase")
    //             }

    //             const remaining = purchaseDetail.quantity - purchaseDetail.received_qty

    //             if (item.quantity > remaining) {
    //                 throw new BadRequestError(
    //                     `Import quantity exceeds remaining for product`
    //                 )
    //             }
    //         }

    //         // 🧾 3. create import
    //         const code = generateImportCode()
    //         const newImport = await tx.import.create({
    //             data: {
    //                 purchase_id: data.purchase_id,
    //                 employee_id: employeeId,
    //                 import_code: code,
    //                 import_details: {
    //                     create: data.import_details
    //                 }
    //             },
    //             include: { import_details: true }
    //         })

    //         // 🔁 4. update purchase_detail + product stock
    //         for (const item of data.import_details) {

    //             // update received_qty
    //             await tx.purchaseDetail.updateMany({
    //                 where: {
    //                     purchase_id: data.purchase_id,
    //                     product_id: item.product_id
    //                 },
    //                 data: {
    //                     received_qty: {
    //                         increment: item.quantity
    //                     }
    //                 }
    //             })

    //             // update stock
    //             await tx.product.update({
    //                 where: { product_id: item.product_id },
    //                 data: {
    //                     stock_qty: {
    //                         increment: item.quantity
    //                     }
    //                 }
    //             })
    //         }

    //         // ✅ 5. check if completed
    //         const updatedDetails = await tx.purchaseDetail.findMany({
    //             where: { purchase_id: data.purchase_id }
    //         })

    //         const isCompleted = updatedDetails.every(
    //             d => (d.received_qty ?? 0) <= d.quantity
    //         )

    //         if (isCompleted) {
    //             await tx.purchaseOrder.update({
    //                 where: { purchase_id: data.purchase_id },
    //                 data: { status: "completed" }
    //             })
    //         }
    //         if (!newImport) {
    //             throw new BadRequestError("Failed to create import")
    //         }

    //         return newImport
    //     })
    // },

    async createImport(
        data: CreateImportInput,
        employeeId: string
    ) {
        console.log("data : ", data)
        return prisma.$transaction(async (tx) => {

            const purchase = await tx.purchaseOrder.findUnique({
                where: { purchase_id: data.purchase_id },
                include: {
                    purchase_details: true,
                    import: true
                }
            });

            if (!purchase) {
                throw new NotFoundError("Purchase not found");
            }
            

            // ❗ 1 Import only
            if (purchase.import) {
                throw new BadRequestError(
                    "This purchase already has an import"
                );
            }
            
            if (purchase.status !== PurchaseOrderStatus.PENDING) {
                throw new BadRequestError(
                    "Only pending purchase can be imported"
                );
            }
            
            // ✅ key ດ້ວຍ variant_id — ບໍ່ແມ່ນ product_id, ເພາະ 1 ອໍເດີ້ອາດມີສິນຄ້າດຽວກັນຫຼາຍ variant (ສີ/ໄຊສ໌)
            const detailMap = new Map(
                purchase.purchase_details.map(d => [
                    d.variant_id,
                    d
                ])
            );

            // ✅ validate (ALLOW ANY QUANTITY <= or flexible)
            for (const item of data.import_details) {

                const purchaseDetail = detailMap.get(item.variant_id);

                if (!purchaseDetail || purchaseDetail.product_id !== item.product_id) {
                    throw new NotFoundError(
                        "Product not in purchase"
                    );
                }

                // ❗ allow partial (important)
                if (item.quantity > purchaseDetail.quantity) {
                    throw new BadRequestError(
                        "Import exceeds ordered quantity"
                    );
                }
            }

            const newImport = await tx.import.create({
                data: {
                    purchase_id: data.purchase_id,
                    employee_id: employeeId,
                    import_code: generateImportCode(),
                    import_details: {
                        createMany: {
                            data: data.import_details.map(d => ({
                                product_id: d.product_id,
                                variant_id: d.variant_id,
                                quantity: d.quantity,
                                cost_price: d.cost_price,
                            }))
                        }
                    }
                },
                include: {
                    import_details: true
                }
            });

            // 🔁 update stock + received_qty
            for (const item of data.import_details) {

                // ✅ ຕ້ອງ match ດ້ວຍ variant_id ນຳ — ບໍ່ດັ່ງນັ້ນ product ດຽວກັນທີ່ມີຫຼາຍ variant
                // ໃນອໍເດີ້ດຽວກັນຈະຖືກຂຽນທັບ received_qty ຂອງກັນແລະກັນ
                await tx.purchaseDetail.updateMany({
                    where: {
                        purchase_id: data.purchase_id,
                        variant_id: item.variant_id
                    },
                    data: {
                        received_qty: item.quantity
                    }
                });

                await tx.productVariant.update({
                    where: { variant_id: item.variant_id },
                    data: {
                        stock_qty: { increment: item.quantity }
                    }
                })
            }

            // 🔥 IMPORTANT CHANGE HERE
            // 👉 ALWAYS COMPLETE AFTER IMPORT (1 TIME ONLY)

            await tx.purchaseOrder.update({
                where: {
                    purchase_id: data.purchase_id
                },
                data: {
                    status: PurchaseOrderStatus.COMPLETED
                }
            });

            return newImport;
        });
    },


    // ─── Confirm (PENDING → COMPLETED) ────────────────────
    // ✅ ອະນຸຍາດແກ້ໄຂ "ຈຳນວນທີ່ໄດ້ຮັບຕົວຈິງ" ຕອນຢືນຢັນ — ຖ້າຕ່າງຈາກຕອນສ້າງ import
    async confirmImport(id: string, updates?: { import_detail_id: string; quantity: number }[]) {
        return prisma.$transaction(async (tx) => {

            const existing = await tx.import.findUnique({
                where: { import_id: id },
                include: { import_details: true }
            })
            if (!existing) throw new NotFoundError("Import not found")

            if (existing.status !== ImportStatus.PENDING)
                throw new BadRequestError("Only PENDING import can be confirmed")

            if (updates?.length) {
                const updateMap = new Map(updates.map(u => [u.import_detail_id, u.quantity]))

                for (const detail of existing.import_details) {
                    const newQty = updateMap.get(detail.import_detail_id)
                    if (newQty === undefined || newQty === detail.quantity) continue

                    if (newQty < 0) throw new BadRequestError("ຈຳນວນຕ້ອງບໍ່ຕິດລົບ")

                    // ✅ ຕ້ອງປັບ stock ຕາມ "ຄວາມແຕກຕ່າງ" — ບໍ່ແມ່ນຕັ້ງໃໝ່ໝົດ ເພາະ stock ຖືກເພີ່ມແລ້ວຕອນສ້າງ import
                    const diff = newQty - detail.quantity

                    await tx.importDetail.update({
                        where: { import_detail_id: detail.import_detail_id },
                        data: { quantity: newQty }
                    })

                    await tx.productVariant.update({
                        where: { variant_id: detail.variant_id },
                        data: { stock_qty: { increment: diff } }
                    })

                    // ✅ sync received_qty ໃນ PurchaseDetail ໃຫ້ກົງກັບຈຳນວນທີ່ຢືນຢັນ — ຜົນຕໍ່ payment calculation
                    await tx.purchaseDetail.updateMany({
                        where: { purchase_id: existing.purchase_id, variant_id: detail.variant_id },
                        data: { received_qty: newQty }
                    })
                }
            }

            // ✅ PENDING → COMPLETED
            return tx.import.update({
                where: { import_id: id },
                data: { status: ImportStatus.COMPLETED },
                include: { import_details: true }
            })
        })
    },

    // ─── Cancel (PENDING → CANCELLED) ─────────────────────
    async cancelImport(id: string) {
        return prisma.$transaction(async (tx) => {

            const existing = await tx.import.findUnique({
                where: { import_id: id },
                include: { import_details: true }
            })
            if (!existing) throw new NotFoundError("Import not found")

            if (existing.status !== ImportStatus.PENDING)
                throw new BadRequestError("Only PENDING import can be cancelled")

            // ✅ Rollback stock — stock -= qty
            for (const item of existing.import_details) {
                await tx.productVariant.update({
                    where: { variant_id: item.variant_id },
                    data: { stock_qty: { decrement: item.quantity } }
                })

                // ✅ reset received_qty — ບໍ່ດັ່ງນັ້ນ payment summary ຈະຄິດຈາກ import ທີ່ຍົກເລີກໄປແລ້ວ
                await tx.purchaseDetail.updateMany({
                    where: { purchase_id: existing.purchase_id, variant_id: item.variant_id },
                    data:  { received_qty: 0 }
                })
            }

            // ✅ purchase → PENDING ຄືນ (ສ້າງ import ໃໝ່ໄດ້)
            await tx.purchaseOrder.update({
                where: { purchase_id: existing.purchase_id },
                data: { status: PurchaseOrderStatus.PENDING }
            })

            // ✅ import → CANCELLED
            return tx.import.update({
                where: { import_id: id },
                data: { status: ImportStatus.CANCELLED }
            })
        })
    },

    // ─── Delete (CANCELLED only) ───────────────────────────
    async deleteImport(id: string) {
        return prisma.$transaction(async (tx) => {

            const existing = await tx.import.findUnique({
                where: { import_id: id }
            })
            if (!existing) throw new NotFoundError("Import not found")

            // ✅ ລຶບໄດ້ສະເພາະ CANCELLED
            // (stock ຖືກ rollback ຕອນ cancel ແລ້ວ)
            if (existing.status !== ImportStatus.CANCELLED)
                throw new BadRequestError(
                    "Must cancel import before deleting. (cancel will rollback stock)"
                )

            // cascade ລຶບ import_details ອັດຕະໂນມັດ
            await tx.import.delete({ where: { import_id: id } })
        })
    }

    // async deleteImport(id: string) {
    //     return prisma.$transaction(async (tx) => {

    //         // 🔍 1. หา import
    //         const existing = await tx.import.findUnique({
    //             where: { import_id: id },
    //             include: {
    //                 import_details: true,
    //                 purchase: true
    //             }
    //         })

    //         if (!existing) {
    //             throw new NotFoundError("Import not found")
    //         }

    //         // ❗ optional: ห้ามลบถ้า purchase completed แล้ว
    //         if (existing.purchase.status === PurchaseOrderStatus.COMPLETED) {
    //             throw new BadRequestError("Cannot delete import from completed purchase")
    //         }

    //         // 🔁 2. rollback stock + received_qty
    //         for (const item of existing.import_details) {

    //             // ลด received_qty
    //             await tx.purchaseDetail.updateMany({
    //                 where: {
    //                     purchase_id: existing.purchase_id,
    //                     product_id: item.product_id
    //                 },
    //                 data: {
    //                     received_qty: {
    //                         decrement: item.quantity
    //                     }
    //                 }
    //             })

    //             await tx.productVariant.update({
    //                 where: { variant_id: item.variant_id },
    //                 data: {
    //                     stock_qty: {
    //                         decrement: item.quantity
    //                     }
    //                 }
    //             })
    //         }

    //         // 🗑️ 3. ลบ import
    //         await tx.import.delete({
    //             where: { import_id: id }
    //         })

    //         // 🔄 4. update purchase status กลับเป็น pending
    //         await tx.purchaseOrder.update({
    //             where: { purchase_id: existing.purchase_id },
    //             data: { status: PurchaseOrderStatus.PENDING }
    //         })

    //         return { message: "Import deleted successfully" }
    //     })
    // }

}