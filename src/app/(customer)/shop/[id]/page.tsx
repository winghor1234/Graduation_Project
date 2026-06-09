"use client";

import React, { useState, use, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCustomer } from '@/components/customerComponent/CustomerContext';
import { useGetProduct, useGetAllProducts } from '@/app/features/hooks/Product';
import { Product } from '@/components/adminComponent/products/ProductType';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    // เปลี่ยนชื่อตัวแปรผลลัพธ์ของ Hook เป็น apiProductResponse เพื่อไม่ให้สับสนกับตัว Type Product
    const { data: apiProductResponse, } = useGetProduct(id);
    const { data: apiAllProductsResponse, isLoading: isAllLoading } = useGetAllProducts();

    const router = useRouter();
    const { addToCart } = useCustomer();
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState<number>(0);

    // ✅ ปรับความปลอดภัย: แกะข้อมูลผ่านรูปแบบที่รองรับกรณีข้อมูลยังมาไม่ถึงหน้าบ้าน
    const product = (apiProductResponse || apiProductResponse) as Product | null;
    const allProducts = (apiAllProductsResponse || apiAllProductsResponse || []) as Product[];

    // ✨ [Rules of Hooks] ประกาศใช้กลุ่ม useMemo ด้านบนสุดร่วมกันอย่างปลอดภัย ไร้ if คั่นกลาง
    const images = useMemo(() => {
        if (!product) return ['/placeholder.png'];
        const firstImg = product.images?.[0]?.image_url || '/placeholder.png';
        return product.images?.length ? product.images.map(img => img.image_url) : [firstImg, firstImg, firstImg];
    }, [product]);

    const relatedProducts = useMemo(() => {
        if (!product || !allProducts) return [];
        return allProducts.filter(p => p.category_id === product.category_id && p.product_id !== product.product_id).slice(0, 4);
    }, [allProducts, product]);

    // 🛑 [Early Return] สเต็ปดักเช็คสถานะแอปพลิเคชัน (ย้ายลงมาด้านล่าง Hooks ทั้งหมดถูกต้องตามกติกา)
    // if (isProductLoading || isAllLoading) return <LoadingDetailSkeleton />;
    if (!product) return <ProductNotFoundState />;

    const handleAddToCart = () => {
        addToCart(product.product_id, quantity);
        toast.success(`เพิ่ม ${product.product_name} ลงตะกร้าเรียบร้อยแล้วครับ! 🛒`);
        router.push('/cart');
    };

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto px-4">
                <Link href="/products">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="size-4 mr-2" /> Back to Shop
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* ซีกซ้าย: แกลเลอรีรูปภาพ */}
                    <div>
                        <div className="aspect-square relative bg-gray-50 rounded-xl overflow-hidden mb-4 border shadow-sm">
                            <Image src={images[selectedImage]} alt={product.product_name} fill priority className="object-cover" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {images.map((img, idx) => (
                                <button key={idx} onClick={() => setSelectedImage(idx)} className={`aspect-square relative bg-gray-50 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-black scale-95 shadow-sm' : 'border-gray-200 hover:border-gray-400'}`}>
                                    <Image src={img} alt="" fill sizes="15vw" className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ซีกขวา: ข้อมูลรายละเอียดและปุ่มสั่งซื้อ */}
                    <div>
                        <Badge className="mb-4">{product.category?.category_name || "Sportswear"}</Badge>
                        <h1 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">{product.product_name}</h1>
                        <p className="text-3xl font-bold mb-6 text-gray-900">฿{product.sale_price.toLocaleString()}</p>
                        <Badge variant={product.stock_qty > 20 ? 'secondary' : 'destructive'} className="mb-6">{product.stock_qty > 0 ? `${product.stock_qty} in stock` : 'Out of stock'}</Badge>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
                            <p className="text-gray-600 font-light leading-relaxed">{product.description || "ไม่มีข้อมูลรายละเอียดของสินค้าชิ้นนี้"}</p>
                        </div>

                        <div className="mb-6">
                            <label className="mb-2 block font-semibold text-gray-900">Quantity</label>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="size-4" /></Button>
                                <span className="text-xl font-semibold w-12 text-center text-gray-900">{quantity}</span>
                                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(product.stock_qty, quantity + 1))} disabled={quantity >= product.stock_qty}><Plus className="size-4" /></Button>
                            </div>
                        </div>

                        <Button size="lg" className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddToCart} disabled={product.stock_qty === 0}>
                            <ShoppingCart className="size-5 mr-2" /> Add to Cart
                        </Button>
                    </div>
                </div>

                {/* สินค้าแนะนำหมวดหมู่เดียวกัน */}
                {relatedProducts.length > 0 && (
                    <div className="border-t pt-16">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">You May Also Like</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((item) => (
                                <Card key={item.product_id} className="group cursor-pointer border shadow-sm overflow-hidden bg-white">
                                    <Link href={`/products/${item.product_id}`}>
                                        <div className="aspect-square relative overflow-hidden bg-gray-50">
                                            <Image src={item.images?.[0]?.image_url || '/placeholder.png'} alt={item.product_name} fill sizes="25vw" className="object-cover group-hover:scale-102 transition-transform duration-300" />
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold mb-2 group-hover:text-blue-600 text-gray-900 line-clamp-1">{item.product_name}</h3>
                                            <span className="text-lg font-bold text-gray-900">฿{item.sale_price.toLocaleString()}</span>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function LoadingDetailSkeleton() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="text-sm font-medium text-gray-500 animate-pulse">กำลังดึงข้อมูลสินค้า... 📦</p>
        </div>
    );
}

function ProductNotFoundState() {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Product not found</h1>
            <Link href="/products"><Button>Back to Shop</Button></Link>
        </div>
    );
}