import path from "path";

import { NextResponse }
    from "next/server";

interface PdfColumn {
    header: string;
    key: string;
    width?: number;
}

interface ExportPdfProps<T> {
    title?: string;
    columns: PdfColumn[];
    data: T[];
    fileName: string;
}

export class PdfBuilder {

    static async export<T>(
        props: ExportPdfProps<T>
    ): Promise<NextResponse> {

        // dynamic import
        const PDFDocument = (await import("pdfkit")).default;

        const {
            title,
            columns,
            data,
            fileName
        } = props;

        // font path
        const regularFont =
            path.join(
                process.cwd(),
                "public/fonts/Roboto-Regular.ttf"
            );

        const boldFont =
            path.join(
                process.cwd(),
                "public/fonts/Roboto-Bold.ttf"
            );

        // create pdf
        const doc =
            new PDFDocument({
                margin: 30,
                size: "A4"
            });

        // register font
        doc.registerFont(
            "Roboto",
            regularFont
        );

        doc.registerFont(
            "Roboto-Bold",
            boldFont
        );

        // IMPORTANT
        doc.font("Roboto");

        const buffers: Buffer[] = [];

        doc.on(
            "data",
            (chunk: Buffer) => {
                buffers.push(chunk);
            }
        );

        // ===== TITLE =====

        if (title) {

            doc
                .font("Roboto-Bold")
                .fontSize(20)
                .text(title, {
                    align: "center"
                });

            doc.moveDown(2);
        }

        // ===== HEADER =====

        const startX = 50;

        let currentY = doc.y;

        columns.forEach(
            (column, index) => {

                const x =
                    startX +
                    (index * 120);

                doc
                    .font("Roboto-Bold")
                    .fontSize(12)
                    .text(
                        column.header,
                        x,
                        currentY,
                        {
                            width:
                                column.width || 100
                        }
                    );
            }
        );

        currentY += 30;

        // ===== ROWS =====

        data.forEach((row: any) => {

            columns.forEach(
                (column, index) => {

                    const x =
                        startX +
                        (index * 120);

                    doc
                        .font("Roboto")
                        .fontSize(11)
                        .text(
                            String(
                                row[column.key] ?? ""
                            ),
                            x,
                            currentY,
                            {
                                width:
                                    column.width || 100
                            }
                        );
                }
            );

            currentY += 25;

            if (currentY > 750) {

                doc.addPage();

                currentY = 50;
            }
        });

        doc.end();

        const pdfBuffer =
            await new Promise<Buffer>(
                (resolve) => {

                    doc.on("end", () => {

                        resolve(
                            Buffer.concat(buffers)
                        );
                    });
                }
            );

        return new NextResponse(
            pdfBuffer as any,
            {
                status: 200,

                headers: {
                    "Content-Type":
                        "application/pdf",

                    "Content-Disposition":
                        `attachment; filename=${fileName}.pdf`
                }
            }
        );
    }
}