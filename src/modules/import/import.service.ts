
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateImportInput } from "./import.type"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { generateImportCode } from "@/utils/generateCode"

export const importService = {

    async getImports(options?: Prisma.ImportFindManyArgs) {

        const imports = await prisma.import.findMany({
            ...options,
            include: {
                employee: true,
                purchase: {
                    include: {
                        supplier: true
                    }
                },
                import_details: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return imports

    },

    async getImport(id: string) {
        const record = await prisma.import.findUnique({
            where: { import_id: id },
            include: {
                employee: true,
                purchase: true,
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

            if (purchase.status !== "pending") {
                throw new BadRequestError(
                    "Only pending purchase can be imported"
                );
            }

            const detailMap = new Map(
                purchase.purchase_details.map(d => [
                    d.product_id,
                    d
                ])
            );

            // ✅ validate (ALLOW ANY QUANTITY <= or flexible)
            for (const item of data.import_details) {

                const purchaseDetail =
                    detailMap.get(item.product_id);

                if (!purchaseDetail) {
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
                        create: data.import_details
                    }
                },
                include: {
                    import_details: true
                }
            });

            // 🔁 update stock + received_qty
            for (const item of data.import_details) {

                await tx.purchaseDetail.updateMany({
                    where: {
                        purchase_id: data.purchase_id,
                        product_id: item.product_id
                    },
                    data: {
                        received_qty: item.quantity
                    }
                });

                await tx.product.update({
                    where: {
                        product_id: item.product_id
                    },
                    data: {
                        stock_qty: {
                            increment: item.quantity
                        }
                    }
                });
            }

            // 🔥 IMPORTANT CHANGE HERE
            // 👉 ALWAYS COMPLETE AFTER IMPORT (1 TIME ONLY)

            await tx.purchaseOrder.update({
                where: {
                    purchase_id: data.purchase_id
                },
                data: {
                    status: "completed"
                }
            });

            return newImport;
        });
    },

    async deleteImport(id: string) {
        return prisma.$transaction(async (tx) => {

            // 🔍 1. หา import
            const existing = await tx.import.findUnique({
                where: { import_id: id },
                include: {
                    import_details: true,
                    purchase: true
                }
            })

            if (!existing) {
                throw new NotFoundError("Import not found")
            }

            // ❗ optional: ห้ามลบถ้า purchase completed แล้ว
            if (existing.purchase.status === "completed") {
                throw new BadRequestError("Cannot delete import from completed purchase")
            }

            // 🔁 2. rollback stock + received_qty
            for (const item of existing.import_details) {

                // ลด received_qty
                await tx.purchaseDetail.updateMany({
                    where: {
                        purchase_id: existing.purchase_id,
                        product_id: item.product_id
                    },
                    data: {
                        received_qty: {
                            decrement: item.quantity
                        }
                    }
                })

                // ลด stock
                await tx.product.update({
                    where: { product_id: item.product_id },
                    data: {
                        stock_qty: {
                            decrement: item.quantity
                        }
                    }
                })
            }

            // 🗑️ 3. ลบ import
            await tx.import.delete({
                where: { import_id: id }
            })

            // 🔄 4. update purchase status กลับเป็น pending
            await tx.purchaseOrder.update({
                where: { purchase_id: existing.purchase_id },
                data: { status: "pending" }
            })

            return { message: "Import deleted successfully" }
        })
    }

}