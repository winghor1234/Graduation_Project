"use client"

import { useEffect, useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, FileDown } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { CreateImportInput, ConfirmImportInput, Import } from "@/modules/import/import.type"
import { PurchaseOrder } from "../purchase/PurchaseType"
import SearchSelect from "@/components/SearchSelectOption"
import { NumericFormat } from "react-number-format"
import { BadgeComponent } from "../StatusComponent"
import { UseMutationResult } from "@tanstack/react-query"
import { handlePDFExport } from "../../ExportToReport"

// ─── Create-mode schema (ຍ້າຍມາຈາກ ImportFormDialog.tsx ທີ່ຖືກລຶບ) ──
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

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    // ✅ ບໍ່ມີ data = ໂໝດສ້າງໃໝ່ (create), ມີ data = ໂໝດເບິ່ງ/ຢືນຢັນ/ຍົກເລີກ (view)
    data?: Import
    confirm: UseMutationResult<void, Error, { id: string; data?: ConfirmImportInput }>
    cancel: UseMutationResult<void, Error, string>
    // ✅ ຕ້ອງການສະເພາະຕອນໃຊ້ໂໝດສ້າງໃໝ່ — ບໍ່ຈຳເປັນຕອນເປີດຈາກ ImportTable ເພື່ອເບິ່ງລາຍການເກົ່າ
    create?: UseMutationResult<Import, Error, CreateImportInput>
    purchases?: PurchaseOrder[]
    // ✅ ເປີດ dialog ພ້ອມເລືອກໃບສັ່ງຊື້ນີ້ໄວ້ລ່ວງໜ້າ — ໃຊ້ຕອນກົດ "ນຳເຂົ້າ" ຈາກແຖວໃບສັ່ງຊື້ໂດຍກົງ
    initialPurchaseId?: string
}

