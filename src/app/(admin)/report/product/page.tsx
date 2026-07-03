'use client'

import { useMemo } from "react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { useReport } from "@/components/adminComponent/exportReport/useExportReport"
import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable"
import { handleProductExcelExport, handleProductPDFExport } from "@/components/adminComponent/exportReport/ExportToReport"
import { Product } from "@/components/adminComponent/products/ProductType"
import StatCard from "@/components/adminComponent/report/StatCard"
import ExportButton from "@/components/ExportButton"
import Link from "next/link"
import { Package, Layers, AlertTriangle, Tag } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ProductReportPage() {
    const report = useReport<Product>({
        reportType: "PRODUCT",
        searchFn: (item, keyword) =>
            (item.product_name?.toLowerCase().includes(keyword) ?? false) ||
            (item.product_code?.toLowerCase().includes(keyword) ?? false) ||
            (item.category?.category_name?.toLowerCase().includes(keyword) ?? false),
    })

    const summary = useMemo(() => {
        const d = report.data
        const totalStock = d.reduce((s, p) => s + (p.variants?.reduce((x, v) => x + (v.stock_qty ?? 0), 0) ?? 0), 0)
        const outOfStock = d.filter(p => (p.variants?.reduce((x, v) => x + (v.stock_qty ?? 0), 0) ?? 0) === 0).length
        const lowStock = d.filter(p => {
            const s = p.variants?.reduce((x, v) => x + (v.stock_qty ?? 0), 0) ?? 0
            return s > 0 && s < 10
        }).length
        return { total: d.length, totalStock, outOfStock, lowStock }
    }, [report.data])

    const chartData = useMemo(() => {
        const catMap: Record<string, number> = {}
        report.data.forEach(p => {
            const cat = p.category?.category_name ?? "ອື່ນໆ"
            const stock = p.variants?.reduce((s, v) => s + (v.stock_qty ?? 0), 0) ?? 0
            catMap[cat] = (catMap[cat] ?? 0) + stock
        })
        return Object.entries(catMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([cat, stock]) => ({ ໝວດ: cat.substring(0, 12), ສາງ: stock }))
    }, [report.data])

    const columns: Column<Product>[] = [
        { key: "product_code", title: "ລະຫັດ", render: r => <span className="font-mono text-sm">{r.product_code}</span> },
        { key: "product_name", title: "ຊື່ສິນຄ້າ", render: r => r.product_name },
        { key: "category", title: "ໝວດ", render: r => r.category?.category_name ?? "—" },
        { key: "variants", title: "ຂະໜາດ", render: r => `${r.variants?.length ?? 0} ຂະໜາດ` },
        {
            key: "stock", title: "ສາງລວມ", render: r => {
                const t = r.variants?.reduce((s, v) => s + (v.stock_qty ?? 0), 0) ?? 0
                return <span className={t === 0 ? "text-red-500 font-medium" : ""}>{t}</span>
            }
        },
        {
            key: "price", title: "ລາຄາຂາຍ", render: r => {
                const prices = r.variants?.map(v => v.sale_price) ?? []
                if (!prices.length) return <span className="text-gray-400">—</span>
                const min = Math.min(...prices), max = Math.max(...prices)
                return min === max ? formatCurrency(min) : `${formatCurrency(min)} – ${formatCurrency(max)}`
            }
        },
        {
            key: "purchase_price", title: "ລາຄາຊື້", render: r => {
                const prices = r.variants?.map(v => v.purchase_price) ?? []
                if (!prices.length) return <span className="text-gray-400">—</span>
                const min = Math.min(...prices), max = Math.max(...prices)
                return min === max ? formatCurrency(min) : `${formatCurrency(min)} – ${formatCurrency(max)}`
            }
        },
    ]

    return (
        <div className="space-y-6 p-6 bg-[#f5f7fb] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <Link href="/report" className="text-sm text-blue-500 hover:underline mb-1 block">← ກັບຄືນ</Link>
                    <h1 className="text-2xl font-bold text-gray-800">ລາຍງານສິນຄ້າ</h1>
                    <p className="text-sm text-gray-500 mt-1">ສະຫຼຸບສາງສິນຄ້າທັງໝົດ</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton title="PDF" loading={report.isLoading} onExport={() => handleProductPDFExport(report.data)} />
                    <ExportButton title="Excel" loading={report.isLoading} onExport={() => handleProductExcelExport(report.data)} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="ສິນຄ້າທັງໝົດ" value={summary.total} icon={<Package size={18} />} color="blue" sub="ລາຍການໃນລະບົບ" />
                <StatCard title="ສາງລວມ" value={summary.totalStock} icon={<Layers size={18} />} color="green" sub="ຈຳນວນທັງໝົດ" />
                <StatCard title="ສິນຄ້າໝົດສາງ" value={summary.outOfStock} icon={<AlertTriangle size={18} />} color="red" sub="ຕ້ອງສັ່ງຊື້ດ່ວນ" />
                <StatCard title="ສາງໃກ້ໝົດ (<10)" value={summary.lowStock} icon={<Tag size={18} />} color="amber" sub="ສາງ < 10 ຊິ້ນ" />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-4">ສາງລວມຕາມໝວດໝູ່</h2>
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-gray-400">ບໍ່ມີຂໍ້ມູນ</div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="ໝວດ" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                            <Tooltip formatter={(v) => [Number(v), "ຈຳນວນສາງ"]} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
                            <Bar dataKey="ສາງ" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Filter + Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex flex-wrap gap-3 items-center justify-between">
                    <span className="text-sm text-gray-500">ທັງໝົດ: <strong>{report.data.length}</strong> ລາຍການ</span>
                    <input value={report.search} onChange={e => report.setSearch(e.target.value)} placeholder="ຄົ້ນຫາ..." className="border rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <DataTable data={report.data} columns={columns} loading={report.isLoading} />
            </div>
        </div>
    )
}
