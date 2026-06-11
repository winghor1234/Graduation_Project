"use client"

import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ImageUpload from "../../ImageUpload"

import { Product } from "@/modules/product/product.types"
import { Category } from "@/modules/category/category.type"
import { UseMutationResult } from "@tanstack/react-query"
import { Textarea } from "../../ui/textarea"
import { productSchema } from "@/schemas/schema"
import { NumericFormat } from "react-number-format"
import { z } from "zod"

/* ----------------------------- TYPE SAFE ----------------------------- */

type ProductFormValues = z.infer<typeof productSchema>

/* ----------------------------- Props ----------------------------- */

type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  create: UseMutationResult<Product, Error, FormData>
  update: UseMutationResult<Product, Error, { id: string; data: FormData }>
  categories: Category[]
}

/* ----------------------------- Component ----------------------------- */

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  create,
  update,
  categories
}: ProductFormDialogProps) {
  const [files, setFiles] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
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

  /* ----------------------------- RESET ----------------------------- */

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
    }
  }, [open, product, reset])

  /* ----------------------------- FORM DATA ----------------------------- */

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

    files.forEach((file) => {
      fd.append("images", file)
    })

    return fd
  }


  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
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
    } catch (err) {
      console.error(err)
    }
  }

  /* ----------------------------- UI ----------------------------- */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">

        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-semibold">
            {product ? "ແກ້ໄຂສິນຄ້າ" : "ເພີ່ມສິນຄ້າ"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* NAME + CATEGORY */}
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="text-sm font-medium">ຊື່ສິນຄ້າ</label>
              <Input {...register("product_name")} />
              <p className="text-xs text-red-500 h-4">
                {errors.product_name?.message}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">ໝວດໝູ່</label>
              <select
                {...register("category_id")}
                className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ເລືອກໝວດໝູ່</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-red-500 h-4">
                {errors.category_id?.message}
              </p>
            </div>

          </div>

          {/* PRICE */}
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="text-sm font-medium">ລາຄາຕົ້ນທຶນ</label>
              <Controller
                name="purchase_price"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    value={field.value === 0 ? "" : field.value}
                    customInput={Input}
                    thousandSeparator=","
                    decimalScale={0}
                    onValueChange={(v) =>
                      field.onChange(v.value === "" ? 0 : Number(v.value))
                    }
                  />
                )}
              />
              <p className="text-xs text-red-500 h-4">
                {errors.purchase_price?.message}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">ລາຄາຂາຍ</label>
              <Controller
                name="sale_price"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    value={field.value === 0 ? "" : field.value}
                    customInput={Input}
                    thousandSeparator=","
                    decimalScale={0}
                    onValueChange={(v) =>
                      field.onChange(v.value === "" ? 0 : Number(v.value))
                    }
                  />
                )}
              />
              <p className="text-xs text-red-500 h-4">
                {errors.sale_price?.message}
              </p>
            </div>

          </div>

          {/* STOCK + DESCRIPTION */}
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="text-sm font-medium">ຈຳນວນໃນສາງ (Stock)</label>
              <Controller
                name="stock_qty"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    value={field.value === 0 ? "" : field.value}
                    customInput={Input}
                    thousandSeparator=","
                    decimalScale={0}
                    onValueChange={(v) =>
                      field.onChange(v.value === "" ? 0 : Number(v.value))
                    }
                  />
                )}
              />
              <p className="text-xs text-red-500 h-4">
                {errors.stock_qty?.message}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">ລາຍລະອຽດ</label>
              <Textarea
                {...register("description")}
                className="h-[42px] resize-none"
              />
            </div>

          </div>

          {/* IMAGE */}
          <div className="space-y-1">
            <label className="text-sm font-medium">ຮູບພາບສິນຄ້າ</label>
            <div className="border rounded-md p-2">
              <ImageUpload files={files} setFiles={setFiles} />
            </div>
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            className="w-full h-10"
            disabled={create.isPending || update.isPending}
          >
            {product ? "ອັບເດດ" : "ບັນທຶກ"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )
}