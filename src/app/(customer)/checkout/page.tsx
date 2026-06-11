"use client";

import React, { useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useAuthMe } from '@/app/features/hooks/Auth';
import { useCreateOrder } from '@/app/features/hooks/Order';
import { useGetAllProvince } from '@/app/features/hooks/Location';

type User = {
    customer_id: string;
    role: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

type Province = {
    province_id: string;
    province_name: string;
    districts: {
        district_id: string;
        district_name: string;
        branches: { // 💡 แก้ไขตัวสะกดจาก branchs เป็น branches ให้ตรงกับ Data จริงหลังบ้าน
            branch_id: string;
            branch_name: string;
            district_id: string;
            createdAt?: string;
            updatedAt?: string;
        }[];
        createdAt?: string;
        updatedAt?: string;
    }[];
    addressBranches?: any[];
    createdAt?: string;
    updatedAt?: string;
}

// 🛡️ 1. ກຳນົດ Zod Schema ໃຫ້ກົງຕາມຂໍ້ມູນຟອມ
const checkoutSchema = z.object({
    province_id: z.string().min(1, 'ກະລຸນາລະບຸແຂວງ'),
    district_id: z.string().min(1, 'ກະລຸນาລະບຸເມືອງ'),
    branch_id: z.string().min(1, 'ກະລຸນາລະບຸສາຂາ'),
    paymentSlip: z.any().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const { cart, clearCart } = useCustomer();
    const { data: apiAllProducts, isLoading } = useGetAllProducts();
    const { data: provincesData, isLoading: isLoadingProvinces } = useGetAllProvince();

    const provinces = provincesData as Province[];
    const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder();
    const router = useRouter();

    const userData = useAuthMe();
    const user: User = userData?.user;

    // ⚡ 2. ປະກາດໃຊ້ງານ React Hook Form ພ້ອມກຳນົດຄ່າເລີ່ມຕົ້ນ
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            province_id: '',
            district_id: '',
            branch_id: ''
        }
    });

    // ==========================================
    // 🔄 ຕັກກະຄັດກອງຂໍ້ມູນ Dropdown ສຳພັນ (Cascading Dropdown)
    // ==========================================

    // ຕິດຕາມຄ່າ ID ທີ່ຖືກເລືອກໃນ Dropdown ປັດຈຸບັນ
    const selectedProvinceId = watch('province_id');
    const selectedDistrictId = watch('district_id');

    // 🔍 ດຶງຂໍ້ມູນ "ແຂວງ" ທີ່ເລືອກ ເພື່ອນຳໄປໃຊ້ດຶງລາຍຊື່ເມືອງຂ້າງໃນ
    const selectedProvinceData = useMemo(() => {
        if (!provinces || !selectedProvinceId) return null;
        return provinces.find((p) => p.province_id === selectedProvinceId);
    }, [provinces, selectedProvinceId]);

    // 🔍 ດຶงຂໍ້ມູນ "ເມືອງ" ທີ່ເລືອກ ເພື່ອນຳໄປໃຊ້ດຶງລายຊື່ສາຂາຂ້າງໃນ
    const selectedDistrictData = useMemo(() => {
        if (!selectedProvinceData || !selectedDistrictId) return null;
        return selectedProvinceData.districts?.find((d) => d.district_id === selectedDistrictId);
    }, [selectedProvinceData, selectedDistrictId]);

    // 🧼 ລ້າງຄ່າເມືອງ ແລະ ສາຂາທັນທີ ເມື່ອຜູ້ໃຊ້ງານທຳການປ່ຽນແຂວງໃໝ່
    useEffect(() => {
        setValue('district_id', '');
        setValue('branch_id', '');
    }, [selectedProvinceId, setValue]);

    // 🧼 ล້າງຄ່າສາຂາທันທີ ເມື່ອຜູ້ໃຊ້ງານທຳການປ່ຽນເມືອງໃໝ່
    useEffect(() => {
        setValue('branch_id', '');
    }, [selectedDistrictId, setValue]);

    // ==========================================

    // ກວດຈັບໄຟລ໌ສະລິບເພື່ອນຳມາທຳພຣີວິວຮູບພາບ
    const currentSlipFile = watch('paymentSlip');

    const previewUrl = useMemo(() => {
        if (currentSlipFile instanceof File) {
            return URL.createObjectURL(currentSlipFile);
        }
        return '';
    }, [currentSlipFile]);

    const allProducts = (apiAllProducts || []) as Product[];

    // 1. ນຳຂໍ້ມູນກະຕ່າໜ້າບ້ານມາລວມຕັກກະຣາຄາ ແລະ ພາບຖ່າຍຈິງຮ່ວມກັບສາງສິນຄ້າຫຼັງບ້ານ
    const cartItems = useMemo(() => {
        if (!cart?.length) return [];

        const mergedCart = Object.values(
            cart.reduce((acc, item) => {
                if (!item.productId) return acc;

                if (acc[item.productId]) {
                    acc[item.productId].quantity += item.quantity;
                } else {
                    acc[item.productId] = { ...item };
                }

                return acc;
            }, {} as Record<string, typeof cart[number]>)
        );

        return mergedCart.map((item) => {
            const dbProduct = allProducts.find(
                (p) => p.product_id === item.productId
            );

            return {
                ...item,
                product: dbProduct ?? null,
            };
        });
    }, [cart, allProducts]);
    console.log("cart item ; ", cartItems)

    // 2. ຄຳນວນລາຄາຍອດລວມສິນຄ້າທັງໝົດ
    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const price = item.product?.sale_price || 0;
            return sum + price * item.quantity;
        }, 0);
    }, [cartItems]);

    const shipping = subtotal > 0 ? 100 : 0; // ຍອດຄ່າຈັດສົ່ງແບບສະກຸນເງິນບາດ ฿100
    const total = subtotal + shipping;

    // 3. ໃຊ້ useEffect ດີດໜ້າເວັບກັບໄປທີ່ກະຕ່າຫາກບໍ່ມີສິນຄ້າຄ້າງຢູ່
    useEffect(() => {
        if (!isLoading && (!cart || cart.length === 0)) {
            router.push('/cart');
        }
    }, [cart, isLoading, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('paymentSlip', file, { shouldValidate: true });
        }
    };

    // 🚀 4. ຟັງຊັນສົ່ງຂໍ້ມູນເມື່ອຜ່ານເກນເງື່ອນໄຂຂອງ Schema ທັງໝົດແລ້ວ
    const onFormSubmit = (data: CheckoutFormData) => {
        console.log("data : ", user);
        const bodyFormData = new FormData();
        bodyFormData.append("customer_id", user?.customer_id || "");
        bodyFormData.append("method", "TRANSFER");
        bodyFormData.append("amount", String(total));
        bodyFormData.append("province_id", data.province_id);
        bodyFormData.append("district_id", data.district_id);
        bodyFormData.append("branch_id", data.branch_id);

        const orderDetailsPayload = cartItems.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.product?.sale_price || 0,
        }));
        console.log("order detail : ", orderDetailsPayload);
        bodyFormData.append("order_details", JSON.stringify(orderDetailsPayload));

        if (data.paymentSlip) {
            bodyFormData.append("file", data.paymentSlip);
        }

        // ເອີ້ນໃຊ້ Mutation ຂອງ React Query ເພື່ອບັນທຶກຂໍ້ມູນ
        createOrder(bodyFormData, {
            onSuccess: () => {
                clearCart();
                toast.success('ທຳການສັ່ງຊື້ສິນຄ້າສຳເລັດຮຽບຮ້ອຍແລ້ວ! 🎉');
                router.push('/products');
            },
            onError: (error) => {
                toast.error(error?.message || 'ເກີດຂໍ້ຜິດພາດໃນການສັ່ງຊື້ສິນຄ້າ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ ❌');
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-md font-medium text-gray-500 animate-pulse">
                ກຳລັງຈັດຕຽມໜ້າລາຍການສັ່ງຊື້... 📦
            </div>
        );
    }

    if (!cart || cart.length === 0) return null;
    if (isLoadingProvinces) return (
        <div className="flex h-screen items-center justify-center text-md font-medium text-gray-500 animate-pulse">
            ກຳລັງດຶງຂໍ້ມູນແຂວງ... 📦
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">Checkout</h1>

                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* ຊີກຊ້າຍ: ຟອມກອກທີ່ຢູ່ ແລະ ອັບໂຫລດຫຼັກຖານສະລິບ */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* ຂໍ້ມູນທີ່ຢູ່ລູກຄ້າ ແລະ ສາຂາ */}
                            <Card className="border shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Branch & Location Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">

                                    {/* 🗺️ 1. SELECT PROVINCE */}
                                    <div>
                                        <Label htmlFor="province_id" className="text-gray-700">Province *</Label>
                                        <select
                                            id="province_id"
                                            {...register('province_id')}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <option value="">-- Select Province --</option>
                                            {provinces?.map((prov) => (
                                                <option key={prov.province_id} value={prov.province_id}>
                                                    {prov.province_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.province_id && (
                                            <p className="text-xs text-destructive mt-1">{errors.province_id.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                        {/* 🏙️ 2. SELECT DISTRICT */}
                                        <div>
                                            <Label htmlFor="district_id" className="text-gray-700">District *</Label>
                                            <select
                                                id="district_id"
                                                {...register('district_id')}
                                                disabled={!selectedProvinceId} // ລັອກໄວ້ຖ້າຍັງບໍ່ເລືອກແຂວງ
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="">-- Select District --</option>
                                                {/* ວົນລູບສະແດງເມືອງສະເພາະທີ່ສັງກັດຢູ່ໃນແຂວງທີ່ເລືອກເທົ່ານັ້ນ */}
                                                {selectedProvinceData?.districts?.map((dist) => (
                                                    <option key={dist.district_id} value={dist.district_id}>
                                                        {dist.district_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.district_id && (
                                                <p className="text-xs text-destructive mt-1">{errors.district_id.message}</p>
                                            )}
                                        </div>

                                        {/* 🏢 3. SELECT BRANCH */}
                                        <div>
                                            <Label htmlFor="branch_id" className="text-gray-700">Branch *</Label>
                                            <select
                                                id="branch_id"
                                                {...register('branch_id')}
                                                disabled={!selectedDistrictId} // ລັອກໄວ້ຖ້າຍັງບໍ່ເລືອກເມືອງ
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="">-- Select Branch --</option>
                                                {/* ວົນລູບສະແດງສາຂາສະເພາະທີ່ສັງກັດຢູ່ໃນເມືອງທີ່ເລືອກເທົ່ານັ້ນ */}
                                                {selectedDistrictData?.branches?.map((branch) => (
                                                    <option key={branch.branch_id} value={branch.branch_id}>
                                                        {branch.branch_name}
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

                            {/* ຄຳແນະນຳການໂອນເງິນຊຳລະເງິນ */}
                            <Card className="border shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <CreditCard className="size-5 text-blue-600" />
                                        Payment Instructions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5">
                                        <h4 className="font-semibold text-blue-900 mb-2">ຂໍ້ມູນບັນຊີທະນາຄານສຳລັບໂອນເງິນ:</h4>
                                        <div className="space-y-1.5 text-sm text-blue-800">
                                            <p>ທະນາຄານ: SportPro Bank (ທະນາຄານເພື່ອການກິລາ)</p>
                                            <p>ເລກທີບັນຊີ: 123-456-7890</p>
                                            <p>ຊື່ບັນຊີ: SportPro E-Commerce Co., Ltd.</p>
                                            <p className="font-bold text-base text-gray-900 mt-3 pt-2 border-t border-blue-200/50">
                                                ຍອດເງິນທີ່ຕ້ອງໂอนຊຳລະ: <span className="text-blue-600 text-lg">฿{total.toLocaleString()}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-amber-900 mb-1">
                                            ⚠️ ສຳຄັນ: ກະລຸນາແນບຫຼັກຖານການໂອນເງິນ (ສະລິບ) ທຸກຄັ້ງຫຼັງໂອນສຳເລັດ
                                        </p>
                                        <p className="text-xs text-amber-800 font-light leading-relaxed">
                                            ລະບົບຈະທຳການກວດສອບ ແລະ ອະນຸມັດຍອດຈັດສົ່ງສິນຄ້າຂອງທ່ານທັນທີເມື່ອໄດ້ຮັບໄຟລ໌ຫຼັກຖານນີ້ ໂດຍປົກກະຕິຈະດຳເນີນການໃຫ້ສຳເລັດພາຍໃນ 24 ຊົ່ວໂມງ
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ພື້ນທີ່ສຳລັບອັບໂຫລດຫຼັກຖານສະລິບໂອນເງິນ */}
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
                                                        <CheckCircle className="size-4" /> ແנบຫຼັກຖານສະລິບໂອນเງິນຮຽບຮ້ອຍແລ້ວ
                                                    </p>
                                                    <Button type="button" variant="outline" size="sm" className="text-gray-600">
                                                        ປ່ຽນຮູບພາບຫຼັກຖານ
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="py-4">
                                                    <Upload className="size-10 mx-auto mb-3 text-gray-400" />
                                                    <p className="text-base font-semibold text-gray-800 mb-1">
                                                        ຄລິກທີ່ນີ້ເພື່ອເລືອກໄຟລ໌ພາບສະລິບໂອນເງິນ
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        ຮອງຮັບໄຟລ໌ຮູບພາບສາກົນ PNG, JPG ຂະໜາດສູงສຸດບໍ່ເກີນ 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ຊີກຂວາ: ຕາຕະລາງບິນສະຫຼຸບລາຍການສິນຄ້າ ແລະ ຍອດລາຄາສຸດທິ (Order Summary) */}
                        <div className="sticky top-24">
                            <Card className="border shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">

                                    {/* ລາຍຊື່ສະຫຼຸບສິນຄ້າທັງໝົດໃນບິນ */}
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
                                                            ຈຳນວນ: {item.quantity} ຊິ້ນ
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

                                    {/* ຄຳແນະນຳຄ່າຕົວເລກຜົນລວມຜົນລັບສຸດທິ */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-500">
                                            <span>ຍອດລວມສິນຄ້າ</span>
                                            <span className="font-semibold text-gray-900">฿{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>ຄ່າຈັດສົ່ງສິນຄ້າ</span>
                                            <span className="font-semibold text-gray-900">฿{shipping.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Separator className="bg-gray-100" />

                                    <div className="flex justify-between items-end pt-1">
                                        <span className="text-base font-bold text-gray-900">ຍອດຊຳລະສຸດທິ</span>
                                        <span className="text-xl font-extrabold text-blue-600">฿{total.toLocaleString()}</span>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
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
    );
}