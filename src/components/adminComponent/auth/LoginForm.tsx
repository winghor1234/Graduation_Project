"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { getRedirectPath } from "@/utils/auth"
import { useLogin } from "@/app/features/hooks/Auth"
import { LoginDto } from "@/modules/auth/auth.type"
import { loginSchema } from "@/app/features/validation"

export default function LoginForm() {
    const router = useRouter()
    const { mutate: login, isPending } = useLogin()
    const [showPassword, setShowPassword] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = (data: LoginDto) => {
        login(data, {
            onSuccess: (res) => {
                toast.success("ເຂົ້າສູ່ລະບົບສຳເລັດ")
                router.replace(getRedirectPath(res?.data?.role))
            },
            onError: () => toast.error("ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ"),
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">ອີເມວ</label>
                <input
                    type="email"
                    placeholder="admin@sportswear.com"
                    {...register("email")}
                    className={`w-full h-10 px-3 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.email ? "border-red-400" : "border-gray-300"
                    }`}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="size-3.5" />
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">ລະຫັດຜ່ານ</label>
                    <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">
                        ລືມລະຫັດຜ່ານ?
                    </Link>
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="ປ້ອນລະຫັດຜ່ານ"
                        {...register("password")}
                        className={`w-full h-10 px-3 pr-10 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                            errors.password ? "border-red-400" : "border-gray-300"
                        }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="size-3.5" />
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors mt-2"
            >
                {isPending ? "ກຳລັງເຂົ້າສູ່ລະບົບ..." : "ເຂົ້າສູ່ລະບົບ"}
            </button>

            <p className="text-center text-sm text-gray-500 pt-2">
                ລູກຄ້າໃໝ່?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    ສ້າງບັນຊີ
                </Link>
            </p>
        </form>
    )
}
