"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { UseMutationResult } from "@tanstack/react-query"
import { Customer } from "@/modules/customer/customer.type"
import { CustomerRegisterInput, CustomerUpdateInput } from "@/modules/auth/auth.type"
import { CustomerCreateFormValues, customerCreateSchema, CustomerUpdateFormValues, customerUpdateSchema } from '@/schemas/schema'


/* ----------------------------- Props ----------------------------- */

type CustomerFormDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    customer?: Customer
    create: UseMutationResult<Customer, Error, CustomerRegisterInput>
    update: UseMutationResult<Customer, Error, { id: string; data: CustomerUpdateInput }>
}

/* ----------------------------- Component ----------------------------- */

export function CustomerFormDialog({ open, onOpenChange, customer, create, update }: CustomerFormDialogProps) {
    const isEdit = !!customer
    const form = useForm<CustomerCreateFormValues | CustomerUpdateFormValues>({
        resolver: zodResolver(isEdit ? customerUpdateSchema : customerCreateSchema),
        defaultValues: {
            customer_name: "",
            phone: "",
            email: "",
            gender: "",
            // address: "",
            ...(isEdit ? {} : { password: "" }) // ✅ password เฉพาะ create
        }
    })

    const { register, handleSubmit, formState: { errors }, reset } = form

    /* ----------------------------- Reset ----------------------------- */

    useEffect(() => {
        if (!open) return
        if (customer) {
            reset({
                customer_name: customer.customer_name,
                phone: customer.phone,
                email: customer.email,
                gender: customer.gender,
                // address: customer.address,
            })
        }
    }, [open, customer, reset])

    /* ----------------------------- Submit ----------------------------- */

    const onSubmit = async (values: CustomerCreateFormValues | CustomerUpdateFormValues) => {
        try {
            if (isEdit && customer) {
                // ✅ remove password อัตโนมัติ
                const { password, ...rest } = values as CustomerCreateFormValues

                const updatePayload: CustomerUpdateInput = {
                    ...rest
                }

                await update.mutateAsync({
                    id: customer.customer_id,
                    data: updatePayload
                })

                toast.success("ອັບເດດຂໍ້ມູນລູກຄ້າສຳເລັດແລ້ວ")

            } else {
                const payload: CustomerRegisterInput = values as CustomerCreateFormValues

                await create.mutateAsync(payload)

                toast.success("ເພີ່ມລູກຄ້າໃໝ່ສຳເລັດແລ້ວ")
            }

            onOpenChange(false)
            reset()

        } catch (error) {
            console.error(error)
            toast.error("ເກີດຂໍ້ຜິດພາດບາງຢ່າງ")
        }
    }

    /* ----------------------------- UI ----------------------------- */

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "ແກ້ໄຂຂໍ້ມູນລູກຄ້າ" : "ເພີ່ມລູກຄ້າ"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <Input {...register("customer_name")} placeholder="ຊື່ລູກຄ້າ..." />
                    <div className="text-red-500 text-sm">{errors.customer_name?.message}</div>

                    <Input type="number" {...register("phone")} placeholder="ເບີໂທລະສັບ..." />
                    <div className="text-red-500 text-sm">{errors.phone?.message}</div>

                    <Input {...register("email")} placeholder="ອີເມວ..." />
                    <div className="text-red-500 text-sm">{errors.email?.message}</div>

                    {/* <Input {...register("address")} placeholder="ທີ່ຢູ່..." />
                    <div className="text-red-500 text-sm">{errors.address?.message}</div> */}

                    <Input {...register("gender")} placeholder="ເພດ..." />
                    <div className="text-red-500 text-sm">{errors.gender?.message}</div>

                    {/* ✅ show password เฉพาะ create */}
                    {!isEdit && (
                        <>
                            <Input type="password" {...register("password")} placeholder="ລະຫັດຜ່ານ..." />
                            <div className="text-red-500 text-sm">{"password" in errors ? errors.password?.message : null}</div>
                        </>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={create.isPending || update.isPending}
                    >
                        {isEdit ? "ອັບເດດຂໍ້ມູນລູກຄ້າ" : "ບັນທຶກຂໍ້ມູນລູກຄ້າ"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}