"use client"

import { useMemo, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Star } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { useAuthMe } from "@/app/features/hooks/Auth"
import { useCreateOrder } from "@/app/features/hooks/Order"
import { useGetAllProvince } from "@/app/features/hooks/Location"
import { useGetAllPromotions } from "@/app/features/hooks/promotion"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Promotion } from "@/modules/promotion/promotion.types"

import { checkoutSchema, CheckoutFormData, Province } from "@/components/customerComponent/checkout/checkout.types"
import { CheckoutLocationCard } from "@/components/customerComponent/checkout/CheckoutLocationCard"
import { CheckoutPaymentCard } from "@/components/customerComponent/checkout/CheckoutPaymentCard"
import { CheckoutSlipCard } from "@/components/customerComponent/checkout/CheckoutSlipCard"
import { CheckoutOrderSummary } from "@/components/customerComponent/checkout/CheckoutOrderSummary"
import { PointRedemptionCard } from "@/components/customerComponent/checkout/PointRedemptionCard"

// ─── Config ────────────────────────────────────────────────
const POINTS_PER_KIP  = 100   // 1 ຄະແນນ = 100₭ ສ່ວນຫຼຸດ
const MAX_REDEEM_RATE = 0.3   // ໃຊ້ຄະແນນໄດ້ສູງສຸດ 30% ຂອງ cart
const MIN_POINTS      = 10    // ຕ່ຳສຸດ 10 ຄະແນນ

type User = {
    customer_id: string
    role: string
    name: string
    email: string
    phone: string
    point?: number
}

