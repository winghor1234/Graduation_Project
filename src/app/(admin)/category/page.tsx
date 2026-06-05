"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, FolderTree } from "lucide-react"
import { toast } from "sonner"
import { Category } from "@/modules/category/category.type"
import { useCreateCategory, useDeleteCategory, useGetCategories, useUpdateCategory } from "@/app/features/hooks/Category"


export default function CategoriesPage() {
    const { data, isError, isPending } = useGetCategories()
    const categories = data?.data
    const create = useCreateCategory()
    const update = useUpdateCategory()
    const del = useDeleteCategory()
    const [showDialog, setShowDialog] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({ category_name: "", description: "", })
    if (isPending) return <div>Loading...</div>
    if (isError) return <div>Error</div>
    console.log("category : ", data)

    // ✅ ADD
    const handleAdd = () => {
        setEditingCategory(null)
        setFormData({ category_name: "", description: "" })
        setShowDialog(true)
    }

    // ✅ EDIT
    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setFormData({
            category_name: category.category_name,
            description: category.description || "",
        })
        setShowDialog(true)
    }

    // ✅ DELETE
    const handleDelete = async (id: string) => {
        try {
            await del.mutateAsync(id)
            toast.success("Category deleted")
        } catch {
            toast.error("Delete failed")
        }
    }

    // ✅ SUBMIT
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (editingCategory) {
                await update.mutateAsync({
                    id: editingCategory.category_id,
                    data: formData,
                })
                toast.success("Updated")
            } else {
                await create.mutateAsync(formData)
                toast.success("Created")
            }

            setShowDialog(false)
        } catch {
            toast.error("Something went wrong")
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString()
    }

    return (
        <div className="p-8">
            {/* HEADER */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FolderTree className="w-8 h-8 text-accent" />
                        <h1>Categories</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Manage product categories
                    </p>
                </div>

                <Button onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {categories?.map((category: Category) => (
                <Card key={category?.category_id} className="p-6">
                    <div className="flex justify-between mb-4">
                        <FolderTree />

                        <div className="flex gap-2">
                            <Button onClick={() => handleEdit(category)}>
                                <Edit />
                            </Button>

                            <Button
                                onClick={() =>
                                    handleDelete(category?.category_id)
                                }
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    </div>

                    <h3>{category.category_name}</h3>

                    <p>{category.description}</p>

                    <div className="flex justify-between">
                        <Badge>
                            {category.products?.length || 0}
                        </Badge>

                        {/* <span>{formatDate(categories.createdAt)}</span> */}
                    </div>
                </Card>
                 ))} 
            </div>

            {/* TABLE */}
            <Card>
                <table className="w-full">
                    <tbody>
                        {categories?.map((category: Category) => (
                        <tr key={category.category_id}>
                            <td>{category.category_name}</td>
                            <td>{category.description}</td>

                            <td>
                                <Badge>
                                    {category.products?.length || 0}
                                </Badge>
                            </td>

                            {/* <td>{formatDate(category.createdAt)}</td> */}

                            <td>
                                <Button onClick={() => handleEdit(category)}>
                                    Edit
                                </Button>

                                <Button
                                    onClick={() =>
                                        handleDelete(category.category_id)
                                    }
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                         ))} 
                    </tbody>
                </table>
            </Card>

            {/* DIALOG */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? "Edit" : "Create"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <Input
                            value={formData.category_name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    category_name: e.target.value,
                                })
                            }
                        />

                        <Textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                        />

                        <Button type="submit">
                            {editingCategory ? "Update" : "Create"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}