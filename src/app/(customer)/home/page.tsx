// "use client";

// import React, { useMemo } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { ArrowRight, TrendingUp } from 'lucide-react';
// import { toast } from 'sonner';

// // Import UI Components & Contexts
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { useCustomer } from '@/components/customerComponent/CustomerContext';
// import { useGetAllProducts } from '@/app/features/hooks/Product';

// // กำหนด Type Interface ตามโครงสร้างของ Prisma Database จริง
// // กำหนด Type Interface ຕາມໂຄງສ້າງຂອງ Prisma Database ຈິງ
// interface ProductImage {
//     image_id: string;
//     image_url: string;
// }

// interface Category {
//     category_id: string;
//     category_name: string;
//     description: string | null;
// }

// interface Product {
//     product_id: string;
//     product_code: string;
//     product_name: string;
//     sale_price: number;
//     stock_qty: number;
//     description: string | null;
//     featured?: boolean;
//     category_id: string;
//     category: Category;
//     images: ProductImage[];
// }

// export default function HomePage() {
//     const { addToCart } = useCustomer();
//     const { data: apiResponse, isLoading, error } = useGetAllProducts();

//     // 📦 แกะข้อมูลสินค้าเตรียมไว้ล่วงหน้า (ถ้าข้อมูลยังไม่มา ให้ดักเป็นอาเรย์ว่างเพื่อป้องกัน Error)
//     // 📦 ແກະຂໍ້ມູນສິນຄ້າກຽມໄວ້ລ່ວງໜ້າ (ຖ້າຂໍ້ມູນຍັງບໍ່ມາ ໃຫ້ດັກເປັນອາເຣວ່າງເພື່ອປ້ອງກັນ Error)
//     const products: Product[] = apiResponse || [];
//     // console.log("product ; ",products);

//     // ✨ [แก้ไขตามกฎ Rules of Hooks] ย้าย useMemo ขึ้นมาประกาศไว้ด้านบนสุดร่วมกันทันที ห้ามมี if คั่น
//     // ✨ [ແກ້ໄຂຕາມກົດ Rules of Hooks] ຍ້າຍ useMemo ຂຶ້ນມາປະກາດໄວ້ດ້ານເທິງສຸດຮ່ວມກັນທັນທີ ຫ້າມມີ if ຂັ້ນ
//     // 1. กรองสินค้าแนะนำ (Featured Products)
//     // 1. ກັ່ນຕອງສິນຄ້າແນະນຳ (Featured Products)
//     const featuredProducts = useMemo(() => {
//         const filtered = products.filter((product) => product.featured);
//         return filtered.length > 0 ? filtered : products.slice(0, 4);
//     }, [products]);

//     // 2. ดึงข้อมูลหมวดหมู่สินค้าแบบ Dynamic ไม่ให้ซ้ำกันโดยใช้ข้อมูลตรงจากฐานข้อมูลสินค้า
//     // 2. ດຶງຂໍ້ມູນໝວດໝູ່ສິນຄ້າແບບ Dynamic ບໍ່ໃຫ້ຊ້ຳກັນໂດຍໃຊ້ຂໍ້ມູນກົງຈາກຖານຂໍ້ມູນສິນຄ້າ
//     const categories = useMemo(() => {
//         const uniqueCategoriesMap = new Map<string, { name: string; image: string; link: string }>();

//         products.forEach((product) => {
//             if (product.category && !uniqueCategoriesMap.has(product.category.category_id)) {
//                 // เอารูปภาพแรกสุดของสินค้าในหมวดหมู่นั้นๆ มาทำเป็นภาพหน้าปก Category
//                 // ເອົາຮູບພາບທຳອິດສຸດຂອງສິນຄ້າໃນໝວດໝູ່ນັ້ນໆ ມາເຮັດເປັນພາບໜ້າປົກ Category
//                 const categoryImage = product.images?.[0]?.image_url || '/placeholder.png';

//                 uniqueCategoriesMap.set(product.category.category_id, {
//                     name: product.category.category_name,
//                     image: categoryImage,
//                     link: `/products?category=${product.category.category_id}`,
//                 });
//             }
//         });

//         return Array.from(uniqueCategoriesMap.values());
//     }, [products]);


