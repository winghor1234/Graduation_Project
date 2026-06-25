// "use client"

// import {
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     DialogDescription
// } from "@/components/ui/dialog"

// import { Import } from "@/modules/import/import.type"
// import { formatDate } from "@/utils/FormatDate"
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"

// import { formatCurrency } from "@/utils/FormatCurrency"

// import {
//     CheckCircle2,
//     Clock,
//     FileDown,
//     HelpCircle
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { handlePDFExport } from "../../ExportToReport"

// type Props = {
//     open: boolean
//     onOpenChange: (open: boolean) => void
//     data?: Import
// }

// export function ImportDetail({
//     open,
//     onOpenChange,
//     data,
// }: Props) {

//     const purchase = data?.purchase

//     const purchaseDetails = purchase?.purchase_details || []

//     const totalCalculatedAmount = purchaseDetails.reduce(
//         (sum, item) =>
//             sum +
//             ((item.received_qty ?? item.quantity ?? 0) *
//                 (item.price ?? 0)),
//         0
//     )

//     const pdfColumns = [
//         {
//             header: "ລຳດັບ",
//             key: "__index",
//         },
//         {
//             header: "ລະຫັດສິນຄ້າ",
//             key: "product_code",
//         },
//         {
//             header: "ສິນຄ້າ",
//             key: "product_name",
//         },
//         {
//             header: "ຈຳນວນຮັບ",
//             key: "quantity",
//         },
//         {
//             header: "ລາຄາ",
//             key: "price",
//         },
//         {
//             header: "ລວມ",
//             key: "total",
//         },
//     ]

//     const pdfData =
//         purchase?.purchase_details?.map((item) => {
//             const qty =  item.received_qty ??  item.quantity ??  0
//             const price =  item.price ?? 0

//             return {
//                 product_code:  item.product?.product_code ??  "-",
//                 product_name:  item.product?.product_name ??  "-",
//                 quantity: qty,
//                 price,
//                 total: qty * price,
//             }
//         }) ?? []

//     const handleExportPDF = () => {
//         if (!purchase) return

//         handlePDFExport({
//             title: `ໃບນຳເຂົ້າ ${data?.import_code ?? ""}`,
//             fileName:
//                 data?.import_code ??
//                 "import-report",
//             sheetName: "Import",
//             columns: pdfColumns,
//             data: pdfData,
//         })
//     }

//     return (
//         <Dialog
//             open={open}
//             onOpenChange={onOpenChange}
//         >
//             <DialogContent className="max-w-2xl p-6 gap-6 rounded-xl border border-gray-100 shadow-lg bg-white">

//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
//                     <div>
//                         <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">
//                             ລາຍລະອຽດການນຳເຂົ້າ
//                         </DialogTitle>

//                         <DialogDescription className="text-xs text-gray-500 mt-0.5">
//                             ລາຍລະອຽດຂໍ້ມູນ ແລະ
//                             ສິນຄ້າທີ່ນຳເຂົ້າຈາກໃບສັ່ງຊື້
//                         </DialogDescription>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             disabled={!purchase}
//                             className="gap-2"
//                             onClick={handleExportPDF}
//                         >
//                             <FileDown className="w-4 h-4" />
//                             Export PDF
//                         </Button>

//                         {purchase?.status ===
//                             "COMPLETED" ? (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
//                                 <CheckCircle2 className="w-3.5 h-3.5" />
//                                 ສຳເລັດ
//                             </span>
//                         ) : purchase?.status ? (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
//                                 <Clock className="w-3.5 h-3.5" />
//                                 ກຳລັງດຳເນີນການ
//                             </span>
//                         ) : (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
//                                 <HelpCircle className="w-3.5 h-3.5" />
//                                 ບໍ່ມີສະຖານະ
//                             </span>
//                         )}
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm bg-gray-50/50 p-4 rounded-lg border border-gray-100">

//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-admin-muted min-w-[100px]">
//                             ລະຫັດນຳເຂົ້າ:
//                         </span>
//                         <span className="font-mono font-medium text-gray-900">
//                             {data?.import_code || "-"}
//                         </span>
//                     </div>

//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-admin-muted min-w-[100px]">
//                             ລະຫັດສັ່ງຊື້:
//                         </span>
//                         <span className="font-mono font-medium text-gray-900">
//                             {purchase?.purchase_code || "-"}
//                         </span>
//                     </div>

//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-admin-muted min-w-[100px]">
//                             ວັນທີນຳເຂົ້າ:
//                         </span>
//                         <span>
//                             {data?.import_date
//                                 ? formatDate(
//                                     data.import_date
//                                 )
//                                 : "-"}
//                         </span>
//                     </div>

