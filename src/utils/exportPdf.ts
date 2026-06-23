import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import { formatCurrency } from "./FormatCurrency";

// ================= TYPES =================

// ປະເພດຂອງ PDF ທີ່ຈະສ້າງ
export type PDFType = "report" | "invoice" | "custom";

// ໂຄງສ້າງຂອງ column ທີ່ຈະສະແດງໃນຕາຕະລາງ
// key = ຊື່ field ໃນ data object, ຫຼື "__index" = ລຳດັບ
// header = ຫົວຄໍລຳທີ່ສະແດງໃນ PDF
export type Column<T> = {
    header: string;
    key: keyof T | "__index";
};

// Parameter ທີ່ຕ້ອງໃສ່ຕອນ export PDF
export type ExportPDFParams<T extends Record<string, unknown>> = {
    type: PDFType;
    title: string;           // ຊື່ລາຍງານ
    fileName?: string;       // ຊື່ໄຟລ໌ (ຖ້າບໍ່ໃສ່ = auto-generate)
    columns: Column<T>[];   // ຄໍລຳທີ່ຈະສະແດງ
    data: T[];              // ຂໍ້ມູນທັງໝົດ
    meta?: {                // ຂໍ້ມູນຫົວໃນ header ຂອງ PDF
        companyName?: string;
        address?: string;
        phone?: string;
        email?: string;
    };
};

// ================= BUILD SUMMARY =================

/**
 * ສ້າງ HTML block ສະຫຼຸບລວມດ້ານລຸ່ມຕາຕະລາງ
 * - ສະແດງຈຳນວນ row ທັງໝົດ
 * - ຕ່ວຍ column ທີ່ຄ່າເປັນຕົວເລກ (ເຊັ່ນ ລາຄາ, ຈຳນວນ) → ຄິດລວມອັດຕະໂນມັດ
 */