//     // 🛑 [Early Return] ประกาศตรวจสอบสถานะแอปพลิเคชันไว้หลังจากรันกลุ่ม Hooks ทั้งหมดเสร็จสิ้นแล้ว
//     // 🛑 [Early Return] ປະກາດກວດສອບສະຖານະແອັບພລິເຄຊັນໄວ້ຫຼັງຈາກລັນກຸ່ມ Hooks ທັງໝົດເສັດສິ້ນແລ້ວ
//     // ตรวจสอบสถานะกำลังโหลดข้อมูล
//     // ກວດສອບສະຖານະກຳລັງໂຫລດຂໍ້ມູນ
//     if (isLoading) {
//         return (
//             <div className="flex h-screen items-center justify-center text-lg font-medium text-gray-500 animate-pulse">
//                 ກຳລັງດຶງຂໍ້ມູນສິນຄ້າຈາກລະບົບຫຼັງບ້ານ... 📦
//             </div>
//         );
//     }

//     // ตรวจสอบสถานะกรณีเกิดข้อผิดพลาดในการดึงข้อมูลจาก API
//     // ກວດສອບສະຖານະກໍລະນີເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຈາກ API
//     if (error || !apiResponse) {
//         return (
//             <div className="flex h-screen items-center justify-center text-lg font-medium text-destructive">
//                 ເກີດຂໍ้ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າ ກະລຸນາລອງໃໝ່ອີກຄັ້ງຄຣັບ ❌
//             </div>
//         );
//     }

//     // Handler ฟังก์ชันสำหรับดักจับการหยิบของใส่ตะกร้าสินค้าของลูกค้า
//     // Handler ຟັງຊັນສຳລັບດັກຈັບການຢິບເຄື່ອງໃສ່ກະຕ່າສິນຄ້າຂອງລູກຄ້າ
//     const handleAddToCart = (e: React.MouseEvent, product: Product) => {
//         e.preventDefault(); 
//         addToCart(product.product_id, 1);
//         toast.success(`ເພີ່ມ ${product.product_name} ລົງກະຕ່າຮຽບຮ້ອຍແລ້ວ! 🛒`);
//     };

//     return (
//         <div className="min-h-screen bg-background">
//             {/* Hero Banner Section */}
//             <section className="relative h-[600px] bg-black text-white overflow-hidden">
//                 <div
//                     className="absolute inset-0 bg-cover bg-center opacity-60"
//                     style={{
//                         backgroundImage:
//                             'url(https://images.unsplash.com/photo-1762709553300-342ab94e8b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)',
//                     }}
//                 />
//                 <div className="relative container mx-auto px-4 h-full flex items-center">
//                     <div className="max-w-2xl">
//                         <Badge className="mb-4 bg-white text-black hover:bg-white/90">
//                             New Season Collection
//                         </Badge>
//                         <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
//                             Unleash Your Athletic Potential
//                         </h1>
//                         <p className="text-xl mb-8 text-gray-300 font-light">
//                             Premium sportswear designed for champions. Experience comfort, style, and performance.
//                         </p>
//                         <Link href="/shop" passHref>
//                             <Button size="lg" className="text-lg px-8 py-6">
//                                 Shop Now
//                                 <ArrowRight className="ml-2 size-5" />
//                             </Button>
//                         </Link>
//                     </div>
//                 </div>
//             </section>

