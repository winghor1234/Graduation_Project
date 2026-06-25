



// "use client"

// import { Card } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { PurchaseOrder } from "@/modules/purchase/purchase.type"
// import { formatDate } from "@/utils/FormatDate"
// import { formatCurrency } from "@/utils/FormatCurrency"
// import { CheckCircle2, Clock, FileDown } from "lucide-react"
// import { handlePDFExport } from "@/components/ExportToReport"
// import { Button } from "@/components/ui/button"

// /* ----------------------------- Props ----------------------------- */

// type Props = {
//     purchase?: PurchaseOrder
//     isLoading?: boolean
// }

// /* ----------------------------- Component ----------------------------- */

// export function PurchaseDetail({ purchase, isLoading }: Props) {

//     if (isLoading) {
//         return <Card className="p-6 text-center">ກຳລັງໂຫຼດຂໍ້ມູນການສັ່ງຊື້...</Card>
//     }

//     if (!purchase) {
//         return <Card className="p-6 text-center">ບໍ່ມີຂໍ້ມູນການສັ່ງຊື້</Card>
//     }

//     const total = purchase.purchase_details?.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//     ) || 0

//     // ✅ columns สำหรับ PDF
//     const pdfColumns = [
//         { header: "ລຳດັບ",   key: "__index" },
//         { header: "ສິນຄ້າ",   key: "product_name" },
//         { header: "ຈຳນວນ",   key: "quantity" },
//         { header: "ລາຄາ",    key: "price" },
//         { header: "ລວມ",     key: "total" },
//     ]

//     // ✅ flatten data สำหรับ PDF
//     const pdfData = purchase.purchase_details?.map((item) => ({
//         product_name: item.product?.product_name ?? "-",
//         quantity:     item.quantity,
//         price:        formatCurrency(item.price),
//         total:        formatCurrency(item.price * item.quantity),
//     })) ?? []

//     return (
//         <Card className="p-6 rounded-xl border border-gray-100 shadow-sm bg-white space-y-6">

//             {/* ── Header ── */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
//                 <div>
//                     <h3 className="text-lg font-bold text-gray-900 tracking-tight">
//                         ລາຍການສິນຄ້າ
//                     </h3>
//                     <p className="text-xs text-gray-500 mt-0.5">
//                         ລາຍລະອຽດສິນຄ້າໃນການສັ່ງຊື້
//                     </p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                     {/* ✅ Export PDF button */}
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         className="gap-2 text-gray-600 hover:text-gray-900"
//                         onClick={() =>
//                             handlePDFExport({
//                                 title:     `ໃບສັ່ງຊື້ ${purchase.purchase_code}`,
//                                 fileName:  purchase.purchase_code,
//                                 sheetName: "Purchase",
//                                 columns:   pdfColumns,
//                                 data:      pdfData,
//                             })
//                         }
//                     >
//                         <FileDown className="w-4 h-4" />
//                         Export PDF
//                     </Button>

//                     {/* Status badge */}
//                     {purchase.status === "COMPLETED" ? (
//                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
//                             <CheckCircle2 className="w-3.5 h-3.5" />
//                             ສຳເລັດ
//                         </span>
//                     ) : (
//                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
//                             <Clock className="w-3.5 h-3.5" />
//                             ກຳລັງດຳເນີນການ
//                         </span>
//                     )}
//                 </div>
//             </div>

//             {/* ── Metadata ── */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm bg-gray-50/50 p-4 rounded-lg border border-gray-100">
//                 <div className="flex justify-between sm:justify-start gap-4">
//                     <span className="text-admin-muted min-w-[90px]">ລະຫັດສັ່ງຊື້:</span>
//                     <span className="font-mono font-medium text-gray-900">
//                         {purchase.purchase_code}
//                     </span>
//                 </div>
//                 <div className="flex justify-between sm:justify-start gap-4">
//                     <span className="text-admin-muted min-w-[90px]">ວັນທີ:</span>
//                     <span className="font-medium text-admin-text">
//                         {formatDate(purchase.purchase_date)}
//                     </span>
//                 </div>
//                 <div className="flex justify-between sm:justify-start gap-4">
//                     <span className="text-admin-muted min-w-[90px]">ຜູ້ສັ່ງຊື້:</span>
//                     <span className="font-medium text-admin-text">
//                         {purchase.employee?.employee_name}
//                     </span>
//                 </div>
//                 <div className="flex justify-between sm:justify-start gap-4">
//                     <span className="text-admin-muted min-w-[90px]">ຜູ້ສະໜອງ:</span>
//                     <span className="font-medium text-admin-text">
//                         {purchase.supplier?.supplier_name}
//                     </span>
//                 </div>
//             </div>

