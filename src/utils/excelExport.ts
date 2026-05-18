import ExcelJS from "exceljs"

export const generateExcel =
    async (
        sheetName: string,
        data: any[]
    ) => {

        const workbook =
            new ExcelJS.Workbook()

        const worksheet =
            workbook.addWorksheet(sheetName)

        if (data.length > 0) {

            worksheet.columns =
                Object.keys(data[0]).map((key) => ({
                    header: key.toUpperCase(),
                    key,
                    width: 25
                }))

            worksheet.addRows(data)
        }

        return await workbook.xlsx.writeBuffer()
    }