

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import { formatCurrency } from "./FormatCurrency";

// ================= TYPES =================

export type PDFType = "report" | "invoice" | "custom";

export type Column<T> = {
    header: string;
    key: keyof T | "__index";
};

export type ExportPDFParams<T extends Record<string, unknown>> = {
    type: PDFType;
    title: string;
    fileName?: string;
    columns: Column<T>[];
    data: T[];
    meta?: {
        companyName?: string;
        address?: string;
        phone?: string;
        email?: string;
    };
};

// ================= BUILD SUMMARY =================

const buildSummary = <T extends Record<string, unknown>>(
    columns: Column<T>[],
    data: T[]
): string => { const totalRows = data.length;
    // console.log("data : ", data);

    // ຄົ້ນຫາ column ທີ່ມີຄ່າເປັນຕົວເລກ (ຍົກເວັ້ນ __index)
    const numericColumns = columns.filter((col) => {
        if (col.key === "__index") return false;
        return data.some((row) => {
            const val = row[col.key as keyof T];
            return val !== null && val !== undefined && val !== "" && !isNaN(Number(val));
        });
    });

    const numericCards = numericColumns
        .map((col) => {
            const total = data.reduce((sum, row) => {
                const val = Number(row[col.key as keyof T]);
                return sum + (isNaN(val) ? 0 : val);
            }, 0);

            return `
            <div style="
                background: #eaf4fb;
                border-left: 4px solid #3498db;
                padding: 10px 18px;
                border-radius: 4px;
                min-width: 140px;
            ">
                <div style="font-size: 11px; color: #555; margin-bottom: 4px; font-family: 'NotoSansLao', sans-serif;">
                    ລວມ ${col.header}
                </div>
                <div style="font-size: 18px; font-weight: bold; color: #2c3e50; font-family: 'NotoSansLao', sans-serif;">
                    ${formatCurrency(total)}
                </div>
            </div>`;
        })
        .join("");

    return `
        <div style="
            margin-top: 16px;
            border-top: 1.5px solid #3498db;
            padding-top: 12px;
            font-family: 'NotoSansLao', sans-serif;
        ">
            <div style="
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #2c3e50;
                font-family: 'NotoSansLao', sans-serif;
            ">ສະຫຼຸບລວມ</div>

            <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start;">

                <!-- ຈຳນວນລາຍການທັງໝົດ -->
                <div style="
                    background: #eaf4fb;
                    border-left: 4px solid #2980b9;
                    padding: 10px 18px;
                    border-radius: 4px;
                    min-width: 140px;
                ">
                    <div style="font-size: 11px; color: #555; margin-bottom: 4px; font-family: 'NotoSansLao', sans-serif;">
                        ຈຳນວນລາຍການທັງໝົດ
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #2c3e50; font-family: 'NotoSansLao', sans-serif;">
                        ${formatCurrency(totalRows)} ລາຍການ
                    </div>
                </div>

                <!-- Numeric columns ທີ່ຄົ້ນພົບ -->
                ${numericCards}

            </div>
        </div>
    `;
};

// ================= BUILD HTML =================

