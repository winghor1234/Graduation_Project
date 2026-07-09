"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, Mail } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import { AuthCard } from "@/components/adminComponent/auth/AuthCard"
import { useCustomerForgotPassword, useEmployeeForgotPassword } from "@/app/features/hooks/Auth"

const schema = z.object({ email: z.string().email("ອີເມວບໍ່ຖືກຕ້ອງ") })
type FormData = z.infer<typeof schema>

type Role = "customer" | "employee"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [role, setRole] = useState<Role>("customer")

    const { mutate: customerForgot, isPending: isCPending } = useCustomerForgotPassword()
    const { mutate: employeeForgot, isPending: isEPending } = useEmployeeForgotPassword()
    const isPending = isCPending || isEPending

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = (data: FormData) => {
        const next = `/verify-otp?email=${data.email}&role=${role}`
        const opts = {
            onSuccess: () => { toast.success("ສົ່ງລະຫັດ OTP ໄປທີ່ອີເມວຂອງທ່ານແລ້ວ"); router.push(next) },
            onError:   () => toast.error("ບໍ່ສາມາດສົ່ງ OTP ໄດ້ ກະລຸນາກວດສອບອີເມວ"),
        }
        if (role === "customer") customerForgot(data, opts)
        else employeeForgot(data, opts)
    }

    return (
        <AuthCard title="ລືມລະຫັດຜ່ານ" subtitle="ເລືອກປະເພດບັນຊີ ແລ້ວໃສ່ອີເມວຂອງທ່ານ">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Role tabs */}
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    {(["customer", "employee"] as Role[]).map(r => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                role === r
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            {r === "customer" ? "ລູກຄ້າ" : "ພະນັກງານ"}
                        </button>
                    ))}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">ອີເມວ</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                            type="email"
                            placeholder="example@email.com"
                            {...register("email")}
                            className={`w-full h-10 pl-9 pr-3 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                                errors.email ? "border-red-400" : "border-gray-300"
                            }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="size-3.5" />{errors.email.message}
                        </p>
                    )}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 text-xs text-blue-700">
                    ລະຫັດ OTP ຈະໝົດອາຍຸໃນ 10 ນາທີ
                </div>

                <button type="submit" disabled={isPending}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors">
                    {isPending ? "ກຳລັງສົ່ງ..." : "ສົ່ງ OTP"}
                </button>

                <Link href="/login"
                    className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 pt-1">
                    <ArrowLeft className="size-4" />
                    ກັບໄປໜ້າເຂົ້າສູ່ລະບົບ
                </Link>
            </form>
        </AuthCard>
    )
}
