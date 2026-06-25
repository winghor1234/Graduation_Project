"use client"

import Image from "next/image"
import { Upload, CheckCircle, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
    previewUrl: string
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
}

export function CheckoutSlipCard({ previewUrl, onFileChange, error }: Props) {
    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2.5 text-gray-900 text-base">
                    <div className="size-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Upload className="size-4 text-emerald-600" />
                    </div>
                    ອັບໂຫຼດສະລິບໂອນເງິນ
                </CardTitle>
            </CardHeader>
            <CardContent>
                <input
                    type="file" id="payment-slip" accept="image/*"
                    onChange={onFileChange} className="hidden"
                />
                <label
                    htmlFor="payment-slip"
                    className="cursor-pointer block border-2 border-dashed border-gray-200 hover:border-brand-orange/50 rounded-xl transition-all duration-200 bg-gray-50 hover:bg-orange-50/30"
                >
                    {previewUrl ? (
                        <div className="p-5 space-y-3 text-center">
                            <div className="max-w-xs mx-auto relative h-64 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                <Image src={previewUrl} alt="Payment slip preview" fill className="object-contain" />
                            </div>
                            <p className="text-sm font-medium text-emerald-600 flex items-center justify-center gap-1.5">
                                <CheckCircle className="size-4" />
                                ແນບຫຼັກຖານສຳເລັດແລ້ວ
                            </p>
                            <span className="inline-block text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors">
                                ກົດເພື່ອປ່ຽນຮູບພາບ
                            </span>
                        </div>
                    ) : (
                        <div className="py-10 text-center px-6">
                            <div className="size-14 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="size-6 text-gray-400" />
                            </div>
                            <p className="text-base font-semibold text-gray-700 mb-1.5">
                                ກົດເພື່ອເລືອກໄຟລ໌ສະລິບ
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG ຂະໜາດສູງສຸດ 10MB</p>
                        </div>
                    )}
                </label>
                {error && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <span>⚠</span> {error}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}