'use client'

import { useMemo } from "react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { useReport } from "@/components/adminComponent/exportReport/useExportReport"
import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable"
import { handleSaleExcelExport, handleSalePDFExport } from "@/components/adminComponent/exportReport/ExportToReport"
import { Employee } from "@/modules/employee/employee.type"
import { Customer } from "@/modules/customer/customer.type"
import { Product } from "@/components/adminComponent/products/ProductType"
import StatCard from "@/components/adminComponent/report/StatCard"
import ExportButton from "@/components/ExportButton"
import Link from "next/link"
import { ShoppingBag, DollarSign, Package, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Period = "WEEK" | "MONTH" | "YEAR" | "CUSTOM"

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

export default function SaleReportPage() {
    const report = useReport<Sale>({
        reportType: "SALE",
        searchFn: (item, keyword) =>
            (item.customer?.customer_name?.toLowerCase().includes(keyword) ?? false) ||
            (item.employee?.employee_name?.toLowerCase().includes(keyword) ?? false),
    })

    const summary = useMemo(() => {
        const d = report.data
        const totalAmount = d.reduce((s, sale) => s + (sale.total_amount ?? 0), 0)
        const totalQty = d.reduce((s, sale) => s + (sale.sale_details?.reduce((x, det) => x + det.quantity, 0) ?? 0), 0)

        const productMap: Record<string, number> = {}
        d.forEach(sale => {
            sale.sale_details?.forEach(det => {
                const name = det.product?.product_name ?? "ບໍ່ລະບຸ"
                productMap[name] = (productMap[name] ?? 0) + det.quantity
            })
        })
        const topProduct = Object.entries(productMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"

        return { total: d.length, totalAmount, totalQty, topProduct }
    }, [report.data])

    const chartData = useMemo(() => {
        const map: Record<string, number> = {}
        report.data.forEach(sale => {
            const key = new Date(sale.sale_date).toISOString().slice(0, 7)
            map[key] = (map[key] ?? 0) + (sale.total_amount ?? 0)
        })
        return Object.entries(map).sort().map(([month, amount]) => ({
            ເດືອນ: new Date(month + "-01").toLocaleDateString("lo-LA", { month: "short", year: "2-digit" }),
            ຍອດ: amount,
        }))
    }, [report.data])

    const columns: Column<Sale>[] = [
        {
            key: "customer",
            title: "ລູກຄ້າ",
            render: r => r.customer?.customer_name ?? "-",
        },
        {
            key: "employee",
            title: "ພະນັກງານຂາຍ",
            render: r => r.employee?.employee_name ?? "-",
        },
        {
            key: "quantity",
            title: "ຈຳນວນລວມ",
            render: r => r.sale_details?.reduce((s, d) => s + d.quantity, 0) ?? 0,
        },
        {
            key: "products",
            title: "ລາຍການສິນຄ້າ",
            render: r => r.sale_details?.map(d => `${d.product?.product_name ?? "-"} x${d.quantity}`).join(", ") ?? "-",
        },
        {
            key: "amount",
            title: "ຍອດລວມ",
            render: r => formatCurrency(r.total_amount ?? 0),
        },
        {
            key: "date",
            title: "ວັນທີ",
            render: r => formatDate(r.sale_date),
        },
    ]

    return (
        <div className="space-y-6 p-6 bg-[#f5f7fb] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <Link href="/report" className="text-sm text-blue-500 hover:underline mb-1 block">← ກັບຄືນ</Link>
                    <h1 className="text-2xl font-bold text-gray-800">ລາຍງານການຂາຍ</h1>
                    <p className="text-sm text-gray-500 mt-1">ສະຫຼຸບຈຳນວນສິນຄ້າທີ່ຂາຍໄດ້</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton title="PDF" loading={report.isLoading} onExport={() => handleSalePDFExport(report.data)} />
                    <ExportButton title="Excel" loading={report.isLoading} onExport={() => handleSaleExcelExport(report.data)} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="ການຂາຍທັງໝົດ" value={summary.total} icon={<ShoppingBag size={18} />} color="blue" sub="ໃນຊ່ວງທີ່ເລືອກ" />
                <StatCard title="ຍອດຂາຍລວມ" value={summary.totalAmount} icon={<DollarSign size={18} />} color="green" sub="ລາຍຮັບລວມ" />
                <StatCard title="ຈຳນວນສິນຄ້າ" value={summary.totalQty} icon={<Package size={18} />} color="purple" sub="ຊິ້ນທັງໝົດທີ່ຂາຍ" />
                <StatCard title="ສິນຄ້າຂາຍດີ" value={summary.topProduct} icon={<TrendingUp size={18} />} color="amber" sub="ຈຳນວນຂາຍສູງສຸດ" />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-4">ຍອດຂາຍລາຍເດືອນ</h2>
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-gray-400">ບໍ່ມີຂໍ້ມູນ</div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="ເດືອນ" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(v) => [formatCurrency(Number(v)), "ຍອດ"]} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
                            <Bar dataKey="ຍອດ" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Filter + Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex flex-wrap gap-3 items-center justify-between">
                    <span className="text-sm text-gray-500">ທັງໝົດ: <strong>{report.data.length}</strong> ລາຍການ</span>
                    <div className="flex flex-wrap gap-2 items-center">
                        <input value={report.search} onChange={e => report.setSearch(e.target.value)} placeholder="ຄົ້ນຫາ..." className="border rounded-lg px-3 py-1.5 text-sm" />
                        {(["WEEK", "MONTH", "YEAR", "CUSTOM"] as Period[]).map(p => (
                            <button key={p} onClick={() => report.setPeriod(p as any)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${report.period === p ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                {p === "WEEK" ? "ອາທິດ" : p === "MONTH" ? "ເດືອນ" : p === "YEAR" ? "ປີ" : "ກຳນົດເອງ"}
                            </button>
                        ))}
                    </div>
                </div>
                {report.period === "CUSTOM" && (
                    <div className="px-6 py-3 flex gap-3 border-b border-gray-50">
                        <input type="date" value={report.startDate ?? ""} onChange={e => report.setStartDate(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm" />
                        <input type="date" value={report.endDate ?? ""} onChange={e => report.setEndDate(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm" />
                    </div>
                )}
                <DataTable data={report.data} columns={columns} loading={report.isLoading} />
            </div>
        </div>
    )
}
