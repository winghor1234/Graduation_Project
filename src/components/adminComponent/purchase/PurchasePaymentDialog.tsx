// "use client"

// import { Dialog, DialogContent, DialogTitle, DialogDescription, } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
// import { formatCurrency } from "@/utils/FormatCurrency"
// import { formatDate } from "@/utils/FormatDate"
// import { AlertTriangle, BadgeCheck, Banknote, Loader2, PackageCheck, } from "lucide-react"
// import { useCreatePaymentPurchaseOrder } from "@/app/features/hooks/Purchase"
// import { PurchaseOrder } from "./PurchaseType"

// /* ----------------------------- Props ----------------------------- */

// type Props = {
//     open: boolean
//     onOpenChange: (open: boolean) => void
//     purchase?: PurchaseOrder
// }

// /* ----------------------------- Component ----------------------------- */

// export function PurchasePaymentDialog({ open, onOpenChange, purchase }: Props) {

//     const { mutate: confirmPayment, isPending } = useCreatePaymentPurchaseOrder()

//     if (!purchase) return null

//     const details = purchase.purchase_details ?? []

//     // ยอดตามสั่ง
//     const orderedTotal = details.reduce(
//         (sum, d) => sum + d.quantity * d.price, 0
//     )

//     // ยอดตามรับจริง (received_qty * price)
//     const actualTotal = details.reduce(
//         (sum, d) => sum + (d.received_qty ?? 0) * d.price, 0
//     )

//     const diff = orderedTotal - actualTotal
//     const isPartialReceive = diff > 0
//     const alreadyPaid = purchase.paid_amount ?? 0
//     const remaining = actualTotal - alreadyPaid

//     // canPay guard
//     const canPay = purchase.status === "COMPLETED" && purchase.payment_status === "UNPAID"

//     const handleConfirm = () => {
//         if (!purchase.purchase_id) return
//         confirmPayment({ id: purchase.purchase_id }, {
//             onSuccess: () => onOpenChange(false),
//         })
//     }

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="max-w-2xl p-6 gap-5 rounded-2xl border border-gray-100 shadow-xl bg-white">

//                 {/* ── Header ── */}
//                 <div className="flex items-start justify-between border-b pb-4">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 rounded-xl bg-green-50 border border-green-100">
//                             <Banknote className="w-5 h-5 text-green-600" />
//                         </div>
//                         <div>
//                             <DialogTitle className="text-base font-bold text-gray-900">
//                                 ຢືນຢັນການຊຳລະເງິນ
//                             </DialogTitle>
//                             <DialogDescription className="text-xs text-admin-muted mt-0.5">
//                                 ກວດສອບລາຍລະອຽດກ່ອນຊຳລະ
//                             </DialogDescription>
//                         </div>
//                     </div>

//                     {/* Payment status pill */}
//                     {purchase.payment_status === "PAID" ? (
//                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
//                             <BadgeCheck className="w-3.5 h-3.5" />
//                             ຊຳລະແລ້ວ
//                         </span>
//                     ) : (
//                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
//                             <Banknote className="w-3.5 h-3.5" />
//                             ຍັງບໍ່ໄດ້ຊຳລະ
//                         </span>
//                     )}
//                 </div>

