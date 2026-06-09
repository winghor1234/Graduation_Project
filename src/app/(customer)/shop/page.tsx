"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Import UI Components & Hooks
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCustomer } from '@/components/customerComponent/CustomerContext';
import { useGetAllProducts } from '@/app/features/hooks/Product';
import { Product } from '@/components/adminComponent/products/ProductType';

export default function ShopPage() {
    const searchParams = useSearchParams();
    const { addToCart } = useCustomer();
    const { data: apiAllProducts, isLoading } = useGetAllProducts();

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [sortBy, setSortBy] = useState('featured');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // ✅ [FIXED] แก้ไขตรรกะการแกะห่อข้อมูล API รองรับทุกโครงสร้าง Object หลังบ้านอย่างปลอดภัย
    const allProducts = useMemo(() => {
        if (!apiAllProducts) return [];
        // เจาะจงเอา apiAllProducts.data ก่อน ถ้าไม่มีค่อยเอา apiAllProducts ตรงๆ
        return (apiAllProducts.data || apiAllProducts) as Product[];
    }, [apiAllProducts]);

    // 🛠️ ระบบกรองข้อมูลอัจฉริยะ (รองรับทั้งชื่อหมวดหมู่และ ID จากฐานข้อมูล)
    const filteredProducts = useMemo(() => {
        let filtered = [...allProducts];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((p) => {
                const catIdMatch = p.category_id === selectedCategory;
                const catNameMatch = p.category?.category_name?.toLowerCase() === selectedCategory.toLowerCase();
                return catIdMatch || catNameMatch;
            });
        }

        if (debouncedSearch) {
            filtered = filtered.filter((p) =>
                p.product_name.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        filtered = filtered.filter(
            (p) => p.sale_price >= priceRange[0] && p.sale_price <= priceRange[1]
        );

        if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.sale_price - b.sale_price);
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.sale_price - a.sale_price);
        } else if (sortBy === 'name') {
            filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
        }

        return filtered;
    }, [allProducts, selectedCategory, debouncedSearch, priceRange, sortBy]);

    if (isLoading) return <ShopSkeletonGrid />;

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12 font-sans">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="flex flex-col md:flex-row gap-10 items-start">

                    {/* ⚙️ ซีกซ้าย: Filters Sidebar (แกะดีไซน์จากรูปภาพ 100%) */}
                    <aside className="w-full md:w-[260px] flex-shrink-0">
                        <Card className="border border-gray-200/60 shadow-none bg-white rounded-xl">
                            <CardContent className="p-6 space-y-6">

                                {/* หัวข้อ Filters */}
                                <div className="flex items-center gap-2 text-gray-900 mb-2">
                                    <SlidersHorizontal className="size-4.5 stroke-[2.5]" />
                                    <h3 className="text-xl font-bold tracking-tight">Filters</h3>
                                </div>

                                {/* เมนูเลือก Category แบบถอดรหัสจากรูปภาพ */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-gray-900 block mb-1">Category</Label>
                                    <div className="flex flex-col space-y-3 pt-1">
                                        {[
                                            { id: 'all', label: 'All Products' },
                                            { id: 'shoes', label: 'Shoes' },
                                            { id: 'clothing', label: 'Clothing' },
                                            { id: 'accessories', label: 'Accessories' }
                                        ].map((item) => {
                                            const isActive = selectedCategory === item.id;
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(item.id)}
                                                    className="flex items-center text-left transition-all duration-200 group"
                                                >
                                                    {/* แสดงจุดสีดำกลมเฉพาะรายการที่กำลัง active ตามรูปเป้าหมาย */}
                                                    <span className={`text-xl leading-none mr-2 transition-all ${isActive ? 'text-black opacity-100 scale-100' : 'text-transparent opacity-0 scale-50'}`}>
                                                        •
                                                    </span>
                                                    <span className={`text-sm font-semibold transition-colors ${isActive ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}`}>
                                                        {item.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ส่วนของแถบราคา (Price Range) */}
                                <div className="space-y-3 pt-2">
                                    <Label className="text-sm font-bold text-gray-900 block">
                                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                                    </Label>
                                    <Slider
                                        min={0}
                                        max={200}
                                        step={5}
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        className="py-2 cursor-pointer [&_[role=slider]]:bg-white [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-black [&_[role=slider]]:shadow-none [&_.bg-primary]:bg-slate-900 [&_.bg-secondary]:bg-gray-200"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* 🛍️ ซีกขวา: Search Input, Dropdown และตารางสินค้า */}
                    <div className="flex-1 w-full space-y-6">

                        {/* แถบค้นหาและปุ่มคัดกรอง */}
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-11 bg-[#f1f3f5] border-none rounded-xl focus-visible:ring-0 text-sm shadow-none text-gray-700"
                                />
                            </div>
                            <div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="h-11 px-4 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 font-medium focus:outline-none shadow-none cursor-pointer min-w-[150px]"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                            </div>
                        </div>

                        {/* ตารางกริดแสดงการ์ดสินค้าแบบไร้เส้นขอบและไร้เงา (Borderless Grid 100% Match) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                            {filteredProducts.map((product) => (
                                <Card key={product.product_id} className="border-none shadow-none bg-white rounded-none p-0 flex flex-col justify-between">
                                    <Link href={`/products/${product.product_id}`} className="block flex-1">

                                        {/* รูปภาพขอบมนทรงโค้งแบบสี่เหลี่ยมจัตุรัส */}
                                        <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-50">
                                            <Image
                                                src={product.images?.[0]?.image_url || '/placeholder.png'}
                                                alt={product.product_name}
                                                fill
                                                sizes="(max-w-768px) 100vw, 33vw"
                                                className="object-cover transition-transform duration-300"
                                                priority
                                            />
                                        </div>

                                        {/* รายละเอียดข้อมูลคำอธิบายและราคาสินค้า */}
                                        <div className="pt-4 pb-2 space-y-1">
                                            <h3 className="font-bold text-[19px] text-gray-900 leading-tight line-clamp-2 min-h-[52px]">
                                                {product.product_name}
                                            </h3>
                                            <p className="text-sm text-gray-400 font-normal line-clamp-2 min-h-[40px] leading-relaxed">
                                                {product.description || "Premium athletic wear designed with advanced materials for maximum performance."}
                                            </p>

                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-xl font-extrabold text-gray-900">
                                                    ${product.sale_price.toFixed(2)}
                                                </span>
                                                <Badge className="bg-[#eef1f6] text-gray-600 hover:bg-[#eef1f6] rounded-md text-[11px] px-2.5 py-1 border-none font-bold shadow-none tracking-wide">
                                                    {product.stock_qty > 0 ? 'In Stock' : 'Out of Stock'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* ปุ่มกดหยิบใส่ตะกร้าสีดำสนิททรงเหลี่ยมมนตรงตามภาพ 100% */}
                                    <div className="pt-2">
                                        <Button
                                            className="w-full h-11 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-none tracking-wide"
                                            disabled={product.stock_qty <= 0}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(product.product_id, 1);
                                                toast.success(`${product.product_name} added to cart! 🛒`);
                                            }}
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* กรณีไม่มีสินค้า */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-28 bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm font-normal">
                                    No products found matching your active criteria.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

function ShopSkeletonGrid() {
    return (
        <div className="min-h-screen bg-white py-12 animate-pulse">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-64 h-80 bg-gray-100 rounded-2xl" />
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-square bg-gray-100 rounded-xl w-full" />
                                <div className="h-6 bg-gray-100 rounded w-3/4" />
                                <div className="h-4 bg-gray-100 rounded w-1/2" />
                                <div className="h-11 bg-gray-100 rounded-lg w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}