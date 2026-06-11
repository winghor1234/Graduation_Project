// components/dashboard/RecentOrders.tsx

import { Order } from "@/modules/order/order.types"
import { formatCurrency } from "@/utils/FormatCurrency";


type Props = {
    orders: Order[]
}

export function RecentOrders({orders }: Props ) {
    // console.log("orders : ", orders);
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-4">
                ລາຍການສັ່ງຊື້ຫຼ້າສຸດ
            </h3>

            <table className="w-full text-sm">
                <thead className="text-gray-500">
                    <tr className="text-left">
                        <th>ອໍເດີ້</th>
                        <th>ລູກຄ້າ</th>
                        <th>ລວມທັງໝົດ</th>
                        <th>ສະຖານະ</th>
                    </tr>
                </thead>

                <tbody className="text-gray-700">
                    {orders?.map((o, i) => (
                        <tr key={i} className="border-t">
                            <td className="py-3">{o?.order_code}</td>
                            <td>{o?.customer?.customer_name}</td>
                            <td>{formatCurrency(o?.total_amount)}</td>
                            <td>
                                <span className="px-2 py-1 rounded-lg text-xs bg-gray-100">
                                    {o.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}