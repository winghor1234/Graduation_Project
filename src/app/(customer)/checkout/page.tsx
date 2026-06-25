"use client"

import { useMemo, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { useAuthMe } from "@/app/features/hooks/Auth"
import { useCreateOrder } from "@/app/features/hooks/Order"
import { useGetAllProvince } from "@/app/features/hooks/Location"
import { useGetPromotionByCode } from "@/app/features/hooks/promotion"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Promotion } from "@/modules/promotion/promotion.types"

import { checkoutSchema, CheckoutFormData, Province } from "@/components/customerComponent/checkout/checkout.types"
import { CheckoutLocationCard } from "@/components/customerComponent/checkout/CheckoutLocationCard"
import { CheckoutPaymentCard } from "@/components/customerComponent/checkout/CheckoutPaymentCard"
import { CheckoutSlipCard } from "@/components/customerComponent/checkout/CheckoutSlipCard"
import { CheckoutOrderSummary } from "@/components/customerComponent/checkout/CheckoutOrderSummary"

type User = {
    customer_id: string
    role: string
    name: string
    email: string
    phone: string
}

export default function CheckoutPage() {

    const { cart, cartTotal, clearCart } = useCustomer()
    const { data: provincesData, isLoading: isLoadingProvinces } = useGetAllProvince()
    const provinces = useMemo(() => (provincesData ?? []) as Province[], [provincesData])

    const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder()
    const router = useRouter()

    const userData = useAuthMe()
    const user: User | undefined = userData?.user

    const {
        register, handleSubmit, setValue, control,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { province_id: "", district_id: "", branch_id: "" },
    })

    const selectedProvinceId = useWatch({ control, name: "province_id" })
    const selectedDistrictId = useWatch({ control, name: "district_id" })
    const currentSlipFile = useWatch({ control, name: "paymentSlip" })

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

    const previewUrl = useMemo(() => {
        if (currentSlipFile instanceof File) return URL.createObjectURL(currentSlipFile)
        return ""
    }, [currentSlipFile])


    const [promoInput, setPromoInput] = useState("")
    const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null)
    const [promoError, setPromoError] = useState("")

    const { mutate: checkPromoCode, isPending: isCheckingPromo } = useGetPromotionByCode()

    const handleApplyPromo = () => {
        const code = promoInput.trim().toUpperCase()
        if (!code) return
        setPromoError("")
        checkPromoCode(code, {
            onSuccess: (promo) => {
                setAppliedPromo(promo)
                setPromoInput("")
                toast.success(`ໃຊ້ໂຄດສ່ວນຫຼຸດສຳເລັດ: -${formatCurrency(promo.discount_value)}`)
            },
            onError: () => {
                setPromoError("ໂຄດໂປໂມຊັນບໍ່ຖືກຕ້ອງ ຫຼື ໝົດອາຍຸແລ້ວ")
                setAppliedPromo(null)
            },
        })
    }

    const handleRemovePromo = () => {
        setAppliedPromo(null)
        setPromoError("")
    }

    const shipping = cartTotal > 0 ? 20000 : 0
    const discount = appliedPromo ? Math.min(appliedPromo.discount_value, cartTotal) : 0
    const total = cartTotal + shipping - discount

    useEffect(() => {
        if (cart.length === 0) router.push("/cart")
    }, [cart, router])

    useEffect(() => {
        if (userData && !userData.user) {
            toast.error("ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນສັ່ງຊື້")
            router.push("/login")
        }
    }, [userData, router])

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

        const orderDetails = cart.map(item => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.sale_price,
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

                <Link href="/cart">
                    <Button variant="ghost" className="mb-4 -ml-2">
                        <ArrowLeft className="size-4 mr-2" />
                        ກັບໄປກະຕ່າ
                    </Button>
                </Link>

                <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">ຊຳລະເງິນ</h1>

                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        <div className="lg:col-span-2 space-y-6">
                            <CheckoutLocationCard
                                register={register}
                                errors={errors}
                                provinces={provinces}
                                selectedProvinceId={selectedProvinceId}
                                selectedDistrictId={selectedDistrictId}
                                selectedProvinceData={selectedProvinceData}
                                selectedDistrictData={selectedDistrictData}
                            />
                            <CheckoutPaymentCard total={total} />
                            <CheckoutSlipCard
                                previewUrl={previewUrl}
                                onFileChange={handleFileChange}
                                error={errors.paymentSlip?.message}
                            />
                        </div>

                        <div className="sticky top-24">
                            <CheckoutOrderSummary
                                cart={cart}
                                cartTotal={cartTotal}
                                shipping={shipping}
                                discount={discount}
                                total={total}
                                isSubmitting={isSubmitting}
                                promoInput={promoInput}
                                appliedPromo={appliedPromo}
                                promoError={promoError}
                                isCheckingPromo={isCheckingPromo}
                                onPromoInputChange={(val) => { setPromoInput(val); setPromoError("") }}
                                onApplyPromo={handleApplyPromo}
                                onRemovePromo={handleRemovePromo}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