//                 {/* ── Purchase + Import Meta ── */}
//                 <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50/60 p-4 rounded-xl border border-gray-100">
//                     <div className="space-y-2">
//                         <p className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
//                             ໃບສັ່ງຊື້
//                         </p>
//                         <div className="flex justify-between">
//                             <span className="text-admin-muted">ລະຫັດ:</span>
//                             <span className="font-mono font-semibold text-admin-text">
//                                 {purchase.purchase_code}
//                             </span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-admin-muted">ວັນທີ:</span>
//                             <span className="text-admin-text">{formatDate(purchase.purchase_date)}</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-admin-muted">ຜູ້ສະໜອງ:</span>
//                             <span className="text-admin-text">{purchase.supplier?.supplier_name}</span>
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <p className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider flex items-center gap-1">
//                             <PackageCheck className="w-3.5 h-3.5" /> ການນຳເຂົ້າ
//                         </p>
//                         <div className="flex justify-between">
//                             <span className="text-admin-muted">ລະຫັດ:</span>
//                             <span className="font-mono font-semibold text-admin-text">
//                                 {purchase.import?.import_code ?? "-"}
//                             </span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-admin-muted">ວັນທີຮັບ:</span>
//                             <span className="text-admin-text">
//                                 {purchase.import?.import_date
//                                     ? formatDate(purchase.import.import_date)
//                                     : "-"}
//                             </span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-admin-muted">ຜູ້ຮັບ:</span>
//                             <span className="text-admin-text">
//                                 {purchase?.employee?.employee_name ?? "-"}
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── Items Table ── */}
//                 <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
//                     <Table>
//                         <TableHeader className="bg-gray-50/80">
//                             <TableRow>
//                                 <TableHead className="w-10 text-center text-gray-500">#</TableHead>
//                                 <TableHead className="text-gray-500">ສິນຄ້າ</TableHead>
//                                 <TableHead className="text-right text-gray-500">ສັ່ງ</TableHead>
//                                 <TableHead className="text-right text-emerald-600">ຮັບຈິງ</TableHead>
//                                 <TableHead className="text-right text-gray-500">ລາຄາ</TableHead>
//                                 <TableHead className="text-right text-gray-500">ລວມ (ຮັບຈິງ)</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {details.map((d, i) => {
//                                 const receivedCost = (d.received_qty ?? 0) * d.price
//                                 const isShort = (d.received_qty ?? 0) < d.quantity
//                                 return (
//                                     <TableRow
//                                         key={d.purchase_detail_id}
//                                         className="hover:bg-brand-blue-soft/30 transition-colors"
//                                     >
//                                         <TableCell className="text-center text-admin-muted">{i + 1}</TableCell>
//                                         <TableCell className="font-medium text-gray-900">
//                                             {d.product?.product_name}
//                                         </TableCell>
//                                         <TableCell className="text-right text-admin-muted tabular-nums">
//                                             {d.quantity}
//                                         </TableCell>
//                                         <TableCell className="text-right tabular-nums">
//                                             <span className={isShort
//                                                 ? "text-amber-600 font-semibold"
//                                                 : "text-emerald-600 font-semibold"
//                                             }>
//                                                 {d.received_qty ?? 0}
//                                             </span>
//                                         </TableCell>
//                                         <TableCell className="text-right text-gray-500 tabular-nums">
//                                             {formatCurrency(d.price)}
//                                         </TableCell>
//                                         <TableCell className="text-right font-semibold text-gray-900 tabular-nums">
//                                             {formatCurrency(receivedCost)}
//                                         </TableCell>
//                                     </TableRow>
//                                 )
//                             })}
//                         </TableBody>
//                     </Table>
//                 </div>

//                 {/* ── Partial Receive Warning ── */}
//                 {isPartialReceive && (
//                     <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700">
//                         <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
//                         <span>
//                             ຮັບສິນຄ້າບໍ່ຄົບ — ຍອດຊຳລະຈະຄິດຕາມ
//                             <strong className="ml-1">ຈຳນວນທີ່ຮັບຕົວຈິງ</strong>
//                             ເທົ່ານັ້ນ
//                         </span>
//                     </div>
//                 )}

//                 {/* ── Summary ── */}
//                 <div className="flex justify-end">
//                     <div className="w-full sm:w-[320px] rounded-xl border border-gray-200 bg-gray-50/40 p-4 space-y-2.5 shadow-sm">
//                         <div className="flex justify-between text-sm text-admin-muted">
//                             <span>ຍອດຕາມໃບສັ່ງ</span>
//                             <span className="tabular-nums line-through">
//                                 {formatCurrency(orderedTotal)} ກີບ
//                             </span>
//                         </div>

//                         {isPartialReceive && (
//                             <div className="flex justify-between text-sm text-amber-600">
//                                 <span>ສ່ວນຫຼຸດ (ບໍ່ຮັບ)</span>
//                                 <span className="tabular-nums">- {formatCurrency(diff)} ກີບ</span>
//                             </div>
//                         )}

//                         <div className="border-t border-dashed" />

//                         <div className="flex justify-between text-sm text-gray-600">
//                             <span>ຍອດຕາມຮັບຈິງ</span>
//                             <span className="font-semibold tabular-nums text-gray-900">
//                                 {formatCurrency(actualTotal)} ກີບ
//                             </span>
//                         </div>

//                         {alreadyPaid > 0 && (
//                             <div className="flex justify-between text-sm text-emerald-600">
//                                 <span>ຊຳລະແລ້ວ</span>
//                                 <span className="tabular-nums">- {formatCurrency(alreadyPaid)} ກີບ</span>
//                             </div>
//                         )}

//                         <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
//                             <span className="text-sm font-bold text-gray-900">ຍອດຕ້ອງຊຳລະ</span>
//                             <span className="text-xl font-extrabold text-green-600 tabular-nums">
//                                 {formatCurrency(remaining)}
//                                 <span className="text-xs font-semibold text-admin-muted ml-1">ກີບ</span>
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── Actions ── */}
//                 <div className="flex justify-end gap-3 pt-1 border-t">
//                     <Button
//                         variant="outline"
//                         onClick={() => onOpenChange(false)}
//                         disabled={isPending}
//                         className="min-w-[90px]"
//                     >
//                         ຍົກເລີກ
//                     </Button>

