"use client"

import { useState } from "react"
import { UseMutationResult } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import SearchSelect from "@/components/SearchSelectOption"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Minus, Plus } from "lucide-react"
import { CreateRefundInput, Refund } from "@/modules/refund/refund.type"
import { Sale } from "@/modules/sale/sale.type"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    sales: Sale[]
    create: UseMutationResult<Refund, Error, CreateRefundInput>
}

export function RefundFormDialog({ open, onOpenChange, sales, create }: Props) {

    const [selectedSaleId, setSelectedSaleId] = useState("")
    const [refundQtys, setRefundQtys] = useState<Record<string, number>>({})

    const selectedSale = sales.find(s => s.sale_id === selectedSaleId)

    // ✅ ສະເພາະ sale ທີ່ຍັງບໍ່ມີ refund
    const availableSales = sales.filter(s => !s.refund)

    const handleQtyChange = (productId: string, delta: number, maxQty: number) => {
        setRefundQtys(prev => {
            const current = prev[productId] ?? 0
            const next = Math.min(Math.max(0, current + delta), maxQty)
            return { ...prev, [productId]: next }
        })
    }

    const handleSubmit = async () => {
        if (!selectedSaleId) {
            toast.error("ກະລຸນາເລືອກໃບຂາຍ")
            return
        }

        const details = selectedSale?.sale_details
            ?.filter(d => (refundQtys[d.product_id] ?? 0) > 0)
            .map(d => ({
                product_id: d.product_id,
                quantity: refundQtys[d.product_id],
                price: d.price,
            })) ?? []

        if (!details.length) {
            toast.error("ກະລຸນາເລືອກຢ່າງໜ້ອຍ 1 ລາຍການ")
            return
        }

        try {
            await create.mutateAsync({ sale_id: selectedSaleId, refund_details: details })
            toast.success("ສ້າງ Refund ສຳເລັດ")
            onOpenChange(false)
            setSelectedSaleId("")
            setRefundQtys({})
        } catch (error) {
            toast.error("ເກີດຂໍ້ຜິດພາດ")
        }
    }

    const totalRefund = selectedSale?.sale_details?.reduce((sum, d) => {
        const qty = refundQtys[d.product_id] ?? 0
        return sum + qty * d.price
    }, 0) ?? 0

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>ສ້າງລາຍການຄືນສິນຄ້າ (Refund)</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    {/* Select sale */}
                    <div>
                        <Label>ເລືອກໃບຂາຍ *</Label>
                        <SearchSelect
                            value={selectedSaleId}
                            placeholder="ຄົ້ນຫາໃບຂາຍ..."
                            options={availableSales.map(s => ({
                                value: s.sale_id,
                                label: `${s.sale_id.slice(0, 8)} — ${s.customer?.customer_name ?? "Walk-in"} — ${formatCurrency(s.total_amount ?? 0)}`,
                            }))}
                            onChange={(val) => {
                                setSelectedSaleId(val)
                                setRefundQtys({})
                            }}
                        />
                    </div>

                    {/* Sale items */}
                    {selectedSale && (
                        <div className="space-y-3">
                            <Label>ລາຍການສິນຄ້າ — ເລືອກຈຳນວນທີ່ຈະ Refund</Label>

                            {selectedSale.sale_details?.map(detail => {
                                const qty = refundQtys[detail.product_id] ?? 0
                                return (
                                    <div key={detail.sale_detail_id}
                                        className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {detail.product?.product_name ?? "—"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {detail.variant?.color}/{detail.variant?.size} ·
                                                ຂາຍ {detail.quantity} ຊິ້ນ ·
                                                {formatCurrency(detail.price)}/ຊິ້ນ
                                            </p>
                                        </div>

                                        {/* Qty control */}
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon" className="h-7 w-7"
                                                type="button"
                                                onClick={() => handleQtyChange(detail.product_id, -1, detail.quantity)}
                                                disabled={qty <= 0}>
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm font-medium">{qty}</span>
                                            <Button variant="outline" size="icon" className="h-7 w-7"
                                                type="button"
                                                onClick={() => handleQtyChange(detail.product_id, 1, detail.quantity)}
                                                disabled={qty >= detail.quantity}>
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                        </div>

                                        <div className="text-right w-24">
                                            <p className="text-sm font-semibold">
                                                {qty > 0 ? formatCurrency(qty * detail.price) : "—"}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Total */}
                            <div className="flex justify-between items-center border-t pt-3">
                                <span className="font-medium">ຍອດ Refund ທັງໝົດ</span>
                                <span className="text-lg font-bold text-red-600">
                                    -{formatCurrency(totalRefund)}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                            ຍົກເລີກ
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleSubmit}
                            disabled={create.isPending || !selectedSaleId || totalRefund === 0}
                        >
                            {create.isPending ? "ກຳລັງສ້າງ..." : "ຢືນຢັນ Refund"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}