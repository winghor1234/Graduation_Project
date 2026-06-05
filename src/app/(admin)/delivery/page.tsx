"use client"

import { useState } from "react"
import { useGetDeliveries, useUpdateDelivery } from "@/app/features/hooks/Delivery"
import { Delivery } from "@/modules/delivery/delivery.type"
import { DeliveryDetailDialog } from "@/components/delivery/DeliveryDetailDialog"
import { DeliveryUpdateDialog } from "@/components/delivery/DeliveryUpdateDialog"
import { DeliveryTable } from "@/components/delivery/DeliveryTable"




export default function DeliveryPage() {

    const { data, isLoading } = useGetDeliveries()
    const updateDelivery = useUpdateDelivery()

    const [selected, setSelected] = useState<Delivery | undefined>()
    const [open, setOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

    const deliveries = data?.data ?? []

    const handleView = (d: Delivery) => {
        setSelected(d)
        setOpen(true)
    }

    const handleEdit = (d: Delivery) => {
        setSelected(d)
        setEditOpen(true)
    }

    return (
        <div className="space-y-4">

            <DeliveryTable
                data={deliveries}
                isLoading={isLoading}
                onView={handleView}
                onEdit={handleEdit}
            />

            <DeliveryDetailDialog
                open={open}
                onOpenChange={setOpen}
                delivery={selected}
            />

            <DeliveryUpdateDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                delivery={selected}
                onSubmit={(data) => {
                    updateDelivery.mutate({
                        id: selected!.delivery_id,
                        data
                    })
                    setEditOpen(false)
                }}
            />

        </div>
    )
}