//                     <Button
//                         onClick={handleConfirm}
//                         disabled={!canPay || isPending}
//                         className="min-w-[140px] bg-green-600 hover:bg-green-700 text-white gap-2"
//                     >
//                         {isPending ? (
//                             <>
//                                 <Loader2 className="w-4 h-4 animate-spin" />
//                                 ກຳລັງດຳເນີນການ...
//                             </>
//                         ) : (
//                             <>
//                                 <BadgeCheck className="w-4 h-4" />
//                                 ຢືນຢັນຊຳລະເງິນ
//                             </>
//                         )}
//                     </Button>
//                 </div>

//                 {/* canPay hint */}
//                 {!canPay && purchase.payment_status !== "PAID" && (
//                     <p className="text-center text-xs text-admin-muted -mt-2">
//                         {!purchase.import
//                             ? "⚠ ຕ້ອງມີໃບນຳເຂົ້າກ່ອນຈຶ່ງຊຳລະໄດ້"
//                             : purchase.status !== "COMPLETED"
//                                 ? "⚠ ສະຖານະຕ້ອງເປັນ COMPLETED ກ່ອນຊຳລະ"
//                                 : null}
//                     </p>
//                 )}

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
import {
    AlertTriangle, BadgeCheck, Banknote,
    Loader2, PackageCheck,
} from "lucide-react"
import { useCreatePaymentPurchaseOrder } from "@/app/features/hooks/Purchase"
import { PurchaseOrder } from "./PurchaseType"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    purchase?: PurchaseOrder
}

