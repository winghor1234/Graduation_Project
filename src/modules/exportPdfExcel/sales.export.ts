import { prisma } from "@/lib/prisma"
import { getDateFilter } from "@/utils/dateFilter"
export class SalesExportService {

    static async generate(
        period?: string,
        startDate?: string | null,
        endDate?: string | null
    ) {

        const dateFilter =
            getDateFilter(
                period,
                startDate,
                endDate
            )

        const sales =
            await prisma.sale.findMany({

                where: {
                    sale_date: dateFilter
                },

                include: {

                    sale_details: {

                        include: {
                            product: true
                        }

                    }

                }

            })

        return sales.flatMap((sale) =>

            sale.sale_details.map((detail) => ({

                invoice:
                    sale.sale_id.slice(0, 8),

                sale_date:
                    sale.sale_date.toLocaleDateString(),

                product_name:
                    detail.product?.product_name || "-",

                quantity:
                    detail.quantity,

                price:
                    detail.price,

                total:
                    detail.quantity * detail.price

            }))

        )

    }

}