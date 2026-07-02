'use client'

import { useMemo, useState } from "react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { useReport } from "@/components/adminComponent/exportReport/useExportReport"
import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable"
import { handleImportExcelExport, handleImportPDFExport } from "@/components/adminComponent/exportReport/ExportToReport"
import { Import } from "@/components/adminComponent/import/ImportType"
import { BadgeComponent } from "@/components/adminComponent/StatusComponent"
import StatCard from "@/components/adminComponent/report/StatCard"
import ExportButton from "@/components/ExportButton"
import Link from "next/link"
import { Package, DollarSign, CheckCircle, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Period = "WEEK" | "MONTH" | "YEAR" | "CUSTOM"

function fmtMonth(d: string | Date) {
    const date = new Date(d)
    return date.toLocaleDateString("lo-LA", { month: "short", year: "2-digit" })
}

export default function ImportReportPage() {
    const report = useReport<Import>({
        reportType: "IMPORT",
        searchFn: (item, keyword) =>
            (item.import_code?.toLowerCase().includes(keyword) ?? false) ||
            (item.purchase?.supplier?.supplier_name?.toLowerCase().includes(keyword) ?? false),
    })

    const summary = useMemo(() => {
        const d = report.data
        const totalCost = d.reduce((s, i) => s + (i.import_details?.reduce((x, det) => x + det.cost_price * det.quantity, 0) ?? 0), 0)
        return {
            total: d.length,
            totalCost,
            completed: d.filter(i => i.purchase?.status === "COMPLETED").length,
            pending: d.filter(i => i.purchase?.status === "PENDING").length,
        }
    }, [report.data])

    const chartData = useMemo(() => {
        const map: Record<string, number> = {}
        report.data.forEach(i => {
            const key = new Date(i.import_date).toISOString().slice(0, 7)
            const cost = i.import_details?.reduce((s, d) => s + d.cost_price * d.quantity, 0) ?? 0
            map[key] = (map[key] ?? 0) + cost
        })
        return Object.entries(map).sort().map(([month, cost]) => ({
            ເດືອນ: fmtMonth(month + "-01"),
            ຕົ້ນທຶນ: cost,
        }))
    }, [report.data])

    const columns: Column<Import>[] = [
        { key: "import_code", title: "ລະຫັດ", render: r => r.import_code },
        { key: "supplier_name", title: "ຜູ້ສະໜອງ", render: r => r.purchase?.supplier?.supplier_name ?? "-" },
        { key: "amount", title: "ຍອດລວມ", render: r => formatCurrency(r.import_details?.reduce((s, d) => s + d.cost_price * d.quantity, 0) ?? 0) },
        { key: "status", title: "ສະຖານະ", render: r => BadgeComponent({ status: r.purchase.status }) },
        { key: "import_date", title: "ວັນທີ", render: r => formatDate(r.import_date) },
    ]

    return (
        <div className="space-y-6 p-6 bg-[#f5f7fb] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <Link href="/report" className="text-sm text-blue-500 hover:underline mb-1 block">← ກັບຄືນ</Link>
                    <h1 className="text-2xl font-bold text-gray-800">ລາຍງານການນຳເຂົ້າ</h1>
                    <p className="text-sm text-gray-500 mt-1">ສະຫຼຸບການນຳເຂົ້າສິນຄ້າທັງໝົດ</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton title="PDF" loading={report.isLoading} onExport={() => handleImportPDFExport(report.data)} />
                    <ExportButton title="Excel" loading={report.isLoading} onExport={() => handleImportExcelExport(report.data)} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="ການນຳເຂົ້າທັງໝົດ" value={summary.total} icon={<Package size={18} />} color="blue" sub="ໃນຊ່ວງທີ່ເລືອກ" />
                <StatCard title="ຕົ້ນທຶນລວມ" value={summary.totalCost} icon={<DollarSign size={18} />} color="red" sub="ຄ່ານຳເຂົ້າລວມ" />
                <StatCard title="ສຳເລັດແລ້ວ" value={summary.completed} icon={<CheckCircle size={18} />} color="green" sub="ນຳເຂົ້າ completed" />
                <StatCard title="ລໍຖ້າ" value={summary.pending} icon={<Clock size={18} />} color="amber" sub="ລໍຖ້າດຳເນີນການ" />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-4">ຕົ້ນທຶນນຳເຂົ້າລາຍເດືອນ</h2>
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-gray-400">ບໍ່ມີຂໍ້ມູນ</div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="ເດືອນ" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(v: number) => [formatCurrency(v), "ຕົ້ນທຶນ"]} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
                            <Bar dataKey="ຕົ້ນທຶນ" fill="#f87171" radius={[4, 4, 0, 0]} />
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
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${report.period === p ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
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
