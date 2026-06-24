"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetAllProducts } from "@/app/features/hooks/Product"
import { useDataTable } from "@/hooks/useDataTable"
import { Promotion } from "@/modules/promotion/promotion.types"
import { PromotionTable } from "@/components/adminComponent/promotion/PromotionTable"
import { PromotionFormDialog } from "@/components/adminComponent/promotion/PromotionFormDialog"
import { useCreatePromotion, useDeletePromotion, useGetPromotions, useTogglePromotionStatus, useUpdatePromotion } from "@/app/features/hooks/prodmotion"


export default function PromotionPage() {
    const table = useDataTable()
    const { data, isLoading } = useGetPromotions(table.params)
    const { data: products = [] } = useGetAllProducts()
    // console.log("product : ",products)
    const productData = products?.items || []

    const create = useCreatePromotion()
    const update = useUpdatePromotion()
    const toggle = useTogglePromotionStatus()
    const remove = useDeletePromotion()

    const [openForm, setOpenForm] = useState(false)
    const [selected, setSelected] = useState<Promotion | undefined>()

    const handleDelete = (id: string) => {
        if (!window.confirm("ຕ້ອງການລຶບໂປໂມຊັນນີ້ແທ້ບໍ່?")) return
        remove.mutate(id, {
            onSuccess: () => toast.success("ລຶບສຳເລັດ"),
            onError:   () => toast.error("ເກີດຂໍ້ຜິດພາດ"),
        })
    }

    const handleToggle = (id: string) => {
        toggle.mutate(id, {
            onSuccess: () => toast.success("ອັບເດດສະຖານະສຳເລັດ"),
            onError:   () => toast.error("ເກີດຂໍ້ຜິດພາດ"),
        })
    }

    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">ຈັດການໂປໂມຊັນ</h1>
                    <p className="text-sm text-muted-foreground mt-1">ສ້າງ ແລະ ຈັດການໂປໂມຊັນສ່ວນຫຼຸດ</p>
                </div>
                <Button onClick={() => { setSelected(undefined); setOpenForm(true) }} className="gap-2">
                    <Plus className="w-4 h-4" /> ສ້າງໂປໂມຊັນ
                </Button>
            </div>

            <PromotionTable
                promotions={data?.data ?? []}
                isLoading={isLoading}
                onEdit={(p) => { setSelected(p); setOpenForm(true) }}
                onDelete={handleDelete}
                onToggle={handleToggle}
            />

            <PromotionFormDialog
                open={openForm}
                onOpenChange={setOpenForm}
                promotion={selected}
                products={productData ?? []}
                create={create}
                update={update}
            />
        </div>
    )
}