function getApplicablePromotions(promotions: Promotion[], cartProductIds: Set<string>): Promotion[] {
    const now = new Date()
    return promotions.filter(promo => {
        if (promo.status !== "ACTIVE") return false
        if (new Date(promo.start_date) > now) return false
        if (new Date(promo.end_date) < now) return false
        if (!promo.promotion_products?.length) return true
        return promo.promotion_products.some(pp => cartProductIds.has(pp.product_id))
    })
}

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCustomer()
    const { data: provincesData, isLoading: isLoadingProvinces } = useGetAllProvince()
    const { data: allPromotions = [] } = useGetAllPromotions()
    const provinces = useMemo(() => (provincesData ?? []) as Province[], [provincesData])

    const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder()
    const router = useRouter()

    const userData = useAuthMe()
    const user = userData?.user as User | undefined

    const [pointsToUse, setPointsToUse] = useState(0)

    const {
        register, handleSubmit, setValue, control,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { province_id: "", district_id: "", branch_id: "" },
    })

    const selectedProvinceId  = useWatch({ control, name: "province_id" })
    const selectedDistrictId  = useWatch({ control, name: "district_id" })
    const currentSlipFile     = useWatch({ control, name: "paymentSlip" })

    const selectedProvinceData = useMemo(
        () => provinces.find(p => p.province_id === selectedProvinceId) ?? null,
        [provinces, selectedProvinceId]
    )
    const selectedDistrictData = useMemo(
        () => selectedProvinceData?.districts.find(d => d.district_id === selectedDistrictId) ?? null,
        [selectedProvinceData, selectedDistrictId]
    )

    useEffect(() => { setValue("district_id", ""); setValue("branch_id", "") }, [selectedProvinceId, setValue])
    useEffect(() => { setValue("branch_id", "") }, [selectedDistrictId, setValue])

    const previewUrl = useMemo(() => {
        if (currentSlipFile instanceof File) return URL.createObjectURL(currentSlipFile)
        return ""
    }, [currentSlipFile])

    const cartProductIds = useMemo(() => new Set(cart.map(i => i.product_id)), [cart])
    const appliedPromotions = useMemo(
        () => getApplicablePromotions(allPromotions, cartProductIds),
        [allPromotions, cartProductIds]
    )

    // ─── Points calculation ─────────────────────────────────
    const customerPoints = Math.floor(user?.point ?? 0)
    const maxRedeemByRate = Math.floor(cartTotal * MAX_REDEEM_RATE / POINTS_PER_KIP)
    const maxRedeemPoints = Math.min(customerPoints, maxRedeemByRate)
    const canUsePoints  = customerPoints >= MIN_POINTS
    const pointDiscount = pointsToUse * POINTS_PER_KIP

    // ─── Final totals ───────────────────────────────────────
    const shipping = cartTotal > 0 ? 20000 : 0
    const promoDiscount = useMemo(
        () => Math.min(appliedPromotions.reduce((s, p) => s + p.discount_value, 0), cartTotal),
        [appliedPromotions, cartTotal]
    )
    const totalDiscount = Math.min(promoDiscount + pointDiscount, cartTotal)
    const total = cartTotal + shipping - totalDiscount

    useEffect(() => { if (cart.length === 0) router.push("/cart") }, [cart, router])
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
        fd.append("customer_id",  user.customer_id)
        fd.append("method",       "TRANSFER")
        fd.append("amount",       String(total))
        fd.append("province_id",  data.province_id)
        fd.append("district_id",  data.district_id)
        fd.append("branch_id",    data.branch_id)
        fd.append("points_used",  String(pointsToUse))

        const orderDetails = cart.map(item => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity:   item.quantity,
            price:      item.sale_price,
        }))
        fd.append("order_details", JSON.stringify(orderDetails))

        if (appliedPromotions.length > 0) {
            fd.append("promotion_ids", JSON.stringify(appliedPromotions.map(p => p.promotion_id)))
        }

        if (data.paymentSlip) fd.append("file", data.paymentSlip)

        createOrder(fd, {
            onSuccess: () => {
                clearCart()
                toast.success("ສັ່ງຊື້ສິນຄ້າສຳເລັດແລ້ວ!")
                router.push("/products")
            },
            onError: (err) => {
                toast.error(err?.message || "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່")
            },
        })
    }

    if (cart.length === 0) return null

    if (isLoadingProvinces) {
        return (
            <div className="flex h-screen items-center justify-center text-sm font-medium text-gray-400 animate-pulse">
                ກຳລັງດຶງຂໍ້ມູນ...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-6xl">

                <Link href="/cart">
                    <Button variant="ghost" className="mb-6 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-xl">
                        <ArrowLeft className="size-4 mr-2" />
                        ກັບໄປກະຕ່າ
                    </Button>
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">ຊຳລະເງິນ</h1>
                    <p className="text-gray-500 text-sm mt-1">ກວດສອບຂໍ້ມູນ ແລະ ຢືນຢັນການສັ່ງຊື້</p>
                </div>

                {/* Point balance banner */}
                {customerPoints > 0 && (
                    <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                        <Star className="size-5 text-amber-500 fill-amber-400 shrink-0" />
                        <p className="text-sm text-amber-800">
                            ທ່ານມີ <span className="font-extrabold text-amber-700">{customerPoints.toLocaleString()} ຄະແນນ</span>
                            {" "}(ມູນຄ່າ {formatCurrency(customerPoints * POINTS_PER_KIP)})
                        </p>
                    </div>
                )}

                {/* Promotion banner */}
                {appliedPromotions.length > 0 && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                            <span className="text-xl">🎉</span>
                        </div>
                        <div>
                            <p className="text-emerald-700 font-bold text-sm">
                                ທ່ານໄດ້ຮັບ {appliedPromotions.length} ໂປໂມຊັນ!
                            </p>
                            <p className="text-emerald-600 text-xs mt-0.5">
                                ສ່ວນຫຼຸດທັງໝົດ: <span className="font-semibold">{formatCurrency(promoDiscount)}</span>
                            </p>
                        </div>
                    </div>
                )}

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

                            {/* Point redemption card */}
                            <PointRedemptionCard
                                customerPoints={customerPoints}
                                maxRedeemPoints={maxRedeemPoints}
                                pointsToUse={pointsToUse}
                                onChangePoints={setPointsToUse}
                                canUse={canUsePoints}
                                minPoints={MIN_POINTS}
                                pointsPerKip={POINTS_PER_KIP}
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
                                discount={totalDiscount}
                                total={total}
                                isSubmitting={isSubmitting}
                                appliedPromotions={appliedPromotions}
                                pointsUsed={pointsToUse}
                                pointsValue={pointDiscount}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
