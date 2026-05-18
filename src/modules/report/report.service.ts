import { prisma } from "@/lib/prisma"
import { MonthlyRevenueRaw } from "./report.type"

export const reportService = {
    //     // Product Report
    //     async getProductReport() {
    //         const products = await prisma.product.findMany({
    //             include: {
    //                 category: true
    //             }
    //         })
    //         return products
    //     },

    //     // Purchase Report
    //     async getPurchaseReport() {
    //         const purchases = await prisma.purchaseOrder.findMany({
    //             include: {
    //                 supplier: true,
    //                 employee: true,
    //                 purchase_details: {
    //                     include: {
    //                         product: true
    //                     }
    //                 }
    //             }
    //         })
    //         return purchases;

    //     },

    //     // Import Report
    //     async getImportReport() {
    //         const imports = await prisma.import.findMany({
    //             include: {
    //                 employee: true,
    //                 purchase: true,
    //                 import_details: {
    //                     include: {
    //                         product: true
    //                     }
    //                 }
    //             }
    //         })
    //         return imports

    //     },

    //     // Customer Report
    //     async getCustomerReport() {
    //         const customers = await prisma.customer.findMany()
    //         return customers
    //     },

    // Sales Quantity Report
    async getSalesQuantityReport() {
        const sales = await prisma.saleDetail.groupBy({
            by: ["product_id"],
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: "desc"
                }
            }
        })
        return sales

    },

    //     // Top Selling Products
    //     async getTopSellingProducts() {
    //         const topSellingProducts = await prisma.saleDetail.groupBy({
    //             by: ["product_id"],
    //             _sum: {
    //                 quantity: true
    //             },
    //             orderBy: {
    //                 _sum: {
    //                     quantity: "desc"
    //                 }
    //             },
    //             take: 10
    //         })
    //         return topSellingProducts

    //     },

    //     // Low Stock Alert
    //     async getLowStockProducts() {
    //         const lowStockProducts = await prisma.product.findMany({
    //             where: {
    //                 stock_qty: {
    //                     lt: 10
    //                 }
    //             }
    //         })
    //         return lowStockProducts

    //     },

    //     // Revenue Report
    //     async getRevenueReport(): Promise<RevenueSummary> {
    //         const revenueResult = await prisma.sale.aggregate({
    //             _sum: {
    //                 total_amount: true
    //             }
    //         })

    //         const costResult = await prisma.importDetail.aggregate({
    //             _sum: {
    //                 cost_price: true
    //             }
    //         })

    //         const revenue = Number(revenueResult._sum.total_amount ?? 0)
    //         const cost = Number(costResult._sum.cost_price ?? 0)

    //         const profit = revenue - cost

    //         return {
    //             revenue,
    //             cost,
    //             profit
    //         }
    //     },

    //     async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    //         const revenue = await prisma.$queryRaw<MonthlyRevenueRaw[]>`
    //     SELECT 
    //       DATE_TRUNC('month', sale_date) AS month,
    //       SUM(total_amount) AS revenue
    //     FROM "Sale"
    //     GROUP BY month
    //     ORDER BY month ASC
    //   `

    //         return revenue.map(item => ({
    //             month: new Date(item.month).toISOString().slice(0, 7),
    //             revenue: Number(item.revenue)
    //         }))
    //     },


    //     async getDashboardSummary() {
    //         const revenue = await prisma.sale.aggregate({
    //             _sum: {
    //                 total_amount: true
    //             }
    //         })

    //         const cost = await prisma.importDetail.aggregate({
    //             _sum: {
    //                 cost_price: true
    //             }
    //         })

    //         const profit =
    //             (revenue._sum.total_amount || 0) -
    //             (cost._sum.cost_price || 0)

    //         return {
    //             revenue: revenue._sum.total_amount || 0,
    //             cost: cost._sum.cost_price || 0,
    //             profit
    //         }

    //     }


    async getReport() {
        const [
            products,
            purchases,
            imports,
            sales,
            customers,
            revenueResult,
            costResult, 
            topProducts,
            lowStock,
            salesQuantity,
            monthlyRevenue,
            order,

            // ------------
        ] = await Promise.all([
            // products,
            prisma.product.findMany({
                include: {
                    category: true
                }
            }),
            
            // purchases,
            prisma.purchaseOrder.findMany({
                include: {
                    supplier: true,
                    employee: true,
                    purchase_details: {
                        include: {
                            product: true
                        }
                    }
                }
            }),
            
            // imports,
            prisma.import.findMany({
                include: {
                    employee: true,
                    purchase: true,
                    import_details: {
                        include: {
                            product: true
                        }
                    }
                }
                
            }),
            
            // sales,
            prisma.sale.findMany({
                include: {
                    sale_details: {
                        include: {
                            product: true
                        }
                    }
                }
            }),
            // customers,
            prisma.customer.findMany({
                include: {
                    orders: true,
                    sales: true
                }
            }),
            
            // revenueResult,
            prisma.sale.aggregate({
                _sum: { total_amount: true }
            }),
            
            
            // costResult, 
            prisma.importDetail.aggregate({
                _sum: { cost_price: true }
            }),
            
            
            // topProducts,
            prisma.saleDetail.groupBy({
                by: ["product_id"],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: "desc" } },
                take: 10
            }),
            
            // lowStock,
            prisma.product.findMany({
                where: {
                    stock_qty: { lt: 10 }
                }
            }),
            
            // salesQuantity,
            prisma.saleDetail.groupBy({
                by: ["product_id"],
                _sum: { quantity: true }
            }),
            
            // monthlyRevenue,
            prisma.$queryRaw<MonthlyRevenueRaw[]>`
            SELECT 
            DATE_TRUNC('month', sale_date) AS month,
            SUM(total_amount) AS revenue
            FROM "Sale"
            GROUP BY month
            ORDER BY month ASC
            `,
            
            // order,
            prisma.order.findMany({
                include: {
                    customer: {
                        select: {
                            customer_id: true,
                            customer_name: true,
                            phone: true,
                            email: true,
                            address: true,
                            gender: true,
                            isActive: true,
                        }
                    }
                },
                take: 10,
                orderBy: { order_date: "desc" }
            }),
        ])

        const revenue = Number(revenueResult._sum.total_amount ?? 0)
        const cost = Number(costResult._sum.cost_price ?? 0)
        const profit = revenue - cost


        return {
            products,
            purchases,
            imports,
            sales,
            customers,
            topProducts,
            lowStock,
            sold: salesQuantity,
            monthlyRevenue: monthlyRevenue.map(item => ({
                month: new Date(item.month).toISOString().slice(0, 7),
                revenue: Number(item.revenue)
            })),
            order,
            summary: {
                revenue,
                cost,
                profit
            },
        }
    }
}