//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-admin-muted min-w-[100px]">
//                             ວັນທີສັ່ງຊື້:
//                         </span>
//                         <span>
//                             {purchase?.purchase_date
//                                 ? formatDate(
//                                     purchase.purchase_date
//                                 )
//                                 : "-"}
//                         </span>
//                     </div>

//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-admin-muted min-w-[100px]">
//                             ຜູ້ນຳເຂົ້າ:
//                         </span>
//                         <span>
//                             {data?.employee
//                                 ?.employee_name || "-"}
//                         </span>
//                     </div>

//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-admin-muted min-w-[100px]">
//                             ຜູ້ສະໜອງ:
//                         </span>
//                         <span>
//                             {purchase?.supplier
//                                 ?.supplier_name || "-"}
//                         </span>
//                     </div>
//                 </div>

//                 <div className="overflow-hidden rounded-xl border border-gray-200">
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>#</TableHead>
//                                 <TableHead>
//                                     ລະຫັດສິນຄ້າ
//                                 </TableHead>
//                                 <TableHead>
//                                     ຊື່ສິນຄ້າ
//                                 </TableHead>
//                                 <TableHead className="text-right">
//                                     ຈຳນວນສັ່ງ
//                                 </TableHead>
//                                 <TableHead className="text-right">
//                                     ຈຳນວນຮັບ
//                                 </TableHead>
//                                 <TableHead className="text-right">
//                                     ລາຄາ
//                                 </TableHead>
//                             </TableRow>
//                         </TableHeader>

//                         <TableBody>
//                             {purchaseDetails.length > 0 ? (
//                                 purchaseDetails.map(
//                                     (
//                                         item,
//                                         index
//                                     ) => (
//                                         <TableRow
//                                             key={
//                                                 item.purchase_detail_id
//                                             }
//                                         >
//                                             <TableCell>
//                                                 {index + 1}
//                                             </TableCell>

//                                             <TableCell>
//                                                 {item.product
//                                                     ?.product_code ||
//                                                     "-"}
//                                             </TableCell>

//                                             <TableCell>
//                                                 {item.product
//                                                     ?.product_name ||
//                                                     "-"}
//                                             </TableCell>

//                                             <TableCell className="text-right">
//                                                 {item.quantity}
//                                             </TableCell>

//                                             <TableCell className="text-right">
//                                                 {item.received_qty}
//                                             </TableCell>

//                                             <TableCell className="text-right">
//                                                 {formatCurrency(
//                                                     item.price
//                                                 )}
//                                             </TableCell>
//                                         </TableRow>
//                                     )
//                                 )
//                             ) : (
//                                 <TableRow>
//                                     <TableCell
//                                         colSpan={6}
//                                         className="text-center py-6"
//                                     >
//                                         ບໍ່ມີຂໍ້ມູນ
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </div>

//                 <div className="flex justify-end">
//                     <div className="w-full sm:w-[340px] rounded-xl border p-4">

//                         <div className="flex justify-between">
//                             <span>
//                                 ຍອດສັ່ງຊື້
//                             </span>

//                             <span>
//                                 {formatCurrency(
//                                     purchase?.total_amount ??
//                                     0
//                                 )}{" "}
//                                 ກີບ
//                             </span>
//                         </div>

//                         <div className="border-t my-3" />

//                         <div className="flex justify-between">
//                             <span className="font-bold">
//                                 ຍອດນຳເຂົ້າຕົວຈິງ
//                             </span>

//                             <span className="font-bold text-green-600">
//                                 {formatCurrency(
//                                     totalCalculatedAmount
//                                 )}{" "}
//                                 ກີບ
//                             </span>
//                         </div>

//                     </div>
//                 </div>

//             </DialogContent>
//         </Dialog>
//     )
// }



"use client"

import {
    Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { CheckCircle2, Clock, FileDown, XCircle } from "lucide-react"
import { handlePDFExport } from "../../ExportToReport"
import { Import } from "@/modules/import/import.type"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data?: Import
}

