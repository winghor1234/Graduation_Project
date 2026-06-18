'use client';
import { formatCurrency } from "@/utils/FormatCurrency";
import { formatDate } from "@/utils/FormatDate";
import { useReport } from "@/components/adminComponent/exportReport/useExportReport";
import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable";
import ReportLayout from "@/components/adminComponent/exportReport/ExportReportLayout";
import { handleCustomerExcelExport, handleCustomerPDFExport } from "@/components/adminComponent/exportReport/ExportToReport";
import { Customer } from "@/components/adminComponent/customer/CustomerType";

export default function CustomerReportPage() {
    const report = useReport<Customer>({
        reportType: "CUSTOMER",
        searchFn: (item, keyword) =>
            (item.customer_name?.toLowerCase().includes(keyword) ?? false) ||
            (item.phone?.toLowerCase().includes(keyword) ?? false) ||
            (item.email?.toLowerCase().includes(keyword) ?? false),
    });

    const columns: Column<Customer>[] = [
        {
            key: "customer_name",
            title: "ຊື່ລູກຄ້າ",
            render: (row) => row.customer_name,
        },
        {
            key: "phone",
            title: "ເບີໂທ",
            render: (row) => row.phone,
        },
        {
            key: "email",
            title: "ອີເມລ",
            render: (row) => row.email,
        },
        {
            key: "province",
            title: "ແຂວງ",
            render: (row) => row.province ?? "-",
        },
        {
            key: "point",
            title: "ແຕ້ມສະສົມ",
            render: (row) => formatCurrency(row.point),
        },
        {
            key: "orders",
            title: "ຈຳນວນອໍເດີ",
            render: (row) => formatCurrency(row.orders?.length ?? 0),
        },
        {
            key: "totalOrderAmount",
            title: "ຍອດຊື້ອອນລາຍ",
            render: (row) =>
                formatCurrency(
                    row.orders?.reduce((sum, o) => sum + (o.total_amount ?? 0), 0) ?? 0
                ),
        },
        {
            key: "sales",
            title: "ຈຳນວນການຊື້ໜ້າຮ້ານ",
            render: (row) => formatCurrency(row.sales?.length ?? 0),
        },
        {
            key: "totalSaleAmount",
            title: "ຍອດຊື້ໜ້າຮ້ານ",
            render: (row) =>
                formatCurrency(
                    row.sales?.reduce((sum, s) => sum + (s.total_amount ?? 0), 0) ?? 0
                ),
        },
        {
            key: "createdAt",
            title: "ວັນທີສະໝັກ",
            render: (row) => formatDate(row.createdAt),
        },
    ];

    return (
        <ReportLayout
            title="ລາຍງານລູກຄ້າ"
            description="ລາຍງານຂໍ້ມູນລູກຄ້າທັງໝົດ"
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
            onPdf={() => handleCustomerPDFExport(report.data)}
            onExcel={() => handleCustomerExcelExport(report.data)}
        >
            <DataTable
                data={report.data}
                columns={columns}
                loading={report.isLoading}
            />
        </ReportLayout>
    );
}