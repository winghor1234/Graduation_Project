"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { UseMutationResult } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from "@/modules/employee/employee.type"

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

type Props = {
    open: boolean
    onOpenChange: (v: boolean) => void
    employee?: Employee
    create: UseMutationResult<Employee, Error, CreateEmployeeInput>
    update: UseMutationResult<Employee, Error, { id: string; data: UpdateEmployeeInput }>
}

type FormValues = {
    employee_name: string
    email: string
    phone: string
    password: string
    gender: string
    address: string
    position: string
    role: "ADMIN" | "STAFF"
}

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function EmployeeFormDialog({ open, onOpenChange, employee, create, update }: Props) {
    const isEdit = !!employee

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
        defaultValues: {
            employee_name: "",
            email: "",
            phone: "",
            password: "",
            gender: "",
            address: "",
            position: "",
            role: "STAFF",
        },
    })

    const role = watch("role")

    useEffect(() => {
        if (!open) return
        if (employee) {
            reset({
                employee_name: employee.employee_name,
                email: employee.email,
                phone: employee.phone,
                password: "",
                gender: employee.gender ?? "",
                address: employee.address ?? "",
                position: employee.position ?? "",
                role: employee.role,
            })
        } else {
            reset({
                employee_name: "",
                email: "",
                phone: "",
                password: "",
                gender: "",
                address: "",
                position: "",
                role: "STAFF",
            })
        }
    }, [open, employee, reset])

    const onSubmit = async (values: FormValues) => {
        try {
            if (isEdit && employee) {
                const { password, ...rest } = values
                await update.mutateAsync({ id: employee.employee_id, data: rest })
                toast.success("ອັບເດດຂໍ້ມູນພະນັກງານສຳເລັດ")
            } else {
                await create.mutateAsync(values)
                toast.success("ເພີ່ມພະນັກງານໃໝ່ສຳເລັດ")
            }
            onOpenChange(false)
        } catch {
            toast.error("ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold">
                        {isEdit ? "ແກ້ໄຂຂໍ້ມູນພະນັກງານ" : "ເພີ່ມພະນັກງານໃໝ່"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

                    {/* Name + Role */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-600">ຊື່ພະນັກງານ *</Label>
                            <Input
                                {...register("employee_name", { required: "ກະລຸນາໃສ່ຊື່" })}
                                placeholder="ຊື່-ນາມສະກຸນ"
                                className="rounded-xl"
                            />
                            {errors.employee_name && (
                                <p className="text-xs text-red-500">{errors.employee_name.message}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-600">Role *</Label>
                            <Select
                                value={role}
                                onValueChange={(v) => setValue("role", v as "ADMIN" | "STAFF")}
                            >
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STAFF">Staff</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-600">ອີເມວ *</Label>
                        <Input
                            {...register("email", { required: "ກະລຸນາໃສ່ອີເມວ" })}
                            type="email"
                            placeholder="example@email.com"
                            className="rounded-xl"
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* Phone + Gender */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-600">ເບີໂທ *</Label>
                            <Input
                                {...register("phone", { required: "ກະລຸນາໃສ່ເບີໂທ" })}
                                placeholder="020XXXXXXXX"
                                className="rounded-xl"
                            />
                            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-600">ເພດ</Label>
                            <Input
                                {...register("gender")}
                                placeholder="ຊາຍ / ຍິງ"
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Position */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-600">ຕຳແໜ່ງ</Label>
                        <Input
                            {...register("position")}
                            placeholder="ເຊັ່ນ: ຜູ້ຈັດການ, ພະນັກງານຂາຍ..."
                            className="rounded-xl"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-600">ທີ່ຢູ່</Label>
                        <Input
                            {...register("address")}
                            placeholder="ທີ່ຢູ່ປັດຈຸບັນ"
                            className="rounded-xl"
                        />
                    </div>

                    {/* Password (create only) */}
                    {!isEdit && (
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-600">ລະຫັດຜ່ານ *</Label>
                            <Input
                                {...register("password", { required: "ກະລຸນາໃສ່ລະຫັດຜ່ານ" })}
                                type="password"
                                placeholder="ຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"
                                className="rounded-xl"
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => onOpenChange(false)}
                        >
                            ຍົກເລີກ
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 rounded-xl bg-gray-900 hover:bg-gray-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "ກຳລັງບັນທຶກ..."
                                : isEdit ? "ອັບເດດ" : "ເພີ່ມພະນັກງານ"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}