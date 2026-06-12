// "use client"

// import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// import { Import } from "@/modules/import/import.type"
// import { formatDate } from "@/utils/FormatDate"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
// import { formatCurrency } from "@/utils/FormatCurrency"
// import { CheckCircle2, HelpCircle, XCircle } from "lucide-react"

// type Props = {
//     open: boolean,
//     onOpenChange: (open: boolean) => void,
//     data?: Import
// }

// export function ImportDetail({ open, onOpenChange, data }: Props) {
//     console.log("import : ", data)

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="max-w-2xl p-6 gap-6 rounded-xl border border-gray-100 shadow-lg bg-white">

//                 {/* Header Section */}
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
//                     <div>
//                         {/* Swapped <h3> for DialogTitle for Accessibility */}
//                         <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">
//                             ລາຍລະອຽດການນຳເຂົ້າ
//                         </DialogTitle>
//                         {/* Swapped <p> for DialogDescription for Accessibility */}
//                         <DialogDescription className="text-xs text-gray-500 mt-0.5">
//                             ລາຍລະອຽດຂໍ້ມູນ ແລະ ສິນຄ້າທີ່ນຳເຂົ້າຈາກໃບສັ່ງຊື້
//                         </DialogDescription>
//                     </div>

//                     {/* Modern Status Badge linked to purchase.status */}
//                     <div>
//                         {data?.purchase?.status === "completed" ? (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
//                                 <CheckCircle2 className="w-3.5 h-3.5" />
//                                 ສຳເລັດ
//                             </span>
//                         ) : data?.purchase?.status ? (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
//                                 <XCircle className="w-3.5 h-3.5" />
//                                 ບໍ່ສຳເລັດ
//                             </span>
//                         ) : (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
//                                 <HelpCircle className="w-3.5 h-3.5" />
//                                 ບໍ່ມີສະຖານະ
//                             </span>
//                         )}
//                     </div>
//                 </div>

//                 {/* Metadata Grid Info (Showing both Import and Purchase correlations) */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm bg-gray-50/50 p-4 rounded-lg border border-gray-100">
//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-gray-400 min-w-[100px]">ລະຫັດນຳເຂົ້າ:</span>
//                         <span className="font-mono font-medium text-gray-900">{data?.import_code || "-"}</span>
//                     </div>
//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-gray-400 min-w-[100px]">ລະຫັດສັ່ງຊື້:</span>
//                         <span className="font-mono font-medium text-gray-900">{data?.purchase?.purchase_code || "-"}</span>
//                     </div>

//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-gray-400 min-w-[100px]">ວັນທີນຳເຂົ້າ:</span>
//                         <span className="font-medium text-gray-800">
//                             {data?.import_date ? formatDate(data.import_date) : "-"}
//                         </span>
//                     </div>
//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-gray-400 min-w-[100px]">ວັນທີສັ່ງຊື້:</span>
//                         <span className="font-medium text-gray-800">
//                             {data?.purchase?.purchase_date ? formatDate(data.purchase.purchase_date) : "-"}
//                         </span>
//                     </div>

//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-gray-400 min-w-[100px]">ຜູ້ນຳເຂົ້າ:</span>
//                         <span className="font-medium text-gray-800">{data?.employee?.employee_name || "-"}</span>
//                     </div>
//                     <div className="flex justify-between sm:justify-start gap-4">
//                         <span className="text-gray-400 min-w-[100px]">ຜູ້ສະໜອງ:</span>
//                         <span className="font-medium text-gray-800">{data?.purchase?.supplier?.supplier_name || "-"}</span>
//                     </div>
//                 </div>

//                 {/* Items Table */}
//                 <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
//                     <Table>
//                         <TableHeader className="bg-gray-50/70">
//                             <TableRow>
//                                 <TableHead className="w-[60px] text-center font-semibold text-gray-600">#</TableHead>
//                                 <TableHead className="font-semibold text-gray-600">ຊື່ສິນຄ້າ</TableHead>
//                                 <TableHead className="text-right font-semibold text-gray-600">ຈຳນວນ</TableHead>
//                                 <TableHead className="text-right font-semibold text-gray-600">ລາຄາ</TableHead>
//                                 <TableHead className="text-right font-semibold text-gray-600">ລວມ</TableHead>
//                             </TableRow>
//                         </TableHeader>

