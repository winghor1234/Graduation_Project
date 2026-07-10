"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import { AuthCard } from "@/components/adminComponent/auth/AuthCard"
import { useCustomerResetPassword, useEmployeeResetPassword } from "@/app/features/hooks/Auth"

const schema = z.object({
    password:        z.string().min(6, "ລະຫັດຜ່ານຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"),
    confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
    message: "ລະຫັດຜ່ານບໍ່ຕົງກັນ",
    path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const role  = searchParams.get("role") === "employee" ? "employee" : "customer"

    const { mutate: customerReset, isPending: isCPending } = useCustomerResetPassword()
    const { mutate: employeeReset, isPending: isEPending } = useEmployeeResetPassword()
    const isPending = isCPending || isEPending

    const [showPw, setShowPw]           = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const inputCls = (err?: object) =>
        `w-full h-10 px-3 pr-10 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${err ? "border-red-400" : "border-gray-300"}`

    const onSubmit = (data: FormData) => {
        const opts = {
            onSuccess: () => { toast.success("ຕັ້ງລະຫັດຜ່ານໃໝ່ສຳເລັດ"); router.push("/login") },
            onError:   () => toast.error("ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່"),
        }
        if (role === "customer") customerReset({ email, password: data.password }, opts)
        else employeeReset({ email, password: data.password }, opts)
    }

    return (
        <AuthCard title="ຕັ້ງລະຫັດຜ່ານໃໝ່" subtitle="ໃສ່ລະຫັດຜ່ານໃໝ່ຂອງທ່ານ">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">ລະຫັດຜ່ານໃໝ່</label>
                    <div className="relative">
                        <input type={showPw ? "text" : "password"} placeholder="ຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"
                            {...register("password")} className={inputCls(errors.password)} />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="size-3.5" />{errors.password.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">ຢືນຢັນລະຫັດຜ່ານ</label>
                    <div className="relative">
                        <input type={showConfirm ? "text" : "password"} placeholder="ຢືນຢັນລະຫັດຜ່ານ"
                            {...register("confirmPassword")} className={inputCls(errors.confirmPassword)} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="size-3.5" />{errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <button type="submit" disabled={isPending}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors mt-2">
                    {isPending ? "ກຳລັງບັນທຶກ..." : "ຕັ້ງລະຫັດຜ່ານໃໝ່"}
                </button>

                <Link href="/login"
                    className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 pt-1">
                    <ArrowLeft className="size-4" />ກັບໄປໜ້າເຂົ້າສູ່ລະບົບ
                </Link>
            </form>
        </AuthCard>
    )
}
