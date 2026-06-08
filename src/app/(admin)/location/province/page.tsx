import { useCreateProvince, useDeleteProvince, useGetProvinces, useUpdateProvince } from "@/app/features/hooks/Location"
import { AppPagination } from "@/components/AppPagination"
import { ProvinceDetailDialog } from "@/components/adminComponent/location/province/ProvinceDetailDialog"
import { ProvinceFormDialog } from "@/components/adminComponent/location/province/ProvinceFormDialog"
import { ProvinceTable } from "@/components/adminComponent/location/province/ProvinceTable"
import { ProvinceToolbar } from "@/components/adminComponent/location/province/ProvinceToolbar"
import { useDataTable } from "@/hooks/useDataTable"
import { Province } from "@/modules/location/location.type"
import { useState } from "react"

export default function ProvincePage() {
    const table = useDataTable()

    const { data, isLoading } = useGetProvinces(table.params)
    const createProvince = useCreateProvince()
    const updateProvince = useUpdateProvince()
    const deleteProvince = useDeleteProvince()

    const [selected, setSelected] = useState<Province | undefined>()
    const [open, setOpen] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)


    const provinces = data?.data ?? []

    const handleEdit = (p: Province) => {
        setSelected(p)
        setOpen(true)
    }

    const handleDelete = (id: string) => {
        if (!confirm("Delete?")) return
        deleteProvince.mutate(id)
    }

    const handleView = (p: Province) => {
        setSelected(p)
        setOpenDetail(true)
    }

    return (
        <div className="space-y-4">
            <ProvinceToolbar
                table={table}
                onAdd={() => setOpen(true)}
            />

            <ProvinceTable
                data={provinces}
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

            <ProvinceFormDialog
                open={open}
                onOpenChange={setOpen}
                create={createProvince}
                update={updateProvince}
                province={selected}

            />
            <ProvinceDetailDialog
                open={openDetail}
                onOpenChange={setOpenDetail}
                province={selected}
            />
        </div>
    )
}