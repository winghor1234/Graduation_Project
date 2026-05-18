import ExcelJS from "exceljs"

export class ExcelBuilder {

    static async export({
        sheetName,
        columns,
        data
    }: any) {

        const workbook =
            new ExcelJS.Workbook()

        const worksheet =
            workbook.addWorksheet(sheetName)

        worksheet.columns = columns

        data.forEach((row: any) => {
            worksheet.addRow(row)
        })

        worksheet.getRow(1).font = {
            bold: true
        }

        const buffer =
            await workbook.xlsx.writeBuffer()

        return Buffer.from(buffer)

    }

}