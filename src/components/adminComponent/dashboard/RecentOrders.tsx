"use client"

import { Order } from "@/modules/order/order.type"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

type Props = {
    orders: Order[]
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    PENDING:   { bg: "bg-amber-50 border border-amber-200",   text: "text-amber-700",   label: "ລໍຖ້າ" },
    CONFIRMED: { bg: "bg-blue-50 border border-blue-200",     text: "text-blue-700",    label: "ຢືນຢັນ" },
    DELIVERED: { bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700", label: "ສົ່ງສຳເລັດ" },
    CANCELLED: { bg: "bg-red-50 border border-red-200",       text: "text-red-600",     label: "ຍົກເລີກ" },
    PAID:      { bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700", label: "ຊຳລະແລ້ວ" },
}

export function RecentOrders({ orders }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <ShoppingBag size={15} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">ລາຍການສັ່ງຊື້ຫຼ້າສຸດ</h3>
                        <p className="text-[11px] text-gray-400">{orders?.length ?? 0} ລາຍການ</p>
                    </div>
                </div>
                <Link
                    href="/order"
                    className="text-xs text-blue-500 hover:text-blue-600 hover:underline transition"
                >
                    ເບິ່ງທັງໝົດ →
                </Link>
            </div>

            {/* Table */}
            {!orders?.length ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
                    <ShoppingBag size={28} className="text-gray-200" />
                    <span className="text-sm">ຍັງບໍ່ມີລາຍການສັ່ງຊື້</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                <th className="text-left px-6 py-3 font-medium">ລະຫັດ</th>
                                <th className="text-left px-6 py-3 font-medium">ລູກຄ້າ</th>
                                <th className="text-right px-6 py-3 font-medium">ຍອດລວມ</th>
                                <th className="text-center px-6 py-3 font-medium">ສະຖານະ</th>
                                <th className="text-right px-6 py-3 font-medium">ວັນທີ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((o, i) => {
                                const s = STATUS_STYLE[o.status] ?? { bg: "bg-gray-100 border border-gray-200", text: "text-gray-600", label: o.status }
                                return (
                                    <tr key={i} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="px-6 py-3.5 font-mono text-xs text-gray-600">
                                            {o.order_code}
                                        </td>
                                        <td className="px-6 py-3.5 text-gray-800 font-medium">
                                            {o.customer?.customer_name ?? "—"}
                                        </td>
                                        <td className="px-6 py-3.5 text-right font-semibold text-blue-600">
                                            {formatCurrency(o.total_amount ?? 0)}
                                        </td>
                                        <td className="px-6 py-3.5 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
                                                {s.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right text-xs text-gray-400">
                                            {formatDate(o.order_date)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
