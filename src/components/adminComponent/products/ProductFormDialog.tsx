"use client"

import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { NumericFormat } from "react-number-format"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ImageUpload from "../../ImageUpload"

import { Category } from "@/modules/category/category.type"
import { UseMutationResult } from "@tanstack/react-query"
import { useDeleteImage } from "@/app/features/hooks/Product"
import { Trash2, Plus } from "lucide-react"
import { ProductFormValues, productSchema } from "./ProductShema"
import { Product } from "./ProductType"

type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  create: UseMutationResult<Product, Error, FormData>
  update: UseMutationResult<Product, Error, { id: string; data: FormData }>
  categories: Category[]
}

type ExistingImage = {
  image_id: string
  image_url: string
}

const DEFAULT_VARIANT = {
  sku: "",
  color: "",
  size: "",
  purchase_price: 0,
  sale_price: 0,
  stock_qty: 0,
}

// ✅ Map ProductVariant → form shape (ຕັດ field ເກີນອອກ)
const mapVariantsToForm = (product?: Product): ProductFormValues["variants"] => {
  if (!product?.variants?.length) return []
  return product.variants.map((v) => ({
    sku: v.sku,
    color: v.color,
    size: v.size,
    purchase_price: v.purchase_price,
    sale_price: v.sale_price,
    stock_qty: v.stock_qty,
  }))
}

const getDefaultValues = (product?: Product): ProductFormValues => ({
  product_name: product?.product_name ?? "",
  category_id: product?.category_id ?? "",
  description: product?.description ?? "",
  variants: mapVariantsToForm(product),
})

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  create,
  update,
  categories,
}: ProductFormDialogProps) {

  const deleteImage = useDeleteImage()

  const [files, setFiles] = useState<File[]>([])
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(),
  })

  // ✅ Reset form ທຸກຄັ້ງທີ່ dialog ເປີດ ຫຼື product ປ່ຽນ
  useEffect(() => {
    if (open) {
      reset(getDefaultValues(product))
      setFiles([])
      setDeletedImageIds([])
    }
  }, [open, product])

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  })

  const existingImages: ExistingImage[] =
    product?.images?.filter(
      (img) => !deletedImageIds.includes(img.image_id)
    ) ?? []

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage.mutateAsync(imageId)
      setDeletedImageIds((prev) => [...prev, imageId])
    } catch (error) {
      console.error(error)
    }
  }

  const toFormData = (values: ProductFormValues) => {
    const fd = new FormData()

    fd.append("product_name", values.product_name)
    fd.append("category_id", values.category_id)
    if (values.description) {
      fd.append("description", values.description)
    }
    if (values.variants?.length) {
      fd.append("variants", JSON.stringify(values.variants))
    }

    files.forEach((file) => fd.append("images", file))
    fd.append("deletedImageIds", JSON.stringify(deletedImageIds))

    return fd
  }

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
      const fd = toFormData(values)

      if (product) {
        await update.mutateAsync({ id: product.product_id, data: fd })
      } else {
        await create.mutateAsync(fd)
      }

      onOpenChange(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = (value: boolean) => {
    if (!value) reset(getDefaultValues())
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            {product ? "ແກ້ໄຂສິນຄ້າ" : "ເພີ່ມສິນຄ້າ"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Product Name + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input {...register("product_name")} placeholder="ຊື່ສິນຄ້າ" />
              <p className="text-sm text-red-500 mt-1">
                {errors.product_name?.message}
              </p>
            </div>
            <div>
              <select
                {...register("category_id")}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">ເລືອກໝວດໝູ່</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-red-500 mt-1">
                {errors.category_id?.message}
              </p>
            </div>
          </div>

          {/* Description */}
          <Textarea
            {...register("description")}
            placeholder="ລາຍລະອຽດສິນຄ້າ"
          />

          {/* Variants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">ຕົວເລືອກສິນຄ້າ (Variants)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append(DEFAULT_VARIANT)}
              >
                <Plus className="w-4 h-4 mr-1" />
                ເພີ່ມ Variant
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 space-y-3 relative"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* SKU / Color / Size */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Input
                      {...register(`variants.${index}.sku`)}
                      placeholder="SKU"
                    />
                    <p className="text-xs text-red-500 mt-1">
                      {errors.variants?.[index]?.sku?.message}
                    </p>
                  </div>
                  <div>
                    <Input
                      {...register(`variants.${index}.color`)}
                      placeholder="ສີ (Color)"
                    />
                    <p className="text-xs text-red-500 mt-1">
                      {errors.variants?.[index]?.color?.message}
                    </p>
                  </div>
                  <div>
                    <Input
                      {...register(`variants.${index}.size`)}
                      placeholder="ຂະໜາດ (Size)"
                    />
                    <p className="text-xs text-red-500 mt-1">
                      {errors.variants?.[index]?.size?.message}
                    </p>
                  </div>
                </div>

                {/* Prices + Stock */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Controller
                      name={`variants.${index}.purchase_price`}
                      control={control}
                      render={({ field }) => (
                        <NumericFormat
                          customInput={Input}
                          thousandSeparator
                          value={field.value}
                          placeholder="ລາຄາຕົ້ນທຶນ"
                          onValueChange={(v) => field.onChange(Number(v.value))}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name={`variants.${index}.sale_price`}
                      control={control}
                      render={({ field }) => (
                        <NumericFormat
                          customInput={Input}
                          thousandSeparator
                          value={field.value}
                          placeholder="ລາຄາຂາຍ"
                          onValueChange={(v) => field.onChange(Number(v.value))}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name={`variants.${index}.stock_qty`}
                      control={control}
                      render={({ field }) => (
                        <NumericFormat
                          customInput={Input}
                          thousandSeparator
                          value={field.value}
                          placeholder="ຈຳນວນໃນສາງ"
                          onValueChange={(v) => field.onChange(Number(v.value))}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Images */}
          <ImageUpload
            files={files}
            setFiles={setFiles}
            existingImages={existingImages}
            onDeleteExisting={handleDeleteImage}
            max={10}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={create.isPending || update.isPending}
          >
            {create.isPending || update.isPending
              ? "ກຳລັງບັນທຶກ..."
              : product ? "ອັບເດດສິນຄ້າ" : "ບັນທຶກສິນຄ້າ"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )
}