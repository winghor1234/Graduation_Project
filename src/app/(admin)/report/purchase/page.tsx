// 'use client';

// import { useMemo, useState } from 'react';
// import ExportButton from '@/components/ExportButton';
// import { Package } from 'lucide-react';
// import { handleProductExcelExport, handleProductPDFExport } from '@/components/report/ExportToReport';
// import { useGetExportReport } from '@/app/features/hooks/Export';
// import { PurchaseOrder } from '@/components/purchase/PurchaseType';
// import { formatCurrency } from '@/utils/FormatCurrency';
// import { getStatusBadge } from '@/components/purchase/StatusBadge';
// import { formatDate } from '@/utils/FormatDate';

// export default function ProductReportPage() {

//     const [search, setSearch] = useState('');
//     const [filterType, setFilterType] = useState<'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM'>('YEAR');
//     const [startDate, setStartDate] = useState<string>();
//     const [endDate, setEndDate] = useState<string>();

//     // 🟢 API CALL (dynamic)
//     const { data, isLoading } = useGetExportReport({
//         reportType: "PURCHASE",
//         period: filterType,
//         startDate,
//         endDate,
//     });
//     console.log(data);

//     const purchase = data?.data ?? [];

//     // 🟢 FILTER (client-side search only)
//     const filteredPurchase = useMemo(() => {
//         const keyword = search.toLowerCase();

//         return purchase.filter((item: PurchaseOrder) =>
//             item?.purchase_code?.toLowerCase().includes(keyword) ||
//             item?.supplier?.supplier_name?.toLowerCase().includes(keyword)
//         );
//     }, [purchase, search]);

//     if (isLoading) {
//         return (
//             <div className="p-6">
//                 <div className="animate-pulse space-y-4">
//                     <div className="h-10 bg-gray-200 rounded" />
//                     <div className="h-96 bg-gray-200 rounded" />
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6 bg-[#f5f7fb] min-h-screen">

//             {/* Header */}
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">
//                         Purchase Report
//                     </h1>

//                     <p className="text-sm text-gray-500">
//                         View and export purchase reports
//                     </p>
//                 </div>

//                 <div className="flex gap-2 flex-wrap">

//                     <ExportButton
//                         title="Export PDF"
//                         loading={isLoading}
//                         onExport={() =>
//                             handleProductPDFExport(filteredPurchase)
//                         }
//                     />

//                     <ExportButton
//                         title="Export Excel"
//                         loading={isLoading}
//                         onExport={() =>
//                             handleProductExcelExport(filteredPurchase)
//                         }
//                     />

//                 </div>
//             </div>

//             {/* Summary */}
//             <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

//                 <div className="flex items-center gap-3">

//                     <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
//                         <Package size={20} />
//                     </div>

//                     <div>
//                         <p className="text-sm text-gray-500">
//                             Total Products
//                         </p>

//                         <h2 className="text-2xl font-bold">
//                             {filteredPurchase.length}
//                         </h2>
//                     </div>

//                 </div>

//             </div>

//             {/* Filters */}
//             <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                     <input
//                         type="text"
//                         placeholder="Search product..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="border rounded-lg px-3 py-2 w-full"
//                     />

//                     <select
//                         value={filterType}
//                         onChange={(e) => setFilterType(e.target.value as 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM')}
//                         className="border rounded-lg px-3 py-2"
//                     >
//                         <option value="WEEK">Weekly</option>
//                         <option value="MONTH">Monthly</option>
//                         <option value="YEAR">Yearly</option>
//                         <option value="CUSTOM">Custom Range</option>
//                     </select>

//                 </div>

//                 {filterType === 'CUSTOM' && (
//                     <div className="grid md:grid-cols-2 gap-4 mt-4">

//                         <input
//                             type="date"
//                             value={startDate ?? ''}
//                             onChange={(e) => setStartDate(e.target.value)}
//                             className="border rounded-lg px-3 py-2"
//                         />

//                         <input
//                             type="date"
//                             value={endDate ?? ''}
//                             onChange={(e) => setEndDate(e.target.value)}
//                             className="border rounded-lg px-3 py-2"
//                         />

//                     </div>
//                 )}

//             </div>

//             {/* Table */}
//             <div className="bg-white rounded-xl shadow-sm overflow-hidden">

//                 <div className="overflow-x-auto">

//                     <table className="w-full">

//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="text-left px-4 py-3">Purchase code</th>
//                                 <th className="text-left px-4 py-3">Supplier</th>
//                                 <th className="text-left px-4 py-3">Total</th>
//                                 <th className="text-left px-4 py-3">Status</th>
//                                 <th className="text-left px-4 py-3">Date</th>

//                             </tr>
//                         </thead>

//                         <tbody>
//                             {filteredPurchase.length > 0 ? (
//                                 filteredPurchase.map((item: PurchaseOrder) => (
//                                     <tr
//                                         key={item.purchase_id}
//                                         className="border-t hover:bg-gray-50"
//                                     >
//                                         <td className="px-4 py-3">{item.purchase_code}</td>
//                                         <td className="px-4 py-3">{item.supplier?.supplier_name}</td>
//                                         <td className="px-4 py-3">{formatCurrency(item?.total_amount as number)}</td>
//                                         <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
//                                         <td className="px-4 py-3">{formatDate(item.purchase_date)}</td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={4} className="text-center py-10 text-gray-500">
//                                         No purchases found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>

//                     </table>

//                 </div>

//             </div>

//         </div >
//     );
// }


'use client';
import { formatCurrency, } from "@/utils/FormatCurrency";
import { formatDate, } from "@/utils/FormatDate";
import { getStatusBadge, } from "@/components/purchase/StatusBadge";
import { useReport } from "@/components/exportReport/useExportReport";
import DataTable, { Column } from "@/components/exportReport/DataTable";
import ReportLayout from "@/components/exportReport/ExportReportLayout";
import { PurchaseOrder } from "@/components/purchase/PurchaseType";
import { handlePurchasePDFExport } from "@/components/exportReport/ExportToReport";
// import { exportPurchasePDF } from "@/components/exportReport/ExportToReport";

export default function PurchaseReportPage() {

    const report = useReport<PurchaseOrder>({
        reportType: "PURCHASE",
        searchFn: (item, keyword) =>
            (item.purchase_code?.toLowerCase().includes(keyword) ?? false) ||
            (item.supplier?.supplier_name?.toLowerCase().includes(keyword) ?? false),
    });


    const columns: Column<PurchaseOrder>[] = [
        {
            key: "code",
            title: "Purchase Code",
            render: (row) => row.purchase_code,
        },
        {
            key: "supplier",
            title: "Supplier",
            render: (row) =>
                row.supplier?.supplier_name,
        },
        {
            key: "amount",
            title: "Amount",
            render: (row) =>  formatCurrency(row.total_amount ?? 0),
        },
        {
            key: "status",
            title: "Status",
            render: (row) => getStatusBadge(row.status),
        },
        {
            key: "date",
            title: "Date",
            render: (row) => formatDate(row.purchase_date),
        },
    ];

    console.log("purchase data : ",report.data)

    return (
        <ReportLayout
            title="Purchase Report"
            description="Purchase Report"
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
            onExcel={() => { }}
        >
            <DataTable
                data={report.data}
                columns={columns}
                loading={report.isLoading}
            />
        </ReportLayout>
    );
}