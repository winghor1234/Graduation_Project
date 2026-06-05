
import { exportExcel } from "@/utils/exportExcel";
import { exportPDF } from "@/utils/exportPdf";

interface Column {
    header: string;
    key: string;
}

interface ExportReportProps {
    title: string;
    fileName: string;
    sheetName?: string;
    columns: Column[];
    data: any[];
}

const companyInfo = {
    companyName: "Sport Wear Systems",
    address: "Vientiane, Laos",
    phone: "02098924536",
    email: "SportWearSystems@gmail.com",
};


export const handlePDFExport = ({ title, columns, data, }: ExportReportProps) => {
    if (!data?.length) return;
    exportPDF({ type: "report", title, meta: companyInfo, columns, data, });
};



export const handleExcelExport = ({ fileName, sheetName, columns, data, }: ExportReportProps) => {
    if (!data?.length) return;
    exportExcel({ fileName, sheetName, columns, data, });
};