export function PurchasePaymentDialog({ open, onOpenChange, purchase }: Props) {

    const { mutate: confirmPayment, isPending } = useCreatePaymentPurchaseOrder()

    if (!purchase) return null

    const details = purchase.purchase_details ?? []

    const orderedTotal = details.reduce((sum, d) => sum + d.quantity * d.price, 0)
    const actualTotal = details.reduce((sum, d) => sum + (d.received_qty ?? 0) * d.price, 0)
    const diff = orderedTotal - actualTotal
    const alreadyPaid = purchase.paid_amount ?? 0
    const remaining = actualTotal - alreadyPaid

    const isPartialReceive = diff > 0

    // ✅ ຕ້ອງ COMPLETED + UNPAID + ມີ import
    const canPay =
        purchase.status === "COMPLETED" &&
        purchase.payment_status === "UNPAID" &&
        !!purchase.import

    const handleConfirm = () => {
        confirmPayment(
            { id: purchase.purchase_id },
            { onSuccess: () => onOpenChange(false) }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 gap-5 rounded-2xl">

                {/* ── Header ── */}
                <div className="flex items-start justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-green-50 border border-green-100">
                            <Banknote className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold">
                                ຢືນຢັນການຊຳລະເງິນ
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                ກວດສອບລາຍລະອຽດກ່ອນຊຳລະ
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Payment status pill */}
                    {purchase.payment_status === "PAID" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            ຊຳລະແລ້ວ
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-200">
                            <Banknote className="w-3.5 h-3.5" />
                            ຍັງບໍ່ໄດ້ຊຳລະ
                        </span>
                    )}
                </div>

                {/* ── Meta ── */}
                <div className="grid grid-cols-2 gap-3 text-sm bg-muted/40 p-4 rounded-xl border">

                    {/* Purchase info */}
                    <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            ໃບສັ່ງຊື້
                        </p>
                        <MetaRow label="ລະຫັດ" value={purchase.purchase_code} mono />
                        <MetaRow label="ວັນທີ" value={formatDate(purchase.purchase_date)} />
                        <MetaRow label="ຜູ້ສະໜອງ" value={purchase.supplier?.supplier_name ?? "—"} />
                    </div>

                    {/* Import info */}
                    <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <PackageCheck className="w-3.5 h-3.5" />
                            ການນຳເຂົ້າ
                        </p>
                        <MetaRow
                            label="ລະຫັດ"
                            value={purchase.import?.import_code ?? "ຍັງບໍ່ມີ"}
                            mono
                        />
                        <MetaRow
                            label="ວັນທີຮັບ"
                            value={purchase.import?.import_date
                                ? formatDate(purchase.import.import_date)
                                : "—"}
                        />
                        <MetaRow
                            label="ຜູ້ຮັບ"
                            value={purchase.employee?.employee_name ?? "—"}
                        />
                    </div>
                </div>

                {/* ── Items Table ── */}
                {details.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6 border rounded-xl">
                        ບໍ່ມີລາຍການສິນຄ້າ
                    </p>
                ) : (
                    <div className="overflow-hidden rounded-xl border shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-10 text-center">#</TableHead>
                                    <TableHead>ສິນຄ້າ</TableHead>
                                    <TableHead className="text-center">Variant</TableHead>
                                    <TableHead className="text-right">ສັ່ງ</TableHead>
                                    <TableHead className="text-right text-emerald-600">ຮັບຈິງ</TableHead>
                                    <TableHead className="text-right">ລາຄາ</TableHead>
                                    <TableHead className="text-right">ລວມ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {details.map((d, i) => {
                                    const receivedCost = (d.received_qty ?? 0) * d.price
                                    const isShort = (d.received_qty ?? 0) < d.quantity
                                    return (
                                        <TableRow key={d.purchase_detail_id}>
                                            <TableCell className="text-center text-muted-foreground text-xs">
                                                {i + 1}
                                            </TableCell>

                                            {/* ✅ Product name */}
                                            <TableCell className="font-medium">
                                                {d.product?.product_name ?? "—"}
                                                <p className="text-xs text-muted-foreground font-normal">
                                                    {d.product?.product_code}
                                                </p>
                                            </TableCell>

                                            {/* ✅ Variant chip */}
                                            <TableCell className="text-center">
                                                {d.variant ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md border text-xs bg-muted text-muted-foreground">
                                                        {d.variant.color} / {d.variant.size}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-right text-muted-foreground tabular-nums">
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

                                            <TableCell className="text-right text-muted-foreground tabular-nums">
                                                {formatCurrency(d.price)}
                                            </TableCell>

                                            <TableCell className="text-right font-semibold tabular-nums">
                                                {formatCurrency(receivedCost)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}

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
                    <div className="w-full sm:w-[320px] rounded-xl border bg-muted/30 p-4 space-y-2.5">

                        <SummaryRow
                            label="ຍອດຕາມໃບສັ່ງ"
                            value={`${formatCurrency(orderedTotal)} ກີບ`}
                            muted
                            strikethrough
                        />

                        {isPartialReceive && (
                            <SummaryRow
                                label="ສ່ວນຫຼຸດ (ບໍ່ຮັບ)"
                                value={`- ${formatCurrency(diff)} ກີບ`}
                                className="text-amber-600"
                            />
                        )}

                        <div className="border-t border-dashed" />

                        <SummaryRow
                            label="ຍອດຕາມຮັບຈິງ"
                            value={`${formatCurrency(actualTotal)} ກີບ`}
                        />

                        {alreadyPaid > 0 && (
                            <SummaryRow
                                label="ຊຳລະແລ້ວ"
                                value={`- ${formatCurrency(alreadyPaid)} ກີບ`}
                                className="text-emerald-600"
                            />
                        )}

                        <div className="border-t pt-2 flex justify-between items-baseline">
                            <span className="text-sm font-bold">ຍອດຕ້ອງຊຳລະ</span>
                            <span className="text-xl font-extrabold text-green-600 tabular-nums">
                                {formatCurrency(remaining)}
                                <span className="text-xs font-medium text-muted-foreground ml-1">ກີບ</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── canPay hint ── */}
                {!canPay && purchase.payment_status !== "PAID" && (
                    <p className="text-center text-xs text-muted-foreground -mt-2">
                        {!purchase.import
                            ? "⚠ ຕ້ອງນຳເຂົ້າສິນຄ້າກ່ອນຈຶ່ງຊຳລະໄດ້"
                            : purchase.status !== "COMPLETED"
                                ? "⚠ ສະຖານະຕ້ອງເປັນ COMPLETED ກ່ອນຊຳລະ"
                                : null}
                    </p>
                )}

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

            </DialogContent>
        </Dialog>
    )
}

// ─── Small helpers ──────────────────────────────────────────

function MetaRow({
    label, value, mono = false
}: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label}:</span>
            <span className={mono ? "font-mono font-semibold" : ""}>
                {value}
            </span>
        </div>
    )
}

function SummaryRow({
    label, value, muted, strikethrough, className = ""
}: {
    label: string
    value: string
    muted?: boolean
    strikethrough?: boolean
    className?: string
}) {
    return (
        <div className={`flex justify-between text-sm ${muted ? "text-muted-foreground" : ""} ${className}`}>
            <span>{label}</span>
            <span className={`tabular-nums ${strikethrough ? "line-through" : ""}`}>
                {value}
            </span>
        </div>
    )
}