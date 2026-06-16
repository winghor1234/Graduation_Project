"use client"

import { Dialog, DialogContent, DialogTitle, DialogDescription, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { AlertTriangle, BadgeCheck, Banknote, Loader2, PackageCheck, } from "lucide-react"
import { useCreatePaymentPurchaseOrder } from "@/app/features/hooks/Purchase"
import { PurchaseOrder } from "./PurchaseType"

/* ----------------------------- Props ----------------------------- */

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    purchase?: PurchaseOrder
}

/* ----------------------------- Component ----------------------------- */

export function PurchasePaymentDialog({ open, onOpenChange, purchase }: Props) {
    console.log("purchase im payment : ", purchase)

    const { mutate: confirmPayment, isPending } = useCreatePaymentPurchaseOrder()

    if (!purchase) return null

    const details = purchase.purchase_details ?? []

    // ยอดตามสั่ง
    const orderedTotal = details.reduce(
        (sum, d) => sum + d.quantity * d.price, 0
    )

    // ยอดตามรับจริง (received_qty * price)
    const actualTotal = details.reduce(
        (sum, d) => sum + (d.received_qty ?? 0) * d.price, 0
    )

    const diff = orderedTotal - actualTotal
    const isPartialReceive = diff > 0
    const alreadyPaid = purchase.paid_amount ?? 0
    const remaining = actualTotal - alreadyPaid

    // canPay guard
    const canPay = purchase.status === "COMPLETED" && purchase.payment_status === "UNPAID"

    const handleConfirm = () => {
        if (!purchase.purchase_id) return
        confirmPayment({ id: purchase.purchase_id }, {
            onSuccess: () => onOpenChange(false),
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-6 gap-5 rounded-2xl border border-gray-100 shadow-xl bg-white">

                {/* ── Header ── */}
                <div className="flex items-start justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-green-50 border border-green-100">
                            <Banknote className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-gray-900">
                                ຢືນຢັນການຊຳລະເງິນ
                            </DialogTitle>
                            <DialogDescription className="text-xs text-gray-400 mt-0.5">
                                ກວດສອບລາຍລະອຽດກ່ອນຊຳລະ
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Payment status pill */}
                    {purchase.payment_status === "PAID" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            ຊຳລະແລ້ວ
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                            <Banknote className="w-3.5 h-3.5" />
                            ຍັງບໍ່ໄດ້ຊຳລະ
                        </span>
                    )}
                </div>

                {/* ── Purchase + Import Meta ── */}
                <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50/60 p-4 rounded-xl border border-gray-100">
                    <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            ໃບສັ່ງຊື້
                        </p>
                        <div className="flex justify-between">
                            <span className="text-gray-400">ລະຫັດ:</span>
                            <span className="font-mono font-semibold text-gray-800">
                                {purchase.purchase_code}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">ວັນທີ:</span>
                            <span className="text-gray-700">{formatDate(purchase.purchase_date)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">ຜູ້ສະໜອງ:</span>
                            <span className="text-gray-700">{purchase.supplier?.supplier_name}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <PackageCheck className="w-3.5 h-3.5" /> ການນຳເຂົ້າ
                        </p>
                        <div className="flex justify-between">
                            <span className="text-gray-400">ລະຫັດ:</span>
                            <span className="font-mono font-semibold text-gray-800">
                                {purchase.import?.import_code ?? "-"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">ວັນທີຮັບ:</span>
                            <span className="text-gray-700">
                                {purchase.import?.import_date
                                    ? formatDate(purchase.import.import_date)
                                    : "-"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">ຜູ້ຮັບ:</span>
                            <span className="text-gray-700">
                                {purchase?.employee?.employee_name ?? "-"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Items Table ── */}
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-50/80">
                            <TableRow>
                                <TableHead className="w-10 text-center text-gray-500">#</TableHead>
                                <TableHead className="text-gray-500">ສິນຄ້າ</TableHead>
                                <TableHead className="text-right text-gray-500">ສັ່ງ</TableHead>
                                <TableHead className="text-right text-emerald-600">ຮັບຈິງ</TableHead>
                                <TableHead className="text-right text-gray-500">ລາຄາ</TableHead>
                                <TableHead className="text-right text-gray-500">ລວມ (ຮັບຈິງ)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {details.map((d, i) => {
                                const receivedCost = (d.received_qty ?? 0) * d.price
                                const isShort = (d.received_qty ?? 0) < d.quantity
                                return (
                                    <TableRow
                                        key={d.purchase_detail_id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <TableCell className="text-center text-gray-400">{i + 1}</TableCell>
                                        <TableCell className="font-medium text-gray-900">
                                            {d.product?.product_name}
                                        </TableCell>
                                        <TableCell className="text-right text-gray-400 tabular-nums">
                                            {d.quantity}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            <span className={isShort
                                                ? "text-amber-600 font-semibold"
                                                : "text-emerald-600 font-semibold"
                                            }>
                                                {d.received_qty ?? 0}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-gray-500 tabular-nums">
                                            {formatCurrency(d.price)}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-gray-900 tabular-nums">
                                            {formatCurrency(receivedCost)}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* ── Partial Receive Warning ── */}
                {isPartialReceive && (
                    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>
                            ຮັບສິນຄ້າບໍ່ຄົບ — ຍອດຊຳລະຈະຄິດຕາມ
                            <strong className="ml-1">ຈຳນວນທີ່ຮັບຕົວຈິງ</strong>
                            ເທົ່ານັ້ນ
                        </span>
                    </div>
                )}

                {/* ── Summary ── */}
                <div className="flex justify-end">
                    <div className="w-full sm:w-[320px] rounded-xl border border-gray-200 bg-gray-50/40 p-4 space-y-2.5 shadow-sm">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>ຍອດຕາມໃບສັ່ງ</span>
                            <span className="tabular-nums line-through">
                                {formatCurrency(orderedTotal)} ກີບ
                            </span>
                        </div>

                        {isPartialReceive && (
                            <div className="flex justify-between text-sm text-amber-600">
                                <span>ສ່ວນຫຼຸດ (ບໍ່ຮັບ)</span>
                                <span className="tabular-nums">- {formatCurrency(diff)} ກີບ</span>
                            </div>
                        )}

                        <div className="border-t border-dashed" />

                        <div className="flex justify-between text-sm text-gray-600">
                            <span>ຍອດຕາມຮັບຈິງ</span>
                            <span className="font-semibold tabular-nums text-gray-900">
                                {formatCurrency(actualTotal)} ກີບ
                            </span>
                        </div>

                        {alreadyPaid > 0 && (
                            <div className="flex justify-between text-sm text-emerald-600">
                                <span>ຊຳລະແລ້ວ</span>
                                <span className="tabular-nums">- {formatCurrency(alreadyPaid)} ກີບ</span>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                            <span className="text-sm font-bold text-gray-900">ຍອດຕ້ອງຊຳລະ</span>
                            <span className="text-xl font-extrabold text-green-600 tabular-nums">
                                {formatCurrency(remaining)}
                                <span className="text-xs font-semibold text-gray-400 ml-1">ກີບ</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Actions ── */}
                <div className="flex justify-end gap-3 pt-1 border-t">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                        className="min-w-[90px]"
                    >
                        ຍົກເລີກ
                    </Button>

                    <Button
                        onClick={handleConfirm}
                        disabled={!canPay || isPending}
                        className="min-w-[140px] bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                ກຳລັງດຳເນີນການ...
                            </>
                        ) : (
                            <>
                                <BadgeCheck className="w-4 h-4" />
                                ຢືນຢັນຊຳລະເງິນ
                            </>
                        )}
                    </Button>
                </div>

                {/* canPay hint */}
                {!canPay && purchase.payment_status !== "PAID" && (
                    <p className="text-center text-xs text-gray-400 -mt-2">
                        {!purchase.import
                            ? "⚠ ຕ້ອງມີໃບນຳເຂົ້າກ່ອນຈຶ່ງຊຳລະໄດ້"
                            : purchase.status !== "COMPLETED"
                                ? "⚠ ສະຖານະຕ້ອງເປັນ COMPLETED ກ່ອນຊຳລະ"
                                : null}
                    </p>
                )}

            </DialogContent>
        </Dialog>
    )
}