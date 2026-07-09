"use client"

import { UseFormRegister, FieldErrors } from "react-hook-form"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutFormData, Province, District } from "./checkout.types"

type Props = {
    register: UseFormRegister<CheckoutFormData>
    errors: FieldErrors<CheckoutFormData>
    provinces: Province[]
    selectedProvinceId: string
    selectedDistrictId: string
    selectedProvinceData: Province | null
    selectedDistrictData: District | null
}

const selectClass = "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm mt-1.5 text-gray-900 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"

export function CheckoutLocationCard({
    register, errors, provinces,
    selectedProvinceId, selectedDistrictId,
    selectedProvinceData, selectedDistrictData,
}: Props) {
    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-base font-semibold">
                    <MapPin className="size-4 text-gray-400" />
                    ທີ່ຢູ່ ແລະ ສາຂາຮັບເຄື່ອງ
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <div>
                    <label htmlFor="province_id" className="block text-sm font-medium text-gray-700 mb-1.5">
                        ແຂວງ <span className="text-red-500">*</span>
                    </label>
                    <select id="province_id" {...register("province_id")} className={selectClass}>
                        <option value="">-- ເລືອກແຂວງ --</option>
                        {provinces.map(p => (
                            <option key={p.province_id} value={p.province_id}>
                                {p.province_name}
                            </option>
                        ))}
                    </select>
                    {errors.province_id && (
                        <p className="text-xs text-red-500 mt-1.5">{errors.province_id.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="district_id" className="block text-sm font-medium text-gray-700 mb-1.5">
                            ເມືອງ <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="district_id"
                            {...register("district_id")}
                            disabled={!selectedProvinceId}
                            className={selectClass}
                        >
                            <option value="">-- ເລືອກເມືອງ --</option>
                            {selectedProvinceData?.districts.map(d => (
                                <option key={d.district_id} value={d.district_id}>
                                    {d.district_name}
                                </option>
                            ))}
                        </select>
                        {errors.district_id && (
                            <p className="text-xs text-red-500 mt-1.5">{errors.district_id.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="branch_id" className="block text-sm font-medium text-gray-700 mb-1.5">
                            ສາຂາ <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="branch_id"
                            {...register("branch_id")}
                            disabled={!selectedDistrictId}
                            className={selectClass}
                        >
                            <option value="">-- ເລືອກສາຂາ --</option>
                            {selectedDistrictData?.branches.map(b => (
                                <option key={b.branch_id} value={b.branch_id}>
                                    {b.branch_name}
                                </option>
                            ))}
                        </select>
                        {errors.branch_id && (
                            <p className="text-xs text-red-500 mt-1.5">{errors.branch_id.message}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}