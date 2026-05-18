import PDFDocument from "pdfkit"
type ReportItem = {
    name: string
    qty: number
    price: number
}
export function exportToPdf(data: ReportItem[]) {

    const doc = new PDFDocument()

    const buffers: Uint8Array[] = []

    doc.on("data", buffers.push.bind(buffers))

    data.forEach((item) => {
        doc.text(JSON.stringify(item))
        doc.moveDown()
    })

    doc.end()

    return new Promise<Buffer>((resolve) => {

        doc.on("end", () => {

            const pdf = Buffer.concat(buffers)

            resolve(pdf)

        })

    })

}