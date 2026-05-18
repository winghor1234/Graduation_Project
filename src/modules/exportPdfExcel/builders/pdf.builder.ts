const PdfPrinter =
    require("pdfmake/src/printer")

import path from "path"

export class PdfBuilder {

    static async export(
        title: string,
        data: any[]
    ) {

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
                bold: true
            })),

            ...data.map((item) =>

                headers.map((header) => ({
                    text: String(item[header] ?? "-")
                }))

            )

        ]
    }

}