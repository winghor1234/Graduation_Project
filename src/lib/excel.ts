import ExcelJS from "exceljs"
import { ExportConfig } from "@/types/export"

export async function generateExcel<T extends Record<string, any>>(
    config: ExportConfig<T>
) {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet("Report")

    // Title
    ws.addRow([config.title])
    ws.addRow([])

    // Header
    ws.addRow(config.columns.map((c) => c.header))

    // Data
    config.data.forEach((row) => {
        ws.addRow(config.columns.map((c) => row[c.key]))
    })

    const buffer = await wb.xlsx.writeBuffer()
    return Buffer.from(buffer)
}