const buildHTML = <T extends Record<string, unknown>>(
    params: ExportPDFParams<T>
): string => {
    const { title, columns, data, meta } = params;

    const headerCells = columns
        .map(
            (c) => `
            <th style="
                padding: 8px 12px;
                text-align: left;
                font-weight: normal;
                font-family: 'NotoSansLao', sans-serif;
                font-size: 13px;
            ">${c.header}</th>`
        )
        .join("");

    const bodyRows = data
        .map((row, index) => {
            const cells = columns
                .map((col) => {
                    const value =  col.key === "__index" ? index + 1 : row[col.key as keyof T];
                    return `
                    <td style="
                        padding: 7px 12px;
                        border-bottom: 1px solid #eee;
                        font-family: 'NotoSansLao', sans-serif;
                        font-size: 12px;
                    ">${value ?? ""}</td>`;
                })
                .join("");

            const bg = index % 2 === 1 ? "background:#f5f5f5;" : "";
            return `<tr style="${bg}">${cells}</tr>`;
        })
        .join("");

    // ສ້າງ summary block
    const summaryBlock = buildSummary(columns, data);

    return `
        <div style="
            font-family: 'NotoSansLao', sans-serif;
            font-size: 13px;
            color: #000;
            padding: 32px 40px;
            width: 794px;
            background: white;
        ">

            <!-- HEADER ROW -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                    <div style="
                        font-size: 20px;
                        font-weight: bold;
                        font-family: 'NotoSansLao', sans-serif;
                        margin-bottom: 6px;
                    ">${meta?.companyName ?? "My Company"}</div>

                    ${meta?.address ? `<div style="font-size: 11px; color: #555; font-family: 'NotoSansLao', sans-serif;">${meta.address}</div>` : ""}
                    ${meta?.phone ? `<div style="font-size: 11px; color: #555; font-family: 'NotoSansLao', sans-serif;">${meta.phone}</div>` : ""}
                    ${meta?.email ? `<div style="font-size: 11px; color: #555; font-family: 'NotoSansLao', sans-serif;">${meta.email}</div>` : ""}
                </div>

                <div style="font-size: 11px; color: #555; text-align: right; font-family: 'NotoSansLao', sans-serif;">
                    Date: ${dayjs().format("DD/MM/YYYY HH:mm")}
                </div>
            </div>

            <!-- DIVIDER -->
            <div style="border-top: 1.5px solid #3498db; margin: 10px 0 14px;"></div>

            <!-- TITLE -->
            <div style="
                font-size: 18px;
                font-weight: bold;
                font-family: 'NotoSansLao', sans-serif;
                margin-bottom: 14px;
            ">${title}</div>

            <!-- TABLE -->
            <table style="
                width: 100%;
                border-collapse: collapse;
                font-family: 'NotoSansLao', sans-serif;
            ">
                <thead>
                    <tr style="background-color: #3498db; color: white;">
                        ${headerCells}
                    </tr>
                </thead>
                <tbody>
                    ${bodyRows}
                </tbody>
            </table>

            <!-- SUMMARY -->
            ${summaryBlock}

            <!-- FOOTER -->
            <div style="
                margin-top: 20px;
                font-size: 10px;
                color: #aaa;
                font-family: 'NotoSansLao', sans-serif;
                text-align: right;
            ">
                Generated by System • ${dayjs().format("DD/MM/YYYY HH:mm")}
            </div>
        </div>
    `;
};

// ================= EXPORT PDF =================

export const exportPDF = async <T extends Record<string, unknown>>(
    params: ExportPDFParams<T>
) => {
    const { type, fileName } = params;

    // 1. ສ້າງ container ຊ່ອນນອກໜ້າຈໍ
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-9999px";
    container.style.left = "-9999px";
    container.style.zIndex = "-1";
    container.innerHTML = buildHTML(params);

    // 2. ເພີ່ມ @font-face ສຳລັບ NotoSansLao
    const style = document.createElement("style");
    style.textContent = `
        @font-face {
            font-family: 'NotoSansLao';
            src: url('/fonts/NotoSansLao-Regular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        * {
            font-family: 'NotoSansLao', sans-serif !important;
            box-sizing: border-box;
        }
    `;
    container.appendChild(style);

    document.body.appendChild(container);

    // 3. ລໍຖ້າ font ໂຫຼດກ່ອນ
    await document.fonts.ready;

    try {
        // 4. Capture ດ້ວຍ html2canvas
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
        });

        const imgData = canvas.toDataURL("image/png");

        // 5. ໃສ່ຮູບໃນ jsPDF
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
        const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // 6. ແບ່ງໜ້າອັດຕະໂນມັດຖ້າເນື້ອຫາຍາວເກີນ 1 ໜ້າ
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        // 7. ບັນທຶກໄຟລ໌
        const name = fileName ?? `${type}-${dayjs().format("YYYYMMDD-HHmm")}`;
        pdf.save(`${name}.pdf`);

    } finally {
        // 8. ລຶບ container ອອກ
        document.body.removeChild(container);
    }
};