const buildSummary = <T extends Record<string, unknown>>(
    columns: Column<T>[],
    data: T[]
): string => {
    const totalRows = data.length;

    // ຫາ column ທີ່ຄ່າທຸກ row ເປັນຕົວເລກໄດ້ (ຍົກເວັ້ນ column ລຳດັບ)
    const numericColumns = columns.filter((col) => {
        if (col.key === "__index") return false;
        return data.some((row) => {
            const val = row[col.key as keyof T];
            // ກວດວ່າຄ່ານັ້ນ parse ເປັນຕົວເລກໄດ້ ແລະ ບໍ່ແມ່ນ empty
            return val !== null && val !== undefined && val !== "" && !isNaN(Number(val));
        });
    });

    // ສ້າງ card HTML ສຳລັບແຕ່ລະ numeric column
    const numericCards = numericColumns.map((col) => {
        // ລວມຄ່າທຸກ row ຂອງ column ນັ້ນ
        const total = data.reduce((sum, row) => {
            const val = Number(row[col.key as keyof T]);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        // return HTML card ສຳລັບ column ນີ້
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
    }).join("");

    // return HTML ທັງໝົດຂອງ summary section
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

            <!-- Card: ຈຳນວນ row ທັງໝົດ — ສະແດງສະເໝີ -->
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
                        
                        <!-- Cards: ລວມຍອດຂອງ numeric columns ທີ່ detect ໄດ້ -->
                        ${numericCards}
                        
                        </div>
                        </div>
                        `;
};

// ================= BUILD HTML =================

/**
 * ສ້າງ HTML string ທັງໝົດ ທີ່ຈະຖືກ render ເປັນ PDF
 * ໂຄງສ້າງ: header → divider → title → table → summary → footer
 */
const buildHTML = <T extends Record<string, unknown>>(
    params: ExportPDFParams<T>
): string => {
    const { title, columns, data, meta } = params;

    // ສ້າງ <th> ສຳລັບທຸກ column ໃນ thead
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

    // ສ້າງ <tr> ສຳລັບທຸກ row ໃນ data
    const bodyRows = data
        .map((row, index) => {
            // ສ້າງ <td> ແຕ່ລະ cell — ຖ້າ key = "__index" ໃຫ້ໃຊ້ index + 1 ແທນ
            const cells = columns
                .map((col) => {
                    const value = col.key === "__index" ? index + 1 : row[col.key as keyof T];
                    return `
                    <td style="
                        padding: 7px 12px;
                        border-bottom: 1px solid #eee;
                        font-family: 'NotoSansLao', sans-serif;
                        font-size: 12px;
                    ">${value ?? ""}</td>`;
                })
                .join("");

            // ສີ row: ຄູ່ = ຂາວ, ຄີກ = grey — ໃຫ້ອ່ານງ່າຍ (zebra stripe)
            const bg = index % 2 === 1 ? "background:#f5f5f5;" : "";
            return `<tr style="${bg}">${cells}</tr>`;
        })
        .join("");

    // ສ້າງ summary section ດ້ານລຸ່ມຕາຕະລາງ
    const summaryBlock = buildSummary(columns, data);

    // ຮວມທຸກສ່ວນເຂົ້າເປັນ HTML document ດຽວ (ກວ້າງ 794px = A4 landscape)
    return `
        <div style="
            font-family: 'NotoSansLao', sans-serif;
            font-size: 13px;
            color: #000;
            padding: 32px 40px;
            width: 794px;
            background: white;
        ">

            <!-- HEADER: ຊື່ບໍລິສັດ + ຂໍ້ມູນຕິດຕໍ່ (ຊ້າຍ) + ວັນທີ (ຂວາ) -->
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

            <!-- DIVIDER: ເສັ້ນຂັ້ນລະຫວ່າງ header ແລະ title -->
            <div style="border-top: 1.5px solid #3498db; margin: 10px 0 14px;"></div>

            <!-- TITLE: ຊື່ລາຍງານ -->
            <div style="
                font-size: 18px;
                font-weight: bold;
                font-family: 'NotoSansLao', sans-serif;
                margin-bottom: 14px;
            ">${title}</div>

            <!-- TABLE: ຕາຕະລາງຂໍ້ມູນ -->
            <table style="
                width: 100%;
                border-collapse: collapse;
                font-family: 'NotoSansLao', sans-serif;
            ">
                <thead>
                    <!-- ໝວດຫົວຕາຕະລາງ ສີຟ້າ -->
                    <tr style="background-color: #3498db; color: white;">
                        ${headerCells}
                    </tr>
                </thead>
                <tbody>
                    ${bodyRows}
                </tbody>
            </table>

            <!-- SUMMARY: ສຳລັບ auto-sum column ຕົວເລກ -->
            ${summaryBlock}

            <!-- FOOTER: ສ້າງໂດຍລະບົບ + timestamp -->
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

/**
 * ຟັງຊັນຫຼັກ: ສ້າງ PDF ຈາກ data ແລ້ວ download ທັນທີ
 *
 * ຂັ້ນຕອນການເຮັດວຽກ:
 *   1. ສ້າງ HTML content → ໃສ່ໃນ hidden <div> ນອກໜ້າຈໍ
 *   2. ໃຊ້ html2canvas ຖ່າຍຮູບ <div> ນັ້ນເປັນ canvas
 *   3. ໃສ່ canvas image ລົງໃນ jsPDF (A4)
 *   4. ຖ້າ content ຍາວກວ່າ 1 ໜ້າ → ເພີ່ມໜ້າໃໝ່ loop ຈົນຄົບ
 *   5. save() → browser download ໄຟລ໌ .pdf
 *   6. ລຶບ hidden <div> ອອກ (cleanup)
 */
export const exportPDF = async <T extends Record<string, unknown>>(
    params: ExportPDFParams<T>
) => {
    const { type, fileName } = params;

    // ── Step 1: ສ້າງ container ທີ່ຊ່ອນຢູ່ນອກໜ້າຈໍ ──
    // ໃຊ້ position: fixed + top/left = -9999px
    // ເພື່ອໃຫ້ html2canvas render ໄດ້ ແຕ່ user ບໍ່ເຫັນ
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-9999px";
    container.style.left = "-9999px";
    container.style.zIndex = "-1";
    container.innerHTML = buildHTML(params);

    // ── Step 2: inject @font-face ສຳລັບພາສາລາວ ──
    // browser ຕ້ອງ load font ກ່ອນ html2canvas ຖ່າຍຮູບ
    // ໄຟລ໌ font ຕ້ອງຢູ່ທີ່ /public/fonts/NotoSansLao-Regular.ttf
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

    // ── Step 3: ລໍຖ້າ font ໂຫຼດສຳເລັດ ──
    // document.fonts.ready = Promise ທີ່ resolve ຕອນ font ທຸກ @font-face ໂຫຼດສຳເລັດ
    // ຖ້າບໍ່ wait → ຕົວໜັງສືລາວໃນ PDF ຈະ render ເປັນ □ (tofu)
    await document.fonts.ready;

    try {
        // ── Step 4: html2canvas ຖ່າຍຮູບ container ──
        // scale: 2 = ຄວາມລະອຽດສູງຂຶ້ນ 2x (ກັນ blur)
        // useCORS: ອະນຸຍາດໂຫຼດຮູບຈາກ domain ອື່ນ
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
        });

        // ── Step 5: convert canvas → base64 PNG ──
        const imgData = canvas.toDataURL("image/png");

        // ── Step 6: ສ້າງ jsPDF A4 portrait ──
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
        const pdfHeight = pdf.internal.pageSize.getHeight();  // 297mm

        // ຄິດໄລ່ຄວາມສູງຂອງຮູບໃນ mm (ຮັກສາ aspect ratio)
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // ── Step 7: loop ເພີ່ມໜ້າ PDF ຖ້າ content ຍາວກວ່າ 1 ໜ້າ ──
        // heightLeft = ຄວາມສູງທີ່ຍັງຕ້ອງ render
        // position = offset Y ທີ່ຈະ shift image ຂຶ້ນໃນແຕ່ລະໜ້າ
        let heightLeft = imgHeight;
        let position = 0;

        // ໜ້າທຳອິດ
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // ໜ້າຕໍ່ໄປ (ຖ້າຍັງເຫຼືອ)
        while (heightLeft > 0) {
            position -= pdfHeight;   // shift image ຂຶ້ນ 1 ໜ້າ
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        // ── Step 8: ບັນທຶກໄຟລ໌ ──
        // ຖ້າ fileName ບໍ່ໄດ້ໃສ່ → auto-generate ຈາກ type + timestamp
        const name = fileName ?? `${type}-${dayjs().format("YYYYMMDD-HHmm")}`;
        pdf.save(`${name}.pdf`);

    } finally {
        // ── Step 9: cleanup — ລຶບ container ທີ່ hidden ໄວ້ ──
        // ຕ້ອງ cleanup ໃນ finally ເພື່ອໃຫ້ລຶບສະເໝີ ເຖິງແມ່ນຈະ error
        document.body.removeChild(container);
    }
};