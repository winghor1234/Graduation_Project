"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useGetRefunds, useCreateRefund, useDeleteRefund } from "@/app/features/hooks/Refund"
import { useDataTable } from "@/hooks/useDataTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Refund } from "@/modules/refund/refund.type"
import { RefundFormDialog } from "@/components/adminComponent/refund/RefundFormDialog"

export default function RefundPage() {
    const table = useDataTable()
    const { data, isLoading } = useGetRefunds(table.params)
    const { data: sales = [] } = useGetAllSales()

    const create = useCreateRefund()
    const remove = useDeleteRefund()

    const [openForm, setOpenForm] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)
    const [selected, setSelected] = useState<Refund | undefined>()

    const handleDelete = (id: string) => {
        if (!window.confirm("ຕ້ອງການລຶບລາຍການຄືນສິນຄ້ານີ້ ແລະ rollback stock ແທ້ບໍ່?")) return
        remove.mutate(id, {
            onSuccess: () => toast.success("ລຶບສຳເລັດ — stock ຖືກ rollback ແລ້ວ"),
            onError: () => toast.error("ເກີດຂໍ້ຜິດພາດ"),
        })
    }

    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">ຈັດການການຄືນສິນຄ້າ</h1>
                    <p className="text-sm text-muted-foreground mt-1">ສ້າງ ແລະ ຈັດການລາຍການ Refund</p>
                </div>
                <Button onClick={() => setOpenForm(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> ສ້າງ Refund
                </Button>
            </div>

            <RefundTable
                refunds={data?.data ?? []}
                isLoading={isLoading}
                onView={(r) => { setSelected(r); setOpenDetail(true) }}
                onDelete={handleDelete}
            />

            <RefundFormDialog
                open={openForm}
                onOpenChange={setOpenForm}
                sales={sales}
                create={create}
            />

            <RefundDetailDialog
                open={openDetail}
                onOpenChange={setOpenDetail}
                data={selected}
            />
        </div>
    )
}