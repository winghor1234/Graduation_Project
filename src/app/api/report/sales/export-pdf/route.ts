import { reportService } from "@/modules/report/report.service"
import { generateSalesPdf } from "@/utils/exportPdf"

export async function GET() {
    const sales = await reportService.getSalesQuantityReport()
    const pdf = await generateSalesPdf(sales)
    return new Response(pdf as any, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=sales-report.pdf"
        }
    })

}
