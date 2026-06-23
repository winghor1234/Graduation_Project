

"use client"

import { useState } from "react"
import { toast } from "sonner"

import { useDataTable } from "@/hooks/useDataTable"
import {
    useGetPurchaseOrders,
    useCreatePurchaseOrder,
    useUpdatePurchaseOrder,
    useDeletePurchaseOrder,
    useGetAllPurchaseOrders,
} from "@/app/features/hooks/Purchase"

import { AppPagination } from "@/components/AppPagination"
import { PurchaseOrderFormDialog } from "@/components/adminComponent/purchase/PurchaseOrderFormDialog"
import { PurchaseOrderTable } from "@/components/adminComponent/purchase/PurchaseTable"
import { PurchaseOrderToolbar } from "@/components/adminComponent/purchase/PurchaseOrderToolbar"
import { PurchaseDetail } from "@/components/adminComponent/purchase/PurchaseDetail"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetAllProducts } from "@/app/features/hooks/Product"
import { useGetSuppliers } from "@/app/features/hooks/Supplier"
import { useGetCategories } from "@/app/features/hooks/Category"
import { PurchaseOrder } from "@/components/adminComponent/purchase/PurchaseType"

export default function PurchaseOrderPage() {
    const table = useDataTable()

    const { data, isLoading } = useGetPurchaseOrders(table.params)
    const { data: purchases } = useGetAllPurchaseOrders()
    console.log("purchases : ",purchases);

    const createPurchase = useCreatePurchaseOrder()
    const updatePurchase = useUpdatePurchaseOrder()
    const deletePurchase = useDeletePurchaseOrder()

    const { data: products } = useGetAllProducts()
    const product = products?.items
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
                purchases={purchases ?? []}
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
                        <DialogTitle>ລາຍລະອຽດໃບບິນສັ່ງຊື້</DialogTitle>
                    </DialogHeader>
                    <PurchaseDetail purchase={selectedPurchase} />
                </DialogContent>
            </Dialog>
        </div>
    )
}