//             {/* Featured Products Section */}
//             <section className="py-20 bg-white">
//                 <div className="container mx-auto px-4">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
//                         <div>
//                             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Featured Products</h2>
//                             <p className="text-gray-500 mt-1">Our best-selling items this season</p>
//                         </div>
//                         <Link href="/shop" passHref>
//                             <Button variant="outline" className="w-full sm:w-auto">
//                                 View All
//                                 <ArrowRight className="ml-2 size-4" />
//                             </Button>
//                         </Link>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {featuredProducts.map((product) => (
//                             <Card
//                                 key={product.product_id}
//                                 className="group border shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden bg-white flex flex-col justify-between"
//                             >
//                                 <Link href={`/product/${product.product_id}`} className="flex-1">
//                                     <div className="aspect-square relative overflow-hidden bg-gray-50">
//                                         <Image
//                                             src={product.images?.[0]?.image_url ?? '/placeholder.png'}
//                                             alt={product.product_name}
//                                             fill
//                                             sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
//                                             className="object-cover group-hover:scale-102 transition-transform duration-300"
//                                             priority={false}
//                                         />
//                                     </div>
//                                     <CardContent className="p-4">
//                                         <h3 className="font-semibold mb-1 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
//                                             {product.product_name}
//                                         </h3>
//                                         <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
//                                             {product.description || "ບໍ່ມີລາຍລະອຽດສິນຄ້າ"}
//                                         </p>
//                                         <div className="flex items-center justify-between mt-2">
//                                             <span className="text-lg font-bold text-gray-900">
//                                                 ฿{product.sale_price.toLocaleString()}
//                                             </span>
//                                             <Badge variant={product.stock_qty > 0 ? 'secondary' : 'destructive'}>
//                                                 {product.stock_qty > 0 ? 'In Stock' : 'Out of Stock'}
//                                             </Badge>
//                                         </div>
//                                     </CardContent>
//                                 </Link>

//                                 <div className="p-4 pt-0">
//                                     <Button
//                                         onClick={(e) => handleAddToCart(e, product)}
//                                         disabled={product.stock_qty <= 0}
//                                         className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
//                                     >
//                                         ຢິບໃສ່ກະຕ່າ
//                                     </Button>
//                                 </div>
//                             </Card>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Dynamic Categories Section */}
//             {categories.length > 0 && (
//                 <section className="py-20 bg-gray-50">
//                     <div className="container mx-auto px-4">
//                         <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 tracking-tight">Shop by Category</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             {categories.map((category) => (
//                                 <Link
//                                     key={category.name}
//                                     href={category.link}
//                                     className="group relative h-80 overflow-hidden rounded-xl block shadow-sm hover:shadow-md transition-all duration-200"
//                                 >
//                                     <Image
//                                         src={category.image}
//                                         alt={category.name}
//                                         fill
//                                         sizes="(max-w-768px) 100vw, 33vw"
//                                         className="object-cover group-hover:scale-105 transition-transform duration-500"
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors flex items-end p-8">
//                                         <h3 className="text-2xl font-bold text-white tracking-wide">
//                                             {category.name}
//                                         </h3>
//                                     </div>
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>
//                 </section>
//             )}

//             {/* Promotional Banner */}
//            <section className="py-20 bg-black text-white relative overflow-hidden">
//                 <div className="container mx-auto px-4 relative z-10">
//                     <div className="max-w-2xl mx-auto text-center">
//                         <TrendingUp className="size-12 mx-auto mb-6 text-blue-500" />
//                         <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
//                             ເຂົ້າຮ່ວມ SportPro Rewards
//                         </h2>
//                         <p className="text-lg text-gray-400 mb-8 font-light">
//                             ຮັບສິດເຂົ້າເຖິງສິນຄ້າໃໝ່, ຂໍ້ສະເໜີສຸດພິເສດ ແລະ ກິດຈະກຳສະເພາະສະມາຊິກກ່ອນໃຜ.
//                         </p>
//                         <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100 font-medium">
//                             ສະໝັກສະມາຊິກຕອນນີ້
//                         </Button>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }


"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetAllProducts } from "@/app/features/hooks/Product"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Product } from "@/modules/product/product.types"
import { VariantSelectDialog } from "@/components/customerComponent/home/VariantSelectDialog"

