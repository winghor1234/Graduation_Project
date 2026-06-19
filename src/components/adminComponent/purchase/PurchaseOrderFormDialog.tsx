// "use client"

// import { useEffect, useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { toast } from "sonner"
// import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form"
// import { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from "@/modules/purchase/purchase.type"
// import { Supplier } from "@/modules/supplier/supplier.type"
// import { Product } from "@/modules/product/product.types"
// import { UseMutationResult } from "@tanstack/react-query"
// import { PurchaseFormValues, purchaseSchema } from "@/schemas/schema"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useCreateProduct, useUpdateProduct } from "@/app/features/hooks/Product"
// import { ProductCombobox } from "./ProductCombobox"
// import { ProductFormDialog } from "../products/ProductFormDialog"
// import { Category } from "@/modules/category/category.type"
// import { NumericFormat } from "react-number-format"
// import SearchSelect from "@/components/SearchSelectOption"
// import { PurchaseOrder } from "./PurchaseType"

// type Props = {
//     open: boolean
//     onOpenChange: (open: boolean) => void
//     purchaseOrder?: PurchaseOrder
//     create: UseMutationResult<PurchaseOrder, Error, CreatePurchaseOrderInput>
//     update: UseMutationResult<PurchaseOrder, Error, { id: string; data: UpdatePurchaseOrderInput }>
//     suppliers: Supplier[]
//     products: Product[]
//     categories: Category[]
// }


// export function PurchaseOrderFormDialog({ open, onOpenChange, purchaseOrder, create, update, suppliers, products, categories }: Props) {
//     const [openProductDialog, setOpenProductDialog] = useState(false)
//     const [tempIndex, setTempIndex] = useState<number | null>(null)
//     const createProduct = useCreateProduct()
//     const updateProduct = useUpdateProduct()

//     const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PurchaseFormValues>({
//         resolver: zodResolver(purchaseSchema),
//         defaultValues: {
//             supplier_id: "",
//             purchase_details: []
//         }
//     })

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: "purchase_details"
//     })

//     /* ---------------- RESET ---------------- */
//     useEffect(() => {
//         if (!open) return
//         if (purchaseOrder) {
//             reset({
//                 supplier_id: purchaseOrder.supplier_id,
//                 purchase_details:
//                     purchaseOrder.purchase_details?.map(d => ({
//                         product_id: d.product_id,
//                         quantity: d.quantity,
//                         price: d.price
//                     })) || []
//             })
//         }
//     }, [open, purchaseOrder, reset])

//     /* ---------------- ADD ITEM ---------------- */
//     const addItem = () => {
//         append({
//             product_id: "",
//             quantity: 0,
//             price: 0
//         })
//     }

//     /* ---------------- SUBMIT ---------------- */
//     const onSubmit: SubmitHandler<PurchaseFormValues> = async (data) => {
//         try {
//             if (!data.supplier_id || data.purchase_details.length === 0) {
//                 toast.error("ຂໍ້ມູນບໍ່ຄົບຖ້ວນ")
//                 return
//             }
//             const payload = {
//                 supplier_id: data.supplier_id,
//                 purchase_details: data.purchase_details
//             }
//             if (purchaseOrder) {
//                 await update.mutateAsync({
//                     id: purchaseOrder.purchase_id,
//                     data: payload
//                 })
//                 toast.success("ອັບເດດໃບບິນສັ່ງຊື້ສຳເລັດແລ້ວ")
//             } else {
//                 await create.mutateAsync(payload)
//                 toast.success("ສ້າງໃບບິນສັ່ງຊື້ສຳເລັດແລ້ວ")
//             }

//             onOpenChange(false)
//             reset()

//         } catch (error) {
//             console.error(error)
//             toast.error("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ")
//         }
//     }




//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="space-y-4 max-w-2xl">
//                 <DialogHeader>
//                     <DialogTitle>
//                         {purchaseOrder ? "ແກ້ໄຂໃບບິນສັ່ງຊື້" : "ສ້າງໃບບິນສັ່ງຊື້"}
//                     </DialogTitle>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                     {/* SUPPLIER */}
//                     <div className="space-y-2">
//                         <SearchSelect
//                             value={watch("supplier_id")}
//                             placeholder="ຄົ້ນຫາຜູ້ສະໜອງ..."
//                             options={suppliers.map((supplier) => ({
//                                 value: supplier.supplier_id,
//                                 label: supplier.supplier_name,
//                             }))}
//                             onChange={(value) =>
//                                 setValue("supplier_id", value, {
//                                     shouldDirty: true,
//                                     shouldValidate: true,
//                                 })
//                             }
//                         />

