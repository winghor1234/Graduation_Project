import { generateExcel } from "@/lib/excel"
import { generatePdf } from "@/lib/pdf"


export const ExportController = {
    async pdf<T>(config: any) {
        return generatePdf(config)
    },

    async excel<T>(config: any) {
        return generateExcel(config)
    }
}