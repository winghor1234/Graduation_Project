
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

interface ExcelColumn {
    header: string;
    key: string;
    width?: number;
}

interface ExportExcelProps<T> {
    sheetName: string;
    columns: ExcelColumn[];
    data: T[];
    fileName: string;
}

export class ExcelBuilder {

    static async export<T>(
        data: ExportExcelProps<T>
    ): Promise<NextResponse> {

        const {
            sheetName,
            columns,
            data: rows,
            fileName
        } = data;

        // create workbook
        const workbook =
            new ExcelJS.Workbook();

        // create worksheet
        const worksheet =
            workbook.addWorksheet(sheetName);

        // set columns
        worksheet.columns = columns;

        // add rows
        rows.forEach((row) => {
            worksheet.addRow(row as any);
        });

        // create buffer
        const buffer =
            await workbook.xlsx.writeBuffer();

        // return response
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

                "Content-Disposition":
                    `attachment; filename=${fileName}.xlsx`
            }
        });
    }
}