//                         <TableBody>
//                             {data?.import_details?.length ? (
//                                 data.import_details.map((d, index) => (
//                                     <TableRow
//                                         key={d.import_detail_id || index}
//                                         className="hover:bg-gray-50/50 transition-colors duration-150"
//                                     >
//                                         <TableCell className="text-center text-gray-400 font-medium">
//                                             {index + 1}
//                                         </TableCell>

//                                         <TableCell className="font-medium text-gray-900">
//                                             {d.product?.product_name || "ບໍ່ມີຊື່ສິນຄ້າ"}
//                                         </TableCell>

//                                         <TableCell className="text-right font-medium text-gray-700 tabular-nums">
//                                             {d.quantity}
//                                         </TableCell>

//                                         <TableCell className="text-right text-gray-600 tabular-nums">
//                                             {formatCurrency(d.cost_price)}
//                                         </TableCell>

//                                         <TableCell className="text-right font-semibold text-gray-900 tabular-nums">
//                                             {formatCurrency(d.quantity * d.cost_price)}
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan={5} className="text-center py-8 text-gray-400 font-medium">
//                                         ບໍ່ມີຂໍ້ມູນສິນຄ້າ
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </div>

//                 {/* Total Summary Section */}
//                 <div className="flex justify-end pt-2">
//                     <div className="w-full sm:w-[340px] rounded-xl border border-gray-200 bg-gray-50/30 p-4 space-y-3 shadow-sm">
//                         <div className="flex justify-between text-sm text-gray-500">
//                             <span>ຍອດລວມ</span>
//                             <span className="font-medium text-gray-800 tabular-nums">
//                                 {data?.import_details && data.import_details.length > 0
//                                     ? `${formatCurrency(data.import_details.reduce((sum, item) => sum + item.quantity * item.cost_price, 0))} ກີບ`
//                                     : "0 ກີບ"}
//                             </span>
//                         </div>

//                         <div className="border-t border-dashed my-2" />

//                         <div className="flex justify-between items-baseline">
//                             <span className="text-sm font-bold text-gray-900">ລວມທັງໝົດ</span>
//                             <span className="text-xl font-extrabold text-green-600 tabular-nums">
//                                 {data?.import_details && data.import_details.length > 0
//                                     ? formatCurrency(data.import_details.reduce((sum, item) => sum + item.quantity * item.cost_price, 0))
//                                     : "0"}
//                                 <span className="text-xs font-semibold text-gray-500 ml-0.5">ກີບ</span>
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//             </DialogContent>
//         </Dialog>
//     )
// }


"use client"

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Import } from "@/modules/import/import.type"
import { formatDate } from "@/utils/FormatDate"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { formatCurrency } from "@/utils/FormatCurrency"
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react"

type Props = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    data?: Import
}