export function ImportViewDialog({
    open, onOpenChange, data, confirm, cancel, create, purchases, initialPurchaseId,
}: Props) {

    // ── ຈຳນວນທີ່ຢືນຢັນ (ໂໝດເບິ່ງ, ແກ້ໄຂໄດ້ຕອນ PENDING) ──
    const [editedQuantities, setEditedQuantities] = useState<Record<string, number>>({})

    useEffect(() => {
        if (!data) return
        const initial: Record<string, number> = {}
        for (const d of data.import_details ?? []) initial[d.import_detail_id] = d.quantity
        setEditedQuantities(initial)
    }, [data])

    // ── ຟອມສ້າງໃໝ່ (ໃຊ້ສະເພາະຕອນ !data) ──
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
        if (data || !purchases) return
        if (!purchaseId) { replace([]); return }

        const purchase = purchases.find(p => p.purchase_id === purchaseId)
        if (!purchase) return

        const items = purchase.purchase_details?.map(d => ({
            product_id: d.product_id,
            variant_id: d.variant_id,
            quantity: d.quantity,
            cost_price: d.price,
            product_name: d.product?.product_name ?? "—",
            variant_info: d.variant
                ? `${d.variant.color} / ${d.variant.size}`
                : "—",
        })) ?? []

        replace(items)
    }, [purchaseId, purchases, replace, data])

    // ✅ Reset ຟອມສ້າງໃໝ່ ເມື່ອ dialog ປິດ — ຫຼື ຕັ້ງຄ່າໃບສັ່ງຊື້ລ່ວງໜ້າຕອນເປີດ (ຖ້າມີ)
    useEffect(() => {
        if (open) {
            if (!data) reset({ purchase_id: initialPurchaseId ?? "", import_details: [] })
        } else {
            reset({ purchase_id: "", import_details: [] })
        }
    }, [open, data, initialPurchaseId, reset])

    const onSubmitCreate = async (values: ImportFormValue) => {
        if (!create) return
        try {
            const cleanDetails: CreateImportInput["import_details"] =
                values.import_details.map(({ product_id, variant_id, quantity, cost_price }) => ({
                    product_id,
                    variant_id,
                    quantity,
                    cost_price,
                }))

            const newImport = await create.mutateAsync({
                purchase_id: values.purchase_id,
                import_details: cleanDetails,
            })

            // ✅ ຢືນຢັນທັນທີຫຼັງສ້າງ — ຈຳນວນຖືກແກ້ໄຂໄດ້ຢູ່ແລ້ວໃນຟອມນີ້ ບໍ່ຈຳເປັນຕ້ອງລໍຖ້າ confirm ແຍກຕ່າງຫາກອີກຂັ້ນ
            await confirm.mutateAsync({ id: newImport.import_id })

            toast.success("ສ້າງລາຍການນຳເຂົ້າສຳເລັດ")
            onOpenChange(false)
        } catch (error) {
            console.error(error)
            toast.error("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ")
        }
    }

    const availablePurchases = (purchases ?? []).filter(
        p => p.status === "PENDING" && !p.import
    )

    const createGrandTotal = watch("import_details").reduce(
        (sum, d) => sum + (d.quantity || 0) * (d.cost_price || 0), 0
    )

    // ══════════════════════════════════════════════════════
    // ── ໂໝດເບິ່ງ/ຢືນຢັນ/ຍົກເລີກ — ມີ data ແລ້ວ ──
    // ══════════════════════════════════════════════════════
    if (data) {
        const details = data.import_details ?? []
        const isPending = data.status === "PENDING"

        // ✅ ຢືນຢັນແລ້ວ (COMPLETED/CANCELLED) ໃຫ້ໃຊ້ຈຳນວນເດີມ, PENDING ໃຫ້ໃຊ້ຈຳນວນທີ່ແກ້ໄຂ (ຖ້າມີ)
        const getQty = (d: (typeof details)[number]) =>
            isPending ? (editedQuantities[d.import_detail_id] ?? d.quantity) : d.quantity

        const grandTotal = details.reduce((sum, d) => sum + getQty(d) * d.cost_price, 0)

        const handleQtyChange = (importDetailId: string, value: number) => {
            setEditedQuantities(prev => ({ ...prev, [importDetailId]: value }))
        }

        const handleConfirm = () => {
            const updates = details
                .map(d => ({ import_detail_id: d.import_detail_id, quantity: getQty(d) }))
                .filter(u => u.quantity !== details.find(d => d.import_detail_id === u.import_detail_id)?.quantity)

            confirm.mutate(
                { id: data.import_id, data: updates.length ? { import_details: updates } : undefined },
                { onSuccess: () => onOpenChange(false) }
            )
        }

        const handleCancel = () => {
            cancel.mutate(data.import_id, {
                onSuccess: () => onOpenChange(false)
            })
        }

        // ✅ ຍ້າຍມາຈາກ ImportDetailDialog.tsx ທີ່ຖືກລຶບ
        const handleExportPDF = () => {
            handlePDFExport({
                title: `ໃບນຳເຂົ້າ ${data.import_code}`,
                fileName: data.import_code,
                sheetName: "Import",
                columns: [
                    { header: "#", key: "__index" },
                    { header: "ລະຫັດສິນຄ້າ", key: "product_code" },
                    { header: "ສິນຄ້າ", key: "product_name" },
                    { header: "Variant", key: "variant_info" },
                    { header: "ຈຳນວນ", key: "quantity" },
                    { header: "ລາຄາ", key: "cost_price" },
                    { header: "ລວມ", key: "total" },
                ],
                data: details.map(d => ({
                    product_code: d.product?.product_code ?? "—",
                    product_name: d.product?.product_name ?? "—",
                    variant_info: d.variant ? `${d.variant.color} / ${d.variant.size}` : "—",
                    quantity: d.quantity,
                    cost_price: d.cost_price,
                    total: d.quantity * d.cost_price,
                })),
            })
        }

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-5">

                    <DialogHeader>
                        <div className="flex items-center justify-between pr-6">
                            <DialogTitle>ລາຍລະອຽດການນຳເຂົ້າ</DialogTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPDF}>
                                    <FileDown className="w-4 h-4" />
                                    Export PDF
                                </Button>
                                <BadgeComponent status={data.status} />
                            </div>
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
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ວັນທີສັ່ງຊື້:</span>
                            <span>
                                {data.purchase?.purchase_date ? formatDate(data.purchase.purchase_date) : "—"}
                            </span>
                        </div>
                    </div>

                    {/* ── Items (readonly) ── */}
                    {details.length > 0 ? (
                        <div className="space-y-3">
                            <label className="text-sm font-medium block">ລາຍການສິນຄ້າ</label>

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
                                    <div className="col-span-4">
                                        <Input
                                            value={d.product?.product_name ?? "—"}
                                            disabled
                                            className="bg-background text-sm"
                                        />
                                    </div>

                                    <div className="col-span-3">
                                        <Input
                                            value={d.variant
                                                ? `${d.variant.color} / ${d.variant.size}`
                                                : "—"}
                                            disabled
                                            className="bg-background text-sm"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        {isPending ? (
                                            <NumericFormat
                                                customInput={Input}
                                                value={getQty(d)}
                                                thousandSeparator
                                                allowNegative={false}
                                                decimalScale={0}
                                                className="text-right"
                                                onValueChange={v => handleQtyChange(d.import_detail_id, v.value === "" ? 0 : Number(v.value))}
                                            />
                                        ) : (
                                            <Input
                                                value={d.quantity}
                                                disabled
                                                className="bg-background text-sm text-right"
                                            />
                                        )}
                                    </div>

                                    <div className="col-span-3 space-y-1">
                                        <div className="px-3 py-2 border rounded-md bg-background text-xs text-right text-muted-foreground">
                                            {formatCurrency(d.cost_price)} / ໜ່ວຍ
                                        </div>
                                        <div className="px-3 py-1 text-xs text-right font-medium">
                                            = {formatCurrency(getQty(d) * d.cost_price)}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <div className="w-full sm:w-[300px] rounded-xl border p-4 space-y-2 mt-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>ຍອດສັ່ງຊື້</span>
                                        <span>{formatCurrency(data.purchase?.total_amount ?? 0)} ກີບ</span>
                                    </div>
                                    <div className="border-t" />
                                    <div className="flex justify-between text-sm font-bold">
                                        <span>ຍອດນຳເຂົ້າຕົວຈິງ</span>
                                        <span className="text-green-600">
                                            {formatCurrency(grandTotal)} ກີບ
                                        </span>
                                    </div>
                                </div>
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

    // ══════════════════════════════════════════════════════
    // ── ໂໝດສ້າງໃໝ່ — ບໍ່ມີ data (ຍ້າຍມາຈາກ ImportFormDialog.tsx) ──
    // ══════════════════════════════════════════════════════
    if (!create) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-5">

                <DialogHeader>
                    <DialogTitle>ສ້າງລາຍການນຳເຂົ້າ</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-5">

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
                                        <div className="col-span-4">
                                            <Input
                                                value={f.product_name ?? "—"}
                                                disabled
                                                className="bg-background text-sm"
                                            />
                                        </div>

                                        <div className="col-span-3">
                                            <Input
                                                value={f.variant_info ?? "—"}
                                                disabled
                                                className="bg-background text-sm"
                                            />
                                        </div>

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

                                        <div className="col-span-3 space-y-1">
                                            <div className="px-3 py-2 border rounded-md bg-background text-xs text-right text-muted-foreground">
                                                {formatCurrency(price)} / ໜ່ວຍ
                                            </div>
                                            <div className="px-3 py-1 text-xs text-right font-medium">
                                                = {formatCurrency(qty * price)}
                                            </div>
                                        </div>

                                        <input type="hidden" {...({ name: `import_details.${i}.product_id` } as object)} />
                                        <input type="hidden" {...({ name: `import_details.${i}.variant_id` } as object)} />
                                    </div>
                                )
                            })}

                            <div className="flex justify-between items-center border-t pt-3 px-1">
                                <span className="text-sm font-medium">ຍອດລວມທັງໝົດ</span>
                                <span className="text-lg font-semibold text-green-600">
                                    {formatCurrency(createGrandTotal)} ກີບ
                                </span>
                            </div>
                        </div>
                    )}

                    {purchaseId && fields.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4 border border-dashed rounded-lg">
                            ໃບສັ່ງຊື້ນີ້ບໍ່ມີລາຍການສິນຄ້າ
                        </p>
                    )}

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
