'use client';
import { formatCurrency } from "@/utils/FormatCurrency";
import { formatDate } from "@/utils/FormatDate";
import { useReport } from "@/components/adminComponent/exportReport/useExportReport";
import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable";
import ReportLayout from "@/components/adminComponent/exportReport/ExportReportLayout";
import { Import } from "@/components/adminComponent/import/ImportType";
import { handleImportExcelExport, handleImportPDFExport } from "@/components/adminComponent/exportReport/ExportToReport";
import { BadgeComponent } from "@/components/adminComponent/StatusComponent";

export default function ImportReportPage() {

    const report = useReport<Import>({
        reportType: "IMPORT",
        searchFn: (item, keyword) =>
            (item.import_code?.toLowerCase().includes(keyword) ?? false) ||
            (item.purchase?.supplier?.supplier_name?.toLowerCase().includes(keyword) ?? false),
    });
console.log("import report : ",report.data);
    const columns: Column<Import>[] = [
        {
            key: "import_code",
            title: "ລະຫັດການນຳເຂົ້າ",
            render: (row) => row.import_code,
        },
        {
            key: "supplier_name",
            title: "ຜູ້ສະໜອງ",
            render: (row) => row.purchase?.supplier?.supplier_name ?? "-",
        },
        {
            key: "amount",
            title: "ຍອດລວມ",
            render: (row) =>
                formatCurrency(
                    row.import_details?.reduce(
                        (sum, d) => sum + d.cost_price * d.quantity, 0
                    ) ?? 0
                ),
        },
        {
            key: "status",
            title: "ສະຖານະ",
            render: (row) => BadgeComponent({ status: row.purchase.status }),
        },
        {
            key: "import_date",
            title: "ວັນທີ",
            render: (row) => formatDate(row.import_date),
        },
    ];

    return (
        <ReportLayout
            title="ລາຍງານການນຳເຂົ້າ"
            description="ລາຍງານການນຳເຂົ້າສິນຄ້າທັງໝົດ"
            total={report.data.length}
            loading={report.isLoading}
            search={report.search}
            setSearch={report.setSearch}
            period={report.period}
            setPeriod={report.setPeriod}
            startDate={report.startDate}
            endDate={report.endDate}
            setStartDate={report.setStartDate}
            setEndDate={report.setEndDate}
            onPdf={() => handleImportPDFExport(report.data)}
            onExcel={() => handleImportExcelExport(report.data)}
        >
            <DataTable
                data={report.data}
                columns={columns}
                loading={report.isLoading}
            />
        </ReportLayout>
    );
}