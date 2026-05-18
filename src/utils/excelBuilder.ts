import ExcelJS from "exceljs"

interface ExportOptions<T> {

    sheetName: string

    columns: {
        header: string
        key: keyof T | string
        width?: number
    }[]

    data: T[]

}

export class ExcelBuilder {

    static async export<T>({
        sheetName,
        columns,
        data
    }: ExportOptions<T>) {

        const workbook =
            new ExcelJS.Workbook()

        const worksheet =
            workbook.addWorksheet(sheetName)

        worksheet.columns =
            columns as any

        data.forEach((row) => {
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