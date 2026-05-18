import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "fontkit"
import fs from "fs"
import path from "path"

export async function generateSalesPdf(data: any[]) {
    return generateGenericPdf("SALES REPORT", data)
}

export async function generateGenericPdf(title: string, data: any[]) {
    if (!data || data.length === 0) {
        throw new Error("No data to export")
    }

    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)

    // Load Lao Font
    const fontPath = path.join(process.cwd(), "public/fonts/NotoSansLao-Regular.ttf")
    let laoFont: any
    try {
        const fontBytes = fs.readFileSync(fontPath)
        laoFont = await pdfDoc.embedFont(fontBytes)
    } catch (error) {
        console.error("Failed to load Lao font, falling back to Helvetica", error)
    }

    const page = pdfDoc.addPage([842, 595]) // A4 Landscape
    const { width, height } = page.getSize()

    const fontSize = 10
    const headerSize = 12
    const titleSize = 18

    let y = height - 50

    // Title
    page.drawText(title.toUpperCase(), {
        x: width / 2 - (title.length * 5),
        y,
        size: titleSize,
        font: laoFont,
        color: rgb(0, 0, 0)
    })

    y -= 40

    // Table Setup
    const headers = Object.keys(data[0])
    const colWidth = (width - 80) / headers.length
    const margin = 40

    // Draw Headers
    headers.forEach((header, i) => {
        page.drawText(header.toUpperCase(), {
            x: margin + (i * colWidth),
            y,
            size: headerSize,
            font: laoFont,
            color: rgb(0, 0, 0)
        })
    })

    y -= 10
    page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0, 0, 0)
    })
    y -= 20

    // Draw Rows
    for (const item of data) {
        if (y < 40) {
            // New Page
            const newPage = pdfDoc.addPage([842, 595])
            y = height - 50
        }

        headers.forEach((header, i) => {
            const value = String(item[header] ?? "-")
            page.drawText(value, {
                x: margin + (i * colWidth),
                y,
                size: fontSize,
                font: laoFont,
                color: rgb(0, 0, 0)
            })
        })

        y -= 20
    }

    // Footer
    page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
        x: margin,
        y: 20,
        size: 8,
        font: laoFont,
        color: rgb(0.5, 0.5, 0.5)
    })

    const pdfBytes = await pdfDoc.save()
    return Buffer.from(pdfBytes)
}
