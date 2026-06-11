import { ReactNode } from "react";
import { Store } from "lucide-react";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4  border-red-500 border-2">
            <div className="w-full max-w-md ">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Store className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">SportWear</h1>
                        <p className="text-sm text-gray-600">ລະບົບຮ້ານຄ້າຂາຍຍ່ອຍ</p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="mb-6">
                        <h2 className="font-bold mb-2">{title}</h2>
                        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                    </div>
                    {children}
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-8">
                    © 2026 SportWear Retail System. ສະຫງວນລິຂະສິດທຸກປະການ.
                </p>
            </div>
        </div>
    );
}