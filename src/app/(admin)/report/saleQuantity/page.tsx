// 'use client';
// import { formatCurrency } from "@/utils/FormatCurrency";
// import { formatDate } from "@/utils/FormatDate";
// import { useReport } from "@/components/adminComponent/exportReport/useExportReport";
// import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable";
// import ReportLayout from "@/components/adminComponent/exportReport/ExportReportLayout";
// import { handlePurchaseExcelExport, handlePurchasePDFExport } from "@/components/adminComponent/exportReport/ExportToReport";
// import { BadgeComponent } from "@/components/adminComponent/StatusComponent";
// import { Product } from "@/components/adminComponent/products/ProductType";
// import { Employee } from "@/modules/employee/employee.type";
// import { Customer } from "@/modules/customer/customer.type";
//  type SaleDetail = {
//     sale_detail_id: string
//     quantity: number
//     price: number
//     sale_id: string
//     product_id: string
//     product?: Product
//     createdAt: string
//     updatedAt: string
// }

//  type Sale = {
//     sale_id: string
//     sale_date: string
//     total_amount?: number
//     employee?: Employee
//     customer?: Customer
//     sale_details?: SaleDetail[]
//     createdAt: string
//     updatedAt: string
// }

// export default function PurchaseReportPage() {

//     const report = useReport<Sale>({
//         reportType: "SALE",
//         searchFn: (item, keyword) =>
//             (item.customer?.customer_name.toLowerCase().includes(keyword) ?? false) ||
//             (item.employee?.employee_name?.toLowerCase().includes(keyword) ?? false),
//     });

//     const columns: Column<Sale>[] = [
//         {
//             key: "code",
//             title: "ລະຫັດການຊື້",
//             render: (row) => row.purchase_code,
//         },
//         {
//             key: "supplier",
//             title: "ຜູ້ສະໜອງ",
//             render: (row) => row.supplier?.supplier_name,
//         },
//         {
//             key: "amount",
//             title: "ຈຳນວນເງິນ",
//             render: (row) => formatCurrency(row.total_amount ?? 0),
//         },
//         {
//             key: "status",
//             title: "ສະຖານະ",
//             render: (row) => BadgeComponent({ status: row.status }),
//         },
//         {
//             key: "date",
//             title: "ວັນທີ",
//             render: (row) => formatDate(row.purchase_date),
//         },
//     ];


//     return (
//         <ReportLayout
//             title="ລາຍງານການຊື້"
//             description="ລາຍງານການຊື້"
//             total={report.data.length}
//             loading={report.isLoading}
//             search={report.search}
//             setSearch={report.setSearch}
//             period={report.period}
//             setPeriod={report.setPeriod}
//             startDate={report.startDate}
//             endDate={report.endDate}
//             setStartDate={report.setStartDate}
//             setEndDate={report.setEndDate}
//             onPdf={() => handlePurchasePDFExport(report.data)}
//             onExcel={() => { handlePurchaseExcelExport(report.data) }}
//         >
//             <DataTable
//                 data={report.data}
//                 columns={columns}
//                 loading={report.isLoading}
//             />
//         </ReportLayout>
//     );
// }



'use client';

import { formatCurrency } from "@/utils/FormatCurrency";
import { formatDate } from "@/utils/FormatDate";
import { useReport } from "@/components/adminComponent/exportReport/useExportReport";
import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable";
import ReportLayout from "@/components/adminComponent/exportReport/ExportReportLayout";
import { Employee } from "@/modules/employee/employee.type";
import { Customer } from "@/modules/customer/customer.type";
import { Product } from "@/components/adminComponent/products/ProductType";
import { handleSaleExcelExport, handleSalePDFExport } from "@/components/adminComponent/exportReport/ExportToReport";

// ================= TYPES =================

export type SaleDetail = {
    sale_detail_id: string
    quantity: number
    price: number
    sale_id: string
    product_id: string
    product?: Product
    createdAt: string
    updatedAt: string
}

export type Sale = {
    sale_id: string
    sale_date: string
    total_amount: number
    employee?: Employee
    customer?: Customer
    sale_details?: SaleDetail[]
    createdAt: string
    updatedAt: string
}

// ================= COMPONENT =================

export default function SaleReportPage() {

    const report = useReport<Sale>({
        reportType: "SALE",
        searchFn: (item, keyword) =>
            (item.customer?.customer_name?.toLowerCase().includes(keyword) ?? false) ||
            (item.employee?.employee_name?.toLowerCase().includes(keyword) ?? false),
    });

    // ✅ columns ຕາມ Sale type
    const columns: Column<Sale>[] = [
        {
            key: "index",
            title: "#",
            render: (_, index) => (index ?? 0) + 1,
        },
        {
            key: "customer",
            title: "ລູກຄ້າ",
            render: (row) => row.customer?.customer_name ?? "-",
        },
        {
            key: "employee",
            title: "ພະນັກງານຂາຍ",
            render: (row) => row.employee?.employee_name ?? "-",
        },
        {
            key: "quantity",
            title: "ຈຳນວນສິນຄ້າ (ລວມ)",
            render: (row) =>
                row.sale_details?.reduce((sum, d) => sum + d.quantity, 0) ?? 0,
        },
        {
            key: "products",
            title: "ລາຍການສິນຄ້າ",
            render: (row) =>
                row.sale_details
                    ?.map((d) => `${d.product?.product_name ?? "-"} x${d.quantity}`)
                    .join(", ") ?? "-",
        },
        {
            key: "amount",
            title: "ຍອດລວມ",
            render: (row) => formatCurrency(row.total_amount ?? 0),
        },
        {
            key: "date",
            title: "ວັນທີ",
            render: (row) => formatDate(row.sale_date),
        },
    ];

    // ✅ PDF columns + data
    const pdfColumns = [
        { header: "#", key: "__index" },
        { header: "ລູກຄ້າ", key: "customer" },
        { header: "ພະນັກງານ", key: "employee" },
        { header: "ຈຳນວນລວມ", key: "quantity" },
        { header: "ລາຍການ", key: "products" },
        { header: "ຍອດລວມ", key: "amount" },
        { header: "ວັນທີ", key: "date" },
    ];

    const pdfData = report.data.map((row) => ({
        customer: row.customer?.customer_name ?? "-",
        employee: row.employee?.employee_name ?? "-",
        quantity: row.sale_details?.reduce((sum, d) => sum + d.quantity, 0) ?? 0,
        products: row.sale_details
            ?.map((d) => `${d.product?.product_name ?? "-"} x${d.quantity}`)
            .join(", ") ?? "-",
        amount: formatCurrency(row.total_amount ?? 0),
        date: formatDate(row.sale_date),
    }));
    return (
        <ReportLayout
            title="ລາຍງານການຂາຍ"
            description="ລາຍງານຈຳນວນສິນຄ້າທີ່ຂາຍໄດ້"
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
            onPdf={() => {handleSalePDFExport(report.data)}}
            onExcel={() => {handleSaleExcelExport(report.data)}}
        >
            <DataTable
                data={report.data}
                columns={columns}
                loading={report.isLoading}
            />
        </ReportLayout>
    );
}