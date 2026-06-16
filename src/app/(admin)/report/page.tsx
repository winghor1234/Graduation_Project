"use client"

import { useGetDashboard } from "@/app/features/hooks/Dashboard"
import SalesGraphCard from "@/components/adminComponent/report/SalesGraphCard"
import StatCard from "@/components/adminComponent/report/StatCard"
import {
    DollarSign,
    ShoppingCart,
    Package,
    AlertTriangle,
    Import,
    BaggageClaim
} from "lucide-react"
import Link from "next/link"

export default function ReportPage() {

    const { data, isLoading, error } = useGetDashboard()

    const report = data?.data

    const reports = [
        {
            title: "ລາຍງານສິນຄ້າ",
            href: "/report/product",
        },
        {
            title: "ລາຍງານການສັ່ງຊື້",
            href: "/report/purchase",
        },
        {
            title: "ລາຍງານການນຳເຂົ້າ",
            href: "/report/import",
        },
        {
            title: "ລາຍງານລູກຄ້າ",
            href: "/report/customer",
        },
        {
            title: "ລາຍງານການຂາຍ",
            href: "/report/sale",
        },
        {
            title: "ລາຍງານລາຍຮັບ",
            href: "/report/revenue",
        },
        {
            title: "ລາຍງານກຳໄລ",
            href: "/report/profit",
        },
        {
            title: "ລາຍງານລາຍຈ່າຍ",
            href: "/report/expenses",
        },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                ກຳລັງໂຫຼດຂໍ້ມູນ...
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6 space-y-6">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        ແຜງຄວບຄຸມ
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        ສະຫຼຸບພາບລວມການດຳເນີນງານຂອງທຸລະກິດ
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 w-full lg:w-auto">

                    {reports.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                        >
                            <h2 className="font-semibold text-gray-800">
                                {item.title}
                            </h2>

                            {/* <p className="text-sm text-gray-500 mt-2">
                                ລາຍງານ
                            </p> */}
                        </Link>
                    ))}

                </div>

            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <StatCard
                    title="ລາຍຮັບລວມ"
                    value={report?.summary?.revenue || 0}
                    prefix="$"
                    growth={14.4}
                    sub="ທຽບກັບເດືອນກ່ອນ"
                    icon={<DollarSign size={18} />}
                    color="blue"
                />

                <StatCard
                    title="ຕົ້ນທຶນລວມ"
                    value={report?.summary?.cost || 0}
                    prefix="$"
                    growth={-3.2}
                    sub="ທຽບກັບເດືອນກ່ອນ"
                    icon={<DollarSign size={18} />}
                    color="red"
                />

                <StatCard
                    title="ກຳໄລລວມ"
                    value={report?.summary?.profit || 0}
                    prefix="$"
                    growth={22.1}
                    sub="ທຽບກັບເດືອນກ່ອນ"
                    icon={<DollarSign size={18} />}
                    color="green"
                />

                <StatCard
                    title="ອໍເດີ້ທັງໝົດ"
                    value={report?.order?.length || 0}
                    growth={16.6}
                    sub="ສະເລ່ຍຕໍ່ວັນ"
                    icon={<ShoppingCart size={18} />}
                    color="purple"
                />

                <StatCard
                    title="ສິນຄ້າທີ່ຂາຍໄດ້"
                    value={report?.sold?.length || 0}
                    sub="ຈຳນວນສິນຄ້າຂາຍອອກ"
                    icon={<Package size={18} />}
                    color="blue"
                />

                <StatCard
                    title="ການສັ່ງຊື້"
                    value={report?.purchases?.length || 0}
                    sub="ໃນເດືອນນີ້"
                    icon={<BaggageClaim size={18} />}
                    color="amber"
                />

                <StatCard
                    title="ການນຳເຂົ້າ"
                    value={report?.imports?.length || 0}
                    sub="ໃນເດືອນນີ້"
                    icon={<Import size={18} />}
                    color="amber"
                />

                <StatCard
                    title="ແຈ້ງເຕືອນສິນຄ້າໃກ້ໝົດ"
                    value={report?.lowStock?.length || 0}
                    sub="ສິນຄ້າໃກ້ໝົດສະຕ໋ອກ"
                    icon={<AlertTriangle size={18} />}
                    color="red"
                />

            </div>

            {/* Graph */}
            <div className="w-full min-w-0">
                <SalesGraphCard
                    data={report}
                />
            </div>

        </div>
    )
}