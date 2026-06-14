"use client"

import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ImageUpload from "../../ImageUpload"
import { NumericFormat } from "react-number-format"
import { z } from "zod"

import { Product } from "@/modules/product/product.types"
import { Category } from "@/modules/category/category.type"
import { productSchema } from "@/schemas/schema"
import { UseMutationResult } from "@tanstack/react-query"
import { useDeleteImage } from "@/app/features/hooks/Product"

type ProductFormValues = z.infer<typeof productSchema>

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

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  create,
  update,
  categories
}: ProductFormDialogProps) {

  const [files, setFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([])

  const deleteImage = useDeleteImage()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: "",
      purchase_price: 0,
      sale_price: 0,
      stock_qty: 0,
      category_id: "",
      description: ""
    }
  })

  /* ---------------- RESET ---------------- */

  useEffect(() => {
    if (!open) return

    if (product) {
      reset({
        product_name: product.product_name,
        purchase_price: product.purchase_price,
        sale_price: product.sale_price,
        stock_qty: product.stock_qty,
        category_id: product.category_id,
        description: product.description || ""
      })

      setExistingImages(
        product.images?.map(img => ({
          image_id: img.image_id,
          image_url: img.image_url
        })) || []
      )
    } else {
      reset()
      setFiles([])
      setExistingImages([])
    }
  }, [open, product, reset])

  /* ---------------- DELETE IMAGE ---------------- */

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImage.mutateAsync(id)

      setExistingImages(prev =>
        prev.filter(img => img.image_id !== id)
      )
    } catch (err) {
      console.error(err)
    }
  }

  /* ---------------- FORM DATA ---------------- */

  const toFormData = (values: ProductFormValues) => {
    const fd = new FormData()

    fd.append("product_name", values.product_name)
    fd.append("purchase_price", String(values.purchase_price))
    fd.append("sale_price", String(values.sale_price))
    fd.append("stock_qty", String(values.stock_qty))
    fd.append("category_id", values.category_id)

    if (values.description) {
      fd.append("description", values.description)
    }

    files.forEach(file => {
      fd.append("images", file)
    })

    fd.append(
      "existingImages",
      JSON.stringify(existingImages.map(i => i.image_id))
    )

    return fd
  }

  /* ---------------- SUBMIT ---------------- */

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    const fd = toFormData(values)

    if (product) {
      await update.mutateAsync({
        id: product.product_id,
        data: fd
      })
    } else {
      await create.mutateAsync(fd)
    }

    onOpenChange(false)
    reset()
    setFiles([])
    setExistingImages([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            {product ? "ແກ້ໄຂສິນຄ້າ" : "ເພີ່ມສິນຄ້າ"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* NAME + CATEGORY */}
          <div className="grid grid-cols-2 gap-4">
            <Input {...register("product_name")} placeholder="ຊື່ສິນຄ້າ" />

            <select {...register("category_id")} className="border rounded px-3 py-2">
              <option value="">ເລືອກໝວດ</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE */}
          <div className="grid grid-cols-2 gap-4">

            <Controller
              name="purchase_price"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  customInput={Input}
                  value={field.value}
                  onValueChange={(v) => field.onChange(Number(v.value))}
                  placeholder="ລາຄາຕົ້ນທຶນ"
                />
              )}
            />

            <Controller
              name="sale_price"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  customInput={Input}
                  value={field.value}
                  onValueChange={(v) => field.onChange(Number(v.value))}
                  placeholder="ລາຄາຂາຍ"
                />
              )}
            />

          </div>

          {/* STOCK */}
          <Controller
            name="stock_qty"
            control={control}
            render={({ field }) => (
              <NumericFormat
                customInput={Input}
                value={field.value}
                onValueChange={(v) => field.onChange(Number(v.value))}
                placeholder="Stock"
              />
            )}
          />

          {/* DESCRIPTION */}
          <Textarea {...register("description")} placeholder="ລາຍລະອຽດ" />

          {/* IMAGES */}
          <ImageUpload
            files={files}
            setFiles={setFiles}
            existingImages={existingImages}
            onDeleteExisting={handleDeleteImage}
            max={10}
          />

          {/* BUTTON */}
          <Button type="submit" className="w-full">
            {product ? "ອັບເດດ" : "ບັນທຶກ"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )
}