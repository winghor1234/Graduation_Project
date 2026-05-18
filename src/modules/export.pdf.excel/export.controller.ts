import { NextRequest, NextResponse } from "next/server"
import { ExportService } from "./export.service"
import { generateExcel } from "@/utils/excelExport"
import { generateCsv } from "@/utils/csvExport"
import { generateGenericPdf, generateSalesPdf } from "@/utils/exportPdf"
import { flattenData } from "@/utils/flattenData"

export class ExportController {

    // ================= FORMAT DATA =================
    static normalizeData(data: any) {
        if (!data) return []
        // aggregate
        if (
            data &&
            typeof data === "object" &&
            !Array.isArray(data)
        ) {

            return [data]
        }

        return data
    }

    // ================= PDF =================
    static async exportPdf(
        req: NextRequest
    ) {

        try {

            // ================= QUERY =================
            const { searchParams } =
                new URL(req.url)

            const type =
                searchParams.get("type")

            // ================= VALIDATE =================
            if (!type) {

                return NextResponse.json(
                    {
                        message:
                            "Type is required"
                    },
                    {
                        status: 400
                    }
                )
            }

            // ================= GET DATA =================
            const rawData =
                await ExportService
                    .getReportData(type)

            // ================= NORMALIZE & FLATTEN =================
            const data =
                flattenData(this.normalizeData(rawData))

            // ================= GENERATE PDF =================
            let pdfBuffer: Buffer

            if (type === "sales") {
                pdfBuffer = await generateSalesPdf(data)
            } else {
                pdfBuffer = await generateGenericPdf(`${type} Report`, data)
            }

            // ================= RESPONSE =================
            return new NextResponse(
                pdfBuffer as any,
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

        } catch (error) {

            console.error(error)

            return NextResponse.json(
                {
                    message:
                        "Export PDF Failed",

                    error:
                        error instanceof Error
                            ? error.message
                            : "Unknown Error"
                },
                {
                    status: 500
                }
            )
        }
    }
    // ================= EXCEL =================
    static async exportExcel(
        req: NextRequest
    ) {

        try {

            const { searchParams } =
                new URL(req.url)

            const type =
                searchParams.get("type")

            if (!type) {

                return NextResponse.json(
                    {
                        message:
                            "Type is required"
                    },
                    {
                        status: 400
                    }
                )
            }

            // get data
            const rawData =
                await ExportService
                    .getReportData(type)

            // normalize & flatten
            const data =
                flattenData(this.normalizeData(rawData))

            // generate excel
            const excelBuffer =
                await generateExcel(
                    `${type} Report`,
                    data
                )

            return new NextResponse(
                excelBuffer,
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

        } catch (error) {

            console.error(error)

            return NextResponse.json(
                {
                    message:
                        "Export Excel Failed",
                    error: error instanceof Error ? error.message : "Unknown error"
                },
                {
                    status: 500
                }
            )
        }
    }

    // ================= CSV =================
    static async exportCsv(
        req: NextRequest
    ) {

        try {

            const { searchParams } =
                new URL(req.url)

            const type =
                searchParams.get("type")

            if (!type) {

                return NextResponse.json(
                    {
                        message:
                            "Type is required"
                    },
                    {
                        status: 400
                    }
                )
            }

            // get data
            const rawData =
                await ExportService
                    .getReportData(type)

            // normalize & flatten
            const data =
                flattenData(this.normalizeData(rawData))

            // generate csv
            const csv =
                generateCsv(data)

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

        } catch (error) {

            console.error(error)

            return NextResponse.json(
                {
                    message:
                        "Export CSV Failed",
                    error: error instanceof Error ? error.message : "Unknown error"
                },
                {
                    status: 500
                }
            )
        }
    }
}
