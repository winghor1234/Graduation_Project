"use client"

import { useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { DeliveryStatus } from "@prisma/client"
import { Delivery } from "@/modules/delivery/delivery.type"

type FormValues = {
    status: DeliveryStatus
    tracking_number: string
}

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    delivery?: Delivery
    onSubmit: (data: FormValues) => void
}

export function DeliveryUpdateDialog({
    open,
    onOpenChange,
    delivery,
    onSubmit,
}: Props) {

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            status: "PENDING",
            tracking_number: ""
        }
    })

    // 🔥 sync data when open
    useEffect(() => {
        if (!delivery) return

        reset({
            status: delivery.status,
            tracking_number: delivery.tracking_number || ""
        })
    }, [delivery, reset])

    if (!delivery) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">

                <DialogHeader>
                    <DialogTitle>Update Delivery</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit((data) => {
                        onSubmit(data)
                        onOpenChange(false)
                    })}
                    className="space-y-4"
                >

                    {/* Status */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">
                            Status
                        </p>

                        <select
                            {...register("status")}
                            className="w-full border rounded-md p-2"
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                        </select>
                    </div>

                    {/* Tracking */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">
                            Tracking Number
                        </p>

                        <Input
                    {...register("tracking_number")}
                            placeholder="Enter tracking number..."
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Update
                    </Button>

                </form>

            </DialogContent>
        </Dialog>
    )
}