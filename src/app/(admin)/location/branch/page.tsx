"use client"

import {
    useCreateBranch,
    useDeleteBranch,
    useGetBranches,
    useGetDistricts,
    useUpdateBranch
} from "@/app/features/hooks/Location"

import { AppPagination } from "@/components/AppPagination"
import { BranchDetailDialog } from "@/components/adminComponent/location/branch/BranchDetailDialog"
import { BranchFormDialog } from "@/components/adminComponent/location/branch/BranchFormDialog"
import { BranchTable } from "@/components/adminComponent/location/branch/BranchTable"
import { BranchToolbar } from "@/components/adminComponent/location/branch/BranchToolbar"
import { useDataTable } from "@/hooks/useDataTable"
import { Branch } from "@/modules/location/location.type"
import { useState } from "react"

export default function BranchPage() {

    const table = useDataTable()

    const { data, isLoading } = useGetBranches(table.params)
    const { data: districts } = useGetDistricts()

    const create = useCreateBranch()
    const update = useUpdateBranch()
    const deleteBranch = useDeleteBranch()

    const [selected, setSelected] = useState<Branch | undefined>()
    const [open, setOpen] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)

    const branches = data?.data ?? []

    const handleEdit = (b: Branch) => {
        setSelected(b)
        setOpen(true)
    }

    const handleDelete = (id: string) => {
        if (!confirm("Delete?")) return
        deleteBranch.mutate(id)
    }

    const handleView = (b: Branch) => {
        setSelected(b)
        setOpenDetail(true)
    }

    return (
        <div className="space-y-4">

            <BranchToolbar table={table} onAdd={() => setOpen(true)} />

            <BranchTable
                data={branches}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
            />

            <AppPagination
                page={table.params.page}
                totalPages={data?.meta?.totalPages ?? 0}
                onPageChange={table.setPage}
            />

            <BranchFormDialog
                open={open}
                onOpenChange={setOpen}
                create={create}
                update={update}
                branch={selected}
                districts={districts?.data ?? []}
            />

            <BranchDetailDialog
                open={openDetail}
                onOpenChange={setOpenDetail}
                branch={selected}
            />
        </div>
    )
}