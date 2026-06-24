"use client"

import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Label } from "@/components/ui/label"
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

export function CheckoutLocationCard({
    register, errors, provinces,
    selectedProvinceId, selectedDistrictId,
    selectedProvinceData, selectedDistrictData,
}: Props) {
    return (
        <Card className="border shadow-sm bg-white">
            <CardHeader>
                <CardTitle className="text-gray-900">ທີ່ຢູ່ ແລະ ສາຂາຮັບເຄື່ອງ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <div>
                    <Label htmlFor="province_id" className="text-gray-700">ແຂວງ *</Label>
                    <select
                        id="province_id"
                        {...register("province_id")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1.5"
                    >
                        <option value="">-- ເລືອກແຂວງ --</option>
                        {provinces.map(p => (
                            <option key={p.province_id} value={p.province_id}>
                                {p.province_name}
                            </option>
                        ))}
                    </select>
                    {errors.province_id && (
                        <p className="text-xs text-destructive mt-1">{errors.province_id.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="district_id" className="text-gray-700">ເມືອງ *</Label>
                        <select
                            id="district_id"
                            {...register("district_id")}
                            disabled={!selectedProvinceId}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1.5 disabled:opacity-50"
                        >
                            <option value="">-- ເລືອກເມືອງ --</option>
                            {selectedProvinceData?.districts.map(d => (
                                <option key={d.district_id} value={d.district_id}>
                                    {d.district_name}
                                </option>
                            ))}
                        </select>
                        {errors.district_id && (
                            <p className="text-xs text-destructive mt-1">{errors.district_id.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="branch_id" className="text-gray-700">ສາຂາ *</Label>
                        <select
                            id="branch_id"
                            {...register("branch_id")}
                            disabled={!selectedDistrictId}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1.5 disabled:opacity-50"
                        >
                            <option value="">-- ເລືອກສາຂາ --</option>
                            {selectedDistrictData?.branches.map(b => (
                                <option key={b.branch_id} value={b.branch_id}>
                                    {b.branch_name}
                                </option>
                            ))}
                        </select>
                        {errors.branch_id && (
                            <p className="text-xs text-destructive mt-1">{errors.branch_id.message}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
