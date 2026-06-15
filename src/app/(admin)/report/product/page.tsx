"use client"

import { useMemo, useState } from "react"
import ExportButton from "@/components/ExportButton"
import { Package } from "lucide-react"
import {
    handleProductExcelExport,
    handleProductPDFExport,
} from "@/components/adminComponent/exportReport/ExportToReport"
import { useGetExportReport } from "@/app/features/hooks/Export"
import { Product } from "@/modules/product/product.types"

export default function ProductReportPage() {

    const [search, setSearch] = useState("")
    const [filterType, setFilterType] = useState<
        "WEEK" | "MONTH" | "YEAR" | "CUSTOM"
    >("YEAR")

    const [startDate, setStartDate] = useState<string>()
    const [endDate, setEndDate] = useState<string>()

    const { data, isLoading } = useGetExportReport({
        reportType: "PRODUCT",
        period: filterType,
        startDate,
        endDate,
    })

    const products = data?.data ?? []

    const filteredProducts = useMemo(() => {
        const keyword = search.toLowerCase().trim()

        return products.filter((item: Product) =>
            item?.product_name?.toLowerCase().includes(keyword) ||
            item?.product_code?.toLowerCase().includes(keyword)
        )
    }, [products, search])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                ກຳລັງໂຫຼດລາຍງານ...
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 bg-slate-50 min-h-screen">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        ລາຍງານສິນຄ້າ
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        ສະແດງ ແລະ ສົ່ງອອກລາຍງານຂໍ້ມູນສິນຄ້າ
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">

                    <ExportButton
                        title="ສົ່ງອອກ PDF"
                        loading={isLoading}
                        onExport={() =>
                            handleProductPDFExport(
                                filteredProducts
                            )
                        }
                    />

                    <ExportButton
                        title="ສົ່ງອອກ Excel"
                        loading={isLoading}
                        onExport={() =>
                            handleProductExcelExport(
                                filteredProducts
                            )
                        }
                    />

                </div>

            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">

                <div className="flex items-center gap-4">

                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                        <Package size={24} />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            ຈຳນວນສິນຄ້າທັງໝົດ
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800">
                            {products.length}
                        </h2>
                    </div>

                </div>

            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <input
                        type="text"
                        placeholder="ຄົ້ນຫາສິນຄ້າ..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={filterType}
                        onChange={(e) =>
                            setFilterType(
                                e.target.value as
                                | "WEEK"
                                | "MONTH"
                                | "YEAR"
                                | "CUSTOM"
                            )
                        }
                        className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="WEEK">
                            ລາຍອາທິດ
                        </option>

                        <option value="MONTH">
                            ລາຍເດືອນ
                        </option>

                        <option value="YEAR">
                            ລາຍປີ
                        </option>

                        <option value="CUSTOM">
                            ກຳນົດເອງ
                        </option>
                    </select>

                </div>

                {filterType === "CUSTOM" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                ວັນທີເລີ່ມຕົ້ນ
                            </label>

                            <input
                                type="date"
                                value={startDate ?? ""}
                                onChange={(e) =>
                                    setStartDate(
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                ວັນທີສິ້ນສຸດ
                            </label>

                            <input
                                type="date"
                                value={endDate ?? ""}
                                onChange={(e) =>
                                    setEndDate(
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                    </div>
                )}

            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[700px]">

                        <thead className="bg-slate-100">

                            <tr>

                                <th className="text-left px-4 py-3 font-semibold">
                                    ລະຫັດສິນຄ້າ
                                </th>

                                <th className="text-left px-4 py-3 font-semibold">
                                    ຊື່ສິນຄ້າ
                                </th>

                                <th className="text-left px-4 py-3 font-semibold">
                                    ຈຳນວນຄົງເຫຼືອ
                                </th>

                                <th className="text-left px-4 py-3 font-semibold">
                                    ລາຄາຂາຍ
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(
                                    (item: Product) => (
                                        <tr
                                            key={
                                                item.product_id
                                            }
                                            className="border-t hover:bg-slate-50 transition-colors"
                                        >

                                            <td className="px-4 py-3">
                                                {
                                                    item.product_code
                                                }
                                            </td>

                                            <td className="px-4 py-3">
                                                {
                                                    item.product_name
                                                }
                                            </td>

                                            <td className="px-4 py-3">
                                                {
                                                    item.stock_qty
                                                }
                                            </td>

                                            <td className="px-4 py-3">
                                                $
                                                {Number(
                                                    item.sale_price
                                                ).toLocaleString()}
                                            </td>

                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-10 text-gray-500"
                                    >
                                        ບໍ່ພົບຂໍ້ມູນສິນຄ້າ
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}