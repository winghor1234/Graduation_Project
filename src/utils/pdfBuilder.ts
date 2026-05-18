const PdfPrinter = require("pdfmake/src/printer")

import path from "path"

export class PdfBuilder {

    static async export(
        title: string,
        data: any[]
    ): Promise<Buffer> {

        if (!data || data.length === 0) {
            throw new Error("No data")
        }

        const fonts = {

            Roboto: {

                normal: path.join(
                    process.cwd(),
                    "public/fonts/Roboto-Regular.ttf"
                ),

                bold: path.join(
                    process.cwd(),
                    "public/fonts/Roboto-Regular.ttf"
                ),

                italics: path.join(
                    process.cwd(),
                    "public/fonts/Roboto-Regular.ttf"
                ),

                bolditalics: path.join(
                    process.cwd(),
                    "public/fonts/Roboto-Regular.ttf"
                )

            }

        }

        const printer =
            new PdfPrinter(fonts)

        const headers =
            Object.keys(data[0])

        const body = [

            headers.map((header) => ({
                text: header.toUpperCase(),
                bold: true,
                fillColor: "#eeeeee"
            })),

            ...data.map((item) =>

                headers.map((header) => ({
                    text: String(
                        item[header] ?? "-"
                    )
                }))

            )

        ]

        const docDefinition = {

            pageSize: "A4",

            pageOrientation: "landscape",

            content: [

                {
                    text: title,
                    style: "header"
                },

                {
                    table: {
                        headerRows: 1,
                        body
                    }
                }

            ],

            styles: {

                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 20]
                }

            },

            defaultStyle: {
                font: "Roboto"
            }

        }

        const pdfDoc =
            printer.createPdfKitDocument(
                docDefinition
            )

        const chunks: Buffer[] = []

        return new Promise((resolve, reject) => {

            pdfDoc.on("data", (chunk: Buffer) => {
                chunks.push(chunk)
            })

            pdfDoc.on("end", () => {

                const result =
                    Buffer.concat(chunks)

                resolve(result)

            })

            pdfDoc.on("error", (err: Error) => {
                reject(err)
            })

            pdfDoc.end()

        })

    }

}