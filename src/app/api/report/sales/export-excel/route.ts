import { reportService } from "@/modules/report/report.service"
import { generateExcel } from "@/utils/excelExport"

export async function GET() {
    const sales = await reportService.getSalesQuantityReport()
    const buffer = await generateExcel("Sales Report", sales)
    return new Response(buffer as any, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=sales-report.xlsx"
        }
    })

}
