"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { useAuthMe } from "@/app/features/hooks/Auth"
import { useCreateOrder } from "@/app/features/hooks/Order"
import { useGetAllProvince } from "@/app/features/hooks/Location"
import { useGetAllPromotions } from "@/app/features/hooks/promotion"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Promotion } from "@/modules/promotion/promotion.types"

import { checkoutSchema, CheckoutFormData, Province } from "@/components/customerComponent/checkout/checkout.types"
import { CheckoutCustomerInfoCard } from "@/components/customerComponent/checkout/CheckoutCustomerInfoCard"
import { CheckoutLocationCard } from "@/components/customerComponent/checkout/CheckoutLocationCard"
import { CheckoutMethodSelector, PaymentMethodOption } from "@/components/customerComponent/checkout/CheckoutMethodSelector"
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

export default function CartPage() {
    const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useCustomer()
    const router = useRouter()

    const { data: provincesData, isLoading: isLoadingProvinces } = useGetAllProvince()
    const { data: allPromotions = [] } = useGetAllPromotions()
    const provinces = useMemo(() => (provincesData ?? []) as Province[], [provincesData])

    const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder()

    const userData = useAuthMe()
    const user = userData?.user as User | undefined
    const isAuthenticated = !!user

    const [pointsToUse, setPointsToUse] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption>("TRANSFER")

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

    // ─── Points calculation (logged-in customers only) ──────
    const customerPoints = Math.floor(user?.point ?? 0)
    const maxRedeemByRate = Math.floor(cartTotal * MAX_REDEEM_RATE / POINTS_PER_KIP)
    const maxRedeemPoints = Math.min(customerPoints, maxRedeemByRate)
    const canUsePoints  = customerPoints >= MIN_POINTS
    const pointDiscount = pointsToUse * POINTS_PER_KIP

    // ─── Final totals ───────────────────────────────────────
    const promoDiscount = useMemo(
        () => Math.min(appliedPromotions.reduce((s, p) => s + p.discount_value, 0), cartTotal),
        [appliedPromotions, cartTotal]
    )
    const totalDiscount = Math.min(promoDiscount + pointDiscount, cartTotal)
    const total = cartTotal - totalDiscount

    // ⚡ Prefetch the likely next stop after a successful order
    useEffect(() => {
        router.prefetch(isAuthenticated ? "/customer/order-history" : "/customer/home")
    }, [router, isAuthenticated])

    // ⚡ Prefetch หน้า shop ตอนเมาส์ชี้ / นิ้วแตะ
    const prefetchShop = () => {
        router.prefetch("/customer/home")
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setValue("paymentSlip", file, { shouldValidate: true })
    }

    const onFormSubmit = (data: CheckoutFormData) => {
        if (!isAuthenticated) {
            if (!data.customer_name?.trim() || !data.phone?.trim() || !data.email?.trim()) {
                toast.error("ກະລຸນາປ້ອນຊື່, ເບີໂທ ແລະ ອີເມວ ເພື່ອສັ່ງຊື້")
                return
            }
        }

        const fd = new FormData()
        if (isAuthenticated && user?.customer_id) {
            fd.append("customer_id", user.customer_id)
        } else {
            fd.append("customer_name", data.customer_name!.trim())
            fd.append("phone",         data.phone!.trim())
            fd.append("email",         data.email!.trim())
        }
        fd.append("method",       paymentMethod)
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
            onSuccess: (result) => {
                const orderCode = result?.order?.order_code
                clearCart()
                toast.success(
                    isAuthenticated
                        ? "ສັ່ງຊື້ສິນຄ້າສຳເລັດແລ້ວ!"
                        : `ສັ່ງຊື້ສຳເລັດແລ້ວ! ລະຫັດອໍເດີ້: ${orderCode ?? ""}`
                )
                router.push(isAuthenticated ? "/customer/order-history" : "/customer/home")
            },
            onError: (err) => {
                toast.error(err?.message || "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່")
            },
        })
    }

    if (!cart.length) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="size-24 mx-auto mb-6 rounded-full bg-brand-orange/10 flex items-center justify-center">
                        <ShoppingBag className="size-11 text-brand-orange" />
                    </div>
                    <h1 className="text-3xl font-extrabold mb-3 text-gray-900 tracking-tight">
                        ກະຕ່າສິນຄ້າຂອງທ່ານຍັງວ່າງເປົ່າ
                    </h1>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        ເບິ່ງຄືວ່າທ່ານຍັງບໍ່ທັນໄດ້ເລືອກຊື້ສິນຄ້າຊິ້ນໃດລົງໃນກະຕ່າເລີຍ
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 rounded-xl gap-2 shadow-md active:scale-[0.98] transition-all"
                    >
                        <Link
                            href="/customer/home"
                            onMouseEnter={prefetchShop}
                            onTouchStart={prefetchShop}
                        >
                            ເລີ່ມຕົ້ນຊື້ສິນຄ້າ <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">ກະຕ່າສິນຄ້າ ແລະ ຊຳລະເງິນ</h1>

                {/* Point balance banner */}
                {isAuthenticated && customerPoints > 0 && (
                    <div className="mb-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                        ຄະແນນທີ່ມີ: <span className="font-semibold">{customerPoints.toLocaleString()} ຄະແນນ</span>
                        {" "}(≈ {formatCurrency(customerPoints * POINTS_PER_KIP)})
                    </div>
                )}

                {/* Promotion banner */}
                {appliedPromotions.length > 0 && (
                    <div className="mb-6 text-sm text-green-800 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                        ໄດ້ຮັບ {appliedPromotions.length} ໂປໂມຊັນ · ສ່ວນຫຼຸດລວມ:{" "}
                        <span className="font-semibold">{formatCurrency(promoDiscount)}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* LEFT: cart items + checkout form */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item, index) => (
                                <Card
                                    key={item.variant_id}
                                    className="border border-gray-200 shadow-sm bg-white rounded-2xl overflow-hidden py-0"
                                >
                                    <CardContent className="p-5 sm:p-6">
                                        <div className="flex flex-col sm:flex-row gap-5">

                                            <div className="w-full sm:w-28 h-28 relative bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                <Image
                                                    src={item.image_url || "/placeholder.png"}
                                                    alt={item.product_name}
                                                    fill
                                                    sizes="112px"
                                                    className="object-cover"
                                                    priority={index < 3}
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={`/customer/shop/${item.product_id}`}
                                                            className="font-semibold text-lg text-gray-900 hover:text-brand-orange transition-colors line-clamp-1"
                                                        >
                                                            {item.product_name}
                                                        </Link>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {item.color} / {item.size}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeFromCart(item.variant_id)}
                                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full shrink-0"
                                                    >
                                                        <Trash2 className="size-5" />
                                                    </Button>
                                                </div>

                                                <div className="flex items-center justify-between mt-6 gap-4">
                                                    <div className="flex items-center gap-1 border border-gray-200 rounded-xl bg-gray-50 p-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost" size="icon"
                                                            className="size-8 rounded-lg bg-white shadow-sm hover:bg-white"
                                                            onClick={() => updateCartQuantity(item.variant_id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="size-3.5 text-gray-800" />
                                                        </Button>
                                                        <span className="text-sm font-bold w-8 text-center text-gray-900">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost" size="icon"
                                                            className="size-8 rounded-lg bg-white shadow-sm hover:bg-white"
                                                            onClick={() => updateCartQuantity(item.variant_id, item.quantity + 1)}
                                                            disabled={item.quantity >= item.stock_qty}
                                                        >
                                                            <Plus className="size-3.5 text-gray-800" />
                                                        </Button>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-xl font-extrabold text-brand-orange">
                                                            {formatCurrency(item.sale_price * item.quantity)}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {formatCurrency(item.sale_price)} / ຊິ້ນ
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {!isAuthenticated && (
                                <CheckoutCustomerInfoCard register={register} errors={errors} />
                            )}

                            {isLoadingProvinces ? (
                                <div className="flex items-center justify-center py-10 text-sm font-medium text-gray-400 animate-pulse">
                                    ກຳລັງດຶງຂໍ້ມູນທີ່ຢູ່...
                                </div>
                            ) : (
                                <CheckoutLocationCard
                                    register={register}
                                    errors={errors}
                                    provinces={provinces}
                                    selectedProvinceId={selectedProvinceId}
                                    selectedDistrictId={selectedDistrictId}
                                    selectedProvinceData={selectedProvinceData}
                                    selectedDistrictData={selectedDistrictData}
                                />
                            )}

                            {isAuthenticated && (
                                <PointRedemptionCard
                                    customerPoints={customerPoints}
                                    maxRedeemPoints={maxRedeemPoints}
                                    pointsToUse={pointsToUse}
                                    onChangePoints={setPointsToUse}
                                    canUse={canUsePoints}
                                    minPoints={MIN_POINTS}
                                    pointsPerKip={POINTS_PER_KIP}
                                />
                            )}

                            <CheckoutMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

                            {paymentMethod === "TRANSFER" ? (
                                <>
                                    <CheckoutPaymentCard total={total} />
                                    <CheckoutSlipCard
                                        previewUrl={previewUrl}
                                        onFileChange={handleFileChange}
                                        error={errors.paymentSlip?.message}
                                    />
                                </>
                            ) : (
                                <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                    ທ່ານຈະຈ່າຍເງິນສົດ {formatCurrency(total)} ໃຫ້ພະນັກງານຂົນສົ່ງເມື່ອໄດ້ຮັບສິນຄ້າ
                                </div>
                            )}
                        </div>

                        {/* RIGHT: summary + submit */}
                        <div className="sticky top-24">
                            <CheckoutOrderSummary
                                cart={cart}
                                cartTotal={cartTotal}
                                discount={totalDiscount}
                                total={total}
                                isSubmitting={isSubmitting}
                                appliedPromotions={appliedPromotions}
                                pointsUsed={pointsToUse}
                                pointsValue={pointDiscount}
                            />

                            <Button
                                asChild
                                variant="outline"
                                className="w-full mt-3 rounded-xl border-gray-300 text-gray-700 hover:text-brand-orange hover:border-brand-orange"
                            >
                                <Link
                                    href="/customer/home"
                                    onMouseEnter={prefetchShop}
                                    onTouchStart={prefetchShop}
                                >
                                    ກັບໄປຊື້ຂອງ
                                </Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