export function ImportDetail({ open, onOpenChange, data }: Props) {
    console.log("import : ", data)

    // Fallback calculation helper using your specific nested data structure
    const purchaseDetails = data?.purchase?.purchase_details || [];
    const totalCalculatedAmount = purchaseDetails.reduce(
        (sum, item) => sum + (item.received_qty || item.quantity || 0) * (item.price || 0),
        0
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-6 gap-6 rounded-xl border border-gray-100 shadow-lg bg-white">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                    <div>
                        <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">
                            ລາຍລະອຽດການນຳເຂົ້າ
                        </DialogTitle>
                        <DialogDescription className="text-xs text-gray-500 mt-0.5">
                            ລາຍລະອຽດຂໍ້ມູນ ແລະ ສິນຄ້າທີ່ນຳເຂົ້າຈາກໃບສັ່ງຊື້
                        </DialogDescription>
                    </div>

                    {/* Modern Status Badge linked to purchase.status */}
                    <div>
                        {data?.purchase?.status === "completed" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                ສຳເລັດ
                            </span>
                        ) : data?.purchase?.status ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <XCircle className="w-3.5 h-3.5" />
                                ບໍ່ສຳເລັດ
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                                <HelpCircle className="w-3.5 h-3.5" />
                                ບໍ່ມີສະຖານະ
                            </span>
                        )}
                    </div>
                </div>

                {/* Metadata Grid Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">ລະຫັດນຳເຂົ້າ:</span>
                        <span className="font-mono font-medium text-gray-900">{data?.import_code || "-"}</span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">ລະຫັດສັ່ງຊື້:</span>
                        <span className="font-mono font-medium text-gray-900">{data?.purchase?.purchase_code || "-"}</span>
                    </div>

                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">ວັນທີນຳເຂົ້າ:</span>
                        <span className="font-medium text-gray-800">
                            {data?.import_date ? formatDate(data.import_date) : "-"}
                        </span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">ວັນທີສັ່ງຊື້:</span>
                        <span className="font-medium text-gray-800">
                            {data?.purchase?.purchase_date ? formatDate(data.purchase.purchase_date) : "-"}
                        </span>
                    </div>

                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">ຜູ້ນຳເຂົ້າ:</span>
                        <span className="font-medium text-gray-800">{data?.employee?.employee_name || "-"}</span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">ຜູ້ສະໜອງ:</span>
                        <span className="font-medium text-gray-800">{data?.purchase?.supplier?.supplier_name || "-"}</span>
                    </div>
                </div>

                {/* Items Table showing purchase_details data layout */}
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-50/70">
                            <TableRow>
                                <TableHead className="w-[60px] text-center font-semibold text-gray-600">#</TableHead>
                                <TableHead className="font-semibold text-gray-600">ລະຫັດສິນຄ້າ</TableHead>
                                <TableHead className="font-semibold text-gray-600">ຊື່ສິນຄ້າ</TableHead>
                                <TableHead className="text-right font-semibold text-gray-600">ຈຳນວນສັ່ງຊື້</TableHead>
                                <TableHead className="text-right font-semibold text-gray-600">ຈຳນວນທີ່ຮັບຕົວຈິງ</TableHead>
                                <TableHead className="text-right font-semibold text-gray-600">ລາຄາ/ຈຳນວນ</TableHead>
                                {/* <TableHead className="text-right font-semibold text-gray-600">ລວມ</TableHead> */}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {purchaseDetails.length ? (
                                purchaseDetails.map((d, index) => (
                                    <TableRow
                                        key={d.purchase_detail_id || index}
                                        className="hover:bg-gray-50/50 transition-colors duration-150"
                                    >
                                        <TableCell className="text-center text-gray-400 font-medium">
                                            {index + 1}
                                        </TableCell>

                                        {/* Fallback to product_id if product name isn't nested directly here */}
                                        <TableCell className="font-medium text-gray-900 font-mono text-xs">
                                            {d.product?.product_code || "ບໍ່ມີຂໍ້ມູນ"}
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900 font-mono text-xs">
                                            {d.product?.product_name || "ບໍ່ມີຂໍ້ມູນ"}
                                        </TableCell>

                                        <TableCell className="text-right font-medium text-gray-400 tabular-nums">
                                            {d.quantity}
                                        </TableCell>

                                        <TableCell className="text-right font-semibold text-emerald-600 tabular-nums">
                                            {d.received_qty}
                                        </TableCell>

                                        <TableCell className="text-right text-gray-600 tabular-nums">
                                            {formatCurrency(d.price)}
                                        </TableCell>

                                   
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-400 font-medium">
                                        ບໍ່ມີຂໍ້ມູນສິນຄ້າ
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Total Summary Section */}
                <div className="flex justify-end pt-2">
                    <div className="w-full sm:w-[340px] rounded-xl border border-gray-200 bg-gray-50/30 p-4 space-y-3 shadow-sm">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>ຍອດລວມທັງໝົດ (ຕາມໃບສັ່ງຊື້)</span>
                            <span className="font-medium text-gray-800 tabular-nums">
                                {data?.purchase?.total_amount
                                    ? `${formatCurrency(data.purchase.total_amount)} ກີບ`
                                    : `${formatCurrency(totalCalculatedAmount)} ກີບ`}
                            </span>
                        </div>

                        <div className="border-t border-dashed my-2" />

                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-bold text-gray-900">ລວມທັງໝົດຕາມໃບນຳເຂົ້າ</span>
                            <span className="text-xl font-extrabold text-green-600 tabular-nums">
                                {formatCurrency(totalCalculatedAmount)}
                                <span className="text-lg font-semibold text-gray-500 ml-0.5">ກີບ</span>
                            </span>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}