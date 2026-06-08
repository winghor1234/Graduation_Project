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
                toast.success("Supplier updated")
            } else {
                await create.mutateAsync(values)
                toast.success("Supplier created")
            }

            onOpenChange(false)
            reset()

        } catch (err) {
            toast.error("Something went wrong")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Supplier" : "Add Supplier"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <Input {...register("supplier_name")} placeholder="Name" />
                    <Input {...register("phone")} placeholder="Phone" />
                    <Input {...register("address")} placeholder="Address" />
                    <Button className="w-full">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}