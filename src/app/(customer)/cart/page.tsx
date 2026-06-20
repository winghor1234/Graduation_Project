"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCustomer } from "@/components/customerComponent/CustomerContext"
import { formatCurrency } from "@/utils/FormatCurrency"

export default function CartPage() {
    const { cart, removeFromCart, updateCartQuantity, cartTotal } = useCustomer()
    const router = useRouter()

    const shipping = cartTotal > 0 ? 20000 : 0
    const total = cartTotal + shipping

    if (!cart.length) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <ShoppingBag className="size-20 mx-auto mb-6 text-gray-300" />
                <h1 className="text-3xl font-bold mb-3 text-gray-900">ກະຕ່າສິນຄ້າຂອງທ່ານຍັງວ່າງເປົ່າ</h1>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-light">
                    ເບິ່ງຄືວ່າທ່ານຍັງບໍ່ທັນໄດ້ເລືອກຊື້ສິນຄ້າຊິ້ນໃດລົງໃນກະຕ່າເລີຍ
                </p>
                <Link href="/products">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                        ເລີ່ມຕົ້ນຊື້ສິນຄ້າ
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">ກະຕ່າສິນຄ້າ</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT: cart items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <Card key={item.variant_id} className="border shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-6">

                                        <div className="w-full sm:w-28 h-28 relative bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border">
                                            <Image
                                                src={item.image_url || "/placeholder.png"}
                                                alt={item.product_name}
                                                fill
                                                sizes="112px"
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <Link
                                                        href={`/product/${item.product_id}`}
                                                        className="font-semibold text-lg text-gray-900 hover:text-blue-600 hover:underline transition-colors line-clamp-1"
                                                    >
                                                        {item.product_name}
                                                    </Link>
                                                    {/* ✅ variant info */}
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {item.color} / {item.size}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFromCart(item.variant_id)}
                                                    className="text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-full"
                                                >
                                                    <Trash2 className="size-5" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between mt-6 gap-4">
                                                <div className="flex items-center gap-2 border rounded-lg bg-white p-1 shadow-sm">
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        className="size-8 rounded-md"
                                                        onClick={() => updateCartQuantity(item.variant_id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="size-3.5" />
                                                    </Button>
                                                    <span className="text-sm font-semibold w-8 text-center text-gray-900">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        className="size-8 rounded-md"
                                                        onClick={() => updateCartQuantity(item.variant_id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.stock_qty}
                                                    >
                                                        <Plus className="size-3.5" />
                                                    </Button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-gray-900">
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
                        <Card className="border shadow-sm bg-white">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-6 text-gray-900 tracking-tight">ສະຫຼຸບການສັ່ງຊື້</h2>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>ຍອດລວມສິນຄ້າ</span>
                                        <span className="font-semibold text-gray-900">{formatCurrency(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>ຄ່າຈັດສົ່ງສິນຄ້າ</span>
                                        <span className="font-semibold text-gray-900">
                                            {shipping > 0 ? formatCurrency(shipping) : "ສົ່ງຟຣີ"}
                                        </span>
                                    </div>

                                    <Separator className="my-2" />

                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-base font-bold text-gray-900">ຍອດຊຳລະສຸດທິ</span>
                                        <span className="text-2xl font-extrabold text-blue-600">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full mt-6 mb-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
                                    onClick={() => router.push("/checkout")}
                                >
                                    ຊຳລະເງິນ
                                </Button>

                                <Link href="/products">
                                    <Button variant="outline" className="w-full text-gray-600 hover:bg-gray-50">
                                        ກັບໄປຊື້ຂອງ
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}