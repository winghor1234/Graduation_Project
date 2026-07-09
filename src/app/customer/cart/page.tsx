


"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { formatCurrency } from "@/utils/FormatCurrency"

export default function CartPage() {
    const { cart, removeFromCart, updateCartQuantity, cartTotal } = useCustomer()
    const router = useRouter()

    const total = cartTotal

    // ⚡ Prefetch หน้า checkout ทันทีที่เข้าหน้า cart
    // เพราะ router.push() ไม่ prefetch ให้เอง (ต่างจาก <Link>)
    useEffect(() => {
        router.prefetch("/customer/checkout")
    }, [router])

    // ⚡ Prefetch หน้า shop ตอนเมาส์ชี้ / นิ้วแตะ
    const prefetchShop = () => {
        router.prefetch("/customer/home")
        // 💡 ถ้าหน้า /shop ใช้ React Query ดึงสินค้า เปิดคอมเมนต์นี้
        //    เพื่อโหลด "ข้อมูล" ล่วงหน้าด้วย (ต้องมี QueryClientProvider):
        //
        // queryClient.prefetchQuery({
        //     queryKey: ["products"],
        //     queryFn: getProducts,
        //     staleTime: 60 * 1000,
        // })
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
                    {/* ✅ asChild: รวม Link+Button เป็น element เดียว ไม่ซ้อน <a><button> */}
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
                <h1 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">ກະຕ່າສິນຄ້າ</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT: cart items */}
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
                                                // ⚡ 3 รูปแรกอยู่บนจอ ให้โหลดก่อน ที่เหลือ lazy อัตโนมัติ
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
                    </div>

                    {/* RIGHT: summary */}
                    <div className="sticky top-24">
                        <Card className="border border-gray-200 bg-white shadow-sm rounded-2xl">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-6 text-gray-900 tracking-tight">ສະຫຼຸບການສັ່ງຊື້</h2>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>ຍອດລວມສິນຄ້າ</span>
                                        <span className="font-semibold text-gray-900">{formatCurrency(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-xs">
                                        <span>ຄ່າຂົນສົ່ງ</span>
                                        <span>ລູກຄ້າຮັບຜິດຊອບເອງ</span>
                                    </div>

                                    <Separator className="bg-gray-100" />

                                    <div className="flex justify-between items-end pt-1">
                                        <span className="text-base font-bold text-gray-900">ຍອດຊຳລະ</span>
                                        <span className="text-2xl font-extrabold text-brand-orange">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>

                                {/* ✅ เปลี่ยนจาก router.push เป็น Link เพื่อได้ prefetch อัตโนมัติ */}
                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full mt-6 mb-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold transition-all duration-200 shadow-md active:scale-[0.98] rounded-xl"
                                >
                                    <Link href="/customer/checkout">ຊຳລະເງິນ</Link>
                                </Button>

                                {/* ✅ แก้ text-white → มองเห็นตัวหนังสือแล้ว + prefetch ตอน hover */}
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full rounded-xl border-gray-300 text-gray-700 hover:text-brand-orange hover:border-brand-orange"
                                >
                                    <Link
                                        href="/customer/home"
                                        onMouseEnter={prefetchShop}
                                        onTouchStart={prefetchShop}
                                        className="text-white"
                                    >
                                        ກັບໄປຊື້ຂອງ
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
