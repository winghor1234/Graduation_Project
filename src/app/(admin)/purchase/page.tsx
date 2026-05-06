

"use client"

import { useState } from "react"
import { toast } from "sonner"

import { useDataTable } from "@/hooks/useDataTable"
import {
    useGetPurchaseOrders,
    useCreatePurchaseOrder,
    useUpdatePurchaseOrder,
    useDeletePurchaseOrder,
    useGetProducts,
    useGetSuppliers,
    useGetCategories
} from "@/app/features/hooks"

import { AppPagination } from "@/components/AppPagination"
import { PurchaseOrder } from "@/modules/purchase/purchase.type"
import { PurchaseOrderFormDialog } from "@/components/purchase/PurchaseOrderFormDialog"
import { PurchaseOrderTable } from "@/components/purchase/PurchaseTable"
import { PurchaseOrderToolbar } from "@/components/purchase/PurchaseOrderToolbar"
import { PurchaseDetail } from "@/components/purchase/PurchaseDetail"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function PurchaseOrderPage() {
    const table = useDataTable()

    const { data, isLoading } = useGetPurchaseOrders(table.params)
    const createPurchase = useCreatePurchaseOrder()
    const updatePurchase = useUpdatePurchaseOrder()
    const deletePurchase = useDeletePurchaseOrder()

    const { data: products } = useGetProducts()
    const product = products?.data
    const { data: suppliers } = useGetSuppliers()
    const supplier = suppliers?.data
    const { data: categories } = useGetCategories()
    const category = categories?.data

    const [openForm, setOpenForm] = useState(false)
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseOrder | undefined>()
    const [openDetail, setOpenDetail] = useState(false)

    /* -------------------- handlers -------------------- */

    const handleEdit = (purchase: PurchaseOrder) => {
        setSelectedPurchase(purchase)
        setOpenForm(true)
    }

    const handleDelete = (id: string) => {
        if (!confirm("Delete purchase?")) return

        deletePurchase.mutate(id, {
            onSuccess: () => toast.success("Deleted successfully"),
            onError: () => toast.error("Delete failed")
        })
    }

    const handleView = (purchase: PurchaseOrder) => {
        setSelectedPurchase(purchase)
        setOpenDetail(true)
    }
    // const products?.data 
    // console.log("products",products?.data)
    console.log("data",product)

    /* -------------------- UI -------------------- */

    return (
        <div className="space-y-4">

            <PurchaseOrderToolbar
                table={table}
                onAdd={() => {
                    setSelectedPurchase(undefined)
                    setOpenForm(true)
                }}
            />

            <PurchaseOrderTable
                purchases={data?.data ?? []}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
            />

            <AppPagination
                page={table.page}
                totalPages={data?.meta?.totalPages ?? 1}
                onPageChange={table.setPage}
            />

            <PurchaseOrderFormDialog
                open={openForm}
                onOpenChange={setOpenForm}
                purchaseOrder={selectedPurchase}
                create={createPurchase}
                update={updatePurchase}
                products={product ?? []}
                suppliers={supplier ?? []}
                categories={category ?? []}
            />
            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Purchase Detail</DialogTitle>
                    </DialogHeader>
                    <PurchaseDetail purchase={selectedPurchase} />
                </DialogContent>
            </Dialog>
        </div>
    )
}