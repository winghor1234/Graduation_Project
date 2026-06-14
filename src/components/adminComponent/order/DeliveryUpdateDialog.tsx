"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Delivery } from "@/modules/delivery/delivery.type"
import { useState } from "react"
import { BadgeComponent } from "../StatusComponent"

type Status = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    delivery?: Delivery
    onUpdateStatus: (status: Status) => void
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
            setSelectedStatus(delivery.status)
        }
        onOpenChange(v)
    }

    if (!delivery) return null

    // console.log(typeof delivery.status)

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>ອັບເດດສະຖານະການຈັດສົ່ງ</DialogTitle>
                </DialogHeader>

                {/* Current Status */}
                <div className="mb-3">
                    {/* ສະຖານະປັດຈຸບັນ: {getStatusBadge(delivery.status as Status)} */}
                    ສະຖານະປັດຈຸບັນ: {BadgeComponent({ status: delivery.status })}
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
                            <SelectItem value="PENDING">ລໍຖ້າດຳເນີນການ</SelectItem>
                            <SelectItem value="PROCESSING">ກຳລັງດຳເນີນການ</SelectItem>
                            <SelectItem value="SHIPPED">ກຳລັງຈັດສົ່ງ</SelectItem>
                            <SelectItem value="DELIVERED">ຈັດສົ່ງສຳເລັດ</SelectItem>
                            <SelectItem value="CANCELLED">ຍົກເລີກແລ້ວ</SelectItem>
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