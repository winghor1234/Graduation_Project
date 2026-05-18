import { ExportController } from "@/modules/export.pdf.excel/export.controller"
import { NextRequest } from "next/server"


export async function GET(req: NextRequest) {
    return ExportController.exportExcel(req)
}