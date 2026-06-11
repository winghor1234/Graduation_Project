"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

// Import UI Components & Contexts
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCustomer } from '@/components/customerComponent/CustomerContext';
import { useGetAllProducts } from '@/app/features/hooks/Product';

// ກຳນົດໂຄງສ້າງຂໍ້ມູນຄີຫຼັກຕາມ Prisma Database Model
interface ProductImage {
    image_id: string;
    image_url: string;
}

interface Category {
    category_id: string;
    category_name: string;
}

interface Product {
    product_id: string;
    product_code: string;
    product_name: string;
    sale_price: number;
    stock_qty: number;
    description: string | null;
    category: Category;
    images: ProductImage[];
}

export default function CartPage() {
    // ເອີ້ນໃຊ້ງານລະບົບກະຕ່າສິນຄ້າຝັ່ງ Customer Context
    const { cart, removeFromCart, updateCartQuantity } = useCustomer();
    const { data: apiResponse, isLoading } = useGetAllProducts();
    const router = useRouter();

    // ດຶງລາຍຊື່ຜະລິດຕະພັນຫຼັງບ້ານມາເກັບໄວ້ໃນອາເຣຍ໌
    const allProducts: Product[] = apiResponse || [];

    // 1. ນຳຂໍ້ມູນກະຕ່າໜ້າບ້าน (cart) ມາປະກອບເຂົ້າກັບຂໍ້ມູນລາຄາສິນຄ້າຈິງຈາກຖານຂໍ້ມູນ (allProducts)
    const cartItems = useMemo(() => {
        if (!cart) return [];
        return cart.map((item) => {
            const dbProduct = allProducts.find((p) => p.product_id === item.productId);
            return {
                ...item,
                product: dbProduct || null,
            };
        });
    }, [cart, allProducts]);

    // 2. ຄຳນວນລາຄາສິນຄ້າລວມທັງໝົດພາຍໃນກະຕ່າຜ່ານ useMemo
    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const price = item.product?.sale_price || 0;
            return sum + price * item.quantity;
        }, 0);
    }, [cartItems]);

    // ຕັ້ງຄ່າບໍລິການຈັດສົ່ງສິນຄ້າ (ກໍລະນີມີຍອດຊື້ເກີນ 0 ກີບ ແມ່ນຄິດຄ່າສົ່ງ 20,000 ກີບ ຫຼື ປັບເປັນສົ່ງຟຣີຕາມຕ້ອງການ)
    const shipping = subtotal > 0 ? 20000 : 0;
    const total = subtotal + shipping;

    // 🛑 ດັກຖ້າຈັງຫວະໂຫຼດຂໍ້ມູນຈາກ API ເພື່ອຄວາມຕໍ່ເນື່ອງຂອງໜ້າເວັບ
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-md font-medium text-gray-500 animate-pulse">
                ກຳລັງກວດສອບກະຕ່າສິນຄ້າ... 📦
            </div>
        );
    }

    // 🛑 ກໍລະນີກະຕ່າວ່າງເປົ່າ ບໍ່ມີສິນຄ້າຄ້າງຢູ່
    if (!cart || cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <ShoppingBag className="size-20 mx-auto mb-6 text-gray-300" />
                <h1 className="text-3xl font-bold mb-3 text-gray-900">ກະຕ່າສິນຄ້າຂອງທ່ານຍັງວ່າງເປົ່າ</h1>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-light">
                    ເບິ່ງຄືວ່າທ່ານຍັງບໍ່ທັນໄດ້ເລືອກຊື້ສິນຄ້າຊິ້ນໃດລົງໃນກະຕ່າເລີຍ ມາຮ່ວມຄົ້ນຫາຊຸດກິລາລະດັບພຣີມ່ຽມໄປພ້ອມກັບພວກເຮົາສິຄະ.
                </p>
                <Link href="/products">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                        ເລີ່ມຕົ້ນຊື້ສິນຄ້າ
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">ກະຕ່າສินຄ້າ (Shopping Cart)</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* ເບື້ອງຊ້າຍ: ລາຍການທັງໝົດໃນກະຕ່າສິນຄ້າ */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const { product } = item;
                            if (!product) return null; // ຂ້າມການສະແດงຜົນຫາກບໍ່ພົບສິນຄ້າໃນຄັງ

                            return (
                                <Card key={item.productId} className="border shadow-sm bg-white overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row gap-6">

                                            {/* ຮູບພາບສິນຄ້າ */}
                                            <div className="w-full sm:w-28 h-28 relative bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border">
                                                <Image
                                                    src={product.images?.[0]?.image_url || '/placeholder.png'}
                                                    alt={product.product_name}
                                                    fill
                                                    sizes="112px"
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* ຂໍ້ມູນຊື່ ແລະ ປຸ່ມຈັດການເພີ່ມ/ຫຼຸດຈຳນວນ */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <Link href={`/products/${product.product_id}`} className="font-semibold text-lg text-gray-900 hover:text-blue-600 hover:underline transition-colors line-clamp-1">
                                                            {product.product_name}
                                                        </Link>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {product.category?.category_name || "ຊຸດກິລາ (Sportswear)"}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeFromCart(item.productId)}
                                                        className="text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-full"
                                                    >
                                                        <Trash2 className="size-5" />
                                                    </Button>
                                                </div>

                                                <div className="flex items-center justify-between mt-6 gap-4">
                                                    {/* ປຸ່ມປັບປ່ຽນຈຳນວນສິນຄ້າ */}
                                                    <div className="flex items-center gap-2 border rounded-lg bg-white p-1 shadow-sm">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 rounded-md"
                                                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="size-3.5" />
                                                        </Button>
                                                        <span className="text-sm font-semibold w-8 text-center text-gray-900">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 rounded-md"
                                                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                                                            disabled={item.quantity >= product.stock_qty}
                                                        >
                                                            <Plus className="size-3.5" />
                                                        </Button>
                                                    </div>

                                                    {/* ລາຄາລວມຂອງແຕ່ລະລາຍການ */}
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-gray-900">
                                                            { (product.sale_price * item.quantity).toLocaleString() } ກີບ
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            { product.sale_price.toLocaleString() } ກີບ / ຊິ້ນ
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* ເບື້ອງຂວາ: ກ່ອງສະຫຼຸບລາຍລະອຽດລາຄາທັງໝົດ (Order Summary) */}
                    <div className="sticky top-24">
                        <Card className="border shadow-sm bg-white">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-6 text-gray-900 tracking-tight">ສະຫຼຸບການສັ່ງຊື້ (Order Summary)</h2>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>ຍອດລວມສິນຄ້າ</span>
                                        <span className="font-semibold text-gray-900">
                                            {subtotal.toLocaleString()} ກີບ
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>ຄ່າຈັດສົ່ງສິນຄ້າ</span>
                                        <span className="font-semibold text-gray-900">
                                            {shipping > 0 ? `${shipping.toLocaleString()} ກີບ` : "ສົ່ງຟຣີ"}
                                        </span>
                                    </div>

                                    <Separator className="my-2" />

                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-base font-bold text-gray-900">ຍອດຊຳລະສຸດທິ</span>
                                        <span className="text-2xl font-extrabold text-blue-600">
                                            {total.toLocaleString()} ກีບ
                                        </span>
                                    </div>
                                </div>

                                {/* ປຸ່ມໄປຫາຂັ້ນຕອນຖັດໄປ */}
                                <Button
                                    size="lg"
                                    className="w-full mt-6 mb-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
                                    onClick={() => router.push('/checkout')}
                                >
                                    ຊຳລະເງິນ 
                                </Button>

                                <Link href="/products" passHref>
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
    );
}