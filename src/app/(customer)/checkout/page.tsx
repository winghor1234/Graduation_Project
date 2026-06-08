"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

// Import UI Components & Contexts
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCustomer } from '@/components/customerComponent/CustomerContext';
import { useGetAllProducts } from '@/app/features/hooks/Product';
import { Product } from '@/components/adminComponent/products/ProductType';

export default function CheckoutPage() {
    const { cart, clearCart, addOrder } = useCustomer();
    const { data: apiAllProducts, isLoading } = useGetAllProducts();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const allProducts = (apiAllProducts?.data || apiAllProducts || []) as Product[];

    // 1. นำข้อมูลตะกร้าหน้าบ้านมารวมตรรกะราคาและภาพถ่ายจริงร่วมกับคลังสินค้าหลังบ้าน
    const cartItems = useMemo(() => {
        if (!cart) return [];
        return cart.map((item) => {
            const dbProduct = allProducts.find((p) => p.product_id === item.productId);
            return { ...item, product: dbProduct || null };
        });
    }, [cart, allProducts]);

    // 2. คำนวณราคายอดรวมสินค้าพรีเมียมทั้งหมด
    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const price = item.product?.sale_price || 0;
            return sum + price * item.quantity;
        }, 0);
    }, [cartItems]);

    const shipping = subtotal > 0 ? 100 : 0; // ยอดค่าจัดส่งแบบสกุลเงินบาท ฿100
    const total = subtotal + shipping;

    // 3. ใช้ useEffect ดีดหน้าเว็บกลับไปที่ตะกร้าหากไม่มีสิ่งของค้างอยู่ (ถูกหลักโครงสร้างสั่งงาน)
    useEffect(() => {
        if (!isLoading && (!cart || cart.length === 0)) {
            router.push('/cart');
        }
    }, [cart, isLoading, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentSlip(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            toast.error('กรุณากรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วนครับ');
            return;
        }

        // ฟอร์มจัดรูปแบบออเดอร์ส่งบันทึกเข้าฐานข้อมูลหลังบ้าน
        const order = {
            id: `ORD-${Date.now()}`,
            customerId: 'cust-' + Date.now(),
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product?.sale_price || 0,
            })),
            total,
            status: paymentSlip ? 'PENDING_VERIFICATION' : 'WAITING_PAYMENT',
            paymentStatus: paymentSlip ? 'PENDING' : 'PENDING',
            paymentSlip: previewUrl || undefined,
            createdAt: new Date().toISOString(),
            address: formData.address,
        } as const;

        if (typeof addOrder === 'function') addOrder(order);
        clearCart();
        toast.success('ทำการสั่งซื้อสินค้าเรียบร้อยแล้วครับ! 🎉');
        router.push('/products');
    };

    // ดักรอจังหวะโหลดข้อมูลสั้นๆ ป้องกันหน้าบิดเบี้ยว
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-md font-medium text-gray-500 animate-pulse">
                กำลังจัดเตรียมหน้ารายการสั่งซื้อ... 📦
            </div>
        );
    }

    if (!cart || cart.length === 0) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* ซีกซ้าย: ฟอร์มกรอกที่อยู่และอัพโหลดหลักฐานสลิป */}
                        <div className="lg:col-span-2 space-y-6">

                            {/*ข้อมูลลูกค้า */}
                            <Card className="border shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Customer Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="email" className="text-gray-700">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="text-gray-700">Phone *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="address" className="text-gray-700">Shipping Address *</Label>
                                        <Textarea
                                            id="address"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            className="mt-1.5 resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* คำแนะนำการโอนเงินชำระเงิน */}
                            <Card className="border shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <CreditCard className="size-5 text-blue-600" />
                                        Payment Instructions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5">
                                        <h4 className="font-semibold text-blue-900 mb-2">ข้อมูลบัญชีธนาคารสำหรับโอนเงิน:</h4>
                                        <div className="space-y-1.5 text-sm text-blue-800">
                                            <p>ธนาคาร: SportPro Bank (ธนาคารเพื่อการกีฬา)</p>
                                            <p>เลขที่บัญชี: 123-456-7890</p>
                                            <p>ชื่อบัญชี: SportPro E-Commerce Co., Ltd.</p>
                                            <p className="font-bold text-base text-gray-900 mt-3 pt-2 border-t border-blue-200/50">
                                                ยอดเงินที่ต้องโอนชำระ: <span className="text-blue-600 text-lg">฿{total.toLocaleString()}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-amber-900 mb-1">
                                            ⚠️ สำคัญ: โปรดแนบหลักฐานการโอนเงิน (สลิป) ทุกครั้งหลังโอนเสร็จ
                                        </p>
                                        <p className="text-xs text-amber-800 font-light leading-relaxed">
                                            ระบบจะทำการตรวจสอบและอนุมัติยอดจัดส่งสินค้าของท่านทันทีเมื่อได้รับไฟล์หลักฐานชิ้นนี้ โดยปกติจะดำเนินการเสร็จสิ้นภายใน 24 ชั่วโมงครับ
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* พื้นที่สำหรับอัพโหลดหลักฐานสลิปโอนเงิน */}
                            <Card className="border shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <Upload className="size-5 text-gray-500" />
                                        Upload Payment Slip
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl p-6 text-center transition-colors bg-gray-50/50">
                                        <input
                                            type="file"
                                            id="payment-slip"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="payment-slip" className="cursor-pointer block">
                                            {previewUrl ? (
                                                <div className="space-y-3">
                                                    <div className="max-w-xs mx-auto relative h-64 border rounded-lg overflow-hidden bg-white shadow-sm">
                                                        <Image
                                                            src={previewUrl}
                                                            alt="Payment slip preview"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <p className="text-sm font-medium text-emerald-600 flex items-center justify-center gap-1.5">
                                                        <CheckCircle className="size-4" /> แนบหลักฐานสลิปโอนเงินเรียบร้อยแล้ว
                                                    </p>
                                                    <Button type="button" variant="outline" size="sm" className="text-gray-600">
                                                        เปลี่ยนรูปภาพหลักฐาน
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="py-4">
                                                    <Upload className="size-10 mx-auto mb-3 text-gray-400" />
                                                    <p className="text-base font-semibold text-gray-800 mb-1">
                                                        คลิกที่นี่เพื่อเลือกไฟล์ภาพสลิปโอนเงิน
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        รองรับไฟล์ไฟล์รูปภาพสากล PNG, JPG ขนาดสูงสุดไม่เกิน 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ซีกขวา: ตารางบิลสรุปรายการสิ่งของและยอดราคาสุทธิ (Order Summary) */}
                        <div className="sticky top-24">
                            <Card className="border shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">

                                    {/* รายชื่อสรุปสิ่งของทั้งหมดในบิล */}
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                        {cartItems.map((item) => {
                                            if (!item.product) return null;
                                            return (
                                                <div key={item.productId} className="flex gap-3 items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                                                    <div className="w-12 h-12 relative bg-gray-50 rounded border overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={item.product.images?.[0]?.image_url || '/placeholder.png'}
                                                            alt={item.product.product_name}
                                                            fill
                                                            sizes="48px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-900 truncate">
                                                            {item.product.product_name}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                                            จำนวน: {item.quantity} ชิ้น
                                                        </p>
                                                        <p className="text-xs font-bold text-gray-700 mt-0.5">
                                                            ฿{(item.product.sale_price * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Separator className="bg-gray-100" />

                                    {/* คำนวณค่าตัวเลขผลรวมผลลัพธ์สุทธิ */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-500">
                                            <span>ยอดรวมสินค้า</span>
                                            <span className="font-semibold text-gray-900">฿{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>ค่าจัดส่งสินค้า</span>
                                            <span className="font-semibold text-gray-900">฿{shipping.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Separator className="bg-gray-100" />

                                    <div className="flex justify-between items-end pt-1">
                                        <span className="text-base font-bold text-gray-900">ยอดชำระสุทธิ</span>
                                        <span className="text-xl font-extrabold text-blue-600">฿{total.toLocaleString()}</span>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors mt-2 shadow-sm">
                                        ยืนยันการสั่งซื้อสินค้า
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}