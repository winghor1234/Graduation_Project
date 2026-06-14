"use client"

import { useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { NumericFormat } from "react-number-format"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import ImageUpload from "../../ImageUpload"

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
    values: product
      ? {
        product_name: product.product_name,
        purchase_price: product.purchase_price ?? 0,
        sale_price: product.sale_price,
        stock_qty: product.stock_qty,
        category_id: product.category_id,
        description: product.description ?? "",
      }
      : {
        product_name: "",
        purchase_price: 0,
        sale_price: 0,
        stock_qty: 0,
        category_id: "",
        description: "",
      },
  })

  const existingImages: ExistingImage[] =
    product?.images?.filter(
      (img) => !deletedImageIds.includes(img.image_id)
    ) || []

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

    fd.append(
      "deletedImageIds",
      JSON.stringify(deletedImageIds)
    )

    return fd
  }

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
      const fd = toFormData(values)

      if (product) {
        await update.mutateAsync({
          id: product.product_id,
          data: fd,
        })
      } else {
        await create.mutateAsync(fd)
      }

      reset()
      setFiles([])
      setDeletedImageIds([])

      onOpenChange(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          reset()
          setFiles([])
          setDeletedImageIds([])
        }

        onOpenChange(value)
      }}
    >
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            {product
              ? "ແກ້ໄຂສິນຄ້າ"
              : "ເພີ່ມສິນຄ້າ"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Product Name + Category */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <Input
                {...register("product_name")}
                placeholder="ຊື່ສິນຄ້າ"
              />

              <p className="text-sm text-red-500 mt-1">
                {errors.product_name?.message}
              </p>
            </div>

            <div>
              <select
                {...register("category_id")}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">
                  ເລືອກໝວດໝູ່
                </option>

                {categories.map((c) => (
                  <option
                    key={c.category_id}
                    value={c.category_id}
                  >
                    {c.category_name}
                  </option>
                ))}
              </select>

              <p className="text-sm text-red-500 mt-1">
                {errors.category_id?.message}
              </p>
            </div>

          </div>

          {/* Prices */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Controller
              name="purchase_price"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  customInput={Input}
                  thousandSeparator
                  value={field.value}
                  placeholder="ລາຄາຕົ້ນທຶນ"
                  onValueChange={(v) =>
                    field.onChange(Number(v.value))
                  }
                />
              )}
            />

            <Controller
              name="sale_price"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  customInput={Input}
                  thousandSeparator
                  value={field.value}
                  placeholder="ລາຄາຂາຍ"
                  onValueChange={(v) =>
                    field.onChange(Number(v.value))
                  }
                />
              )}
            />

          </div>

          {/* Stock */}

          <Controller
            name="stock_qty"
            control={control}
            render={({ field }) => (
              <NumericFormat
                customInput={Input}
                thousandSeparator
                value={field.value}
                placeholder="ຈຳນວນໃນສາງ"
                onValueChange={(v) =>
                  field.onChange(Number(v.value))
                }
              />
            )}
          />

          {/* Description */}

          <Textarea
            {...register("description")}
            placeholder="ລາຍລະອຽດສິນຄ້າ"
          />

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
            disabled={
              create.isPending ||
              update.isPending
            }
          >
            {create.isPending || update.isPending
              ? "ກຳລັງບັນທຶກ..."
              : product
                ? "ອັບເດດສິນຄ້າ"
                : "ບັນທຶກສິນຄ້າ"}
          </Button>
        </form>

      </DialogContent>
    </Dialog>
  )
}