export function ImportDetailDialog({ open, onOpenChange, data }: Props) {

    // ✅ ໃຊ້ import_details ບໍ່ແມ່ນ purchase_details
    const importDetails = data?.import_details ?? []
    const purchase = data?.purchase

    const totalCost = importDetails.reduce(
        (sum, d) => sum + d.quantity * d.cost_price, 0
    )

    const handleExportPDF = () => {
        if (!data) return
        handlePDFExport({
            title: `ໃບນຳເຂົ້າ ${data.import_code}`,
            fileName: data.import_code,
            sheetName: "Import",
            columns: [
                { header: "#", key: "__index" },
                { header: "ລະຫັດສິນຄ້າ", key: "product_code" },
                { header: "ສິນຄ້າ", key: "product_name" },
                { header: "Variant", key: "variant_info" },
                { header: "ຈຳນວນ", key: "quantity" },
                { header: "ລາຄາ", key: "cost_price" },
                { header: "ລວມ", key: "total" },
            ],
            data: importDetails.map(d => ({
                product_code: d.product?.product_code ?? "—",
                product_name: d.product?.product_name ?? "—",
                variant_info: d.variant
                    ? `${d.variant.color} / ${d.variant.size}`
                    : "—",
                quantity: d.quantity,
                cost_price: d.cost_price,
                total: d.quantity * d.cost_price,
            })),
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 gap-5 rounded-xl">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                    <div>
                        <DialogTitle className="text-base font-bold">
                            ລາຍລະອຽດການນຳເຂົ້າ
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                            ລາຍລະອຽດຂໍ້ມູນ ແລະ ສິນຄ້າທີ່ນຳເຂົ້າ
                        </DialogDescription>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPDF}>
                            <FileDown className="w-4 h-4" />
                            Export PDF
                        </Button>

                        {/* Status badge */}
                        {data?.status === "COMPLETED" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />ສຳເລັດ
                            </span>
                        ) : data?.status === "CANCELLED" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-200">
                                <XCircle className="w-3.5 h-3.5" />ຍົກເລີກ
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" />ລໍຖ້າ
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Meta ── */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm bg-muted/40 p-4 rounded-lg border">
                    <MetaRow label="ລະຫັດນຳເຂົ້າ" value={data?.import_code ?? "—"} mono />
                    <MetaRow label="ລະຫັດສັ່ງຊື້" value={purchase?.purchase_code ?? "—"} mono />
                    <MetaRow label="ວັນທີນຳເຂົ້າ" value={data?.import_date ? formatDate(data.import_date) : "—"} />
                    <MetaRow label="ວັນທີສັ່ງຊື້" value={purchase?.purchase_date ? formatDate(purchase.purchase_date) : "—"} />
                    <MetaRow label="ຜູ້ນຳເຂົ້າ" value={data?.employee?.employee_name ?? "—"} />
                    <MetaRow label="ຜູ້ສະໜອງ" value={purchase?.supplier?.supplier_name ?? "—"} />
                </div>

                {/* ── Items Table ── */}
                <div className="overflow-hidden rounded-xl border">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-10">#</TableHead>
                                <TableHead>ລະຫັດ</TableHead>
                                <TableHead>ສິນຄ້າ</TableHead>
                                <TableHead className="text-center">Variant</TableHead>  {/* ✅ */}
                                <TableHead className="text-right">ຈຳນວນ</TableHead>
                                <TableHead className="text-right">ລາຄາ</TableHead>
                                <TableHead className="text-right">ລວມ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {importDetails.length > 0 ? (
                                importDetails.map((d, i) => (
                                    <TableRow key={d.import_detail_id}>
                                        <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                                        <TableCell className="text-xs font-mono">
                                            {d.product?.product_code ?? "—"}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {d.product?.product_name ?? "—"}
                                        </TableCell>

                                        {/* ✅ Variant */}
                                        <TableCell className="text-center">
                                            {d.variant ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md border text-xs bg-muted text-muted-foreground">
                                                    {d.variant.color} / {d.variant.size}
                                                </span>
                                            ) : "—"}
                                        </TableCell>

                                        <TableCell className="text-right tabular-nums">
                                            {d.quantity}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-muted-foreground">
                                            {formatCurrency(d.cost_price)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums font-medium">
                                            {formatCurrency(d.quantity * d.cost_price)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        ບໍ່ມີລາຍການ
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* ── Summary ── */}
                <div className="flex justify-end">
                    <div className="w-full sm:w-[300px] rounded-xl border p-4 space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>ຍອດສັ່ງຊື້</span>
                            <span>{formatCurrency(purchase?.total_amount ?? 0)} ກີບ</span>
                        </div>
                        <div className="border-t" />
                        <div className="flex justify-between text-sm font-bold">
                            <span>ຍອດນຳເຂົ້າຕົວຈິງ</span>
                            <span className="text-green-600">
                                {formatCurrency(totalCost)} ກີບ
                            </span>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

// ─── Helper ────────────────────────────────────────────────
function MetaRow({ label, value, mono = false }: {
    label: string; value: string; mono?: boolean
}) {
    return (
        <div className="flex justify-between sm:justify-start gap-4">
            <span className="text-muted-foreground min-w-[100px]">{label}:</span>
            <span className={mono ? "font-mono font-semibold" : ""}>{value}</span>
        </div>
    )
}