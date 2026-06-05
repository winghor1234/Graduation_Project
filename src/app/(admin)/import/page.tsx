"use client"

import { useState } from "react"
import { useDataTable } from "@/hooks/useDataTable"
import { toast } from "sonner"
import { useGetImports, useCreateImport, useDeleteImport } from "@/app/features/hooks/Import"
import { Import } from "@/modules/import/import.type"
import { ImportToolbar } from "@/components/import/ImportToolbar"
import { ImportTable } from "@/components/import/ImportTable"
import { ImportFormDialog } from "@/components/import/ImportFormDialog"
import { ImportDetail } from "@/components/import/ImportDetailDialog"
import { useGetPurchaseOrders } from "@/app/features/hooks/Purchase"






export default function ImportPage() {

    const table = useDataTable()

    const { data, isLoading } = useGetImports(table.params)
    const { data: purchases } = useGetPurchaseOrders()

    const createImport = useCreateImport()
    const deleteImport = useDeleteImport()

    const [openForm, setOpenForm] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)
    const [selected, setSelected] = useState<Import | undefined>()

    const handleDelete = (id: string) => {
        if (!confirm("Delete?")) return

        deleteImport.mutate(id, {
            onSuccess: () => toast.success("Deleted")
        })
    }

    return (
        <div className="space-y-4">

            <ImportToolbar
                table={table}
                onAdd={() => setOpenForm(true)}
            />

            <ImportTable
                imports={data?.data ?? []}
                isLoading={isLoading}
                onView={(i) => {
                    setSelected(i)
                    setOpenDetail(true)
                }}
                onDelete={handleDelete}
            />

            <ImportFormDialog
                open={openForm}
                onOpenChange={setOpenForm}
                create={createImport}
                purchases={purchases?.data ?? []}
            />

            <ImportDetail
                open={openDetail}
                onOpenChange={setOpenDetail}
                data={selected}
            />

        </div>
    )
}