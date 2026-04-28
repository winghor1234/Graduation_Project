import { prisma } from "@/lib/prisma"
import { MonthlyRevenueRaw } from "../report/report.type"

export const dashboardService = {
    async getDashboardData() {
        const [
            revenueResult,
            costResult,
            monthlyRaw,
            topProductsRaw,
            lowStock,
            customerCount,
            orderCount,
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

            prisma.product.findMany({
                where: { stock_qty: { lt: 10 } },
                select: {
                    product_id: true,
                    product_name: true,
                    stock_qty: true
                }
            }),

            prisma.customer.count(),

            prisma.order.count(),
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
            select: { product_id: true, product_name: true, product_code: true, sale_price: true }
        })

        const productMap = new Map(
            products.map(p => [p.product_id, p])
        )

        const topProducts = topProductsRaw.map(p => {
            const product = productMap.get(p.product_id)

            return {
                productId: p.product_id,
                productName: product?.product_name || "Unknown",
                productCode: product?.product_code || "-",
                price: Number(product?.sale_price ?? 0),
                sold: Number(p._sum.quantity ?? 0)
            }
        })

        return {
            summary: {
                revenue,
                cost,
                profit: revenue - cost
            },

            monthly,

            topProducts,
            lowStock,
            customers: customerCount,
            orders: orderCount
        }
    }
}