import { ExportController } from "@/modules/export.pdf.exel/export.controller"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    return ExportController.excel(req)
}