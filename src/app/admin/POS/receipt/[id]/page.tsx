"use client"

import { useParams } from "next/navigation"
import { useMemo } from "react"
import { useGetSale } from "@/app/features/hooks/Sale"
import { formatDate } from "@/utils/FormatDate"
import { formatCurrency } from "@/utils/FormatCurrency"
import { BackButton } from "@/utils/BackButton"

import jsPDF from "jspdf"
// ✅ html2canvas ທຳມະດາບໍ່ຮອງຮັບ oklch() (Tailwind v4 ໃຊ້ເປັນ default) — ໃຊ້ fork ນີ້ແທນ
import html2canvas from "html2canvas-pro"

// ⚠️ ຫ້າມແກ້ກັບໄປໃຊ້ jsPDF.text() + custom font ອີກ — jsPDF ວາດ text ແບບ 1
// codepoint = 1 glyph ຈາກ cmap ຢ່າງດຽວ, ບໍ່ຮອງຮັບ OpenType GSUB/GPOS shaping
// ເຊິ່ງເປັນສິ່ງທີ່ພາສາລາວຕ້ອງການ (ວາງສະຫຼະ/ວັນນະຍຸດເທິງ-ລຸ່ມພະຍັນຊະນະ) — ໂຕໜັງສືຈະແຕກ/
// ວາງຜິດຕຳແໜ່ງສະເໝີ ບໍ່ວ່າ font ຈະຖືກຕ້ອງສໍ່າໃດ. ແທນທີ່ຈະແຕ້ມ text ດ້ວຍ jsPDF ໂດຍກົງ,
// ໃຫ້ html2canvas ຖ່າຍຮູບ DOM ທີ່ browser render ຖືກຕ້ອງແລ້ວ (#invoice) ແລ້ວຝັງເປັນຮູບໃນ PDF ແທນ.

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

    const exportPDF = async () => {
        const invoiceEl = document.getElementById("invoice")
        if (!invoiceEl) return

        // ✅ ຖ່າຍຮູບ DOM ທີ່ browser render Lao text ຖືກຕ້ອງແລ້ວ — ບໍ່ໃຫ້ jsPDF ແຕ້ມ text ເອງ
        const canvas = await html2canvas(invoiceEl, {
            scale: 2, // ຄວາມລະອຽດສູງ ໃຫ້ໂຕໜັງສືຄົມ
            useCORS: true,
            backgroundColor: "#ffffff",
        })

        const imgData = canvas.toDataURL("image/png")
        const doc = new jsPDF("p", "mm", "a4")

        const pageWidth  = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const imgWidth   = pageWidth
        const imgHeight  = (canvas.height * imgWidth) / canvas.width

        // ✅ ຖ້າໃບບິນຍາວກວ່າ 1 ໜ້າ A4 — ແບ່ງເປັນຫຼາຍໜ້າ
        let heightLeft = imgHeight
        let position = 0

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft > 0) {
            position = heightLeft - imgHeight
            doc.addPage()
            doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
        }

        doc.save(`invoice-${data.sale_id}.pdf`)
    }

    return (
        <div className="min-h-screen bg-admin-bg py-8">
            <div className="max-w-5xl mx-auto">
                <BackButton />

                <div
                    id="invoice"
                    className="bg-white shadow-lg rounded-xl p-8 mt-4"
                >
                    {/* Header */}
                    <div className="text-center border-b pb-5">
                        <h1 className="text-3xl font-bold">ຮ້ານ ວັນໄຊ</h1>
                        <p className="text-gray-500">ນະຄອນຫຼວງວຽງຈັນ, ເມືອງ ສີໂຄດຕະບອງ, ບ້ານ ວຽງຄຳ</p>
                        <p className="text-gray-500">ໂທ: 020 98924536</p>
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
                                <tr className="bg-admin-bg">
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

                    {/* Buttons — data-html2canvas-ignore ກັນບໍ່ໃຫ້ຕິດໄປໃນຮູບ PDF ທີ່ຖ່າຍ */}
                    <div className="flex gap-3 mt-8 print:hidden" data-html2canvas-ignore="true">
                        <button
                            onClick={() => window.print()}
                            className="px-5 py-2 rounded-lg border hover:bg-brand-blue-soft"
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