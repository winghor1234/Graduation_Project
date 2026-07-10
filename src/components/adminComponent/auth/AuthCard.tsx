import { ShieldCheck } from "lucide-react"
import { ReactNode } from "react"

type Props = {
    title: string
    subtitle?: string
    children: ReactNode
}

export function AuthCard({ title, subtitle, children }: Props) {
    return (
        <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <div className="size-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
                    <ShieldCheck className="size-6 text-white" />
                </div>
                <h1 className="text-lg font-bold text-gray-900">SportWear Admin</h1>
                <p className="text-sm text-gray-500 mt-0.5">ລະບົບຮ້ານຄ້າຂາຍຍ່ອຍ</p>
            </div>

            {/* Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                {children}
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
                © 2026 SportWear Retail System
            </p>
        </div>
    )
}
