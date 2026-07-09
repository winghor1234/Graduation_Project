"use client"

import { useState } from "react"
import { useDataTable } from "@/hooks/useDataTable"
import { useGetSuppliers,  useCreateSupplier,  useUpdateSupplier,  useDeleteSupplier} from "@/app/features/hooks/Supplier"
import { Supplier } from "@/modules/supplier/supplier.type"
import { AppPagination } from "@/components/AppPagination"
import { SupplierToolbar } from "@/components/adminComponent/supplier/SupplierToolbar"
import { SupplierTable } from "@/components/adminComponent/supplier/SupplierTable"
import { SupplierFormDialog } from "@/components/adminComponent/supplier/SupplierFormDialog"

export default function SupplierPage() {
    const table = useDataTable()

    const { data, isLoading } = useGetSuppliers(table.params)

    const createSupplier = useCreateSupplier()
    const updateSupplier = useUpdateSupplier()
    const deleteSupplier = useDeleteSupplier()

    const [openForm, setOpenForm] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>()

    const suppliers = data?.data ?? []

    const handleEdit = (supplier: Supplier) => {
        setSelectedSupplier(supplier)
        setOpenForm(true)
    }

    const handleDelete = (id: string) => {
        deleteSupplier.mutate(id)
    }

    return (
        <div className="space-y-4">

            <SupplierToolbar table={table} onAdd={() => {
                setSelectedSupplier(undefined)
                setOpenForm(true)
            }} />

            <SupplierTable
                suppliers={suppliers}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AppPagination
                page={table.params.page}
                totalPages={data?.meta?.totalPages ?? 0}
                onPageChange={table.setPage}
            />

            <SupplierFormDialog
                open={openForm}
                onOpenChange={setOpenForm}
                supplier={selectedSupplier}
                create={createSupplier}
                update={updateSupplier}
            />

        </div>
    )
}