


"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { UseMutationResult } from "@tanstack/react-query"
import { CreateImportInput, Import } from "@/modules/import/import.type"
import { PurchaseOrder } from "../purchase/PurchaseType"
import SearchSelect from "@/components/SearchSelectOption"
import { NumericFormat } from "react-number-format"
import { formatCurrency } from "@/utils/FormatCurrency"

// ─── Schema ────────────────────────────────────────────────
const importDetailSchema = z.object({
    product_id: z.string(),
    variant_id: z.string(),
    quantity: z.number().min(1, "ຈຳນວນຕ້ອງຢ່າງໜ້ອຍ 1"),
    cost_price: z.number().min(0),
    // UI-only fields (ຖືກລຶບກ່ອນ submit)
    product_name: z.string().optional(),
    variant_info: z.string().optional(),
})

const importFormSchema = z.object({
    purchase_id: z.string().min(1, "ກະລຸນາເລືອກໃບສັ່ງຊື້"),
    import_details: z.array(importDetailSchema).min(1),
})

type ImportFormValue = z.infer<typeof importFormSchema>
// ───────────────────────────────────────────────────────────

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    create: UseMutationResult<Import, Error, CreateImportInput>
    purchases: PurchaseOrder[]
}

export function ImportFormDialog({ open, onOpenChange, create, purchases }: Props) {

    const {
        control, handleSubmit, setValue, watch, reset,
        formState: { errors },
    } = useForm<ImportFormValue>({
        resolver: zodResolver(importFormSchema),
        defaultValues: { purchase_id: "", import_details: [] },
    })

    const { fields, replace } = useFieldArray({ control, name: "import_details" })

    const purchaseId = watch("purchase_id")

    // ✅ ໂຫຼດ items ຈາກ purchase ທີ່ເລືອກ
    useEffect(() => {
        if (!purchaseId) { replace([]); return }

        const purchase = purchases.find(p => p.purchase_id === purchaseId)
        if (!purchase) return

        const items = purchase.purchase_details?.map(d => ({
            product_id: d.product_id,
            variant_id: d.variant_id,   // ✅
            quantity: d.quantity,
            cost_price: d.price,
            product_name: d.product?.product_name ?? "—",
            variant_info: d.variant        // ✅ ສະແດງ color/size
                ? `${d.variant.color} / ${d.variant.size}`
                : "—",
        })) ?? []

        replace(items)
    }, [purchaseId, purchases, replace])

    // ✅ Reset ເມື່ອ dialog ປິດ
    useEffect(() => {
        if (!open) reset({ purchase_id: "", import_details: [] })
    }, [open, reset])

    // ─── Submit ──────────────────────────────────────────
    const onSubmit = async (data: ImportFormValue) => {
        try {
            // ✅ ລຶບ UI-only fields ກ່ອນ submit
            const cleanDetails: CreateImportInput["import_details"] =
                data.import_details.map(({ product_id, variant_id, quantity, cost_price }) => ({
                    product_id,
                    variant_id,
                    quantity,
                    cost_price,
                }))

            await create.mutateAsync({
                purchase_id: data.purchase_id,
                import_details: cleanDetails,
            })

            toast.success("ສ້າງລາຍການນຳເຂົ້າສຳເລັດ")
            onOpenChange(false)
        } catch (error) {
            console.error(error)
            toast.error("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ")
        }
    }

    // ✅ ສະເພາະ PENDING ທີ່ຍັງບໍ່ມີ import
    const availablePurchases = purchases.filter(
        p => p.status === "PENDING" && !p.import
    )

    const grandTotal = watch("import_details").reduce(
        (sum, d) => sum + (d.quantity || 0) * (d.cost_price || 0), 0
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-5">

                <DialogHeader>
                    <DialogTitle>ສ້າງລາຍການນຳເຂົ້າ</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* SELECT PURCHASE */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">
                            ໃບສັ່ງຊື້ (PENDING)
                        </label>
                        <SearchSelect
                            value={watch("purchase_id")}
                            placeholder="ຄົ້ນຫາໃບສັ່ງຊື້..."
                            options={availablePurchases.map(p => ({
                                value: p.purchase_id,
                                label: `${p.purchase_code} — ${p.supplier?.supplier_name ?? ""}`,
                            }))}
                            onChange={val => setValue("purchase_id", val, { shouldValidate: true })}
                        />
                        <p className="text-xs text-red-500 mt-1">{errors.purchase_id?.message}</p>
                    </div>

                    {/* ITEMS */}
                    {fields.length > 0 && (
                        <div className="space-y-3">
                            <label className="text-sm font-medium block">ລາຍການສິນຄ້າ</label>

                            {/* Header row */}
                            <div className="grid grid-cols-12 gap-2 px-3 text-xs text-muted-foreground">
                                <div className="col-span-4">ສິນຄ້າ</div>
                                <div className="col-span-3">Variant</div>
                                <div className="col-span-2 text-right">ຈຳນວນ</div>
                                <div className="col-span-3 text-right">ລາຄາ / ລວມ</div>
                            </div>

                            {fields.map((f, i) => {
                                const qty = watch(`import_details.${i}.quantity`) || 0
                                const price = watch(`import_details.${i}.cost_price`) || 0

                                return (
                                    <div
                                        key={f.id}
                                        className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg bg-muted/30"
                                    >
                                        {/* Product name */}
                                        <div className="col-span-4">
                                            <Input
                                                value={f.product_name ?? "—"}
                                                disabled
                                                className="bg-background text-sm"
                                            />
                                        </div>

                                        {/* Variant info ✅ */}
                                        <div className="col-span-3">
                                            <Input
                                                value={f.variant_info ?? "—"}
                                                disabled
                                                className="bg-background text-sm"
                                            />
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-2">
                                            <Controller
                                                name={`import_details.${i}.quantity`}
                                                control={control}
                                                render={({ field }) => (
                                                    <NumericFormat
                                                        customInput={Input}
                                                        value={field.value === 0 ? "" : field.value}
                                                        placeholder="ຈຳນວນ"
                                                        thousandSeparator
                                                        allowNegative={false}
                                                        decimalScale={0}
                                                        className="text-right"
                                                        onValueChange={v =>
                                                            field.onChange(v.value === "" ? 0 : Number(v.value))
                                                        }
                                                    />
                                                )}
                                            />
                                            <p className="text-xs text-red-500 mt-0.5">
                                                {errors.import_details?.[i]?.quantity?.message}
                                            </p>
                                        </div>

                                        {/* Price + subtotal */}
                                        <div className="col-span-3 space-y-1">
                                            <div className="px-3 py-2 border rounded-md bg-background text-xs text-right text-muted-foreground">
                                                {formatCurrency(price)} / ໜ່ວຍ
                                            </div>
                                            <div className="px-3 py-1 text-xs text-right font-medium">
                                                = {formatCurrency(qty * price)}
                                            </div>
                                        </div>

                                        {/* Hidden fields */}
                                        <input type="hidden" {...({ name: `import_details.${i}.product_id` } as object)} />
                                        <input type="hidden" {...({ name: `import_details.${i}.variant_id` } as object)} />
                                    </div>
                                )
                            })}

                            {/* Grand total */}
                            <div className="flex justify-between items-center border-t pt-3 px-1">
                                <span className="text-sm font-medium">ຍອດລວມທັງໝົດ</span>
                                <span className="text-lg font-semibold text-green-600">
                                    {formatCurrency(grandTotal)} ກີບ
                                </span>
                            </div>
                        </div>
                    )}

                    {purchaseId && fields.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4 border border-dashed rounded-lg">
                            ໃບສັ່ງຊື້ນີ້ບໍ່ມີລາຍການສິນຄ້າ
                        </p>
                    )}

                    {/* SUBMIT */}
                    <div className="border-t pt-4 flex justify-end">
                        <Button
                            type="submit"
                            className="min-w-[160px]"
                            disabled={create.isPending || fields.length === 0}
                        >
                            {create.isPending ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກການນຳເຂົ້າ"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}