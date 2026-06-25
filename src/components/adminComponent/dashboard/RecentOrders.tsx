import { Order } from "@/modules/order/order.type"
import { formatCurrency } from "@/utils/FormatCurrency"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type Props = {
    orders: Order[]
}

function getStatusStyle(status: string) {
    const map: Record<string, string> = {
        PENDING:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
        CONFIRMED: "bg-brand-blue-soft text-brand-blue border border-brand-blue/30",
        DELIVERED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        CANCELLED: "bg-red-50 text-red-600 border border-red-200",
        PAID:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    }
    return map[status] ?? "bg-gray-100 text-gray-600 border border-gray-200"
}

const statusLabel: Record<string, string> = {
    PENDING:   "ລໍຖ້າ",
    CONFIRMED: "ຢືນຢັນ",
    DELIVERED: "ສົ່ງສຳເລັດ",
    CANCELLED: "ຍົກເລີກ",
    PAID:      "ຊຳລະແລ້ວ",
}

export function RecentOrders({ orders }: Props) {
    return (
        <div className={cn("p-5 rounded-2xl", theme.card)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={cn("font-semibold text-sm", theme.text)}>ລາຍການສັ່ງຊື້ຫຼ້າສຸດ</h3>
                <span className={cn("text-xs", theme.subText)}>{orders?.length ?? 0} ລາຍການ</span>
            </div>

            {!orders?.length ? (
                <p className={cn("text-sm text-center py-8", theme.subText)}>ຍັງບໍ່ມີລາຍການສັ່ງຊື້</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-125">
                        <thead>
                            <tr className="text-left border-b border-admin-border">
                                <th className={cn("pb-2 text-xs font-medium", theme.subText)}>ລະຫັດອໍເດີ້</th>
                                <th className={cn("pb-2 text-xs font-medium", theme.subText)}>ລູກຄ້າ</th>
                                <th className={cn("pb-2 text-xs font-medium", theme.subText)}>ລວມທັງໝົດ</th>
                                <th className={cn("pb-2 text-xs font-medium", theme.subText)}>ສະຖານະ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((o, i) => (
                                <tr key={i} className="border-b border-admin-border/50 hover:bg-admin-bg transition-colors">
                                    <td className={cn("py-3 font-mono text-xs", theme.text)}>{o?.order_code}</td>
                                    <td className={cn("py-3", theme.text)}>{o?.customer?.customer_name}</td>
                                    <td className={cn("py-3 font-semibold", theme.primary)}>{formatCurrency(o.total_amount ?? 0)}</td>
                                    <td className="py-3">
                                        <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", getStatusStyle(o.status))}>
                                            {statusLabel[o.status] ?? o.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}