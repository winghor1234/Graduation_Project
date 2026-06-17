"use client"

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"

import { Import } from "@/modules/import/import.type"
import { formatDate } from "@/utils/FormatDate"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { formatCurrency } from "@/utils/FormatCurrency"

import {
    CheckCircle2,
    Clock,
    FileDown,
    HelpCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { handlePDFExport } from "../../ExportToReport"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data?: Import
}

export function ImportDetail({
    open,
    onOpenChange,
    data,
}: Props) {

    const purchase = data?.purchase

    const purchaseDetails = purchase?.purchase_details || []

    const totalCalculatedAmount = purchaseDetails.reduce(
        (sum, item) =>
            sum +
            ((item.received_qty ?? item.quantity ?? 0) *
                (item.price ?? 0)),
        0
    )

    const pdfColumns = [
        {
            header: "ລຳດັບ",
            key: "__index",
        },
        {
            header: "ລະຫັດສິນຄ້າ",
            key: "product_code",
        },
        {
            header: "ສິນຄ້າ",
            key: "product_name",
        },
        {
            header: "ຈຳນວນຮັບ",
            key: "quantity",
        },
        {
            header: "ລາຄາ",
            key: "price",
        },
        {
            header: "ລວມ",
            key: "total",
        },
    ]

    const pdfData =
        purchase?.purchase_details?.map((item) => {
            const qty =  item.received_qty ??  item.quantity ??  0
            const price =  item.price ?? 0

            return {
                product_code:  item.product?.product_code ??  "-",
                product_name:  item.product?.product_name ??  "-",
                quantity: qty,
                price,
                total: qty * price,
            }
        }) ?? []

    const handleExportPDF = () => {
        if (!purchase) return

        handlePDFExport({
            title: `ໃບນຳເຂົ້າ ${data?.import_code ?? ""}`,
            fileName:
                data?.import_code ??
                "import-report",
            sheetName: "Import",
            columns: pdfColumns,
            data: pdfData,
        })
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-w-2xl p-6 gap-6 rounded-xl border border-gray-100 shadow-lg bg-white">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                    <div>
                        <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">
                            ລາຍລະອຽດການນຳເຂົ້າ
                        </DialogTitle>

                        <DialogDescription className="text-xs text-gray-500 mt-0.5">
                            ລາຍລະອຽດຂໍ້ມູນ ແລະ
                            ສິນຄ້າທີ່ນຳເຂົ້າຈາກໃບສັ່ງຊື້
                        </DialogDescription>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!purchase}
                            className="gap-2"
                            onClick={handleExportPDF}
                        >
                            <FileDown className="w-4 h-4" />
                            Export PDF
                        </Button>

                        {purchase?.status ===
                            "COMPLETED" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                ສຳເລັດ
                            </span>
                        ) : purchase?.status ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" />
                                ກຳລັງດຳເນີນການ
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                                <HelpCircle className="w-3.5 h-3.5" />
                                ບໍ່ມີສະຖານະ
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm bg-gray-50/50 p-4 rounded-lg border border-gray-100">

                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">
                            ລະຫັດນຳເຂົ້າ:
                        </span>
                        <span className="font-mono font-medium text-gray-900">
                            {data?.import_code || "-"}
                        </span>
                    </div>

                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">
                            ລະຫັດສັ່ງຊື້:
                        </span>
                        <span className="font-mono font-medium text-gray-900">
                            {purchase?.purchase_code || "-"}
                        </span>
                    </div>

                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">
                            ວັນທີນຳເຂົ້າ:
                        </span>
                        <span>
                            {data?.import_date
                                ? formatDate(
                                    data.import_date
                                )
                                : "-"}
                        </span>
                    </div>

                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">
                            ວັນທີສັ່ງຊື້:
                        </span>
                        <span>
                            {purchase?.purchase_date
                                ? formatDate(
                                    purchase.purchase_date
                                )
                                : "-"}
                        </span>
                    </div>

                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">
                            ຜູ້ນຳເຂົ້າ:
                        </span>
                        <span>
                            {data?.employee
                                ?.employee_name || "-"}
                        </span>
                    </div>

                    <div className="flex justify-between sm:justify-start gap-4">
                        <span className="text-gray-400 min-w-[100px]">
                            ຜູ້ສະໜອງ:
                        </span>
                        <span>
                            {purchase?.supplier
                                ?.supplier_name || "-"}
                        </span>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>
                                    ລະຫັດສິນຄ້າ
                                </TableHead>
                                <TableHead>
                                    ຊື່ສິນຄ້າ
                                </TableHead>
                                <TableHead className="text-right">
                                    ຈຳນວນສັ່ງ
                                </TableHead>
                                <TableHead className="text-right">
                                    ຈຳນວນຮັບ
                                </TableHead>
                                <TableHead className="text-right">
                                    ລາຄາ
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {purchaseDetails.length > 0 ? (
                                purchaseDetails.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <TableRow
                                            key={
                                                item.purchase_detail_id
                                            }
                                        >
                                            <TableCell>
                                                {index + 1}
                                            </TableCell>

                                            <TableCell>
                                                {item.product
                                                    ?.product_code ||
                                                    "-"}
                                            </TableCell>

                                            <TableCell>
                                                {item.product
                                                    ?.product_name ||
                                                    "-"}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {item.quantity}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {item.received_qty}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {formatCurrency(
                                                    item.price
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-6"
                                    >
                                        ບໍ່ມີຂໍ້ມູນ
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-end">
                    <div className="w-full sm:w-[340px] rounded-xl border p-4">

                        <div className="flex justify-between">
                            <span>
                                ຍອດສັ່ງຊື້
                            </span>

                            <span>
                                {formatCurrency(
                                    purchase?.total_amount ??
                                    0
                                )}{" "}
                                ກີບ
                            </span>
                        </div>

                        <div className="border-t my-3" />

                        <div className="flex justify-between">
                            <span className="font-bold">
                                ຍອດນຳເຂົ້າຕົວຈິງ
                            </span>

                            <span className="font-bold text-green-600">
                                {formatCurrency(
                                    totalCalculatedAmount
                                )}{" "}
                                ກີບ
                            </span>
                        </div>

                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}