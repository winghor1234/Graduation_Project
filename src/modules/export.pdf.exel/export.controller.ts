import { NextRequest } from "next/server"
import { generateExcel } from "@/lib/excel"
import { generatePdf } from "@/lib/pdf"
import { ExportConfig } from "@/types/export"

export const ExportController = {
    async pdf<T extends Record<string, unknown>>(req: NextRequest) {
        try {
            const config: ExportConfig<T> = await req.json()
            return await generatePdf(config)
        } catch (error) {
            console.log(error)
            return Response.json(
                { success: false, message: "Generate PDF failed" },
                { status: 500 }
            )
        }
    },

    async excel<T extends Record<string, unknown>>(req: NextRequest) {
        try {
            const config: ExportConfig<T> = await req.json()
            return await generateExcel(config)
        } catch (error) {
            console.log(error)
            return Response.json(
                { success: false, message: "Generate Excel failed" },
                { status: 500 }
            )

        }

    }

}