"use client"

import { useParams } from "next/navigation"
import { useMemo } from "react"
import { useGetSale } from "@/app/features/hooks/Sale"
import { formatDate } from "@/utils/FormatDate"
import { formatCurrency } from "@/utils/FormatCurrency"
import { BackButton } from "@/utils/BackButton"

import jsPDF from "jspdf"
import autoTable, { RowInput } from "jspdf-autotable"

// -----------------------------------------------------------------
// ‼️ ສຳຄັນ: jsPDF ບໍ່ມີຟອນພາສາລາວມາໃນຕົວ (default font = Helvetica)
// ຕ້ອງ embed ຟອນລາວ (ແນະນຳ Noto Sans Lao) ກ່ອນຈຶ່ງຈະພິມຕົວອັກສອນລາວ
// ອອກໃນ PDF ໄດ້ຖືກຕ້ອງ. ວິທີສ້າງ base64 font:
//
// 1. ໂຫຼດຟອນ .ttf (ເຊັ່ນ NotoSansLao-Regular.ttf)
// 2. ໃຊ້ jsPDF Fontconverter: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
//    ຫຼື script: node -e "console.log(require('fs').readFileSync('font.ttf').toString('base64'))"
// 3. ເອົາຜົນ base64 ມາວາງໃນໄຟລ໌ lib/fonts/NotoSansLao.ts ດັ່ງຕົວຢ່າງ:
//      export const NotoSansLaoBase64 = "AAEAAAAR..." // (string ຍາວຫຼາຍ)
// 4. import ມາໃຊ້ດັ່ງລຸ່ມນີ້
//
// ຖ້າຍັງບໍ່ມີໄຟລ໌ font, ໃຫ້ comment ສ່ວນ embed font ໄວ້ກ່ອນ —
// ແຕ່ໃຫ້ຮູ້ໄວ້ວ່າ exportPDF ຈະບໍ່ສະແດງຕົວອັກສອນລາວຖືກຕ້ອງ.
// -----------------------------------------------------------------

// ປະກາດ type ໃຫ້ jsPDF instance ທີ່ມີ lastAutoTable (ແທນການໃຊ້ `as any`)
type jsPDFWithAutoTable = jsPDF & {
    lastAutoTable: { finalY: number }
}

function registerLaoFont(doc: jsPDF) {
    doc.addFileToVFS("NotoSansLao-Regular.ttf", NotoSansLaoBase64)
    doc.addFont("NotoSansLao-Regular.ttf", "NotoSansLao", "normal")
    doc.setFont("NotoSansLao")
}

export default function ReceiptPage() {
    const { id } = useParams()

    const { data, isLoading } = useGetSale(id as string)

    const saleDetails = data?.sale_details ?? []

    // ຄຳນວນຍອດລວມຄືນຈາກ sale_details ກໍລະນີ total_amount ບໍ່ມີຄ່າ (null)
    const computedTotal = useMemo(
        () =>
            saleDetails.reduce(
                (sum, item) => sum + Number(item.quantity) * Number(item.price),
                0
            ),
        [saleDetails]
    )

    const totalAmount = data?.total_amount ?? computedTotal

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
        const doc = new jsPDF() as jsPDFWithAutoTable

        registerLaoFont(doc)

        // -------------------
        // HEADER
        // -------------------
        doc.setFontSize(20)
        doc.text("ຮ້ານຂອງຂ້ອຍ", 105, 15, { align: "center" })

        doc.setFontSize(10)
        doc.text("ນະຄອນຫຼວງວຽງຈັນ, ລາວ", 105, 22, { align: "center" })
        doc.text("ໂທ: 020 XXXXXXXX", 105, 28, { align: "center" })

        // -------------------
        // SALE INFO
        // -------------------
        doc.setFontSize(11)
        doc.text(`ເລກບິນ : ${data.sale_id}`, 14, 40)
        doc.text(`ວັນທີ : ${formatDate(data.sale_date)}`, 14, 47)
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
        const tableBody: RowInput[] = saleDetails.map((item, index) => [
            index + 1,
            item.variant
                ? `${item.product?.product_name ?? "-"} (${item.variant.color}/${item.variant.size})`
                : item.product?.product_name ?? "-",
            item.quantity,
            formatCurrency(item.price),
            formatCurrency(Number(item.quantity) * Number(item.price)),
        ])

        autoTable(doc, {
            startY: 70,
            head: [["#", "ສິນຄ້າ", "ຈຳນວນ", "ລາຄາ", "ຈຳນວນເງິນ"]],
            body: tableBody,
            styles: {
                fontSize: 9,
                font: "NotoSansLao",
            },
            headStyles: {
                fillColor: [41, 128, 185],
                font: "NotoSansLao",
            },
        })

        const finalY = doc.lastAutoTable.finalY + 10

        doc.setFontSize(12)
        doc.text(`ຈຳນວນລາຍການ : ${saleDetails.length}`, 14, finalY)
        doc.text(`ລວມທັງໝົດ : ${formatCurrency(totalAmount)}`, 140, finalY)

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
                        <h1 className="text-3xl font-bold">ຮ້ານຂອງຂ້ອຍ</h1>
                        <p className="text-gray-500">ນະຄອນຫຼວງວຽງຈັນ, ລາວ</p>
                        <p className="text-gray-500">ໂທ: 020 XXXXXXXX</p>
                    </div>

                    {/* Invoice Info */}
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div>
                            <p>
                                <strong>ເລກບິນ:</strong> {data.sale_id}
                            </p>
                            <p>
                                <strong>ວັນທີ:</strong>{" "}
                                {formatDate(data.sale_date)}
                            </p>
                        </div>

                        <div>
                            <p>
                                <strong>ລູກຄ້າ:</strong>{" "}
                                {data.customer?.customer_name ?? "ລູກຄ້າທົ່ວໄປ"}
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
                                {saleDetails.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="border p-6 text-center text-gray-400"
                                        >
                                            ບໍ່ມີລາຍການສິນຄ້າ
                                        </td>
                                    </tr>
                                ) : (
                                    saleDetails.map((item, index) => (
                                        <tr key={item.sale_detail_id}>
                                            <td className="border p-3 text-center">
                                                {index + 1}
                                            </td>

                                            <td className="border p-3">
                                                {item.product?.product_name ?? "-"}
                                                {item.variant && (
                                                    <span className="text-gray-400 text-sm">
                                                        {" "}
                                                        ({item.variant.color}/
                                                        {item.variant.size})
                                                    </span>
                                                )}
                                            </td>

                                            <td className="border p-3 text-center">
                                                {item.quantity}
                                            </td>

                                            <td className="border p-3 text-right">
                                                {formatCurrency(item.price)}
                                            </td>

                                            <td className="border p-3 text-right">
                                                {formatCurrency(
                                                    Number(item.quantity) *
                                                        Number(item.price)
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end mt-8">
                        <div className="w-[320px] border rounded-lg p-4">
                            <div className="flex justify-between mb-2">
                                <span>ຈຳນວນລາຍການ</span>
                                <span>{saleDetails.length}</span>
                            </div>

                            <div className="flex justify-between text-xl font-bold">
                                <span>ລວມທັງໝົດ</span>
                                <span>{formatCurrency(totalAmount)}</span>
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