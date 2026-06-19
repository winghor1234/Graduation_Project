"use client"

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import { UseMutationResult } from "@tanstack/react-query"
import { CreateImportInput, Import } from "@/modules/import/import.type"
import { ImportFormValue } from "@/schemas/schema"
import { Button } from "@/components/ui/button"
import SearchSelect from "@/components/SearchSelectOption"
import { PurchaseOrder } from "../purchase/PurchaseType"

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
                variant_id: d.variant_id,
                product_name: d.product?.product_name,
                quantity: d.quantity,
                cost_price: d.price

            })) || []

        replace(items)

    }, [purchaseId, purchases, replace])

    /* 🔥 submit */
    const onSubmit = async (data: ImportFormValue) => {

        try {
            if (!data.purchase_id) {
                toast.error("ກະລຸນາເລືອກລາຍການຈັດຊື້")
                return
            }

            if (!data.import_details.length) {
                toast.error("ບໍ່ມີລາຍການສິນຄ້າ")
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

            toast.success("ສ້າງລາຍການນຳເຂົ້າສຳເລັດແລ້ວ")
            onOpenChange(false)
            reset()

        } catch (error) {
            console.error(error)
            toast.error("ເກີດຂໍ້ຜผิดພາດບາງຢ່າງ")
        }
    }

    /* 🔥 only pending purchase */
    const pendingPurchases = purchases.filter(p => p.status === "PENDING")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-6 space-y-6">

                {/* HEADER */}
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        ສ້າງລາຍການນຳເຂົ້າ
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* ================= SELECT PURCHASE ================= */}
                    <div className="space-y-2">
                        <SearchSelect
                            value={watch("purchase_id")}
                            placeholder="ຄົ້ນຫາລາຍການຈັດຊື້..."
                            options={pendingPurchases.map((purchase) => ({
                                value: purchase.purchase_id,
                                label: `${purchase.purchase_code} - ${purchase.supplier?.supplier_name}`,
                            }))}
                            onChange={(value) =>
                                setValue("purchase_id", value, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                })
                            }
                        />
                       
                    </div>

                    {/* ================= ITEMS ================= */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-700">
                                ລາຍການສິນຄ້າ
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {fields.map((f, i) => (
                                <div
                                    key={f.id}
                                    className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg bg-gray-50"
                                >
                                    {/* PRODUCT NAME */}
                                    <div className="col-span-5">
                                        <Input
                                            value={f.product_name || ""}
                                            disabled
                                            className="bg-white"
                                        />
                                    </div>

                                    {/* QTY */}
                                    <div className="col-span-3">
                                        <Input
                                            type="number"
                                            placeholder="ຈຳນວນ"
                                            {...register(`import_details.${i}.quantity`, {
                                                valueAsNumber: true,
                                            })}
                                        />
                                    </div>

                                    {/* COST */}
                                    <div className="col-span-4">
                                        <Input
                                            value={f.cost_price}
                                            disabled
                                            className="bg-white text-gray-600"
                                        />
                                    </div>

                                    {/* hidden id */}
                                    <input
                                        type="hidden"
                                        {...register(`import_details.${i}.product_id`)}
                                    />
                                    {/* hiden variant id */}
                                    <input
                                        type="hidden"
                                        {...register(`import_details.${i}.variant_id`)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= ACTION ================= */}
                    <div className="pt-4 border-t flex justify-end">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto px-6"
                            disabled={create.isPending}
                        >
                            ບັນທຶກການນຳເຂົ້າ
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}