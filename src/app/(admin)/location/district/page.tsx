"use client"

import { useCreateDistrict, useDeleteDistrict, useGetAllProvince, useGetDistricts, useUpdateDistrict } from "@/app/features/hooks/Location"
import { AppPagination } from "@/components/AppPagination"
import { DistrictDetailDialog } from "@/components/adminComponent/location/district/DistrictDetaildialog"
import { DistrictFormDialog } from "@/components/adminComponent/location/district/DistrictFormDialog"
import { DistrictTable } from "@/components/adminComponent/location/district/DistrictTable"
import { DistrictToolbar } from "@/components/adminComponent/location/district/DistrictToolbar"
import { useDataTable } from "@/hooks/useDataTable"
import { District } from "@/modules/location/location.type"
import { useState } from "react"




export default function DistrictPage() {
    const table = useDataTable()
    const { data, isLoading } = useGetDistricts(table.params)
    const { data: provinces } = useGetAllProvince()
    const createDistrict = useCreateDistrict()
    const updateDistrict = useUpdateDistrict()
    const deleteDistrict = useDeleteDistrict()

    const [selected, setSelected] = useState< District | undefined>()
    const [open, setOpen] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)

    const districts = data?.data ?? []

    const handleEdit = (d: District) => {
        setSelected(d)
        setOpen(true)
    }

    const handleDelete = (id: string) => {
        if (!confirm("Delete?")) return
        deleteDistrict.mutate(id)
    }

    const handleView = (d: District) => {
        setSelected(d)
        setOpenDetail(true)
    }


    return (
        <div className="space-y-4">
            <DistrictToolbar table={table} onAdd={() => setOpen(true)} />

            <DistrictTable
                data={districts}
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

            <DistrictFormDialog
                open={open}
                onOpenChange={setOpen}
                create={createDistrict}
                update={updateDistrict}
                district={selected}
                provinces={provinces ?? []}
            />
            <DistrictDetailDialog
                open={openDetail}
                onOpenChange={setOpenDetail}
                district={selected}
            />
        </div>
    )
}