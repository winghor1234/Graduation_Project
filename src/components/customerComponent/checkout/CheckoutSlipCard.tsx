"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
    previewUrl: string
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
}

export function CheckoutSlipCard({ previewUrl, onFileChange, error }: Props) {
    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="pb-3">
                <CardTitle className="text-gray-900 text-base font-semibold">ອັບໂຫຼດສະລິບໂອນເງິນ</CardTitle>
            </CardHeader>
            <CardContent>
                <input
                    type="file" id="payment-slip" accept="image/*"
                    onChange={onFileChange} className="hidden"
                />
                <label
                    htmlFor="payment-slip"
                    className="cursor-pointer block border-2 border-dashed border-gray-200 hover:border-orange-400 rounded-xl transition-colors bg-gray-50 hover:bg-gray-50"
                >
                    {previewUrl ? (
                        <div className="p-4 text-center space-y-2">
                            <div className="max-w-xs mx-auto relative h-56 rounded-lg overflow-hidden bg-white border border-gray-200">
                                <Image src={previewUrl} alt="Payment slip" fill className="object-contain" />
                            </div>
                            <p className="text-xs text-green-600 font-medium">ແນບຫຼັກຖານສຳເລັດ · ກົດເພື່ອປ່ຽນ</p>
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-sm font-medium text-gray-600 mb-1">ກົດເພື່ອເລືອກໄຟລ໌ສະລິບ</p>
                            <p className="text-xs text-gray-400">PNG, JPG · ສູງສຸດ 10MB</p>
                        </div>
                    )}
                </label>
                {error && (
                    <p className="text-xs text-red-500 mt-2">{error}</p>
                )}
            </CardContent>
        </Card>
    )
}
