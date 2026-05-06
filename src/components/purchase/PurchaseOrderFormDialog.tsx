"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form"
import { CreatePurchaseOrderInput, PurchaseOrder, UpdatePurchaseOrderInput } from "@/modules/purchase/purchase.type"
import { Supplier } from "@/modules/supplier/supplier.type"
import { Product } from "@/modules/product/product.types"
import { UseMutationResult } from "@tanstack/react-query"
import { PurchaseFormValues, purchaseSchema } from "@/schemas/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateProduct, useUpdateProduct } from "@/app/features/hooks"
import { ProductCombobox } from "./ProductCombobox"
import { ProductFormDialog } from "../products/ProductFormDialog"
import { Category } from "@/modules/category/category.type"
import { NumericFormat } from "react-number-format"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    purchaseOrder?: PurchaseOrder
    create: UseMutationResult<PurchaseOrder, Error, CreatePurchaseOrderInput>
    update: UseMutationResult<PurchaseOrder, Error, { id: string; data: UpdatePurchaseOrderInput }>
    suppliers: Supplier[]
    products: Product[]
    categories: Category[]
}


export function PurchaseOrderFormDialog({ open, onOpenChange, purchaseOrder, create, update, suppliers, products, categories }: Props) {
    const [openProductDialog, setOpenProductDialog] = useState(false)
    const [tempIndex, setTempIndex] = useState<number | null>(null)
    const createProduct = useCreateProduct()
    const updateProduct = useUpdateProduct()



    const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PurchaseFormValues>({
        resolver: zodResolver(purchaseSchema),
        defaultValues: {
            supplier_id: "",
            purchase_details: []
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "purchase_details"
    })
    /* ---------------- RESET ---------------- */
    useEffect(() => {
        if (!open) return
        if (purchaseOrder) {
            reset({
                supplier_id: purchaseOrder.supplier_id,
                purchase_details:
                    purchaseOrder.purchase_details?.map(d => ({
                        product_id: d.product_id,
                        quantity: d.quantity,
                        price: d.price
                    })) || []
            })
        }
    }, [open, purchaseOrder, reset])

    /* ---------------- ADD ITEM ---------------- */
    const addItem = () => {
        append({
            product_id: "",
            quantity: 0,
            price: 0
        })
    }

    /* ---------------- SUBMIT ---------------- */
    const onSubmit: SubmitHandler<PurchaseFormValues> = async (data) => {
        try {
            if (!data.supplier_id || data.purchase_details.length === 0) {
                toast.error("Missing data")
                return
            }


            const payload = {
                supplier_id: data.supplier_id,
                purchase_details: data.purchase_details
            }

            if (purchaseOrder) {
                await update.mutateAsync({
                    id: purchaseOrder.purchase_id,
                    data: payload
                })
                toast.success("Updated successfully")
            } else {
                await create.mutateAsync(payload)
                toast.success("Created successfully")
            }

            onOpenChange(false)
            reset()

        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        }
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="space-y-4">
                <DialogHeader>
                    <DialogTitle>
                        {purchaseOrder ? "Edit Purchase Order" : "Create Purchase Order"}
                    </DialogTitle>
                </DialogHeader>

                {/* SUPPLIER */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <select {...register("supplier_id")}>
                            <option value="">Select supplier</option>
                            {suppliers.map((c) => (
                                <option key={c.supplier_id} value={c.supplier_id}>
                                    {c.supplier_name}
                                </option>
                            ))}
                        </select>
                        <div className="h-6 text-red-500">{errors.supplier_id?.message}</div>
                    </div>

                    {/* ITEMS */}
                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                {/* PRODUCT */}
                                <div>
                                    <ProductCombobox
                                        products={products}
                                        value={watch(`purchase_details.${index}.product_id`)}
                                        onChange={(val) => {
                                            setValue(`purchase_details.${index}.product_id`, val)

                                            const product = products.find(p => p.product_id === val)

                                            setValue(
                                                `purchase_details.${index}.price`,
                                                product?.purchase_price || 0
                                            )
                                        }} onCreateNew={() => {
                                            setTempIndex(index)
                                            setOpenProductDialog(true)
                                        }}
                                    />
                                    <div className="h-6 text-red-500">{errors.purchase_details?.[index]?.product_id?.message}</div>
                                </div>

                                {/* QTY */}
                                <div>
                                    <Controller
                                        name={`purchase_details.${index}.quantity`}
                                        control={control}
                                        render={({ field }) => (
                                            <NumericFormat
                                                value={field.value === 0 ? "" : field.value}
                                                customInput={Input}
                                                placeholder="Qty"
                                                thousandSeparator=","
                                                allowNegative={false}
                                                decimalScale={0}
                                                onValueChange={(values) => {
                                                    field.onChange(
                                                        values.value === "" ? 0 : Number(values.value)
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                    <div className="h-6 text-red-500">{errors.purchase_details?.[index]?.quantity?.message}</div>
                                </div>

                                {/* PRICE (READ ONLY FROM PRODUCT) */}
                                <div>
                                    <div className="px-3 py-2 border rounded bg-gray-100">
                                        {products
                                            .find(
                                                (p) =>
                                                    p.product_id ===
                                                    watch(`purchase_details.${index}.product_id`)
                                            )
                                            ?.purchase_price?.toLocaleString() || 0}
                                    </div>

                                    <div className="h-6 text-red-500">
                                        {errors.purchase_details?.[index]?.price?.message}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => remove(index)}
                                >
                                    X
                                </Button>
                            </div>
                        ))}
                    </div>

                    <Button type="button" onClick={addItem}>
                        + Add Item
                    </Button>

                    {/* SUBMIT */}
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={create.isPending || update.isPending}
                    >
                        {purchaseOrder ? "Update" : "Create"}
                    </Button>
                </form>

            </DialogContent>
            <ProductFormDialog
                open={openProductDialog}
                onOpenChange={setOpenProductDialog}
                categories={categories as Category[]}
                create={createProduct}
                update={updateProduct}
            />
        </Dialog>
    )
}