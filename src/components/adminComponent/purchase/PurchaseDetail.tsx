"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table"
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
        <div className="space-y-4">

            {/* ---------------- HEADER ---------------- */}
            <Card className="p-4 space-y-2">
                <div className="flex justify-between">
                    <h2 className="text-lg font-semibold">
                        ລາຍລະອຽດການສັ່ງຊື້ (Purchase)
                    </h2>

                    <Badge>
                        {purchase.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-500">ຜູ້ສະໜອງ (Supplier):</span>{" "}
                        {purchase.supplier?.supplier_name}
                    </div>

                    <div>
                        <span className="text-gray-500">ພະນັກງານ (Employee):</span>{" "}
                        {purchase.employee?.employee_name}
                    </div>

                    <div>
                        <span className="text-gray-500">ວັນທີ (Date):</span>{" "}
                        {formatDate(purchase.purchase_date)}
                    </div>

                    <div>
                        <span className="text-gray-500">ຍອດລວມ (Total):</span>{" "}
                        {formatCurrency(total)}
                    </div>
                </div>
            </Card>

            {/* ---------------- TABLE ---------------- */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ລຳດັບ</TableHead>
                            <TableHead>ສິນຄ້າ</TableHead>
                            <TableHead className="text-right">ຈຳນວນ</TableHead>
                            <TableHead className="text-right">ລາຄາ</TableHead>
                            <TableHead className="text-right">ລວມ</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {purchase.purchase_details?.map((item,index) => (
                            <TableRow key={item.purchase_detail_id}>
                                <TableCell>
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {item.product?.product_name}
                                </TableCell>

                                <TableCell className="text-right">
                                    {item.quantity}
                                </TableCell>

                                <TableCell className="text-right">
                                    {formatCurrency(item.price)}
                                </TableCell>

                                <TableCell className="text-right font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* ---------------- TOTAL ---------------- */}
                <TableFooter className="flex justify-end items-center">
                    <TableRow>
                        <TableHead className="text-right font-bold text-lg">ລວມທັງໝົດ: </TableHead>
                        <TableHead className="text-right font-bold text-lg">
                            {formatCurrency(total)} ກີບ
                        </TableHead>
                    </TableRow>
                </TableFooter>
            </Card>

        </div>
    )
}