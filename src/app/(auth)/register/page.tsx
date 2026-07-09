"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { AuthCard } from "@/components/adminComponent/auth/AuthCard"
import { useCustomerRegister } from "@/app/features/hooks/Auth"

const schema = z.object({
    customer_name:   z.string().min(2, "ກະລຸນາໃສ່ຊື່ຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ"),
    email:           z.string().email("ອີເມວບໍ່ຖືກຕ້ອງ"),
    phone:           z.string().min(8, "ເບີໂທຢ່າງໜ້ອຍ 8 ຕົວເລກ"),
    password:        z.string().min(6, "ລະຫັດຜ່ານຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"),
    confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
    message: "ລະຫັດຜ່ານບໍ່ຕົງກັນ",
    path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {children}
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="size-3.5 shrink-0" />{error}
                </p>
            )}
        </div>
    )
}

export default function RegisterPage() {
    const router = useRouter()
    const { mutate: register, isPending } = useCustomerRegister()
    const [showPw, setShowPw]           = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const { register: reg, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const inputCls = (err?: object) =>
        `w-full h-10 px-3 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${err ? "border-red-400" : "border-gray-300"}`

    const onSubmit = (data: FormData) => {
        const { confirmPassword, ...payload } = data
        void confirmPassword
        register(payload, {
            onSuccess: () => {
                toast.success("ລົງທະບຽນສຳເລັດ!")
                router.replace("/customer/home")
            },
            onError: () => toast.error("ບໍ່ສາມາດລົງທະບຽນໄດ້ ກະລຸນາລອງໃໝ່"),
        })
    }

    return (
        <AuthCard title="ລົງທະບຽນ" subtitle="ສ້າງບັນຊີລູກຄ້າໃໝ່">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field label="ຊື່ - ນາມສະກຸນ" error={errors.customer_name?.message}>
                    <input type="text" placeholder="ທ.ສົມສັກ ດາວພອນ"
                        {...reg("customer_name")} className={inputCls(errors.customer_name)} />
                </Field>

                <Field label="ອີເມວ" error={errors.email?.message}>
                    <input type="email" placeholder="example@email.com"
                        {...reg("email")} className={inputCls(errors.email)} />
                </Field>

                <Field label="ເບີໂທ" error={errors.phone?.message}>
                    <input type="tel" placeholder="020XXXXXXXX"
                        {...reg("phone")} className={inputCls(errors.phone)} />
                </Field>

                <Field label="ລະຫັດຜ່ານ" error={errors.password?.message}>
                    <div className="relative">
                        <input type={showPw ? "text" : "password"} placeholder="ຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"
                            {...reg("password")} className={inputCls(errors.password) + " pr-10"} />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                </Field>

                <Field label="ຢືນຢັນລະຫັດຜ່ານ" error={errors.confirmPassword?.message}>
                    <div className="relative">
                        <input type={showConfirm ? "text" : "password"} placeholder="ຢືນຢັນລະຫັດຜ່ານ"
                            {...reg("confirmPassword")} className={inputCls(errors.confirmPassword) + " pr-10"} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                </Field>

                <button type="submit" disabled={isPending}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors mt-2">
                    {isPending ? "ກຳລັງລົງທະບຽນ..." : "ລົງທະບຽນ"}
                </button>

                <p className="text-center text-sm text-gray-500 pt-1">
                    ມີບັນຊີຢູ່ແລ້ວ?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        ເຂົ້າສູ່ລະບົບ
                    </Link>
                </p>
            </form>
        </AuthCard>
    )
}
