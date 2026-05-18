import { NextRequest, NextResponse } from "next/server"
import { ExportService } from "./export.service"
import { PdfBuilder } from "./builders/pdf.builder"
import { CsvBuilder } from "./builders/csv.builder"
import { ExcelBuilder } from "./builders/excel.builder"
import { ExportColumns } from "./constants/exportColumns"

export class ExportController {
    static async export(req: NextRequest) {
        try {
            const { searchParams } = new URL(req.url)
            const type = searchParams.get("type")
            const format = searchParams.get("format")
            const period = searchParams.get("period")
            const startDate = searchParams.get("startDate")
            const endDate = searchParams.get("endDate")

            let data: any[] = []
            let columns: any[] = []
            let title = ""
            // =========================
            // SALES
            // =========================

            if (type === "sales") {
                data = await ExportService.getSalesData(period || undefined, startDate, endDate)
                columns = ExportColumns.sales
                title = "Sales Export"
            }

            // =========================
            // PRODUCTS
            // =========================

            // else if (type === "products") {
            //     data = await ExportService.getProductData()
            //     columns = ExportColumns.products
            //     title = "Product Export"
            // }

            // =========================
            // INVALID TYPE
            // =========================
            else {
                return NextResponse.json({ message: "Invalid type" }, { status: 400 })
            }

            // =========================
            // NO DATA
            // =========================

            if (!data || data.length === 0) {
                return NextResponse.json({ message: "No data found" }, { status: 404 })
            }

            // =========================
            // EXCEL
            // =========================

            if (format === "excel") {
                const buffer = await ExcelBuilder.export({
                    sheetName: title,
                    columns,
                    data
                })
                return new NextResponse(
                    new Uint8Array(buffer),
                    {
                        status: 200,
                        headers: {
                            "Content-Type":
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

                            "Content-Disposition":
                                `attachment; filename=${type}.xlsx`
                        }
                    }
                )

            }

            // =========================
            // CSV
            // =========================

            if (format === "csv") {
                const csv = CsvBuilder.export(data)
                return new NextResponse(
                    csv,
                    {
                        status: 200,
                        headers: {
                            "Content-Type":
                                "text/csv",

                            "Content-Disposition":
                                `attachment; filename=${type}.csv`
                        }
                    }
                )

            }

            // =========================
            // PDF
            // =========================

            if (format === "pdf") {
                const buffer = await PdfBuilder.export(title, data)
                return new NextResponse(
                    new Uint8Array(buffer as any),
                    {
                        status: 200,
                        headers: {
                            "Content-Type":
                                "application/pdf",

                            "Content-Disposition":
                                `attachment; filename=${type}.pdf`
                        }
                    }
                )

            }

            // =========================
            // INVALID FORMAT
            // =========================

            return NextResponse.json(
                {
                    message: "Invalid format"
                },
                {
                    status: 400
                }
            )

        } catch (error) {

            console.error(error)

            return NextResponse.json(
                {
                    message: "Export failed",
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unknown error"
                },
                {
                    status: 500
                }
            )

        }

    }

}