"use client"

import { useState } from "react"
import { useGetCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/app/features/hooks/Category"
import { useDataTable } from "@/hooks/useDataTable"
import { Category } from "@/modules/category/category.type"
import { CategoryToolbar } from "@/components/adminComponent/category/CategoryToolbar"
import { CategoryTable } from "@/components/adminComponent/category/CategoryTable"
import { AppPagination } from "@/components/AppPagination"
import { CategoryFormDialog } from "@/components/adminComponent/category/CategoryFormDialog"
import { toast } from "sonner"

export default function CategoryPage() {
    const table = useDataTable()

    const { data, isLoading } = useGetCategories(table.params)
    const createCategory = useCreateCategory()
    const updateCategory = useUpdateCategory()
    const deleteCategory = useDeleteCategory()

    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()
    const [openForm, setOpenForm] = useState(false)

    const categories = data?.data ?? []

    const handleEdit = (category: Category) => {
        setSelectedCategory(category)
        setOpenForm(true)
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory.mutateAsync(id)
            toast.success("ລຶບປະເພດສິນຄ້າສຳເລັດແລ້ວ")
        } catch {
            toast.error("ບໍ່ສາມາດລຶບໄດ້")
        }
    }




    return (
        <div className="space-y-4">
            {/* Header */}
            <CategoryToolbar table={table} onAdd={() => {
                setSelectedCategory(undefined) // Reset choice for new additions
                setOpenForm(true)
            }} />

            {/* Table */}
            <CategoryTable
                categories={categories}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            <AppPagination
                page={table.params.page}
                totalPages={data?.meta?.totalPages ?? 0}
                onPageChange={table.setPage}
            />

            {/* Form Dialog Modal */}
            <CategoryFormDialog
                open={openForm}
                onOpenChange={setOpenForm}
                create={createCategory}
                update={updateCategory}
                category={selectedCategory}
            />
        </div>
    )
}