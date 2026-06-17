'use client';
import { formatCurrency } from "@/utils/FormatCurrency";
import { formatDate } from "@/utils/FormatDate";
import { useReport } from "@/components/adminComponent/exportReport/useExportReport";
import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable";
import ReportLayout from "@/components/adminComponent/exportReport/ExportReportLayout";
import { PurchaseOrder } from "@/components/adminComponent/purchase/PurchaseType";
import { handlePurchaseExcelExport, handlePurchasePDFExport } from "@/components/adminComponent/exportReport/ExportToReport";
import { BadgeComponent } from "@/components/adminComponent/StatusComponent";

export default function CustomerReportPage() {

    const report = useReport<PurchaseOrder>({
        reportType: "PURCHASE",
        searchFn: (item, keyword) =>
            (item.purchase_code?.toLowerCase().includes(keyword) ?? false) ||
            (item.supplier?.supplier_name?.toLowerCase().includes(keyword) ?? false),
    });

    const columns: Column<PurchaseOrder>[] = [
        {
            key: "code",
            title: "ລະຫັດການຊື້",
            render: (row) => row.purchase_code,
        },
        {
            key: "supplier",
            title: "ຜູ້ສະໜອງ",
            render: (row) => row.supplier?.supplier_name,
        },
        {
            key: "amount",
            title: "ຈຳນວນເງິນ",
            render: (row) => formatCurrency(row.total_amount ?? 0),
        },
        {
            key: "status",
            title: "ສະຖານະ",
            render: (row) => BadgeComponent({ status: row.status }),
        },
        {
            key: "date",
            title: "ວັນທີ",
            render: (row) => formatDate(row.purchase_date),
        },
    ];


    return (
        <ReportLayout
            title="ລາຍງານການຊື້"
            description="ລາຍງານການຊື້"
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
            onPdf={() => handlePurchasePDFExport(report.data)}
            onExcel={() => { handlePurchaseExcelExport(report.data) }}
        >
            <DataTable
                data={report.data}
                columns={columns}
                loading={report.isLoading}
            />
        </ReportLayout>
    );
}