//             {/* ── Items Table ── */}
//             <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
//                 <Table>
//                     <TableHeader className="bg-gray-50/70">
//                         <TableRow>
//                             <TableHead className="w-[60px] text-center font-semibold text-gray-600">#</TableHead>
//                             <TableHead className="font-semibold text-gray-600">ສິນຄ້າ</TableHead>
//                             <TableHead className="text-right font-semibold text-gray-600">ຈຳນວນ</TableHead>
//                             <TableHead className="text-right font-semibold text-gray-600">ລາຄາ</TableHead>
//                             <TableHead className="text-right font-semibold text-gray-600">ລວມ</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {purchase.purchase_details?.map((item, index) => (
//                             <TableRow
//                                 key={item.purchase_detail_id}
//                                 className="hover:bg-brand-blue-soft/30 transition-colors duration-150"
//                             >
//                                 <TableCell className="text-center text-admin-muted font-medium">
//                                     {index + 1}
//                                 </TableCell>
//                                 <TableCell className="font-medium text-gray-900">
//                                     {item.product?.product_name}
//                                 </TableCell>
//                                 <TableCell className="text-right font-medium text-admin-text">
//                                     {item.quantity}
//                                 </TableCell>
//                                 <TableCell className="text-right text-gray-600">
//                                     {formatCurrency(item.price)}
//                                 </TableCell>
//                                 <TableCell className="text-right font-semibold text-gray-900">
//                                     {formatCurrency(item.price * item.quantity)}
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </div>

//             {/* ── Total Summary ── */}
//             <div className="flex justify-end pt-2">
//                 <div className="w-full sm:w-[340px] rounded-xl border border-gray-200 bg-gray-50/30 p-4 space-y-3 shadow-sm">
//                     <div className="flex justify-between text-sm text-gray-500">
//                         <span>ຍອດລວມ</span>
//                         <span className="font-medium text-admin-text">
//                             {formatCurrency(total)} ກີບ
//                         </span>
//                     </div>
//                     <div className="border-t border-dashed my-2" />
//                     <div className="flex justify-between items-baseline">
//                         <span className="text-sm font-bold text-gray-900">ລວມທັງໝົດ</span>
//                         <span className="text-xl font-extrabold text-green-600">
//                             {formatCurrency(total)}{" "}
//                             <span className="text-xs font-semibold text-gray-500 ml-0.5">ກີບ</span>
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </Card>
//     )
// }



"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PurchaseOrder } from "@/modules/purchase/purchase.type"
import { formatDate } from "@/utils/FormatDate"
import { formatCurrency } from "@/utils/FormatCurrency"
import { CheckCircle2, Clock, FileDown, Phone, Send } from "lucide-react"
import { handlePDFExport } from "@/components/ExportToReport"
import { Button } from "@/components/ui/button"
import dayjs from "dayjs"

type Props = {
    purchase?: PurchaseOrder
    isLoading?: boolean
}

// ແປງເບີໂທເປັນ format WhatsApp
function toWhatsAppNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.startsWith("856")) return cleaned
    if (cleaned.startsWith("0")) return "856" + cleaned.slice(1)
    return "856" + cleaned
}

// ສ້າງຂໍ້ຄວາມ WhatsApp
function buildWhatsAppMessage(purchase: PurchaseOrder): string {
    const items = purchase.purchase_details
        ?.map((d, i) =>
            `${i + 1}. ${d.product?.product_name} — ${d.quantity} ຊິ້ນ x ${formatCurrency(d.price)} ກີບ`
        )
        .join("\n") ?? ""

    const total = purchase.purchase_details?.reduce(
        (sum, d) => sum + d.price * d.quantity, 0
    ) ?? 0

    return [
        `📦 *ໃບສັ່ງຊື້: ${purchase.purchase_code}*`,
        `📅 ວັນທີ: ${dayjs(purchase.purchase_date).format("DD/MM/YYYY")}`,
        `🏢 ຜູ້ສັ່ງ: ${purchase.employee?.employee_name ?? "-"}`,
        ``,
        `*ລາຍການສິນຄ້າ:*`,
        items,
        ``,
        `💰 *ຍອດລວມ: ${formatCurrency(total)} ກີບ*`,
        ``,
        `_(ກະລຸນາແນບ PDF ທີ່ດາວໂຫຼດໄວ້)_`,
    ].join("\n")
}

