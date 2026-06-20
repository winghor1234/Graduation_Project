"use client"

import { useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, CheckCircle, CreditCard } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { useAuthMe } from "@/app/features/hooks/Auth"
import { useCreateOrder } from "@/app/features/hooks/Order"
import { useGetAllProvince } from "@/app/features/hooks/Location"
import { formatCurrency } from "@/utils/FormatCurrency"

type User = {
    customer_id: string
    role:        string
    name:        string
    email:       string
    phone:       string
}

type Province = {
    province_id:   string
    province_name: string
    districts: {
        district_id:   string
        district_name: string
        branches: {
            branch_id:   string
            branch_name: string
        }[]
    }[]
}

const checkoutSchema = z.object({
    province_id: z.string().min(1, "ກະລຸນາເລືອກແຂວງ"),
    district_id: z.string().min(1, "ກະລຸນາເລືອກເມືອງ"),
    branch_id:   z.string().min(1, "ກະລຸນາເລືອກສາຂາ"),
    paymentSlip: z.any().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {

    const { cart, cartTotal, clearCart } = useCustomer()
    const { data: provincesData, isLoading: isLoadingProvinces } = useGetAllProvince()
    const provinces = (provincesData ?? []) as Province[]

    const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder()
    const router = useRouter()

    const userData = useAuthMe()
    const user: User | undefined = userData?.user

    const {
        register, handleSubmit, setValue, watch,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { province_id: "", district_id: "", branch_id: "" },
    })

    const selectedProvinceId = watch("province_id")
    const selectedDistrictId = watch("district_id")

    const selectedProvinceData = useMemo(
        () => provinces.find(p => p.province_id === selectedProvinceId) ?? null,
        [provinces, selectedProvinceId]
    )

    const selectedDistrictData = useMemo(
        () => selectedProvinceData?.districts.find(d => d.district_id === selectedDistrictId) ?? null,
        [selectedProvinceData, selectedDistrictId]
    )

    useEffect(() => {
        setValue("district_id", "")
        setValue("branch_id", "")
    }, [selectedProvinceId, setValue])

    useEffect(() => {
        setValue("branch_id", "")
    }, [selectedDistrictId, setValue])

    const currentSlipFile = watch("paymentSlip")
    const previewUrl = useMemo(() => {
        if (currentSlipFile instanceof File) return URL.createObjectURL(currentSlipFile)
        return ""
    }, [currentSlipFile])

    // ✅ ບໍ່ຕ້ອງ merge ກັບ allProducts ອີກຕໍ່ໄປ — cart ມີຂໍ້ມູນຄົບແລ້ວ
    const shipping = cartTotal > 0 ? 20000 : 0
    const total = cartTotal + shipping

    useEffect(() => {
        if (cart.length === 0) router.push("/cart")
    }, [cart, router])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setValue("paymentSlip", file, { shouldValidate: true })
    }

    const onFormSubmit = (data: CheckoutFormData) => {
        if (!user?.customer_id) {
            toast.error("ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນສັ່ງຊື້")
            return
        }

        const fd = new FormData()
        fd.append("customer_id", user.customer_id)
        fd.append("method", "TRANSFER")
        fd.append("amount", String(total))
        fd.append("province_id", data.province_id)
        fd.append("district_id", data.district_id)
        fd.append("branch_id", data.branch_id)

        // ✅ variant_id ຄົບ — ສຳຄັນສຳລັບການຫັກສາງຖືກ variant
        const orderDetails = cart.map(item => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity:   item.quantity,
            price:      item.sale_price,
        }))
        fd.append("order_details", JSON.stringify(orderDetails))

        if (data.paymentSlip) fd.append("file", data.paymentSlip)

        createOrder(fd, {
            onSuccess: () => {
                clearCart()
                toast.success("ສັ່ງຊື້ສິນຄ້າສຳເລັດແລ້ວ! 🎉")
                router.push("/products")
            },
            onError: (error) => {
                toast.error(error?.message || "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່")
            },
        })
    }

    if (cart.length === 0) return null

    if (isLoadingProvinces) {
        return (
            <div className="flex h-screen items-center justify-center text-md font-medium text-gray-500 animate-pulse">
                ກຳລັງດຶງຂໍ້ມູນແຂວງ... 📦
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">ຊຳລະເງິນ</h1>

                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* LEFT */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Location */}
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

                            {/* Payment instructions */}
                            <Card className="border shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <CreditCard className="size-5 text-blue-600" />
                                        ຄຳແນະນຳການຊຳລະເງິນ
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5">
                                        <h4 className="font-semibold text-blue-900 mb-2">ຂໍ້ມູນບັນຊີທະນາຄານ:</h4>
                                        <div className="space-y-1.5 text-sm text-blue-800">
                                            <p>ທະນາຄານ: SportPro Bank</p>
                                            <p>ເລກທີບັນຊີ: 123-456-7890</p>
                                            <p>ຊື່ບັນຊີ: SportPro E-Commerce Co., Ltd.</p>
                                            <p className="font-bold text-base text-gray-900 mt-3 pt-2 border-t border-blue-200/50">
                                                ຍອດເງິນທີ່ຕ້ອງໂອນ: <span className="text-blue-600 text-lg">{formatCurrency(total)}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-amber-900 mb-1">
                                            ⚠️ ກະລຸນາແນບຫຼັກຖານການໂອນເງິນ (ສະລິບ) ທຸກຄັ້ງຫຼັງໂອນສຳເລັດ
                                        </p>
                                        <p className="text-xs text-amber-800 font-light leading-relaxed">
                                            ລະບົບຈະກວດສອບ ແລະ ອະນຸມັດການຈັດສົ່ງພາຍໃນ 24 ຊົ່ວໂມງ
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upload slip */}
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
                                            onChange={handleFileChange} className="hidden"
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
                                                    <p className="text-xs text-gray-400">
                                                        PNG, JPG ຂະໜາດສູງສຸດ 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT: Order Summary */}
                        <div className="sticky top-24">
                            <Card className="border shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">ສະຫຼຸບອໍເດີ້</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">

                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                        {cart.map(item => (
                                            <div
                                                key={item.variant_id}
                                                className="flex gap-3 items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0"
                                            >
                                                <div className="w-12 h-12 relative bg-gray-50 rounded border overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={item.image_url || "/placeholder.png"}
                                                        alt={item.product_name}
                                                        fill sizes="48px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-gray-900 truncate">
                                                        {item.product_name}
                                                    </p>
                                                    {/* ✅ variant */}
                                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                                        {item.color} / {item.size} · {item.quantity} ຊິ້ນ
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-700 mt-0.5">
                                                        {formatCurrency(item.sale_price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator className="bg-gray-100" />

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-500">
                                            <span>ຍອດລວມສິນຄ້າ</span>
                                            <span className="font-semibold text-gray-900">{formatCurrency(cartTotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>ຄ່າຈັດສົ່ງ</span>
                                            <span className="font-semibold text-gray-900">{formatCurrency(shipping)}</span>
                                        </div>
                                    </div>

                                    <Separator className="bg-gray-100" />

                                    <div className="flex justify-between items-end pt-1">
                                        <span className="text-base font-bold text-gray-900">ຍອດຊຳລະສຸດທິ</span>
                                        <span className="text-xl font-extrabold text-blue-600">{formatCurrency(total)}</span>
                                    </div>

                                    <Button
                                        type="submit" size="lg" disabled={isSubmitting}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors mt-2 shadow-sm"
                                    >
                                        {isSubmitting ? "ກຳລັງດຳເນີນການອໍເດີ້..." : "ຢືນຢັນການສັ່ງຊື້ສິນຄ້າ"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}