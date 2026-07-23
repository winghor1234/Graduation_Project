// import { prisma } from "@/lib/prisma"
// import { MonthlyRevenueRaw } from "./report.type"

// export const reportService = {
//     //     // Product Report
//     //     async getProductReport() {
//     //         const products = await prisma.product.findMany({
//     //             include: {
//     //                 category: true
//     //             }
//     //         })
//     //         return products
//     //     },

//     //     // Purchase Report
//     //     async getPurchaseReport() {
//     //         const purchases = await prisma.purchaseOrder.findMany({
//     //             include: {
//     //                 supplier: true,
//     //                 employee: true,
//     //                 purchase_details: {
//     //                     include: {
//     //                         product: true
//     //                     }
//     //                 }
//     //             }
//     //         })
//     //         return purchases;

//     //     },

//     //     // Import Report
//     //     async getImportReport() {
//     //         const imports = await prisma.import.findMany({
//     //             include: {
//     //                 employee: true,
//     //                 purchase: true,
//     //                 import_details: {
//     //                     include: {
//     //                         product: true
//     //                     }
//     //                 }
//     //             }
//     //         })
//     //         return imports

//     //     },

//     //     // Customer Report
//     //     async getCustomerReport() {
//     //         const customers = await prisma.customer.findMany()
//     //         return customers
//     //     },

//     //     // Sales Quantity Report
//     //     async getSalesQuantityReport() {
//     //         const sales = await prisma.saleDetail.groupBy({
//     //             by: ["product_id"],
//     //             _sum: {
//     //                 quantity: true
//     //             },
//     //             orderBy: {
//     //                 _sum: {
//     //                     quantity: "desc"
//     //                 }
//     //             }
//     //         })
//     //         return sales

//     //     },

//     //     // Top Selling Products
//     //     async getTopSellingProducts() {
//     //         const topSellingProducts = await prisma.saleDetail.groupBy({
//     //             by: ["product_id"],
//     //             _sum: {
//     //                 quantity: true
//     //             },
//     //             orderBy: {
//     //                 _sum: {
//     //                     quantity: "desc"
//     //                 }
//     //             },
//     //             take: 10
//     //         })
//     //         return topSellingProducts

//     //     },

//     //     // Low Stock Alert
//     //     async getLowStockProducts() {
//     //         const lowStockProducts = await prisma.product.findMany({
//     //             where: {
//     //                 stock_qty: {
//     //                     lt: 10
//     //                 }
//     //             }
//     //         })
//     //         return lowStockProducts

//     //     },

//     //     // Revenue Report
//     //     async getRevenueReport(): Promise<RevenueSummary> {
//     //         const revenueResult = await prisma.sale.aggregate({
//     //             _sum: {
//     //                 total_amount: true
//     //             }
//     //         })

//     //         const costResult = await prisma.importDetail.aggregate({
//     //             _sum: {
//     //                 cost_price: true
//     //             }
//     //         })

//     //         const revenue = Number(revenueResult._sum.total_amount ?? 0)
//     //         const cost = Number(costResult._sum.cost_price ?? 0)

//     //         const profit = revenue - cost

//     //         return {
//     //             revenue,
//     //             cost,
//     //             profit
//     //         }
//     //     },

//     //     async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
//     //         const revenue = await prisma.$queryRaw<MonthlyRevenueRaw[]>`
//     //     SELECT 
//     //       DATE_TRUNC('month', sale_date) AS month,
//     //       SUM(total_amount) AS revenue
//     //     FROM "Sale"
//     //     GROUP BY month
//     //     ORDER BY month ASC
//     //   `

//     //         return revenue.map(item => ({
//     //             month: new Date(item.month).toISOString().slice(0, 7),
//     //             revenue: Number(item.revenue)
//     //         }))
//     //     },


//     //     async getDashboardSummary() {
//     //         const revenue = await prisma.sale.aggregate({
//     //             _sum: {
//     //                 total_amount: true
//     //             }
//     //         })

//     //         const cost = await prisma.importDetail.aggregate({
//     //             _sum: {
//     //                 cost_price: true
//     //             }
//     //         })

//     //         const profit =
//     //             (revenue._sum.total_amount || 0) -
//     //             (cost._sum.cost_price || 0)

//     //         return {
//     //             revenue: revenue._sum.total_amount || 0,
//     //             cost: cost._sum.cost_price || 0,
//     //             profit
//     //         }

//     //     }


