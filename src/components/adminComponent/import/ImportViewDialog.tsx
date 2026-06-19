"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { Import } from "@/modules/import/import.type"
import { BadgeComponent } from "../StatusComponent"
import { UseMutationResult } from "@tanstack/react-query"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data?: Import
    confirm: UseMutationResult<void, Error, string>
    cancel: UseMutationResult<void, Error, string>
}

export function ImportViewDialog({ open, onOpenChange, data, confirm, cancel }: Props) {

    if (!data) return null

    const details = data.import_details ?? []
    const grandTotal = details.reduce((sum, d) => sum + d.quantity * d.cost_price, 0)
    const isPending = data.status === "PENDING"

    const handleConfirm = () => {
        confirm.mutate(data.import_id, {
            onSuccess: () => onOpenChange(false)
        })
    }

    const handleCancel = () => {
        cancel.mutate(data.import_id, {
            onSuccess: () => onOpenChange(false)
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-5">

                <DialogHeader>
                    <div className="flex items-center justify-between pr-6">
                        <DialogTitle>ລາຍລະອຽດການນຳເຂົ້າ</DialogTitle>
                        <BadgeComponent status={data.status} />
                    </div>
                </DialogHeader>

                {/* ── Meta info ── */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm bg-muted/40 p-4 rounded-lg border">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">ລະຫັດນຳເຂົ້າ:</span>
                        <span className="font-mono font-medium">{data.import_code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">ລະຫັດສັ່ງຊື້:</span>
                        <span className="font-mono font-medium">
                            {data.purchase?.purchase_code ?? "—"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">ຜູ້ສະໜອງ:</span>
                        <span>{data.purchase?.supplier?.supplier_name ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">ພະນັກງານ:</span>
                        <span>{data.employee?.employee_name ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">ວັນທີນຳເຂົ້າ:</span>
                        <span>{formatDate(data.import_date)}</span>
                    </div>
                </div>

                {/* ── Items (same layout as ImportFormDialog, readonly) ── */}
                {details.length > 0 ? (
                    <div className="space-y-3">
                        <label className="text-sm font-medium block">ລາຍການສິນຄ້າ</label>

                        {/* Header row */}
                        <div className="grid grid-cols-12 gap-2 px-3 text-xs text-muted-foreground">
                            <div className="col-span-4">ສິນຄ້າ</div>
                            <div className="col-span-3">Variant</div>
                            <div className="col-span-2 text-right">ຈຳນວນ</div>
                            <div className="col-span-3 text-right">ລາຄາ / ລວມ</div>
                        </div>

                        {details.map((d) => (
                            <div
                                key={d.import_detail_id}
                                className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg bg-muted/30"
                            >
                                {/* Product name */}
                                <div className="col-span-4">
                                    <Input
                                        value={d.product?.product_name ?? "—"}
                                        disabled
                                        className="bg-background text-sm"
                                    />
                                </div>

                                {/* Variant */}
                                <div className="col-span-3">
                                    <Input
                                        value={d.variant
                                            ? `${d.variant.color} / ${d.variant.size}`
                                            : "—"}
                                        disabled
                                        className="bg-background text-sm"
                                    />
                                </div>

                                {/* Quantity */}
                                <div className="col-span-2">
                                    <Input
                                        value={d.quantity}
                                        disabled
                                        className="bg-background text-sm text-right"
                                    />
                                </div>

                                {/* Price + subtotal */}
                                <div className="col-span-3 space-y-1">
                                    <div className="px-3 py-2 border rounded-md bg-background text-xs text-right text-muted-foreground">
                                        {formatCurrency(d.cost_price)} / ໜ່ວຍ
                                    </div>
                                    <div className="px-3 py-1 text-xs text-right font-medium">
                                        = {formatCurrency(d.quantity * d.cost_price)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Grand total */}
                        <div className="flex justify-between items-center border-t pt-3 px-1">
                            <span className="text-sm font-medium">ຍອດລວມທັງໝົດ</span>
                            <span className="text-lg font-semibold text-green-600">
                                {formatCurrency(grandTotal)} ກີບ
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-sm text-muted-foreground py-4 border border-dashed rounded-lg">
                        ບໍ່ມີລາຍການສິນຄ້າ
                    </p>
                )}

                {/* ── Actions (PENDING only) ── */}
                <div className="border-t pt-4 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={confirm.isPending || cancel.isPending}
                    >
                        ປິດ
                    </Button>

                    {isPending && (
                        <>
                            {/* Cancel import */}
                            <Button
                                variant="destructive"
                                onClick={handleCancel}
                                disabled={cancel.isPending || confirm.isPending}
                                className="gap-2"
                            >
                                {cancel.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <XCircle className="w-4 h-4" />
                                )}
                                ຍົກເລີກການນຳເຂົ້າ
                            </Button>

                            {/* Confirm import */}
                            <Button
                                onClick={handleConfirm}
                                disabled={confirm.isPending || cancel.isPending}
                                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                            >
                                {confirm.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4" />
                                )}
                                ຢືນຢັນການນຳເຂົ້າ
                            </Button>
                        </>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    )
}