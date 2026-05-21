import { prisma } from "@/lib/prisma";

type ExportsProps = {
    startDate?: string | null;
    endDate?: string | null;
}

export class ExportService {

    static async getProductsTop(
        props: ExportsProps
    ) {

        const {
            startDate,
            endDate
        } = props;

        const topProducts =
            await prisma.saleDetail.groupBy({

                by: ["product_id"],

                where: {
                    sale: {
                        ...(startDate && {
                            createdAt: {
                                gte: new Date(startDate)
                            }
                        }),

                        ...(endDate && {
                            createdAt: {
                                lt: new Date(endDate)
                            }
                        })
                    }
                },

                _sum: {
                    quantity: true
                },

                orderBy: {
                    _sum: {
                        quantity: "desc"
                    }
                },

                take: 10
            });

        const data =
            await Promise.all(

                topProducts.map(async (item) => {

                    const product =
                        await prisma.product.findUnique({

                            where: {
                                product_id:
                                    item.product_id
                            },

                            include: {
                                category: true
                            }
                        });

                    return {
                        ...product,
                        total_quantity:
                            item._sum.quantity
                    };
                })
            );

        return data;
    }
}