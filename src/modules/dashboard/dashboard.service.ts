import { prisma } from "@/lib/prisma"
import { MonthlyRevenueRaw } from "../report/report.type"
import { calculateGrowthPercent } from "@/utils/metrics"
import { unstable_cache } from "next/cache"

const getDashboardDataCached = unstable_cache(
    async () => {
        const now = new Date()

        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const startOfChartRange = new Date(now.getFullYear(), now.getMonth() - 11, 1)

        const [
            revenueResult,
            costResult,
            monthlyRaw,
            topProductsRaw,
            // lowStock,
            customerCount,
            order,
            currentMonthOrder,
            lastMonthOrder
        ] = await Promise.all([

            prisma.sale.aggregate({
                _sum: { total_amount: true }
            }),

            prisma.importDetail.aggregate({
                _sum: { cost_price: true }
            }),

            prisma.$queryRaw<MonthlyRevenueRaw[]>`
        SELECT
          DATE_TRUNC('month', sale_date) AS month,
          SUM(total_amount) AS revenue
        FROM "Sale"
        WHERE sale_date >= ${startOfChartRange}
        GROUP BY month
        ORDER BY month ASC
      `,

            // 👉 top selling (raw)
            prisma.saleDetail.groupBy({
                by: ["product_id"],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: "desc" } },
                take: 5
            }),

            // prisma.product.findMany({
            //     where: { variants.stock_qty: { lt: 10 } },
            //     select: {
            //         product_id: true,
            //         product_name: true,
            //         stock_qty: true
            //     }
            // }),

            prisma.customer.count(),

            prisma.order.findMany({
                include: {
                    customer: {
                        select: {
                            customer_id: true,
                            customer_name: true,
                            phone: true,
                            email: true,
                            province: true,
                            district: true,
                            village: true,
                            gender: true,
                            isActive: true,
                        }
                    }
                },
                take: 10,
                orderBy: { order_date: "desc" }
            }),
            prisma.order.count({
                where: {
                    createdAt: {
                        gte: startOfCurrentMonth,
                        lt: endOfCurrentMonth
                    }
                }
            }),

            // 🔥 last month
            prisma.order.count({
                where: {
                    createdAt: {
                        gte: startOfLastMonth,
                        lt: endOfLastMonth
                    }
                }
            })
        ])

        // ✅ summary
        const revenue = Number(revenueResult._sum.total_amount ?? 0)
        const cost = Number(costResult._sum.cost_price ?? 0)

        // ✅ monthly
        const monthly = monthlyRaw.map((item) => ({
            month: new Date(item.month).toISOString().slice(0, 7),
            revenue: Number(item.revenue)
        }))

        // ✅ 🔥 FIX: join product name (สำคัญ)
        const productIds = topProductsRaw.map(p => p.product_id)

        const products = await prisma.product.findMany({
            where: { product_id: { in: productIds } },
            select: { product_id: true, product_name: true, product_code: true, variants: { select: { sale_price: true } } }
        })

        const productMap = new Map(products.map(p => [p.product_id, p]))
        const topProducts = topProductsRaw.map(p => {
            const product = productMap.get(p.product_id)

            return {
                productId: p.product_id,
                productName: product?.product_name || "Unknown",
                productCode: product?.product_code || "-",
                price: Number(product?.variants?.[0]?.sale_price ?? 0),
                sold: Number(p._sum.quantity ?? 0)
            }
        })

        const percent = calculateGrowthPercent(currentMonthOrder, lastMonthOrder)


        return {
            summary: {
                revenue,
                cost,
                profit: revenue - cost
            },
            monthly,
            topProducts,
            // lowStock,
            customers: customerCount,
            orders: order,
            currentMonthOrder,
            lastMonthOrder,
            percent
        }
    },
    ["dashboard-data"],
    { revalidate: 60, tags: ["dashboard"] }
)

export const dashboardService = {
    getDashboardData: getDashboardDataCached
}