"use client"

import { UseFormRegister, FieldErrors } from "react-hook-form"
import { User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutFormData } from "./checkout.types"

type Props = {
    register: UseFormRegister<CheckoutFormData>
    errors: FieldErrors<CheckoutFormData>
}

const inputClass = "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm mt-1.5 text-gray-900 placeholder:text-gray-400 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-colors"

export function CheckoutCustomerInfoCard({ register, errors }: Props) {
    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-base font-semibold">
                    <User className="size-4 text-gray-400" />
                    ຂໍ້ມູນລູກຄ້າ
                </CardTitle>
                <p className="text-xs text-gray-400 mt-1">
                    ທ່ານກຳລັງສັ່ງຊື້ແບບບໍ່ເຂົ້າສູ່ລະບົບ — ກະລຸນາປ້ອນຂໍ້ມູນເພື່ອຕິດຕໍ່ ແລະ ຈັດສົ່ງ
                </p>
            </CardHeader>
            <CardContent className="space-y-4">

                <div>
                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        ຊື່ ແລະ ນາມສະກຸນ <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="customer_name"
                        type="text"
                        required
                        placeholder="ຊື່ ນາມສະກຸນ"
                        {...register("customer_name")}
                        className={inputClass}
                    />
                    {errors.customer_name && (
                        <p className="text-xs text-red-500 mt-1.5">{errors.customer_name.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                            ເບີໂທ <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            required
                            placeholder="020xxxxxxxx"
                            {...register("phone")}
                            className={inputClass}
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-500 mt-1.5">{errors.phone.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                            ອີເມວ <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="you@email.com"
                            {...register("email")}
                            className={inputClass}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
