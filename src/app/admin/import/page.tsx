"use client"

import { useState } from "react"
import { useDataTable } from "@/hooks/useDataTable"
import { toast } from "sonner"
import { useGetImports, useCreateImport, useDeleteImport, useConfirmImport, useCancelImport } from "@/app/features/hooks/Import"
import { Import } from "@/modules/import/import.type"
import { ImportToolbar } from "@/components/adminComponent/import/ImportToolbar"
import { ImportTable } from "@/components/adminComponent/import/ImportTable"
import { ImportViewDialog } from "@/components/adminComponent/import/ImportViewDialog"
import { useGetAllPurchaseOrders } from "@/app/features/hooks/Purchase"
import { ImportDetailDialog } from "@/components/adminComponent/import/ImportDetailDialog"






export default function ImportPage() {

    const table = useDataTable()

    const { data, isLoading } = useGetImports(table.params)
    const { data: purchases } = useGetAllPurchaseOrders()

    const createImport = useCreateImport()
    const deleteImport = useDeleteImport()
    const confirmImport = useConfirmImport()
    const cancelImport = useCancelImport()

    const [openForm, setOpenForm] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)
    const [selected, setSelected] = useState<Import | undefined>()

    const handleDelete = (id: string) => {
        if (!confirm("Delete?")) return
        deleteImport.mutate(id, {
            onSuccess: () => toast.success("Deleted")
        })
    }

    // const handleConfirm = (id: string) => {
    //     if (!confirm("Confirm?")) return
    //     confirmImport.mutate(id, {
    //         onSuccess: () => toast.success("Confirmed")
    //     })
    // }
    // const handleCancel = (id: string) => {
    //     if (!confirm("Cancel?")) return
    //     cancelImport.mutate(id, {
    //         onSuccess: () => toast.success("Canceled")
    //     })
    // }
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
                confirm={confirmImport}
                cancel={cancelImport}
                purchases={purchases ?? []}
                create={createImport}
            />

            <ImportViewDialog
                open={openForm}
                onOpenChange={setOpenForm}
                confirm={confirmImport}
                cancel={cancelImport}
                create={createImport}
                purchases={purchases ?? []}
            />

            <ImportDetailDialog
                open={openDetail}
                onOpenChange={setOpenDetail}
                data={selected}

            />

        </div>
    )
}
