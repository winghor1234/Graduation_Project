// import * as XLSX from "xlsx"

// export function exportToExcel(data: any[], sheetName = "Report") {

//     const worksheet = XLSX.utils.json_to_sheet(data)

//     const workbook = XLSX.utils.book_new()

//     XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

//     const buffer = XLSX.write(workbook, {
//         type: "buffer",
//         bookType: "xlsx"
//     })

//     return buffer

// }


import * as XLSX from "xlsx";

export type ExcelColumn<T> = {
    header: string;
    key: keyof T | "__index";
};

type ExportExcelParams<T extends Record<string, unknown>> = {
    fileName?: string;
    sheetName?: string;
    columns: ExcelColumn<T>[];
    data: T[];
};

export const exportExcel = <
    T extends Record<string, unknown>
>({
    fileName = "report",
    sheetName = "Sheet1",
    columns,
    data,
}: ExportExcelParams<T>) => {

    // ================= FORMAT DATA =================

    const formattedData = data.map(
        (row, index) => {
            const result: Record<
                string,
                unknown
            > = {};

            columns.forEach((col) => {
                result[col.header] =
                    col.key === "__index"
                        ? index + 1
                        : row[col.key];
            });

            return result;
        }
    );

    // ================= CREATE WORKSHEET =================

    const worksheet =
        XLSX.utils.json_to_sheet(
            formattedData
        );

    // ================= CREATE WORKBOOK =================

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        sheetName
    );

    // ================= EXPORT =================

    XLSX.writeFile(
        workbook,
        `${fileName}.xlsx`
    );
};