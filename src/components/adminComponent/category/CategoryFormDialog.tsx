"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { UseMutationResult } from "@tanstack/react-query"
import { CategoryCreateFormInput, categoryCreateSchema, CategoryUpdateFormInput, categoryUpdateSchema } from '@/schemas/schema'
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/modules/category/category.type"

/* ----------------------------- Props ----------------------------- */

type CategoryFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
  create: UseMutationResult<Category, Error, CreateCategoryInput>
  update: UseMutationResult<Category, Error, { id: string; data: UpdateCategoryInput }>
}

/* ----------------------------- Component ----------------------------- */

export function CategoryFormDialog({ open, onOpenChange, category, create, update }: CategoryFormDialogProps) {
  const isEdit = !!category

  const form = useForm<CategoryCreateFormInput | CategoryUpdateFormInput>({
    resolver: zodResolver(isEdit ? categoryUpdateSchema : categoryCreateSchema),
    defaultValues: {
      category_name: "",
      description: "",
    }
  })

  const { register, handleSubmit, formState: { errors }, reset } = form

  /* ----------------------------- Reset Form ----------------------------- */

  useEffect(() => {
    if (!open) return
    if (category) {
      reset({
        category_name: category.category_name,
        description: category.description ?? "",
      })
    } else {
      reset({
        category_name: "",
        description: "",
      })
    }
  }, [open, category, reset])

  /* ----------------------------- Submit ----------------------------- */

  const onSubmit = async (values: CategoryCreateFormInput | CategoryUpdateFormInput) => {
    try {
      if (isEdit && category) {
        const updatePayload: UpdateCategoryInput = {
          category_name: values.category_name,
          description: values.description,
        }

        await update.mutateAsync({
          id: category.category_id,
          data: updatePayload
        })

        toast.success("ອັບເດດຂໍ້ມູນປະເພດສິນຄ້າສຳເລັດແລ້ວ")
      } else {
        const payload: CreateCategoryInput = {
          category_name: values.category_name || "",
          description: values.description,
        }

        await create.mutateAsync(payload)

        toast.success("ເພີ່ມປະເພດສິນຄ້າໃໝ່ສຳເລັດແລ້ວ")
      }

      onOpenChange(false)
      reset()
    } catch (error) {
      console.error(error)
      toast.error("ເກີດຂໍ້ຜິດພາດບາງຢ່າງ")
    }
  }

  /* ----------------------------- UI ----------------------------- */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "ແກ້ໄຂຂໍ້ມູນປະເພດສິນຄ້າ" : "ເພີ່ມປະເພດສິນຄ້າ"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">ຊື່ປະເພດສິນຄ້າ</label>
            <Input {...register("category_name")} placeholder="ປ້ອນຊື່ປະເພດສິນຄ້າ..." />
            {errors.category_name?.message && (
              <div className="text-red-500 text-sm mt-1">{errors.category_name.message}</div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">ລາຍລະອຽດ</label>
            <Input {...register("description")} placeholder="ປ້ອນລາຍລະອຽດປະເພດສິນຄ້າ..." />
            {errors.description?.message && (
              <div className="text-red-500 text-sm mt-1">{errors.description.message}</div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={create.isPending || update.isPending}
          >
            {isEdit ? "ອັບເດດຂໍ້ມູນປະເພດສິນຄ້າ" : "ບັນທຶກຂໍ້ມູນປະເພດສິນຄ້າ"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}