import PDFDocument from "pdfkit"
import { ExportConfig } from "@/types/export"

export async function generatePdf<T extends Record<string, any>>(
    config: ExportConfig<T>
) {
    const doc = new PDFDocument({ margin: 30 })
    const buffers: Buffer[] = []

    doc.on("data", (b) => buffers.push(b))

    // Title
    doc.fontSize(16).text(config.title, { align: "center" })
    doc.moveDown()

    // Header
    doc.fontSize(10)
    config.columns.forEach((col, i) => {
        doc.text(col.header, { continued: i !== config.columns.length - 1 })
    })

    doc.moveDown()

    // Data
    config.data.forEach((row) => {
        config.columns.forEach((col, i) => {
            const value = row[col.key]
            doc.text(String(value ?? ""), {
                continued: i !== config.columns.length - 1
            })
        })
        doc.moveDown()
    })

    doc.end()

    return new Promise<Buffer>((resolve) => {
        doc.on("end", () => resolve(Buffer.concat(buffers)))
    })
}