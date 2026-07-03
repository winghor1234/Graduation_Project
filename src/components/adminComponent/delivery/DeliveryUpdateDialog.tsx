"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Delivery, UpdateDeliveryInput } from "@/modules/delivery/delivery.type"
import { DeliveryStatus } from "@prisma/client"
import { useState } from "react"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    delivery?: Delivery
    onSubmit: (data: UpdateDeliveryInput) => void
}

export function DeliveryUpdateDialog({ open, onOpenChange, delivery, onSubmit }: Props) {

    const [status, setStatus] = useState<DeliveryStatus>("PENDING")
    const [trackingNumber, setTrackingNumber] = useState("")

    const handleOpenChange = (v: boolean) => {
        if (v && delivery) {
            setStatus(delivery.status)
            setTrackingNumber(delivery.tracking_number ?? "")
        }
        onOpenChange(v)
    }

    if (!delivery) return null

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>ອັບເດດການຈັດສົ່ງ</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>ສະຖານະ</Label>
                        <Select
                            value={status}
                            onValueChange={(value: DeliveryStatus) => setStatus(value)}
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
                    </div>

                    <div className="space-y-2">
                        <Label>ເລກຕິດຕາມພັດສະດຸ</Label>
                        <Input
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="ເລກຕິດຕາມພັດສະດຸ (ຖ້າມີ)"
                        />
                    </div>

                    <Button
                        className="w-full"
                        onClick={() =>
                            onSubmit({
                                status,
                                tracking_number: trackingNumber || undefined,
                            })
                        }
                    >
                        ບັນທຶກ
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
