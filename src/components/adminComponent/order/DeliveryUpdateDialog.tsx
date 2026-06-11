"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "../../ui/badge"
import { Button } from "@/components/ui/button"
import { Delivery } from "@/modules/delivery/delivery.type"
import { useState } from "react"

type Status = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    delivery?: Delivery
    onUpdateStatus: (status: Status) => void
}

export const getStatusBadge = (status: Status) => {
    switch (status) {
        case "PENDING":
            return <Badge className="bg-yellow-500 text-white">ຮ້ອງຂໍ</Badge>
        case "PROCESSING":
            return <Badge className="bg-blue-500 text-white">ກຳລັງດຳເນີນການ</Badge>
        case "SHIPPED":
            return <Badge className="bg-purple-500 text-white">ກຳລັງຈັດສົ່ງ</Badge>
        case "DELIVERED":
            return <Badge className="bg-green-500 text-white">ຈັດສົ່ງສຳເລັດ</Badge>
        case "CANCELLED":
            return <Badge className="bg-red-500 text-white">ຍົກເລີກແລ້ວ</Badge>
    }
}

export function DeliveryUpdateDialog({
    open,
    onOpenChange,
    delivery,
    onUpdateStatus
}: Props) {

    const [selectedStatus, setSelectedStatus] = useState<Status | "">("")

    // reset ຕອນເປີດ dialog (ບໍ່ໃຊ້ useEffect)
    const handleOpenChange = (v: boolean) => {
        if (v && delivery) {
            setSelectedStatus(delivery.status as Status)
        }
        onOpenChange(v)
    }

    if (!delivery) return null

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>ອັບເດດສະຖານະການຈັດສົ່ງ</DialogTitle>
                </DialogHeader>

                {/* Current Status */}
                <div className="mb-3">
                    ສະຖານະປັດຈຸບັນ: {getStatusBadge(delivery.status as Status)}
                </div>

                {/* SELECT */}
                <div className="w-full space-y-3">
                    <Select
                        value={selectedStatus}
                        onValueChange={(value: Status) => setSelectedStatus(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="ເລືອກສະຖານະ" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="PENDING">ຮ້ອງຂໍ (Pending)</SelectItem>
                            <SelectItem value="PROCESSING">Gຳລັງດຳເນີນການ (Processing)</SelectItem>
                            <SelectItem value="SHIPPED">ກຳລັງຈັດສົ່ງ (Shipped)</SelectItem>
                            <SelectItem value="DELIVERED">ຈັດສົ່ງສຳເລັດ (Delivered)</SelectItem>
                            <SelectItem value="CANCELLED">ຍົກເລີກແລ້ວ (Cancelled)</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* SUBMIT BUTTON */}
                    <Button
                        className="w-full"
                        disabled={!selectedStatus || selectedStatus === delivery.status}
                        onClick={() => onUpdateStatus(selectedStatus as Status)}
                    >
                        ບັນທຶກ
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}