//     async getReport() {
//         const [
//             products,
//             purchases,
//             imports,
//             sales,
//             customers,
//             revenueResult,
//             costResult, 
//             topProducts,
//             lowStock,
//             salesQuantity,
//             monthlyRevenue,
//             order,

//             // ------------
//         ] = await Promise.all([
//             // products,
//             prisma.product.findMany({
//                 include: {
//                     category: true
//                 }
//             }),

//             // purchases,
//             prisma.purchaseOrder.findMany({
//                 include: {
//                     supplier: true,
//                     employee: true,
//                     purchase_details: {
//                         include: {
//                             product: true
//                         }
//                     }
//                 }
//             }),

//             // imports,
//             prisma.import.findMany({
//                 include: {
//                     employee: true,
//                     purchase: true,
//                     import_details: {
//                         include: {
//                             product: true
//                         }
//                     }
//                 }

//             }),

//             // sales,
//             prisma.sale.findMany({
//                 include: {
//                     sale_details: {
//                         include: {
//                             product: true
//                         }
//                     }
//                 }
//             }),
//             // customers,
//             prisma.customer.findMany({
//                 include: {
//                     orders: true,
//                     sales: true
//                 }
//             }),

//             // revenueResult,
//             prisma.sale.aggregate({
//                 _sum: { total_amount: true }
//             }),


//             // costResult, 
//             prisma.importDetail.aggregate({
//                 _sum: { cost_price: true }
//             }),


//             // topProducts,
//             prisma.saleDetail.groupBy({
//                 by: ["product_id"],
//                 _sum: { quantity: true },
//                 orderBy: { _sum: { quantity: "desc" } },
//                 take: 10
//             }),

//             // lowStock,
//             prisma.product.findMany({
//                 where: {
//                     stock_qty: { lt: 10 }
//                 }
//             }),

//             // salesQuantity,
//             prisma.saleDetail.groupBy({
//                 by: ["product_id"],
//                 _sum: { quantity: true }
//             }),

//             // monthlyRevenue,
//             prisma.$queryRaw<MonthlyRevenueRaw[]>`
//             SELECT 
//             DATE_TRUNC('month', sale_date) AS month,
//             SUM(total_amount) AS revenue
//             FROM "Sale"
//             GROUP BY month
//             ORDER BY month ASC
//             `,

//             // order,
//             prisma.order.findMany({
//                 include: {
//                     customer: {
//                         select: {
//                             customer_id: true,
//                             customer_name: true,
//                             phone: true,
//                             email: true,
//                             province: true,
//                             district: true,
//                             village: true,
//                             point: true,
//                             gender: true,
//                             isActive: true,
//                         }
//                     }
//                 },
//                 take: 10,
//                 orderBy: { order_date: "desc" }
//             }),
//         ])

//         const revenue = Number(revenueResult._sum.total_amount ?? 0)
//         const cost = Number(costResult._sum.cost_price ?? 0)
//         const profit = revenue - cost


//         return {
//             products,
//             purchases,
//             imports,
//             sales,
//             customers,
//             summary: {
//                 revenue,
//                 cost,
//                 profit
//             },
//             topProducts,
//             lowStock,
//             sold: salesQuantity,
//             monthlyRevenue: monthlyRevenue.map(item => ({
//                 month: new Date(item.month).toISOString().slice(0, 7),
//                 revenue: Number(item.revenue)
//             })),
//             order
//         }
//     }
// }


import { PrismaClient, OrderStatus } from "@prisma/client";
import { ReportQueryDto, ReportType, ReportPeriod } from "./report.type";

export class ReportService {
    constructor(private prisma: PrismaClient) { }