//                         <div className="h-5 text-xs text-red-500">
//                             {errors.supplier_id?.message}
//                         </div>
//                     </div>

//                     {/* ITEMS */}
//                     <div className="space-y-3">
//                         <label className="text-sm font-medium">ລາຍການສິນຄ້າ</label>

//                         {fields.map((field, index) => (
//                             <div key={field.id} className="flex gap-2 items-start">
//                                 {/* PRODUCT */}
//                                 <div className="flex-1">
//                                     <ProductCombobox
//                                         products={products}
//                                         value={watch(`purchase_details.${index}.product_id`)}
//                                         placeholder="ເລືອກສິນຄ້າ"
//                                         onChange={(val) => {
//                                             setValue(`purchase_details.${index}.product_id`, val)

//                                             const product = products.find(p => p.product_id === val)

//                                             setValue(
//                                                 `purchase_details.${index}.price`,
//                                                 product?.purchase_price || 0
//                                             )
//                                         }} onCreateNew={() => {
//                                             setTempIndex(index)
//                                             setOpenProductDialog(true)
//                                         }}
//                                     />
//                                     <div className="h-5 text-xs text-red-500 mt-0.5">
//                                         {errors.purchase_details?.[index]?.product_id?.message}
//                                     </div>
//                                 </div>

//                                 {/* QTY */}
//                                 <div className="w-28">
//                                     <Controller
//                                         name={`purchase_details.${index}.quantity`}
//                                         control={control}
//                                         render={({ field }) => (
//                                             <NumericFormat
//                                                 value={field.value === 0 ? "" : field.value}
//                                                 customInput={Input}
//                                                 placeholder="ຈຳນວນ"
//                                                 thousandSeparator=","
//                                                 allowNegative={false}
//                                                 decimalScale={0}
//                                                 onValueChange={(values) => {
//                                                     field.onChange(
//                                                         values.value === "" ? 0 : Number(values.value)
//                                                     )
//                                                 }}
//                                             />
//                                         )}
//                                     />
//                                     <div className="h-5 text-xs text-red-500 mt-0.5">
//                                         {errors.purchase_details?.[index]?.quantity?.message}
//                                     </div>
//                                 </div>

//                                 {/* PRICE (READ ONLY FROM PRODUCT) */}
//                                 <div className="w-36">
//                                     <div className="px-3 py-2 border rounded bg-gray-100 text-sm h-10 flex items-center justify-end">
//                                         {products
//                                             .find(
//                                                 (p) =>
//                                                     p.product_id ===
//                                                     watch(`purchase_details.${index}.product_id`)
//                                             )
//                                             ?.purchase_price?.toLocaleString() || 0}
//                                     </div>
//                                     <div className="h-5 text-xs text-red-500 mt-0.5">
//                                         {errors.purchase_details?.[index]?.price?.message}
//                                     </div>
//                                 </div>

//                                 <Button
//                                     type="button"
//                                     variant="destructive"
//                                     onClick={() => remove(index)}
//                                     className="h-10"
//                                 >
//                                     ລຶບ
//                                 </Button>
//                             </div>
//                         ))}
//                     </div>

//                     <Button
//                         type="button"
//                         variant="outline"
//                         onClick={addItem}
//                         className="w-full border-dashed"
//                     >
//                         + ເພີ່ມລາຍການສິນຄ້າ
//                     </Button>

//                     {/* SUBMIT */}
//                     <Button
//                         className="w-full h-10"
//                         type="submit"
//                         disabled={create.isPending || update.isPending}
//                     >
//                         {purchaseOrder ? "ອັບເດດໃບບິນ" : "ບັນທຶກໃບບິນ"}
//                     </Button>
//                 </form>

//             </DialogContent>
//             <ProductFormDialog
//                 open={openProductDialog}
//                 onOpenChange={setOpenProductDialog}
//                 categories={categories as Category[]}
//                 create={createProduct}
//                 update={updateProduct}
//             />
//         </Dialog>
//     )
// }


"use client"

import { useEffect, useState } from "react"
import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { NumericFormat } from "react-number-format"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SearchSelect from "@/components/SearchSelectOption"

import { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from "@/modules/purchase/purchase.type"
import { Supplier } from "@/modules/supplier/supplier.type"
import { Category } from "@/modules/category/category.type"
import { PurchaseOrder } from "./PurchaseType"
import { UseMutationResult } from "@tanstack/react-query"
import { ProductFormDialog } from "../products/ProductFormDialog"
import { useCreateProduct, useUpdateProduct } from "@/app/features/hooks/Product"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Product } from "../products/ProductType"
import { PurchaseFormValues, purchaseSchema } from "./PurcaseSchema"

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

const EMPTY_ITEM = { product_id: "", variant_id: "", quantity: 1, price: 0 }

export function PurchaseOrderFormDialog({
    open, onOpenChange, purchaseOrder,
    create, update, suppliers, products, categories,
}: Props) {

    const [openProductDialog, setOpenProductDialog] = useState(false)
    const createProduct = useCreateProduct()
    const updateProduct = useUpdateProduct()

    const {
        control, handleSubmit, reset, setValue, watch,
        formState: { errors },
    } = useForm<PurchaseFormValues>({
        resolver: zodResolver(purchaseSchema),
        defaultValues: { supplier_id: "", purchase_details: [] },
    })

    const { fields, append, remove } = useFieldArray({ control, name: "purchase_details" })

    // ✅ Reset ທຸກຄັ້ງ dialog ເປີດ
    useEffect(() => {
        if (!open) return
        if (purchaseOrder) {
            reset({
                supplier_id: purchaseOrder.supplier_id,
                purchase_details: purchaseOrder.purchase_details?.map(d => ({
                    product_id: d.product_id,
                    variant_id: d.variant_id, // ✅
                    quantity: d.quantity,
                    price: d.price,
                })) ?? [],
            })
        } else {
            reset({ supplier_id: "", purchase_details: [] })
        }
    }, [open, purchaseOrder, reset])

    // ─── Computed: grand total ───────────────────────────
    const details = watch("purchase_details")
    const grandTotal = details.reduce((sum, d) => sum + (d.quantity || 0) * (d.price || 0), 0)

    // ─── Submit ──────────────────────────────────────────
    const onSubmit: SubmitHandler<PurchaseFormValues> = async (data) => {
        try {
            if (purchaseOrder) {
                await update.mutateAsync({ id: purchaseOrder.purchase_id, data })
                toast.success("ອັບເດດໃບບິນສັ່ງຊື້ສຳເລັດ")
            } else {
                await create.mutateAsync(data)
                toast.success("ສ້າງໃບບິນສັ່ງຊື້ສຳເລັດ")
            }
            onOpenChange(false)
            reset()
        } catch (error) {
            console.error(error)
            toast.error("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ")
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {purchaseOrder ? "ແກ້ໄຂໃບບິນສັ່ງຊື້" : "ສ້າງໃບບິນສັ່ງຊື້"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* SUPPLIER */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">ຜູ້ສະໜອງ</label>
                            <SearchSelect
                                value={watch("supplier_id")}
                                placeholder="ຄົ້ນຫາຜູ້ສະໜອງ..."
                                options={suppliers.map(s => ({
                                    value: s.supplier_id,
                                    label: s.supplier_name,
                                }))}
                                onChange={val => setValue("supplier_id", val, { shouldValidate: true })}
                            />
                            <p className="text-xs text-red-500 mt-1">{errors.supplier_id?.message}</p>
                        </div>

                        {/* ITEMS */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">ລາຍການສິນຄ້າ</label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOpenProductDialog(true)}
                                    >
                                        + ສ້າງສິນຄ້າໃໝ່
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append(EMPTY_ITEM)}
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        ເພີ່ມລາຍການ
                                    </Button>
                                </div>
                            </div>

                            {fields.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                                    ຍັງບໍ່ມີລາຍການ — ກົດ ເພີ່ມລາຍການ
                                </p>
                            )}

                            {fields.map((field, index) => {
                                const selectedProductId = watch(`purchase_details.${index}.product_id`)
                                const selectedProduct = products.find(p => p.product_id === selectedProductId)
                                const selectedVariantId = watch(`purchase_details.${index}.variant_id`)
                                const qty = watch(`purchase_details.${index}.quantity`) || 0
                                const price = watch(`purchase_details.${index}.price`) || 0

                                return (
                                    <div key={field.id} className="border rounded-lg p-3 space-y-3">

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                ລາຍການທີ {index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* ROW 1: Product select */}
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">ສິນຄ້າ</label>
                                            <SearchSelect
                                                value={selectedProductId}
                                                placeholder="ເລືອກສິນຄ້າ..."
                                                options={products.map(p => ({
                                                    value: p.product_id,
                                                    label: p.product_name,
                                                }))}
                                                onChange={val => {
                                                    setValue(`purchase_details.${index}.product_id`, val, { shouldValidate: true })
                                                    // ✅ Reset variant ເມື່ອປ່ຽນສິນຄ້າ
                                                    setValue(`purchase_details.${index}.variant_id`, "")
                                                    setValue(`purchase_details.${index}.price`, 0)
                                                }}
                                            />
                                            <p className="text-xs text-red-500 mt-0.5">
                                                {errors.purchase_details?.[index]?.product_id?.message}
                                            </p>
                                        </div>

                                        {/* ROW 2: Variant select — ✅ ສຳຄັນ */}
                                        {selectedProduct && (
                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">
                                                    ຕົວເລືອກ (Variant)
                                                </label>
                                                {selectedProduct.variants?.length ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedProduct.variants.map(v => {
                                                            const isSelected = selectedVariantId === v.variant_id
                                                            return (
                                                                <button
                                                                    key={v.variant_id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setValue(`purchase_details.${index}.variant_id`, v.variant_id, { shouldValidate: true })
                                                                        // ✅ Auto-fill ລາຄາ variant
                                                                        setValue(`purchase_details.${index}.price`, v.purchase_price)
                                                                    }}
                                                                    className={`px-3 py-1.5 rounded-md border text-xs transition-colors ${isSelected
                                                                            ? "bg-primary text-primary-foreground border-primary"
                                                                            : "bg-background hover:bg-secondary border-border"
                                                                        }`}
                                                                >
                                                                    {v.color} / {v.size}
                                                                    <span className="ml-1 opacity-70">
                                                                        ({formatCurrency(v.purchase_price)})
                                                                    </span>
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-red-500">
                                                        ສິນຄ້ານີ້ບໍ່ມີ variant — ກະລຸນາເພີ່ມກ່ອນ
                                                    </p>
                                                )}
                                                <p className="text-xs text-red-500 mt-0.5">
                                                    {errors.purchase_details?.[index]?.variant_id?.message}
                                                </p>
                                            </div>
                                        )}

                                        {/* ROW 3: Qty + Price + Subtotal */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">ຈຳນວນ</label>
                                                <Controller
                                                    name={`purchase_details.${index}.quantity`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <NumericFormat
                                                            customInput={Input}
                                                            value={field.value === 0 ? "" : field.value}
                                                            placeholder="ຈຳນວນ"
                                                            thousandSeparator
                                                            allowNegative={false}
                                                            decimalScale={0}
                                                            onValueChange={v => field.onChange(v.value === "" ? 0 : Number(v.value))}
                                                        />
                                                    )}
                                                />
                                                <p className="text-xs text-red-500 mt-0.5">
                                                    {errors.purchase_details?.[index]?.quantity?.message}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">ລາຄາ/ໜ່ວຍ</label>
                                                <div className="px-3 py-2 border rounded-md bg-muted text-sm h-10 flex items-center">
                                                    {formatCurrency(price)}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">ລວມ</label>
                                                <div className="px-3 py-2 border rounded-md bg-muted text-sm h-10 flex items-center font-medium">
                                                    {formatCurrency(qty * price)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            <p className="text-xs text-red-500">
                                {errors.purchase_details?.message}
                            </p>
                        </div>

                        {/* GRAND TOTAL */}
                        {fields.length > 0 && (
                            <div className="flex justify-between items-center border-t pt-3">
                                <span className="text-sm font-medium">ຍອດລວມທັງໝົດ</span>
                                <span className="text-lg font-semibold">
                                    {formatCurrency(grandTotal)}
                                </span>
                            </div>
                        )}

                        {/* SUBMIT */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={create.isPending || update.isPending}
                        >
                            {create.isPending || update.isPending
                                ? "ກຳລັງບັນທຶກ..."
                                : purchaseOrder ? "ອັບເດດໃບບິນ" : "ບັນທຶກໃບບິນ"}
                        </Button>

                    </form>
                </DialogContent>
            </Dialog>

            <ProductFormDialog
                open={openProductDialog}
                onOpenChange={setOpenProductDialog}
                categories={categories}
                create={createProduct}
                update={updateProduct}
            />
        </>
    )
}