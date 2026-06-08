"use client"

import { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import { PurchaseOrder } from "@/modules/purchase/purchase.type"
import { UseMutationResult } from "@tanstack/react-query"
import { CreateImportInput, Import } from "@/modules/import/import.type"
import { ImportFormValue } from "@/schemas/schema"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    create: UseMutationResult<Import, Error, CreateImportInput>
    purchases: PurchaseOrder[]
}

export function ImportFormDialog({ open, onOpenChange, create, purchases }: Props) {

    /* ✅ FIX: ใช้ ImportFormValue */
    const { register, control, handleSubmit, setValue, watch, reset } = useForm<ImportFormValue>({
        defaultValues: {
            purchase_id: "",
            import_details: []
        }
    })

    const { fields, replace } = useFieldArray({
        control,
        name: "import_details"
    })
    const purchaseId = watch("purchase_id")
    useEffect(() => {
    }, [purchaseId, replace])

    /* 🔥 load purchase detail */
    useEffect(() => {
        if (!purchaseId) return
        const purchase = purchases.find(
            p => p.purchase_id === purchaseId
        )
        if (!purchase) return
        const items =
            purchase.purchase_details?.map(d => ({
                product_id: d.product_id,
                product_name: d.product?.product_name,
                quantity: d.quantity,
                cost_price: d.price

            })) || []

        replace(items)

    }, [purchaseId, purchases, replace])

    /* 🔥 submit */
    const onSubmit = async (data: ImportFormValue) => {
        console.log("IMPORT SUBMIT:", data)

        try {
            if (!data.purchase_id) {
                toast.error("Please select purchase")
                return
            }

            if (!data.import_details.length) {
                toast.error("No items")
                return
            }

            // await create.mutateAsync({
            //     purchase_id: data.purchase_id,
            //     import_details: data.import_details
            // })

            const cleanDetails = data.import_details.map(({ product_name, ...rest }) => rest)
            await create.mutateAsync({
                purchase_id: data.purchase_id,
                import_details: cleanDetails
            })

            toast.success("Import created")
            onOpenChange(false)
            reset()

        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        }
    }

    /* 🔥 only pending purchase */
    const pendingPurchases = purchases.filter(p => p.status === "pending")

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="space-y-4">

                <DialogHeader>
                    <DialogTitle>Create Import</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >

                    {/* SELECT PURCHASE */}
                    <Select
                        value={purchaseId}
                        onValueChange={(v) =>
                            setValue("purchase_id", v, {
                                shouldValidate: true,
                                shouldDirty: true
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select purchase" />
                        </SelectTrigger>

                        <SelectContent>
                            {pendingPurchases.map(p => (
                                <SelectItem
                                    key={p.purchase_id}
                                    value={p.purchase_id}
                                >
                                    {p.supplier?.supplier_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* ITEMS */}
                    <div className="space-y-2">
                        {fields.map((f, i) => (
                            <div
                                key={f.id}
                                className="flex gap-2"
                            >
                                {/* PRODUCT */}
                                {/* 👁️ แสดงชื่อ */}
                                <Input
                                    value={f.product_name || ""}
                                    disabled
                                />

                                {/* 📦 เก็บ id ไว้ submit */}
                                <input
                                    type="hidden"
                                    {...register(`import_details.${i}.product_id`)}
                                />

                                {/* QTY */}
                                <Input
                                    type="number"
                                    placeholder="Qty"
                                    {...register(
                                        `import_details.${i}.quantity`,
                                        { valueAsNumber: true }
                                    )}
                                />

                                {/* COST */}
                                <Input
                                    value={f.cost_price}
                                    disabled
                                    type="number"
                                    placeholder="Cost"
                                    {...register(
                                        `import_details.${i}.cost_price`,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </div>
                        ))}
                    </div>

                    {/* SUBMIT */}
                    <Button
                        variant={"default"}
                        type="submit"
                        className="w-full"
                        disabled={create.isPending}
                    >
                        Create Import
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    )
}