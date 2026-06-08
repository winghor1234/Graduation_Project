"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"
import { Delivery } from "@/modules/delivery/delivery.type"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    delivery?: Delivery
}

export function DeliveryDetailDialog({ open, onOpenChange, delivery }: Props) {

    if (!delivery) return null

    const address = delivery.address

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">

                <DialogHeader>
                    <DialogTitle>Delivery Detail</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">

                    {/* Order */}
                    <div>
                        <p className="text-muted-foreground">Order</p>
                        <p className="font-medium">{delivery.order_id}</p>
                    </div>

                    {/* Status */}
                    <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge>{delivery.status}</Badge>
                    </div>

                    {/* Tracking */}
                    <div>
                        <p className="text-muted-foreground">Tracking Number</p>
                        <p className="font-medium">
                            {delivery.tracking_number || "-"}
                        </p>
                    </div>

                    {/* Provider */}
                    <div>
                        <p className="text-muted-foreground">Provider</p>
                        <p className="font-medium">{delivery.provider}</p>
                    </div>

                    {/* Address (important) */}
                    <div>
                        <p className="text-muted-foreground">Address</p>

                        <p className="font-medium">
                            {address?.branch?.branch_name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            {address?.district?.district_name},{" "}
                            {address?.province?.province_name}
                        </p>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    )
}