export default function HomePage() {

    const { data: products = [], isLoading, error } = useGetAllProducts()
    const [pickerProduct, setPickerProduct] = useState<Product | null>(null)

    // ✅ "Featured" — ບໍ່ມີ field ນີ້ໃນ Schema, ໃຊ້ 4 ລາຍການລ່າສຸດແທນ
    const featuredProducts = useMemo(() => products.slice(0, 4), [products])

    // ✅ Categories — unique ຈາກ products
    const categories = useMemo(() => {
        const map = new Map<string, { name: string; image: string; link: string }>()
        products.forEach(p => {
            if (p.category && !map.has(p.category.category_id)) {
                map.set(p.category.category_id, {
                    name: p.category.category_name,
                    image: p.images?.[0]?.image_url ?? "/placeholder.png",
                    link: `/products?category=${p.category.category_id}`,
                })
            }
        })
        return Array.from(map.values())
    }, [products])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground animate-pulse">
                ກຳລັງດຶງຂໍ້ມູນສິນຄ້າ... 📦
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center text-lg font-medium text-destructive">
                ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ ❌
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">

            {/* Hero Banner */}
            <section className="relative h-[600px] bg-black text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: "url(https://images.unsplash.com/photo-1762709553300-342ab94e8b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)" }}
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
                        <Link href="/shop">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Shop Now <ArrowRight className="ml-2 size-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                                Featured Products
                            </h2>
                            <p className="text-gray-500 mt-1">Our best-selling items this season</p>
                        </div>
                        <Link href="/shop">
                            <Button variant="outline" className="w-full sm:w-auto">
                                View All <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </Link>
                    </div>

                    {featuredProducts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">
                            ບໍ່ມີສິນຄ້າໃນຂະນະນີ້
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map(product => {

                                // ✅ ດຶງລາຄາ ແລະ ສາງຈາກ variants
                                const prices = product.variants?.map(v => v.sale_price) ?? []
                                const minPrice = prices.length ? Math.min(...prices) : 0
                                const maxPrice = prices.length ? Math.max(...prices) : 0
                                const priceLabel = prices.length === 0
                                    ? "ບໍ່ມີຕົວເລືອກ"
                                    : minPrice === maxPrice
                                        ? formatCurrency(minPrice)
                                        : `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`

                                const totalStock = product.variants?.reduce((s, v) => s + v.stock_qty, 0) ?? 0
                                const inStock = totalStock > 0

                                return (
                                    <Card
                                        key={product.product_id}
                                        className="group border shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden bg-white flex flex-col justify-between"
                                    >
                                        <Link href={`/home/${product.product_id}`} className="flex-1">
                                            <div className="aspect-square relative overflow-hidden bg-gray-50">
                                                <Image
                                                    src={product.images?.[0]?.image_url ?? "/placeholder.png"}
                                                    alt={product.product_name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {!inStock && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                        <span className="text-white text-xs font-medium px-3 py-1 bg-black/60 rounded-full">
                                                            ໝົດສາງ
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold mb-1 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                    {product.product_name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                                                    {product.description || "ບໍ່ມີລາຍລະອຽດສິນຄ້າ"}
                                                </p>
                                                <div className="flex items-center justify-between mt-2 gap-2">
                                                    <span className="text-lg font-bold text-gray-900 truncate">
                                                        {priceLabel}
                                                    </span>
                                                    <Badge variant={inStock ? "secondary" : "destructive"}>
                                                        {inStock ? "In Stock" : "Out of Stock"}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Link>

                                        <div className="p-4 pt-0">
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setPickerProduct(product)
                                                }}
                                                disabled={!inStock}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                            >
                                                ຢິບໃສ່ກະຕ່າ
                                            </Button>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 tracking-tight">
                            Shop by Category
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {categories.map(category => (
                                <Link
                                    key={category.link}
                                    href={category.link}
                                    className="group relative h-80 overflow-hidden rounded-xl block shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
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

            {/* Promo Banner */}
            <section className="py-20 bg-black text-white relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        <TrendingUp className="size-12 mx-auto mb-6 text-blue-500" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                            ເຂົ້າຮ່ວມ SportPro Rewards
                        </h2>
                        <p className="text-lg text-gray-400 mb-8 font-light">
                            ຮັບສິດເຂົ້າເຖິງສິນຄ້າໃໝ່, ຂໍ້ສະເໜີສຸດພິເສດ ແລະ ກິດຈະກຳສະເພາະສະມາຊິກກ່ອນໃຜ.
                        </p>
                        <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100 font-medium">
                            ສະໝັກສະມາຊິກຕອນນີ້
                        </Button>
                    </div>
                </div>
            </section>

            {/* ✅ Variant picker dialog */}
            <VariantSelectDialog
                product={pickerProduct}
                open={!!pickerProduct}
                onOpenChange={(v) => { if (!v) setPickerProduct(null) }}
            />
        </div>
    )
}