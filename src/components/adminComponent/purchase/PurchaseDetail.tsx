"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PurchaseOrder } from "@/modules/purchase/purchase.type"
import { formatDate } from "@/utils/FormatDate"
import { formatCurrency } from "@/utils/FormatCurrency"
import { CheckCircle2, XCircle } from "lucide-react"

/* ----------------------------- Props ----------------------------- */

type Props = {
    purchase?: PurchaseOrder
    isLoading?: boolean
}

/* ----------------------------- Component ----------------------------- */

export function PurchaseDetail({ purchase, isLoading }: Props) {

    if (isLoading) {
        return <Card className="p-6 text-center">ກຳລັງໂຫຼດຂໍ້ມູນການສັ່ງຊື້...</Card>
    }

    if (!purchase) {
        return <Card className="p-6 text-center">ບໍ່ມີຂໍ້ມູນການສັ່ງຊື້</Card>
    }

    const total = purchase.purchase_details?.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    ) || 0

    return (

        <Card className="p-6 rounded-xl border border-gray-100 shadow-sm bg-white space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                        ລາຍການສິນຄ້າ
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        ລາຍລະອຽດສິນຄ້າໃນການສັ່ງຊື້
                    </p>
                </div>

                {/* Modern Status Badge */}
                <div>
                    {purchase.status === "completed" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ສຳເລັດ
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <XCircle className="w-3.5 h-3.5" />
                            ບໍ່ສຳເລັດ
                        </span>
                    )}
                </div>
            </div>

            {/* Metadata Grid Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between sm:justify-start gap-4">
                    <span className="text-gray-400 min-w-[90px]">ລະຫັດສັ່ງຊື້:</span>
                    <span className="font-mono font-medium text-gray-900">{purchase.purchase_code}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                    <span className="text-gray-400 min-w-[90px]">ວັນທີ:</span>
                    <span className="font-medium text-gray-800">{formatDate(purchase.purchase_date)}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                    <span className="text-gray-400 min-w-[90px]">ຜູ້ສັ່ງຊື້:</span>
                    <span className="font-medium text-gray-800">{purchase.employee?.employee_name}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                    <span className="text-gray-400 min-w-[90px]">ຜູ້ສະໜອງ:</span>
                    <span className="font-medium text-gray-800">{purchase.supplier?.supplier_name}</span>
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
                                className="hover:bg-gray-50/50 transition-colors duration-150"
                            >
                                <TableCell className="text-center text-gray-400 font-medium">
                                    {index + 1}
                                </TableCell>

                                <TableCell className="font-medium text-gray-900">
                                    {item.product?.product_name}
                                </TableCell>

                                <TableCell className="text-right font-medium text-gray-700">
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

            {/* Total Summary Section */}
            <div className="flex justify-end pt-2">
                <div className="w-full sm:w-[340px] rounded-xl border border-gray-200 bg-gray-50/30 p-4 space-y-3 shadow-sm">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>ຍອດລວມ</span>
                        <span className="font-medium text-gray-800">
                            {formatCurrency(total)} ກີບ
                        </span>
                    </div>

                    <div className="border-t border-dashed my-2" />

                    <div className="flex justify-between items-baseline">
                        <span className="text-sm font-bold text-gray-900">ລວມທັງໝົດ</span>
                        <span className="text-xl font-extrabold text-green-600">
                            {formatCurrency(total)} <span className="text-xs font-semibold text-gray-500 ml-0.5">ກີບ</span>
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}