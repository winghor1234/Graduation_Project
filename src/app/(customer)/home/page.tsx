"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

// Import UI Components & Contexts
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCustomer } from '@/components/customerComponent/CustomerContext';
import { useGetAllProducts } from '@/app/features/hooks/Product';

// กำหนด Type Interface ตามโครงสร้างของ Prisma Database จริง
interface ProductImage {
    image_id: string;
    image_url: string;
}

interface Category {
    category_id: string;
    category_name: string;
    description: string | null;
}

interface Product {
    product_id: string;
    product_code: string;
    product_name: string;
    sale_price: number;
    stock_qty: number;
    description: string | null;
    featured?: boolean;
    category_id: string;
    category: Category;
    images: ProductImage[];
}

export default function HomePage() {
    const { addToCart } = useCustomer();
    const { data: apiResponse, isLoading, error } = useGetAllProducts();

    // 📦 แกะข้อมูลสินค้าเตรียมไว้ล่วงหน้า (ถ้าข้อมูลยังไม่มา ให้ดักเป็นอาเรย์ว่างเพื่อป้องกัน Error)
    const products: Product[] = apiResponse || [];
    // console.log("product ; ",products);

    // ✨ [แก้ไขตามกฎ Rules of Hooks] ย้าย useMemo ขึ้นมาประกาศไว้ด้านบนสุดร่วมกันทันที ห้ามมี if คั่น
    // 1. กรองสินค้าแนะนำ (Featured Products)
    const featuredProducts = useMemo(() => {
        const filtered = products.filter((product) => product.featured);
        return filtered.length > 0 ? filtered : products.slice(0, 4);
    }, [products]);

    // 2. ดึงข้อมูลหมวดหมู่สินค้าแบบ Dynamic ไม่ให้ซ้ำกันโดยใช้ข้อมูลตรงจากฐานข้อมูลสินค้า
    const categories = useMemo(() => {
        const uniqueCategoriesMap = new Map<string, { name: string; image: string; link: string }>();

        products.forEach((product) => {
            if (product.category && !uniqueCategoriesMap.has(product.category.category_id)) {
                // เอารูปภาพแรกสุดของสินค้าในหมวดหมู่นั้นๆ มาทำเป็นภาพหน้าปก Category
                const categoryImage = product.images?.[0]?.image_url || '/placeholder.png';

                uniqueCategoriesMap.set(product.category.category_id, {
                    name: product.category.category_name,
                    image: categoryImage,
                    link: `/products?category=${product.category.category_id}`,
                });
            }
        });

        return Array.from(uniqueCategoriesMap.values());
    }, [products]);


    // 🛑 [Early Return] ประกาศตรวจสอบสถานะแอปพลิเคชันไว้หลังจากรันกลุ่ม Hooks ทั้งหมดเสร็จสิ้นแล้ว
    // ตรวจสอบสถานะกำลังโหลดข้อมูล
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-lg font-medium text-gray-500 animate-pulse">
                กำลังดึงข้อมูลสินค้าจากหลังบ้าน... 📦
            </div>
        );
    }

    // ตรวจสอบสถานะกรณีเกิดข้อผิดพลาดในการดึงข้อมูลจาก API
    if (error || !apiResponse) {
        return (
            <div className="flex h-screen items-center justify-center text-lg font-medium text-destructive">
                เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า กรุณาลองใหม่อีกครั้งครับ ❌
            </div>
        );
    }

    // Handler ฟังก์ชันสำหรับดักจับการหยิบของใส่ตะกร้าสินค้าของลูกค้า
    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault(); // ป้องกันไม่ให้การกดปุ่มนี้ไปลิ้งก์เปิดหน้ารายละเอียดสินค้ากวนใจ
        addToCart(product.product_id, 1);
        toast.success(`เพิ่ม ${product.product_name} ลงตะกร้าแล้วครับ! 🛒`);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Banner Section */}
            <section className="relative h-[600px] bg-black text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1762709553300-342ab94e8b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)',
                    }}
                />
                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl">
                        <Badge className="mb-4 bg-white text-black hover:bg-white/90">
                            New Season Collection
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                            Unleash Your Athletic Potential
                        </h1>
                        <p className="text-xl mb-8 text-gray-300 font-light">
                            Premium sportswear designed for champions. Experience comfort, style, and performance.
                        </p>
                        <Link href="/shop" passHref>
                            <Button size="lg" className="text-lg px-8 py-6">
                                Shop Now
                                <ArrowRight className="ml-2 size-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Featured Products</h2>
                            <p className="text-gray-500 mt-1">Our best-selling items this season</p>
                        </div>
                        <Link href="/shop" passHref>
                            <Button variant="outline" className="w-full sm:w-auto">
                                View All
                                <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <Card
                                key={product.product_id}
                                className="group border shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden bg-white flex flex-col justify-between"
                            >
                                <Link href={`/product/${product.product_id}`} className="flex-1">
                                    <div className="aspect-square relative overflow-hidden bg-gray-50">
                                        <Image
                                            src={product.images?.[0]?.image_url ?? '/placeholder.png'}
                                            alt={product.product_name}
                                            fill
                                            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
                                            className="object-cover group-hover:scale-102 transition-transform duration-300"
                                            priority={false}
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold mb-1 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                            {product.product_name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                                            {product.description || "ไม่มีรายละเอียดสินค้า"}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-lg font-bold text-gray-900">
                                                ฿{product.sale_price.toLocaleString()}
                                            </span>
                                            <Badge variant={product.stock_qty > 0 ? 'secondary' : 'destructive'}>
                                                {product.stock_qty > 0 ? 'In Stock' : 'Out of Stock'}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Link>

                                <div className="p-4 pt-0">
                                    <Button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={product.stock_qty <= 0}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                    >
                                        หยิบใส่ตะกร้า
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Categories Section */}
            {categories.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 tracking-tight">Shop by Category</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.link}
                                    className="group relative h-80 overflow-hidden rounded-xl block shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="(max-w-768px) 100vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors flex items-end p-8">
                                        <h3 className="text-2xl font-bold text-white tracking-wide">
                                            {category.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Promotional Banner */}
            <section className="py-20 bg-black text-white relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        <TrendingUp className="size-12 mx-auto mb-6 text-blue-500" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                            Join SportPro Rewards
                        </h2>
                        <p className="text-lg text-gray-400 mb-8 font-light">
                            Get exclusive access to new products, special offers, and member-only events.
                        </p>
                        <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100 font-medium">
                            Sign Up Now
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}