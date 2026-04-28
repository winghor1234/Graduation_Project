// components/dashboard/RecentOrders.tsx

const orders = [
    { id: "#001", customer: "John", total: "$120", status: "Paid" },
    { id: "#002", customer: "Anna", total: "$80", status: "Pending" },
    { id: "#003", customer: "Mike", total: "$45", status: "Cancel" },
]

export function RecentOrders() {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-4">
                Recent Orders
            </h3>

            <table className="w-full text-sm">
                <thead className="text-gray-500">
                    <tr className="text-left">
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody className="text-gray-700">
                    {orders.map((o, i) => (
                        <tr key={i} className="border-t">
                            <td className="py-3">{o.id}</td>
                            <td>{o.customer}</td>
                            <td>{o.total}</td>
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