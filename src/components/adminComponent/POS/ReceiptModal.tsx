"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { CartItemType } from "./type"

type Props = {
    data: {
        receiptNo?: string
        customer: string
        date: string
        items: CartItemType[]
        total: number
    }
    onClose: () => void
}

export default function ReceiptModal({
    data,
    onClose,
}: Props) {

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("lo-LA").format(amount)

    const exportPDF = () => {

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        })

        // Header
        doc.setFontSize(18)
        doc.text("Receipt", 105, 15, {
            align: "center",
        })

        doc.setFontSize(11)

        doc.text(
            `Receipt No: ${data.receiptNo ?? "-"}`,
            14,
            30
        )

        doc.text(
            `Customer: ${data.customer}`,
            14,
            38
        )

        doc.text(
            `Date: ${data.date}`,
            14,
            46
        )

        // Table
        autoTable(doc, {
            startY: 55,

            head: [[
                "#",
                "Product",
                "Qty",
                "Price",
                "Amount",
            ]],

            body: data.items.map((item, index) => [
                index + 1,
                item.product_name,
                item.quantity,
                formatCurrency(item.sale_price),
                formatCurrency(
                    item.sale_price *
                    item.quantity
                ),
            ]),

            styles: {
                fontSize: 10,
                cellPadding: 3,
            },

            headStyles: {
                fillColor: [41, 128, 185],
            },

            theme: "grid",
        })

        const finalY =
            (doc as any).lastAutoTable.finalY + 10

        doc.setFontSize(12)

        doc.text(
            `Total: ${formatCurrency(data.total)} LAK`,
            140,
            finalY
        )

        doc.save(
            `receipt-${Date.now()}.pdf`
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">

                <div className="space-y-3">

                    <h2 className="text-center text-xl font-bold">
                        ໃບບິນຮັບເງິນ
                    </h2>

                    <div className="text-sm">
                        <p>
                            ລູກຄ້າ:
                            {" "}
                            {data.customer}
                        </p>

                        <p>
                            ວັນທີ:
                            {" "}
                            {data.date}
                        </p>

                        <p>
                            ຈຳນວນສິນຄ້າ:
                            {" "}
                            {data.items.length}
                            {" "}
                            ລາຍການ
                        </p>
                    </div>

                    <div className="max-h-72 overflow-y-auto border rounded-lg">

                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 text-left">
                                        ສິນຄ້າ
                                    </th>

                                    <th className="p-2 text-center">
                                        ຈຳນວນ
                                    </th>

                                    <th className="p-2 text-right">
                                        ລວມ
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.items.map((item) => (
                                    <tr
                                        key={item.product_id}
                                        className="border-t"
                                    >
                                        <td className="p-2">
                                            {item.product_name}
                                        </td>

                                        <td className="p-2 text-center">
                                            {item.quantity}
                                        </td>

                                        <td className="p-2 text-right">
                                            {formatCurrency(
                                                item.sale_price *
                                                item.quantity
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>

                    <div className="flex justify-between text-lg font-bold">
                        <span>ລວມທັງໝົດ</span>

                        <span>
                            {formatCurrency(
                                data.total
                            )} LAK
                        </span>
                    </div>

                </div>

                <div className="mt-5 flex gap-2">

                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border py-2 hover:bg-gray-50"
                    >
                        ປິດ
                    </button>

                    <button
                        onClick={exportPDF}
                        className="flex-1 rounded-lg bg-green-600 py-2 text-white hover:bg-green-700"
                    >
                        Export PDF
                    </button>

                </div>

            </div>

        </div>
    )
}