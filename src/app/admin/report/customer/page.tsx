'use client'

import { useMemo, useState } from "react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { useReport } from "@/components/adminComponent/exportReport/useExportReport"
import DataTable, { Column } from "@/components/adminComponent/exportReport/DataTable"
import { handleCustomerExcelExport, handleCustomerPDFExport } from "@/components/adminComponent/exportReport/ExportToReport"
import { Customer } from "@/components/adminComponent/customer/CustomerType"
import StatCard from "@/components/adminComponent/report/StatCard"
import ExportButton from "@/components/ExportButton"
import Link from "next/link"
import { Users, ShoppingBag, DollarSign, Star } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Period = "WEEK" | "MONTH" | "YEAR" | "CUSTOM"

export default function CustomerReportPage() {
    const [period, setPeriod] = useState<Period>("YEAR")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [search, setSearch] = useState("")

    const report = useReport<Customer>({
        reportType: "CUSTOMER",
        searchFn: (item, keyword) =>
            (item.customer_name?.toLowerCase().includes(keyword) ?? false) ||
            (item.phone?.toLowerCase().includes(keyword) ?? false) ||
            (item.email?.toLowerCase().includes(keyword) ?? false),
    })

    const summary = useMemo(() => {
        const d = report.data
        const totalOrderAmount = d.reduce((s, c) => s + (c.orders?.reduce((x, o) => x + (o.total_amount ?? 0), 0) ?? 0), 0)
        const totalSaleAmount = d.reduce((s, c) => s + (c.sales?.reduce((x, sa) => x + (sa.total_amount ?? 0), 0) ?? 0), 0)
        return {
            total: d.length,
            withOrders: d.filter(c => (c.orders?.length ?? 0) > 0).length,
            totalOrderAmount,
            totalSaleAmount,
        }
    }, [report.data])

    const chartData = useMemo(() =>
        report.data
            .map(c => ({
                ຊື່: (c.customer_name ?? '-').substring(0, 10),
                ຍອດ: (c.orders?.reduce((s, o) => s + (o.total_amount ?? 0), 0) ?? 0)
                    + (c.sales?.reduce((s, sa) => s + (sa.total_amount ?? 0), 0) ?? 0),
            }))
            .sort((a, b) => b.ຍອດ - a.ຍອດ)
            .slice(0, 8)
    , [report.data])

    const columns: Column<Customer>[] = [
        { key: "customer_name", title: "ຊື່ລູກຄ້າ", render: r => r.customer_name },
        { key: "phone", title: "ເບີໂທ", render: r => r.phone },
        { key: "email", title: "ອີເມລ", render: r => r.email },
        { key: "province", title: "ແຂວງ", render: r => r.province ?? "-" },
        { key: "point", title: "ແຕ້ມ", render: r => formatCurrency(r.point) },
        { key: "orders", title: "ຈຳນວນອໍເດີ", render: r => r.orders?.length ?? 0 },
        { key: "totalOrderAmount", title: "ຍອດຊື້ອອນລາຍ", render: r => formatCurrency(r.orders?.reduce((s, o) => s + (o.total_amount ?? 0), 0) ?? 0) },
        { key: "sales", title: "ຊື້ໜ້າຮ້ານ", render: r => r.sales?.length ?? 0 },
        { key: "totalSaleAmount", title: "ຍອດຊື້ໜ້າຮ້ານ", render: r => formatCurrency(r.sales?.reduce((s, sa) => s + (sa.total_amount ?? 0), 0) ?? 0) },
        { key: "createdAt", title: "ວັນທີສະໝັກ", render: r => formatDate(r.createdAt) },
    ]

    return (
        <div className="space-y-6 p-6 bg-[#f5f7fb] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <Link href="/admin/report" className="text-sm text-blue-500 hover:underline mb-1 block">← ກັບຄືນ</Link>
                    <h1 className="text-2xl font-bold text-gray-800">ລາຍງານລູກຄ້າ</h1>
                    <p className="text-sm text-gray-500 mt-1">ສະຫຼຸບຂໍ້ມູນລູກຄ້າທັງໝົດ</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton title="PDF" loading={report.isLoading} onExport={() => handleCustomerPDFExport(report.data)} />
                    <ExportButton title="Excel" loading={report.isLoading} onExport={() => handleCustomerExcelExport(report.data)} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="ລູກຄ້າທັງໝົດ" value={summary.total} icon={<Users size={18} />} color="blue" sub="ທັງໝົດທີ່ລົງທະບຽນ" />
                <StatCard title="ມີປະຫວັດອໍເດີ" value={summary.withOrders} icon={<ShoppingBag size={18} />} color="green" sub="ເຄີຍສັ່ງຊື້ອອນລາຍ" />
                <StatCard title="ຍອດຊື້ອອນລາຍ" value={summary.totalOrderAmount} icon={<DollarSign size={18} />} color="purple" sub="ຈາກ Order ທັງໝົດ" />
                <StatCard title="ຍອດຊື້ໜ້າຮ້ານ" value={summary.totalSaleAmount} icon={<Star size={18} />} color="amber" sub="ຈາກ Sale ທັງໝົດ" />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-4">ລູກຄ້າຍອດຊື້ສູງສຸດ (8 ອັນດັບ)</h2>
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-gray-400">ບໍ່ມີຂໍ້ມູນ</div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="ຊື່" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(v) => [formatCurrency(Number(v)), "ຍອດລວມ"]} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
                            <Bar dataKey="ຍອດ" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
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
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${report.period === p ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
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