export function PurchaseDetail({ purchase, isLoading }: Props) {

    if (isLoading) {
        return <Card className="p-6 text-center">ກຳລັງໂຫຼດຂໍ້ມູນການສັ່ງຊື້...</Card>
    }

    if (!purchase) {
        return <Card className="p-6 text-center">ບໍ່ມີຂໍ້ມູນການສັ່ງຊື້</Card>
    }

    const total = purchase.purchase_details?.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    ) || 0

    const supplierPhone = purchase.supplier?.phone ?? ""

    const pdfColumns = [
        { header: "ລຳດັບ", key: "__index" },
        { header: "ສິນຄ້າ", key: "product_name" },
        { header: "ຈຳນວນ", key: "quantity" },
        { header: "ລາຄາ", key: "price" },
        { header: "ລວມ", key: "total" },
    ]

    const pdfData = purchase.purchase_details?.map((item) => ({
        product_name: item.product?.product_name ?? "-",
        quantity: item.quantity,
        price: formatCurrency(item.price),
        total: formatCurrency(item.price * item.quantity),
    })) ?? []

    const handleSendWhatsApp = async () => {
        // 1. Download PDF ກ່ອນ
        await handlePDFExport({
            title: `ໃບສັ່ງຊື້ ${purchase.purchase_code}`,
            fileName: purchase.purchase_code,
            sheetName: "Purchase",
            columns: pdfColumns,
            data: pdfData,
        })

        // 2. ເປີດ WhatsApp ຫຼັງ PDF ດາວໂຫຼດ
        setTimeout(() => {
            const phone = toWhatsAppNumber(supplierPhone)
            const message = encodeURIComponent(buildWhatsAppMessage(purchase))
            window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
        }, 800)
    }

    return (
        <Card className="p-6 rounded-xl border border-gray-100 shadow-sm bg-white space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                        ລາຍການສິນຄ້າ
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        ລາຍລະອຽດສິນຄ້າໃນການສັ່ງຊື້
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">

                    {/* Export PDF */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-gray-600 hover:text-gray-900"
                        onClick={() =>
                            handlePDFExport({
                                title: `ໃບສັ່ງຊື້ ${purchase.purchase_code}`,
                                fileName: purchase.purchase_code,
                                sheetName: "Purchase",
                                columns: pdfColumns,
                                data: pdfData,
                            })
                        }
                    >
                        <FileDown className="w-4 h-4" />
                        Export PDF
                    </Button>

                    {/* Send WhatsApp */}
                    {supplierPhone ? (
                        <Button
                            size="sm"
                            className="gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white"
                            onClick={handleSendWhatsApp}
                        >
                            <Send className="w-4 h-4" />
                            ສົ່ງຫາ WhatsApp
                        </Button>
                    ) : (
                        <span className="text-xs text-admin-muted italic">
                            ບໍ່ມີເບີໂທຜູ້ສະໜອງ
                        </span>
                    )}

                    {/* Status badge */}
                    {purchase.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ສຳເລັດ
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            ກຳລັງດຳເນີນການ
                        </span>
                    )}
                </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between sm:justify-start gap-4">
                    <span className="text-admin-muted min-w-[90px]">ລະຫັດສັ່ງຊື້:</span>
                    <span className="font-mono font-medium text-gray-900">
                        {purchase.purchase_code}
                    </span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                    <span className="text-admin-muted min-w-[90px]">ວັນທີ:</span>
                    <span className="font-medium text-admin-text">
                        {formatDate(purchase.purchase_date)}
                    </span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                    <span className="text-admin-muted min-w-[90px]">ຜູ້ສັ່ງຊື້:</span>
                    <span className="font-medium text-admin-text">
                        {purchase.employee?.employee_name}
                    </span>
                </div>

                {/* ✅ ຜູ້ສະໜອງ + ເບີໂທ clickable */}
                <div className="flex justify-between sm:justify-start gap-4">
                    <span className="text-admin-muted min-w-[90px]">ຜູ້ສະໜອງ:</span>
                    <div className="flex flex-col items-end sm:items-start gap-0.5">
                        <span className="font-medium text-admin-text">
                            {purchase.supplier?.supplier_name}
                        </span>
                        {supplierPhone && (
                            <a
                                href={`https://wa.me/${toWhatsAppNumber(supplierPhone)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#25D366] hover:underline font-medium"
                            >
                                <Phone className="w-3 h-3" />
                                {supplierPhone}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/70">
                        <TableRow>
                            <TableHead className="w-[60px] text-center font-semibold text-gray-600">#</TableHead>
                            <TableHead className="font-semibold text-gray-600">ສິນຄ້າ</TableHead>
                            <TableHead className="text-right font-semibold text-gray-600">ຈຳນວນ</TableHead>
                            <TableHead className="text-right font-semibold text-gray-600">ລາຄາ</TableHead>
                            <TableHead className="text-right font-semibold text-gray-600">ລວມ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchase.purchase_details?.map((item, index) => (
                            <TableRow
                                key={item.purchase_detail_id}
                                className="hover:bg-brand-blue-soft/30 transition-colors duration-150"
                            >
                                <TableCell className="text-center text-admin-muted font-medium">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">
                                    {item.product?.product_name}
                                </TableCell>
                                <TableCell className="text-right font-medium text-admin-text">
                                    {item.quantity}
                                </TableCell>
                                <TableCell className="text-right text-gray-600">
                                    {formatCurrency(item.price)}
                                </TableCell>
                                <TableCell className="text-right font-semibold text-gray-900">
                                    {formatCurrency(item.price * item.quantity)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Total */}
            <div className="flex justify-end pt-2">
                <div className="w-full sm:w-[340px] rounded-xl border border-gray-200 bg-gray-50/30 p-4 space-y-3 shadow-sm">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>ຍອດລວມ</span>
                        <span className="font-medium text-admin-text">
                            {formatCurrency(total)} ກີບ
                        </span>
                    </div>
                    <div className="border-t border-dashed my-2" />
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm font-bold text-gray-900">ລວມທັງໝົດ</span>
                        <span className="text-xl font-extrabold text-green-600">
                            {formatCurrency(total)}{" "}
                            <span className="text-xs font-semibold text-gray-500 ml-0.5">ກີບ</span>
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}