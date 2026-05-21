import { ExportController } from "@/modules/exportPdfExcel/export.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return ExportController.ProductTopPdf(req)
}