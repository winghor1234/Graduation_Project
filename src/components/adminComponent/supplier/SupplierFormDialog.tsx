"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { Supplier } from "@/modules/supplier/supplier.type"
import { CreateSupplierInput, UpdateSupplierInput } from "@/modules/supplier/supplier.type"

import { UseMutationResult } from "@tanstack/react-query"

type Props = {
    open: boolean
    onOpenChange: (v: boolean) => void
    supplier?: Supplier

    create: UseMutationResult<Supplier, Error, CreateSupplierInput>
    update: UseMutationResult<Supplier, Error, { id: string; data: UpdateSupplierInput }>
}

export function SupplierFormDialog({ open, onOpenChange, supplier, create, update}: Props) {
    const isEdit = !!supplier
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            supplier_name: "",
            phone: "",
            address: ""
        }
    })

    useEffect(() => {
        if (!open) return
        if (supplier) {
            reset({
                supplier_name: supplier.supplier_name,
                phone: supplier.phone,
                address: supplier.address ?? ""
            })
        } else {
            reset()
        }
    }, [open, supplier])

    const onSubmit = async (values: CreateSupplierInput) => {
        try {
            if (isEdit && supplier) {
                await update.mutateAsync({
                    id: supplier.supplier_id,
                    data: values
                })
                toast.success("ອັບເດດຂໍ້ມູນຜູ້ສະໜອງສຳເລັດແລ້ວ")
            } else {
                await create.mutateAsync(values)
                toast.success("ເພີ່ມຜູ້ສະໜອງໃໝ່ສຳເລັດແລ້ວ")
            }

            onOpenChange(false)
            reset()

        } catch (err) {
            toast.error("ເກີດຂໍ້ຜິດພາດ ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "ແກ້ໄຂຂໍ້ມູນຜູ້ສະໜອງ" : "ເພີ່ມຜູ້ສະໜອງ"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">ຊື່ຜູ້ສະໜອງ</label>
                        <Input {...register("supplier_name")} placeholder="ປ້ອນຊື່ຜູ້ສະໜອງ..." />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm font-medium">ເບີໂທລະສັບ</label>
                        <Input {...register("phone")} placeholder="ປ້ອນເບີໂທລະສັບ..." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">ທີ່ຢູ່</label>
                        <Input {...register("address")} placeholder="ປ້ອນທີ່ຢູ່..." />
                    </div>

                    <Button className="w-full mt-2">
                        {isEdit ? "ອັບເດດ" : "ບັນທຶກ"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}