"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PurchaseOrder } from "@/modules/purchase/purchase.type"
import { formatDate } from "@/utils/FormatDate"
import { formatCurrency } from "@/utils/FormatCurrency"

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

        <Card className="p-4 rounded-xl border shadow-sm">
            <div className="mb-3">
                <h3 className="text-base font-semibold text-gray-800">
                    ລາຍການສິນຄ້າ
                </h3>
                <p className="text-sm text-gray-500">
                    ລາຍລະອຽດສິນຄ້າໃນການສັ່ງຊື້
                </p>
            </div>

            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[60px]">#</TableHead>
                            <TableHead>ສິນຄ້າ</TableHead>
                            <TableHead className="text-right">ຈຳນວນ</TableHead>
                            <TableHead className="text-right">ລາຄາ</TableHead>
                            <TableHead className="text-right">ລວມ</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {purchase.purchase_details?.map((item, index) => (
                            <TableRow
                                key={item.purchase_detail_id}
                                className="hover:bg-gray-50 transition"
                            >
                                <TableCell className="text-gray-500">
                                    {index + 1}
                                </TableCell>

                                <TableCell className="font-medium text-gray-800">
                                    {item.product?.product_name}
                                </TableCell>

                                <TableCell className="text-right">
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

            {/* TOTAL SECTION (modern summary card style) */}
            <div className="mt-4 flex justify-end">
                <div className="w-full sm:w-[320px] rounded-lg border bg-gray-50 p-4">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>ຍອດລວມ</span>
                        <span className="font-medium text-gray-900">
                            {formatCurrency(total)}
                        </span>
                    </div>

                    <div className="flex justify-between text-base font-bold mt-2">
                        <span>ລວມທັງໝົດ</span>
                        <span className="text-black">
                            {formatCurrency(total)} ກີບ
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}