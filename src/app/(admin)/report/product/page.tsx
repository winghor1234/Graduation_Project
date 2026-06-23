'use client'

import { formatCurrency } from "@/utils/FormatCurrency"
import { useReport } from "@/components/adminComponent/exportReport/useExportReport"
import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable"
import ReportLayout from "@/components/adminComponent/exportReport/ExportReportLayout"
import { handleProductExcelExport, handleProductPDFExport } from "@/components/adminComponent/exportReport/ExportToReport"
import { Product } from "@/components/adminComponent/products/ProductType"

export default function ProductReportPage() {

    const report = useReport<Product>({
        reportType: "PRODUCT",
        searchFn: (item, keyword) =>
            (item.product_name?.toLowerCase().includes(keyword) ?? false) || (item.product_code?.toLowerCase().includes(keyword) ?? false) || (item.category?.category_name?.toLowerCase().includes(keyword) ?? false),
    })

    console.log(report.data)

    const columns: Column<Product>[] = [
        {
            key: "product_code",
            title: "ລະຫັດສິນຄ້າ",
            render: (row) => (
                <span className="font-mono text-sm">{row.product_code}</span>
            ),
        },
        {
            key: "product_name",
            title: "ຊື່ສິນຄ້າ",
            render: (row) => row.product_name,
        },
        {
            key: "category",
            title: "ໝວດໝູ່",
            render: (row) => row.category?.category_name ?? "—",
        },
        {
            key: "variants",
            title: "ຈຳນວນຂະໜາດ(size)",
            render: (row) => (
                <span>{row.variants?.length ?? 0} ຂະໜາດ(size)</span>
            ),
        },
        {
            key: "stock",
            title: "ຈຳນວນຄົງເຫຼືອ (ລວມ)",
            render: (row) => {
                // ✅ ລວມ stock_qty ຈາກທຸກ variant
                const total = row.variants?.reduce(
                    (sum, v) => sum + (v.stock_qty ?? 0), 0
                ) ?? 0
                return (
                    <span className={total === 0 ? "text-red-500 font-medium" : ""}>
                        {total}
                    </span>
                )
            },
        },
        {
            key: "price",
            title: "ລາຄາຂາຍ",
            render: (row) => {
                // ✅ ດຶງ min/max ຈາກ variants
                const prices = row.variants?.map(v => v.sale_price) ?? []
                if (!prices.length) return <span className="text-gray-400">—</span>
                const min = Math.min(...prices)
                const max = Math.max(...prices)
                return (
                    <span>
                        {min === max
                            ? formatCurrency(min)
                            : `${formatCurrency(min)} – ${formatCurrency(max)}`}
                    </span>
                )
            },
        },
        {
            key: "purchase_price",
            title: "ລາຄາຊື້",
            render: (row) => {
                const prices = row.variants?.map(v => v.purchase_price) ?? []
                if (!prices.length) return <span className="text-gray-400">—</span>
                const min = Math.min(...prices)
                const max = Math.max(...prices)
                return (
                    <span>
                        {min === max
                            ? formatCurrency(min)
                            : `${formatCurrency(min)} – ${formatCurrency(max)}`}
                    </span>
                )
            },
        },
    ]

    return (
        <ReportLayout
            title="ລາຍງານສິນຄ້າ"
            description="ສະແດງ ແລະ ສົ່ງອອກລາຍງານຂໍ້ມູນສິນຄ້າ"
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
            onPdf={() => handleProductPDFExport(report.data)}
            onExcel={() => handleProductExcelExport(report.data)}
        >
            <DataTable
                data={report.data}
                columns={columns}
                loading={report.isLoading}
            />
        </ReportLayout>
    )
}