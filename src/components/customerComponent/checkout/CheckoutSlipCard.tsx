"use client"

import Image from "next/image"
import { Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
    previewUrl: string
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
}

export function CheckoutSlipCard({ previewUrl, onFileChange, error }: Props) {
    return (
        <Card className="border shadow-sm bg-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Upload className="size-5 text-gray-500" />
                    ອັບໂຫຼດສະລິບໂອນເງິນ
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl p-6 text-center transition-colors bg-gray-50/50">
                    <input
                        type="file" id="payment-slip" accept="image/*"
                        onChange={onFileChange} className="hidden"
                    />
                    <label htmlFor="payment-slip" className="cursor-pointer block">
                        {previewUrl ? (
                            <div className="space-y-3">
                                <div className="max-w-xs mx-auto relative h-64 border rounded-lg overflow-hidden bg-white shadow-sm">
                                    <Image src={previewUrl} alt="Payment slip preview" fill className="object-contain" />
                                </div>
                                <p className="text-sm font-medium text-emerald-600 flex items-center justify-center gap-1.5">
                                    <CheckCircle className="size-4" /> ແນບຫຼັກຖານສຳເລັດແລ້ວ
                                </p>
                                <Button type="button" variant="outline" size="sm" className="text-gray-600">
                                    ປ່ຽນຮູບພາບ
                                </Button>
                            </div>
                        ) : (
                            <div className="py-4">
                                <Upload className="size-10 mx-auto mb-3 text-gray-400" />
                                <p className="text-base font-semibold text-gray-800 mb-1">
                                    ກົດເພື່ອເລືອກໄຟລ໌ສະລິບ
                                </p>
                                <p className="text-xs text-gray-400">PNG, JPG ຂະໜາດສູງສຸດ 10MB</p>
                            </div>
                        )}
                    </label>
                </div>
                {error && <p className="text-xs text-destructive mt-2">{error}</p>}
            </CardContent>
        </Card>
    )
}