    // =========================
    // DATE FILTER
    // =========================
    private buildDateFilter(
        period?: ReportPeriod,
        startDate?: string,
        endDate?: string
    ) {
        if (startDate && endDate) {
            return {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        const now = new Date();

        switch (period) {
            case ReportPeriod.WEEK: {
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - 7);

                return {
                    gte: weekStart,
                    lte: now,
                };
            }

            case ReportPeriod.MONTH: {
                return {
                    gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    lte: now,
                };
            }

            case ReportPeriod.YEAR: {
                return {
                    gte: new Date(now.getFullYear(), 0, 1),
                    lte: now,
                };
            }

            default:
                return undefined;
        }
    }

    // =========================
    // MAIN REPORT
    // =========================
    async getExportReport(query: ReportQueryDto) {
        const dateFilter = this.buildDateFilter(
            query.period,
            query.startDate,
            query.endDate
        );

        switch (query.reportType) {
            // ================= PRODUCT =================
            case ReportType.PRODUCT:
                return this.prisma.product.findMany({
                    include: { category: true , images: true, variants: true},
                });

            // ================= PURCHASE =================
            case ReportType.PURCHASE:
                return this.prisma.purchaseOrder.findMany({
                    where: dateFilter
                        ? { purchase_date: dateFilter }
                        : undefined,
                    include: {
                        supplier: true,
                        employee: true,
                        purchase_details: {
                            include: { product: true },
                        },
                    },
                });

            // ================= IMPORT =================
            case ReportType.IMPORT:
                return this.prisma.import.findMany({
                    where: dateFilter
                        ? { import_date: dateFilter }
                        : undefined,
                    include: {
                        employee: true,
                        purchase: {
                            include: { supplier: true },
                        },
                        import_details: {
                            include: { product: true },
                        },
                    },
                });

            // ================= CUSTOMER =================
            case ReportType.CUSTOMER:
                return this.prisma.customer.findMany({
                    where: dateFilter
                        ? { createdAt: dateFilter }
                        : undefined,
                    include: {
                        orders: true,
                        sales: true,
                    },
                });

            // ================= SALE =================
            // ✅ ລວມທັງການຂາຍໜ້າຮ້ານ (Sale/POS) ແລະ ອໍເດີ້ອອນລາຍທີ່ສຳເລັດແລ້ວ (Order: COMPLETED)
            // ເພາະ 2 ຕາຕະລາງນີ້ແຍກກັນ — ຖ້າເບິ່ງແຕ່ Sale ຢ່າງດຽວ ຍອດຂາຍອອນລາຍຈະຫາຍໄປໝົດ
            case ReportType.SALE: {
                const [sales, orders] = await Promise.all([
                    this.prisma.sale.findMany({
                        where: dateFilter
                            ? { sale_date: dateFilter }
                            : undefined,
                        include: {
                            customer: true,
                            employee: true,
                            sale_details: {
                                include: { product: true },
                            },
                        },
                    }),
                    this.prisma.order.findMany({
                        where: {
                            status: OrderStatus.COMPLETED,
                            ...(dateFilter ? { order_date: dateFilter } : {}),
                        },
                        include: {
                            customer: true,
                            order_details: {
                                include: { product: true },
                            },
                        },
                    }),
                ]);

                const posSales = sales.map((s) => ({ ...s, source: "POS" as const }));

                const onlineAsSales = orders.map((o) => ({
                    sale_id: o.order_id,
                    sale_date: o.order_date,
                    total_amount: o.total_amount,
                    employee: null,
                    customer: o.customer,
                    source: "ONLINE" as const,
                    sale_details: o.order_details.map((d) => ({
                        sale_detail_id: d.order_detail_id,
                        quantity: d.quantity,
                        price: d.price,
                        product: d.product,
                    })),
                    createdAt: o.createdAt,
                    updatedAt: o.updatedAt,
                }));

                return [...posSales, ...onlineAsSales].sort(
                    (a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
                );
            }

            // ================= ORDER =================
            case ReportType.ORDER:
                return this.prisma.order.findMany({
                    where: dateFilter
                        ? { order_date: dateFilter }
                        : undefined,
                    include: {
                        customer: true,
                        order_details: {
                            include: { product: true },
                        },
                    },
                });

            // ================= REVENUE =================
            // ✅ ລວມຍອດຂາຍ POS + ອໍເດີ້ອອນລາຍທີ່ສຳເລັດແລ້ວ
            case ReportType.REVENUE: {
                const [saleAgg, orderAgg] = await Promise.all([
                    this.prisma.sale.aggregate({
                        where: dateFilter
                            ? { sale_date: dateFilter }
                            : undefined,
                        _sum: { total_amount: true },
                    }),
                    this.prisma.order.aggregate({
                        where: {
                            status: OrderStatus.COMPLETED,
                            ...(dateFilter ? { order_date: dateFilter } : {}),
                        },
                        _sum: { total_amount: true },
                    }),
                ]);

                return {
                    _sum: {
                        total_amount:
                            Number(saleAgg._sum.total_amount ?? 0) +
                            Number(orderAgg._sum.total_amount ?? 0),
                    },
                };
            }

            // ================= PROFIT =================
            case ReportType.PROFIT: {
                const [saleAgg, orderAgg, cost] = await Promise.all([
                    this.prisma.sale.aggregate({
                        where: dateFilter
                            ? { sale_date: dateFilter }
                            : undefined,
                        _sum: { total_amount: true },
                    }),
                    this.prisma.order.aggregate({
                        where: {
                            status: OrderStatus.COMPLETED,
                            ...(dateFilter ? { order_date: dateFilter } : {}),
                        },
                        _sum: { total_amount: true },
                    }),
                    this.prisma.importDetail.aggregate({
                        where: dateFilter
                            ? {
                                import: {
                                    import_date: dateFilter,
                                },
                            }
                            : undefined,
                        _sum: { cost_price: true },
                    }),
                ]);

                const totalRevenue =
                    Number(saleAgg._sum.total_amount ?? 0) +
                    Number(orderAgg._sum.total_amount ?? 0);

                const totalCost = Number(
                    cost._sum.cost_price ?? 0
                );

                return {
                    revenue: totalRevenue,
                    cost: totalCost,
                    profit: totalRevenue - totalCost,
                };
            }

            default:
                throw new Error("Invalid report type");
        }
    }

    // =========================
    // FINANCIAL REPORT (monthly breakdown)
    // =========================
    async getFinancialReport(
        period?: ReportPeriod,
        startDate?: string,
        endDate?: string
    ) {
        const dateFilter = this.buildDateFilter(period, startDate, endDate);

        // ✅ ລວມ Order ອອນລາຍທີ່ສຳເລັດແລ້ວເຂົ້າກັບ Sale POS ນຳ — ບໍ່ດັ່ງນັ້ນລາຍຮັບອອນລາຍຈະບໍ່ຖືກນັບ
        const [sales, orders, purchases] = await Promise.all([
            this.prisma.sale.findMany({
                where: dateFilter ? { sale_date: dateFilter } : undefined,
                select: { sale_date: true, total_amount: true },
            }),
            this.prisma.order.findMany({
                where: {
                    status: OrderStatus.COMPLETED,
                    ...(dateFilter ? { order_date: dateFilter } : {}),
                },
                select: { order_date: true, total_amount: true },
            }),
            this.prisma.purchaseOrder.findMany({
                where: dateFilter ? { purchase_date: dateFilter } : undefined,
                select: { purchase_date: true, total_amount: true },
            }),
        ]);

        // Group sales (POS) by YYYY-MM
        const revenueByMonth: Record<string, { total: number; count: number }> = {};
        for (const s of sales) {
            const key = new Date(s.sale_date).toISOString().slice(0, 7);
            if (!revenueByMonth[key]) revenueByMonth[key] = { total: 0, count: 0 };
            revenueByMonth[key].total += Number(s.total_amount);
            revenueByMonth[key].count += 1;
        }
        // Group completed online orders by YYYY-MM
        for (const o of orders) {
            const key = new Date(o.order_date).toISOString().slice(0, 7);
            if (!revenueByMonth[key]) revenueByMonth[key] = { total: 0, count: 0 };
            revenueByMonth[key].total += Number(o.total_amount);
            revenueByMonth[key].count += 1;
        }

        // Group purchases by YYYY-MM
        const expensesByMonth: Record<string, number> = {};
        for (const p of purchases) {
            const key = new Date(p.purchase_date).toISOString().slice(0, 7);
            expensesByMonth[key] = (expensesByMonth[key] ?? 0) + Number(p.total_amount);
        }

        // Merge all months
        const allMonths = new Set([
            ...Object.keys(revenueByMonth),
            ...Object.keys(expensesByMonth),
        ]);

        const monthly = Array.from(allMonths)
            .sort()
            .map((month) => {
                const revenue = revenueByMonth[month]?.total ?? 0;
                const cost = expensesByMonth[month] ?? 0;
                return {
                    month,
                    revenue,
                    cost,
                    profit: revenue - cost,
                    saleCount: revenueByMonth[month]?.count ?? 0,
                };
            });

        const totalRevenue =
            sales.reduce((s, r) => s + Number(r.total_amount), 0) +
            orders.reduce((s, r) => s + Number(r.total_amount), 0);
        const totalCost = purchases.reduce((s, p) => s + Number(p.total_amount), 0);
        const totalProfit = totalRevenue - totalCost;

        return {
            summary: {
                totalRevenue,
                totalCost,
                totalProfit,
                profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
                saleCount: sales.length + orders.length,
                purchaseCount: purchases.length,
                monthCount: monthly.length,
                avgMonthlyRevenue: monthly.length > 0 ? totalRevenue / monthly.length : 0,
                avgMonthlyCost: monthly.length > 0 ? totalCost / monthly.length : 0,
            },
            monthly,
        };
    }
}