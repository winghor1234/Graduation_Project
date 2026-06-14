"use client"

import { useParams } from "next/navigation"
import { useGetSale } from "@/app/features/hooks/Sale"
import { formatDate } from "@/utils/FormatDate"
import { formatCurrency } from "@/utils/FormatCurrency"
import { BackButton } from "@/utils/BackButton"

import jsPDF from "jspdf"
import autoTable, { RowInput } from "jspdf-autotable"

export default function ReceiptPage() {
    const { id } = useParams()

    const { data, isLoading } = useGetSale(id as string)

    if (isLoading) {
        return (
            <div className="flex justify-center mt-20">
                ກຳລັງໂຫຼດ...
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex justify-center mt-20">
                ບໍ່ມີຂໍ້ມູນ
            </div>
        )
    }

    const exportPDF = () => {
        const doc = new jsPDF()

        // -------------------
        // HEADER
        // -------------------
        doc.setFontSize(20)
        doc.text("ຮ້ານຂອງຂ້ອຍ", 105, 15, {
            align: "center",
        })

        doc.setFontSize(10)

        doc.text(
            "ນະຄອນຫຼວງວຽງຈັນ, ລາວ",
            105,
            22,
            { align: "center" }
        )

        doc.text(
            "ໂທ: 020 XXXXXXXX",
            105,
            28,
            { align: "center" }
        )

        // -------------------
        // SALE INFO
        // -------------------
        doc.setFontSize(11)

        doc.text(`ເລກບິນ : ${data.sale_id}`, 14, 40)

        doc.text(
            `ວັນທີ : ${formatDate(data.sale_date)}`,
            14,
            47
        )

        doc.text(
            `ລູກຄ້າ : ${data.customer?.customer_name ?? "ລູກຄ້າທົ່ວໄປ"}`,
            14,
            54
        )

        doc.text(
            `ພະນັກງານ : ${data.employee?.employee_name ?? "-"}`,
            14,
            61
        )

        // -------------------
        // TABLE
        // -------------------
        autoTable(doc, {
            startY: 70,
            head: [
                [
                    "#",
                    "ສິນຄ້າ",
                    "ຈຳນວນ",
                    "ລາຄາ",
                    "ຈຳນວນເງິນ",
                ],
            ],
            body: data?.sale_details?.map((item, index) => [
                index + 1,
                item.product?.product_name,
                item.quantity,
                formatCurrency(item.price),
                formatCurrency(item.quantity * item.price),
            ]) as RowInput[] | undefined,
            styles: {
                fontSize: 9,
            },
            headStyles: {
                fillColor: [41, 128, 185],
            },
        })

        const finalY = (doc as any).lastAutoTable.finalY + 10

        doc.setFontSize(12)

        doc.text(
            `ຈຳນວນລາຍການ : ${data?.sale_details?.length}`,
            14,
            finalY
        )

        doc.text(
            `ລວມທັງໝົດ : ${formatCurrency(data?.total_amount ?? 0)}`,
            140,
            finalY
        )

        doc.save(`invoice-${data.sale_id}.pdf`)
    }

    return (
        <div className="min-h-screen bg-slate-100 py-8">
            <div className="max-w-5xl mx-auto">
                <BackButton />

                <div
                    id="invoice"
                    className="bg-white shadow-lg rounded-xl p-8 mt-4"
                >
                    {/* Header */}
                    <div className="text-center border-b pb-5">
                        <h1 className="text-3xl font-bold">
                            ຮ້ານຂອງຂ້ອຍ
                        </h1>

                        <p className="text-gray-500">
                            ນະຄອນຫຼວງວຽງຈັນ, ລາວ
                        </p>

                        <p className="text-gray-500">
                            ໂທ: 020 XXXXXXXX
                        </p>
                    </div>

                    {/* Invoice Info */}
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div>
                            <p>
                                <strong>ເລກບິນ:</strong>{" "}
                                {data.sale_id}
                            </p>

                            <p>
                                <strong>ວັນທີ:</strong>{" "}
                                {formatDate(data.sale_date)}
                            </p>
                        </div>

                        <div>
                            <p>
                                <strong>ລູກຄ້າ:</strong>{" "}
                                {data.customer?.customer_name ??
                                    "ລູກຄ້າທົ່ວໄປ"}
                            </p>

                            <p>
                                <strong>ພະນັກງານ:</strong>{" "}
                                {data.employee?.employee_name ?? "-"}
                            </p>
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="overflow-x-auto mt-8">
                        <table className="w-full border">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border p-3 w-16">#</th>
                                    <th className="border p-3 text-left">
                                        ສິນຄ້າ
                                    </th>
                                    <th className="border p-3 w-24">
                                        ຈຳນວນ
                                    </th>
                                    <th className="border p-3 w-40">
                                        ລາຄາ
                                    </th>
                                    <th className="border p-3 w-40">
                                        ຈຳນວນເງິນ
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {data?.sale_details?.map((item, index) => (
                                    <tr key={item.sale_detail_id}>
                                        <td className="border p-3 text-center">
                                            {index + 1}
                                        </td>

                                        <td className="border p-3">
                                            {item.product?.product_name}
                                        </td>

                                        <td className="border p-3 text-center">
                                            {item.quantity}
                                        </td>

                                        <td className="border p-3 text-right">
                                            {formatCurrency(item.price)}
                                        </td>

                                        <td className="border p-3 text-right">
                                            {formatCurrency(
                                                item.quantity * item.price
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end mt-8">
                        <div className="w-[320px] border rounded-lg p-4">
                            <div className="flex justify-between mb-2">
                                <span>ຈຳນວນລາຍການ</span>
                                <span>{data?.sale_details?.length}</span>
                            </div>

                            <div className="flex justify-between text-xl font-bold">
                                <span>ລວມທັງໝົດ</span>
                                <span>
                                    {formatCurrency(data?.total_amount ?? 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t mt-10 pt-5 text-center text-gray-500">
                        ຂອບໃຈສຳລັບການຊື້ຂາຍ
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-8 print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="px-5 py-2 rounded-lg border hover:bg-gray-50"
                        >
                            ພິມ
                        </button>

                        <button
                            onClick={exportPDF}
                            className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                            ສົ່ງອອກ PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}