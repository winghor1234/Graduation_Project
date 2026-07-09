"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { AuthCard } from "@/components/adminComponent/auth/AuthCard"
import {
    useCustomerVerifyOtp, useCustomerResendOtp,
    useEmployeeVerifyOtp, useEmployeeResendOTP,
} from "@/app/features/hooks/Auth"

export default function VerifyOTPPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const role  = searchParams.get("role") === "employee" ? "employee" : "customer"

    const { mutate: customerVerify,  isPending: isCVPending }  = useCustomerVerifyOtp()
    const { mutate: employeeVerify,  isPending: isEVPending }  = useEmployeeVerifyOtp()
    const { mutate: customerResend,  isPending: isCRPending }  = useCustomerResendOtp()
    const { mutate: employeeResend,  isPending: isERPending }  = useEmployeeResendOTP()

    const isPending   = isCVPending || isEVPending
    const isResending = isCRPending || isERPending

    const [otp, setOtp]             = useState(["", "", "", "", "", ""])
    const [error, setError]         = useState("")
    const [resendTimer, setResendTimer] = useState(60)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (!email) router.push("/forgot-password")
    }, [email, router])

    useEffect(() => {
        if (resendTimer > 0) {
            const t = setTimeout(() => setResendTimer(v => v - 1), 1000)
            return () => clearTimeout(t)
        }
    }, [resendTimer])

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const next = [...otp]; next[index] = value; setOtp(next); setError("")
        if (value && index < 5) inputRefs.current[index + 1]?.focus()
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0)
            inputRefs.current[index - 1]?.focus()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const code = otp.join("")
        if (code.length !== 6) { setError("ກະລຸນາປ້ອນໃຫ້ຄົບ 6 ຫຼັກ"); return }

        const opts = {
            onSuccess: () => {
                toast.success("ຢືນຢັນ OTP ສຳເລັດ")
                router.push(`/reset-password?email=${email}&role=${role}`)
            },
            onError: () => setError("ລະຫັດ OTP ບໍ່ຖືກຕ້ອງ"),
        }
        if (role === "customer") customerVerify({ email, otp: code }, opts)
        else employeeVerify({ email, otp: code }, opts)
    }

    const handleResend = () => {
        const opts = {
            onSuccess: () => { toast.success("ສົ່ງ OTP ໃໝ່ສຳເລັດ"); setResendTimer(60) },
            onError:   () => toast.error("ບໍ່ສາມາດສົ່ງ OTP ໄດ້"),
        }
        if (role === "customer") customerResend({ email }, opts)
        else employeeResend({ email }, opts)
    }

    return (
        <AuthCard title="ຢືນຢັນ OTP" subtitle={`ສົ່ງໄປທີ່ ${email}`}>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">ລະຫັດ OTP (6 ຫຼັກ)</label>
                    <div className="flex gap-2 justify-between">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => { inputRefs.current[i] = el }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                className={`w-11 h-12 text-center text-lg font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                                    error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                                }`}
                            />
                        ))}
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>

                <button type="submit" disabled={isPending}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors">
                    {isPending ? "ກຳລັງຢືນຢັນ..." : "ຢືນຢັນ OTP"}
                </button>

                <div className="text-center">
                    <button type="button" disabled={resendTimer > 0 || isResending}
                        onClick={handleResend}
                        className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed">
                        {resendTimer > 0 ? `ສົ່ງໃໝ່ໃນ ${resendTimer} ວິ` : isResending ? "ກຳລັງສົ່ງ..." : "ສົ່ງ OTP ໃໝ່"}
                    </button>
                </div>

                <Link href={`/forgot-password`}
                    className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="size-4" />ກັບຄືນ
                </Link>
            </form>
        </AuthCard>
    )
}
