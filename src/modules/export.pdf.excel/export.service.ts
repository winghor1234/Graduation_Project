import { prisma } from "@/lib/prisma"
import { MonthlyRevenueRaw } from "../report/report.type"

export class ExportService {

    static async getReportData(type: string) {
        switch (type) {
            // ================= PURCHASE =================
            case "purchase":
                const purchases = await prisma.purchaseOrder.findMany({
                    include: {
                        supplier: true,
                        employee: true,
                    }
                })
                return purchases.map(p => ({
                    ID: p.purchase_id.slice(0, 8),
                    Date: new Date(p.purchase_date).toLocaleDateString(),
                    Supplier: p.supplier?.supplier_name || "-",
                    Employee: p.employee?.employee_name || "-",
                    Total: p.total_amount,
                    Status: p.status
                }))

            // ================= IMPORT =================
            case "import":
                const imports = await prisma.import.findMany({
                    include: {
                        employee: true,
                    }
                })
                return imports.map(i => ({
                    ID: i.import_id.slice(0, 8),
                    Date: new Date(i.import_date).toLocaleDateString(),
                    Employee: i.employee?.employee_name || "-",
                    Total: i.total_amount
                }))

            // ================= SALES =================
            case "sales":
                const sales = await prisma.sale.findMany({
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
                        invoice: sale.sale_id.slice(0, 8),
                        sale_date: new Date(sale.sale_date).toLocaleDateString(),
                        product_name: detail.product?.product_name || "-",
                        quantity: detail.quantity,
                        price: detail.price,
                        total: detail.quantity * detail.price
                    }))
                )

            // ================= CUSTOMER =================
            case "customer":
                const customers = await prisma.customer.findMany()
                return customers.map(c => ({
                    ID: c.customer_id.slice(0, 8),
                    Name: c.customer_name,
                    Email: c.email || "-",
                    Phone: c.phone || "-",
                    Address: c.address || "-"
                }))

            // ================= REVENUE =================
            case "revenue":
                return await prisma.sale.aggregate({
                    _sum: { total_amount: true }
                })

            // ================= COST =================
            case "cost":
                return await prisma.importDetail.aggregate({
                    _sum: { cost_price: true }
                })

            // ================= TOP PRODUCT =================
            case "topProduct":
                return await prisma.saleDetail.groupBy({
                    by: ["product_id"],
                    _sum: { quantity: true },
                    orderBy: { _sum: { quantity: "desc" } },
                    take: 10
                })

            // ================= LOW PRODUCT =================
            case "lowProduct":
                return await prisma.product.findMany({
                    where: {
                        stock_qty: { lt: 10 }
                    }
                })

            // ================= SALE QUANTITY =================
            case "saleQuantity":
                return await prisma.product.findMany({
                    where: {
                        stock_qty: { lt: 10 }
                    }
                })

            // ================= MONTHLY REVENUE =================
            case "monthlyRevenue":
                return await prisma.$queryRaw<MonthlyRevenueRaw[]>`
                            SELECT 
                            DATE_TRUNC('month', sale_date) AS month,
                            SUM(total_amount) AS revenue
                            FROM "Sale"
                            GROUP BY month
                            ORDER BY month ASC
                            `

            // ================= ORDER =================
            case "order":
                const orders = await prisma.order.findMany({
                    include: {
                        customer: true
                    },
                    take: 10,
                    orderBy: { order_date: "desc" }
                })
                return orders.map(o => ({
                    ID: o.order_id.slice(0, 8),
                    Date: new Date(o.order_date).toLocaleDateString(),
                    Customer: o.customer?.customer_name || "-",
                    Total: o.total_amount,
                    Status: o.status
                }))

            default:
                throw new Error("Invalid report type")
        }
    }
}
