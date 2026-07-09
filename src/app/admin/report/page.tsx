"use client"

import { useGetDashboard } from "@/app/features/hooks/Dashboard"
import SalesGraphCard from "@/components/adminComponent/report/SalesGraphCard"
import StatCard from "@/components/adminComponent/report/StatCard"
import {
    DollarSign,
    ShoppingCart,
    Package,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Users,
    BarChart2,
    ArrowRight,
    FileText,
    Layers,
} from "lucide-react"
import Link from "next/link"

const operationReports = [
    {
        title: "ສິນຄ້າ",
        desc: "ສາງ, ລາຄາ, ໝວດໝູ່",
        href: "/admin/report/product",
        icon: <Package size={20} />,
        color: "blue",
    },
    {
        title: "ການສັ່ງຊື້",
        desc: "ໃບສັ່ງຊື້, ຜູ້ສະໜອງ",
        href: "/admin/report/purchase",
        icon: <ShoppingCart size={20} />,
        color: "amber",
    },
    {
        title: "ການນຳເຂົ້າ",
        desc: "ນຳເຂົ້າສາງ, ຕົ້ນທຶນ",
        href: "/admin/report/import",
        icon: <Layers size={20} />,
        color: "red",
    },
    {
        title: "ລູກຄ້າ",
        desc: "ຂໍ້ມູນ, ປະຫວັດການຊື້",
        href: "/admin/report/customer",
        icon: <Users size={20} />,
        color: "purple",
    },
    {
        title: "ການຂາຍ",
        desc: "ຈຳນວນ, ລາຍການສິນຄ້າ",
        href: "/admin/report/saleQuantity",
        icon: <BarChart2 size={20} />,
        color: "green",
    },
]

const financialReports = [
    {
        title: "ລາຍຮັບ",
        desc: "ຍອດຂາຍ, ແນວໂນ້ມລາຍເດືອນ",
        href: "/admin/report/revenue",
        icon: <DollarSign size={20} />,
        color: "blue",
    },
    {
        title: "ກຳໄລ",
        desc: "ລາຍຮັບ ຫັກ ຕົ້ນທຶນ",
        href: "/admin/report/profit",
        icon: <TrendingUp size={20} />,
        color: "green",
    },
    {
        title: "ລາຍຈ່າຍ",
        desc: "ຕົ້ນທຶນ, ຄ່າໃຊ້ຈ່າຍ",
        href: "/admin/report/expenses",
        icon: <TrendingDown size={20} />,
        color: "red",
    },
]

const colorMap: Record<string, { bg: string; text: string; ring: string; hover: string }> = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   ring: "ring-blue-100",   hover: "hover:bg-blue-100" },
    amber:  { bg: "bg-amber-50",  text: "text-amber-600",  ring: "ring-amber-100",  hover: "hover:bg-amber-100" },
    red:    { bg: "bg-red-50",    text: "text-red-500",    ring: "ring-red-100",    hover: "hover:bg-red-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-100", hover: "hover:bg-purple-100" },
    green:  { bg: "bg-emerald-50",text: "text-emerald-600",ring: "ring-emerald-100",hover: "hover:bg-emerald-100" },
}

type ReportItem = { title: string; desc: string; href: string; icon: React.ReactNode; color: string }

function ReportCard({ item }: { item: ReportItem }) {
    const c = colorMap[item.color] ?? colorMap.blue
    return (
        <Link
            href={item.href}
            className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
        >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ring-2 ${c.bg} ${c.text} ${c.ring} ${c.hover} transition shrink-0`}>
                {item.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{item.desc}</p>
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
    )
}

export default function ReportPage() {
    const { data, isLoading, error } = useGetDashboard()
    const report = data?.data

    return (
        <div className="space-y-6 p-6 bg-[#f5f7fb] min-h-screen">

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">ລາຍງານ</h1>
                <p className="text-sm text-gray-500 mt-1">ພາບລວມການດຳເນີນງານ ແລະ ລາຍງານລາຍລະອຽດ</p>
            </div>

            {/* KPI Summary */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100" />
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-500 rounded-2xl px-6 py-4 text-sm border border-red-100">
                    ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard title="ລາຍຮັບລວມ" value={report?.summary?.revenue ?? 0} icon={<DollarSign size={18} />} color="blue" sub="ລາຍຮັບທັງໝົດ" />
                    <StatCard title="ຕົ້ນທຶນລວມ" value={report?.summary?.cost ?? 0} icon={<TrendingDown size={18} />} color="red" sub="ຄ່າໃຊ້ຈ່າຍລວມ" />
                    <StatCard title="ກຳໄລລວມ" value={report?.summary?.profit ?? 0} icon={<TrendingUp size={18} />} color="green" sub="ລາຍຮັບ ຫັກ ຕົ້ນທຶນ" />
                    <StatCard title="ອໍເດີ້ທັງໝົດ" value={report?.order?.length ?? 0} icon={<ShoppingCart size={18} />} color="purple" sub="ຈຳນວນໃບສັ່ງ" />
                    <StatCard title="ສິນຄ້າທີ່ຂາຍໄດ້" value={report?.sold?.length ?? 0} icon={<Package size={18} />} color="blue" sub="ລາຍການທີ່ຂາຍ" />
                    <StatCard title="ການສັ່ງຊື້" value={report?.purchases?.length ?? 0} icon={<FileText size={18} />} color="amber" sub="ໃບສັ່ງຊື້ທັງໝົດ" />
                    <StatCard title="ການນຳເຂົ້າ" value={report?.imports?.length ?? 0} icon={<Layers size={18} />} color="amber" sub="ລາຍການນຳເຂົ້າ" />
                    <StatCard title="ສາງໃກ້ໝົດ" value={report?.lowStock?.length ?? 0} icon={<AlertTriangle size={18} />} color="red" sub="ຕ້ອງສັ່ງຊື້ດ່ວນ" />
                </div>
            )}

            {/* Sales Graph */}
            <div className="w-full min-w-0">
                <SalesGraphCard data={report} />
            </div>

            {/* Report Links */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Operations */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-5 rounded bg-blue-500" />
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">ລາຍງານດ້ານການດຳເນີນງານ</h2>
                    </div>
                    {operationReports.map(item => <ReportCard key={item.href} item={item} />)}
                </div>

                {/* Financial */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-5 rounded bg-emerald-500" />
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">ລາຍງານດ້ານການເງິນ</h2>
                    </div>
                    {financialReports.map(item => <ReportCard key={item.href} item={item} />)}
                </div>

            </div>
        </div>
    )
}
