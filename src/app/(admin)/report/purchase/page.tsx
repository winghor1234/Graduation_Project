'use client'

import { useMemo } from "react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { useReport } from "@/components/adminComponent/exportReport/useExportReport"
import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable"
import { handlePurchaseExcelExport, handlePurchasePDFExport } from "@/components/adminComponent/exportReport/ExportToReport"
import { PurchaseOrder } from "@/components/adminComponent/purchase/PurchaseType"
import { BadgeComponent } from "@/components/adminComponent/StatusComponent"
import StatCard from "@/components/adminComponent/report/StatCard"
import ExportButton from "@/components/ExportButton"
import Link from "next/link"
import { ShoppingCart, DollarSign, CheckCircle, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Period = "WEEK" | "MONTH" | "YEAR" | "CUSTOM"

export default function PurchaseReportPage() {
    const report = useReport<PurchaseOrder>({
        reportType: "PURCHASE",
        searchFn: (item, keyword) =>
            (item.purchase_code?.toLowerCase().includes(keyword) ?? false) ||
            (item.supplier?.supplier_name?.toLowerCase().includes(keyword) ?? false),
    })

    const summary = useMemo(() => {
        const d = report.data
        const totalAmount = d.reduce((s, p) => s + (p.total_amount ?? 0), 0)
        const completed = d.filter(p => p.status === "COMPLETED").length
        const pending = d.filter(p => p.status === "PENDING").length
        return { total: d.length, totalAmount, completed, pending }
    }, [report.data])

    const chartData = useMemo(() => {
        const map: Record<string, number> = {}
        report.data.forEach(p => {
            const key = new Date(p.purchase_date).toISOString().slice(0, 7)
            map[key] = (map[key] ?? 0) + (p.total_amount ?? 0)
        })
        return Object.entries(map).sort().map(([month, amount]) => ({
            ເດືອນ: new Date(month + "-01").toLocaleDateString("lo-LA", { month: "short", year: "2-digit" }),
            ຍອດ: amount,
        }))
    }, [report.data])

    const columns: Column<PurchaseOrder>[] = [
        { key: "code", title: "ລະຫັດ", render: r => r.purchase_code },
        { key: "supplier", title: "ຜູ້ສະໜອງ", render: r => r.supplier?.supplier_name },
        { key: "amount", title: "ຍອດ", render: r => formatCurrency(r.total_amount ?? 0) },
        { key: "status", title: "ສະຖານະ", render: r => BadgeComponent({ status: r.status }) },
        { key: "date", title: "ວັນທີ", render: r => formatDate(r.purchase_date) },
    ]

    return (
        <div className="space-y-6 p-6 bg-[#f5f7fb] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <Link href="/report" className="text-sm text-blue-500 hover:underline mb-1 block">← ກັບຄືນ</Link>
                    <h1 className="text-2xl font-bold text-gray-800">ລາຍງານການສັ່ງຊື້</h1>
                    <p className="text-sm text-gray-500 mt-1">ສະຫຼຸບການສັ່ງຊື້ຈາກຜູ້ສະໜອງທັງໝົດ</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton title="PDF" loading={report.isLoading} onExport={() => handlePurchasePDFExport(report.data)} />
                    <ExportButton title="Excel" loading={report.isLoading} onExport={() => handlePurchaseExcelExport(report.data)} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="ໃບສັ່ງຊື້ທັງໝົດ" value={summary.total} icon={<ShoppingCart size={18} />} color="blue" sub="ໃນຊ່ວງທີ່ເລືອກ" />
                <StatCard title="ຍອດລວມ" value={summary.totalAmount} icon={<DollarSign size={18} />} color="red" sub="ຄ່າໃຊ້ຈ່າຍລວມ" />
                <StatCard title="ສຳເລັດແລ້ວ" value={summary.completed} icon={<CheckCircle size={18} />} color="green" sub="ດຳເນີນການ completed" />
                <StatCard title="ລໍຖ້າ" value={summary.pending} icon={<Clock size={18} />} color="amber" sub="ຍັງລໍຖ້າ" />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-4">ຍອດສັ່ງຊື້ລາຍເດືອນ</h2>
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-gray-400">ບໍ່ມີຂໍ້ມູນ</div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="ເດືອນ" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(v) => [formatCurrency(Number(v)), "ຍອດ"]} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
                            <Bar dataKey="ຍອດ" fill="#f59e0b" radius={[4, 4, 0, 0]} />
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
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${report.period === p ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                {p === "WEEK" ? "ສັບດາ" : p === "MONTH" ? "ເດືອນ" : p === "YEAR" ? "ປີ" : "ກຳນົດເອງ"}
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
