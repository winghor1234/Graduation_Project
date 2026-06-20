"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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
// ⚠️ ສົມມຸດວ່າມີ hook ນີ້ — ກະລຸນາກວດ path ຈິງໃນໂປຣເຈັກ (ຫຼືສ້າງຖ້າຍັງບໍ່ມີ)
import { Product } from '@/components/adminComponent/products/ProductType';
import { formatCurrency } from '@/utils/FormatCurrency';
import { useGetAllCategories } from '@/app/features/hooks/Category';


const DEFAULT_MAX_PRICE = 1_000_000; // fallback ກໍລະນີຍັງບໍ່ມີສິນຄ້າ

// -----------------------------------------------------------------
// 🧮 Helper: ລາຄາ ແລະ stock ຢູ່ໃນ ProductVariant, ບໍ່ແມ່ນ Product ໂດຍກົງ
// ສິນຄ້າໜຶ່ງລາຍການອາດມີຫຼາຍ variant (ສີ/ໄຊ້) ລາຄາ/stock ຕ່າງກັນ
// -----------------------------------------------------------------
function getProductMinPrice(product: Product): number {
    if (!product.variants || product.variants.length === 0) return 0
    return Math.min(...product.variants.map((v) => v.sale_price))
}

function getProductTotalStock(product: Product): number {
    if (!product.variants || product.variants.length === 0) return 0
    return product.variants.reduce((sum, v) => sum + v.stock_qty, 0)
}

// ໝວດໝູ່ "ສິນຄ້າທັງໝົດ" ສະເໝີຢູ່ຕົ້ນ list
const ALL_CATEGORY_ID = 'all'

export default function ShopPage() {
    const searchParams = useSearchParams();
    const { addToCart } = useCustomer();

    const { data: apiAllProducts, isLoading: isLoadingProducts } = useGetAllProducts();
    const { data: apiCategories, isLoading: isLoadingCategories } = useGetAllCategories();

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || ALL_CATEGORY_ID);
    const [sortBy, setSortBy] = useState('featured');

    const [priceRange, setPriceRange] = useState<[number, number]>([0, DEFAULT_MAX_PRICE]);
    const [hasUserAdjustedPrice, setHasUserAdjustedPrice] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // ✅ unwrap ໂຄງສ້າງ response ໃຫ້ປອດໄພ ບໍ່ວ່າ backend ສົ່ງ array ຕົງໆ ຫຼື { data: [...] }
    const allProducts: Product[] = useMemo(() => {
        if (!apiAllProducts) return [];
        if (Array.isArray(apiAllProducts)) return apiAllProducts;
        if (Array.isArray((apiAllProducts as any).data)) return (apiAllProducts as any).data;
        return [];
    }, [apiAllProducts]);

    const categories = useMemo(() => {
        if (!apiCategories) return [];
        const list = Array.isArray(apiCategories)
            ? apiCategories
            : Array.isArray((apiCategories as any).data)
                ? (apiCategories as any).data
                : [];
        return list as { category_id: string; category_name: string }[];
    }, [apiCategories]);

    // 💰 ຄຳນວນ max price ຈິງຈາກຂໍ້ມູນສິນຄ້າ ແທນ hardcode 200
    const maxPossiblePrice = useMemo(() => {
        const allPrices = allProducts.flatMap((p) =>
            p.variants?.map((v) => v.sale_price) ?? []
        );
        if (allPrices.length === 0) return DEFAULT_MAX_PRICE;
        return Math.max(...allPrices);
    }, [allProducts]);

    // ຕັ້ງ priceRange ເລີ່ມຕົ້ນຄືນ ເມື່ອຮູ້ max ຈິງແລ້ວ (ຖ້າຜູ້ໃຊ້ຍັງບໍ່ໄດ້ປັບແຕ່ງເອງ)
    useEffect(() => {
        if (!hasUserAdjustedPrice) {
            setPriceRange([0, maxPossiblePrice]);
        }
    }, [maxPossiblePrice, hasUserAdjustedPrice]);

    // 🛠️ ລະບົບກອງຂໍ້ມູນ
    const filteredProducts = useMemo(() => {
        let filtered = [...allProducts];

        if (selectedCategory !== ALL_CATEGORY_ID) {
            filtered = filtered.filter((p) => p.category_id === selectedCategory);
        }

        if (debouncedSearch) {
            filtered = filtered.filter((p) =>
                p.product_name.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        filtered = filtered.filter((p) => {
            const price = getProductMinPrice(p);
            return price >= priceRange[0] && price <= priceRange[1];
        });

        if (sortBy === 'price-low') {
            filtered.sort((a, b) => getProductMinPrice(a) - getProductMinPrice(b));
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => getProductMinPrice(b) - getProductMinPrice(a));
        } else if (sortBy === 'name') {
            filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
        }

        return filtered;
    }, [allProducts, selectedCategory, debouncedSearch, priceRange, sortBy]);

    const isFiltered =
        selectedCategory !== ALL_CATEGORY_ID ||
        debouncedSearch !== '' ||
        priceRange[0] !== 0 ||
        priceRange[1] !== maxPossiblePrice;

    const resetFilters = () => {
        setSelectedCategory(ALL_CATEGORY_ID);
        setSearchQuery('');
        setDebouncedSearch('');
        setPriceRange([0, maxPossiblePrice]);
        setHasUserAdjustedPrice(false);
    };

    if (isLoadingProducts) return <ShopSkeletonGrid />;

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12 font-sans">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="flex flex-col md:flex-row gap-10 items-start">

                    {/* ⚙️ ຊີກຊ້າຍ: Filters Sidebar */}
                    <aside className="w-full md:w-[260px] flex-shrink-0">
                        <Card className="border border-gray-200/60 shadow-none bg-white rounded-xl">
                            <CardContent className="p-6 space-y-6">

                                <div className="flex items-center justify-between text-gray-900 mb-2">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal className="size-4.5 stroke-[2.5]" />
                                        <h3 className="text-xl font-bold tracking-tight">ການຕັ້ງຄ່າ</h3>
                                    </div>

                                    {isFiltered && (
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 transition-colors"
                                        >
                                            <X className="size-3" />
                                            ລ້າງ
                                        </button>
                                    )}
                                </div>

                                {/* ເມນູເລືອກໝວດໝູ່ (ດຶງມາຈາກ API ຈິງ) */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-gray-900 block mb-1">ໝວດໝູ່</Label>
                                    <div className="flex flex-col space-y-3 pt-1">
                                        {isLoadingCategories ? (
                                            <div className="space-y-2">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
                                                ))}
                                            </div>
                                        ) : (
                                            [{ category_id: ALL_CATEGORY_ID, category_name: 'ສິນຄ້າທັງໝົດ' }, ...categories].map((item) => {
                                                const isActive = selectedCategory === item.category_id;
                                                return (
                                                    <button
                                                        key={item.category_id}
                                                        type="button"
                                                        onClick={() => setSelectedCategory(item.category_id)}
                                                        className="flex items-center text-left transition-all duration-200 group"
                                                    >
                                                        <span className={`text-xl leading-none mr-2 transition-all ${isActive ? 'text-black opacity-100 scale-100' : 'text-transparent opacity-0 scale-50'}`}>
                                                            •
                                                        </span>
                                                        <span className={`text-sm font-semibold transition-colors ${isActive ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}`}>
                                                            {item.category_name}
                                                        </span>
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* ສ່ວນຂອງແຖບລາຄາ */}
                                <div className="space-y-3 pt-2">
                                    <Label className="text-sm font-bold text-gray-900 block">
                                        ຊ່ວງລາຄາ: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                                    </Label>
                                    <Slider
                                        min={0}
                                        max={maxPossiblePrice}
                                        step={Math.max(1, Math.round(maxPossiblePrice / 100))}
                                        value={priceRange}
                                        onValueChange={(value) => {
                                            setPriceRange(value as [number, number]);
                                            setHasUserAdjustedPrice(true);
                                        }}
                                        className="py-2 cursor-pointer [&_[role=slider]]:bg-white [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-black [&_[role=slider]]:shadow-none [&_.bg-primary]:bg-slate-900 [&_.bg-secondary]:bg-gray-200"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* 🛍️ ຊີກຂວາ: ຊ່ອງຄົ້ນຫາ, Dropdown ແລະ ຕາຕະລາງສິນຄ້າ */}
                    <div className="flex-1 w-full space-y-6">

                        <div className="flex gap-4 items-center">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input
                                    placeholder="ຄົ້ນຫາສິນຄ້າ..."
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
                                    <option value="featured">ແນະນຳ</option>
                                    <option value="price-low">ລາຄາ: ຕ່ຳ - ສູງ</option>
                                    <option value="price-high">ລາຄາ: ສູງ - ຕ່ຳ</option>
                                    <option value="name">ຊື່: ກ - ຮ</option>
                                </select>
                            </div>
                        </div>

                        {/* ສະແດງຈຳນວນຜົນລັບ */}
                        <p className="text-sm text-gray-400">
                            ພົບ {filteredProducts.length} ລາຍການ
                        </p>

                        {/* ຕາຕະລາງກຣິດສະແດງສິນຄ້າ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                            {filteredProducts.map((product) => {
                                const minPrice = getProductMinPrice(product);
                                const totalStock = getProductTotalStock(product);
                                const hasMultiplePrices =
                                    product.variants &&
                                    new Set(product.variants.map((v) => v.sale_price)).size > 1;

                                return (
                                    <Card key={product.product_id} className="border-none shadow-none bg-white rounded-none p-0 flex flex-col justify-between">
                                        <Link href={`/products/${product.product_id}`} className="block flex-1">

                                            <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-50">
                                                <Image
                                                    src={product.images?.[0]?.image_url || '/placeholder.png'}
                                                    alt={product.product_name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="object-cover transition-transform duration-300"
                                                    priority
                                                />
                                            </div>

                                            <div className="pt-4 pb-2 space-y-1">
                                                <h3 className="font-bold text-[19px] text-gray-900 leading-tight line-clamp-2 min-h-[52px]">
                                                    {product.product_name}
                                                </h3>
                                                <p className="text-sm text-gray-400 font-normal line-clamp-2 min-h-[40px] leading-relaxed">
                                                    {product.description || "ເຄື່ອງກີລາຊັ້ນສູງ ອອກແບບດ້ວຍວັດສະດຸທີ່ທັນສະໄໝ ເພື່ອປະສິດທິພາບສູງສຸດ."}
                                                </p>

                                                <div className="flex items-center justify-between pt-1">
                                                    <span className="text-xl font-extrabold text-gray-900">
                                                        {hasMultiplePrices && 'ເລີ່ມຕົ້ນ '}
                                                        {formatCurrency(minPrice)}
                                                    </span>
                                                    <Badge className="bg-[#eef1f6] text-gray-600 hover:bg-[#eef1f6] rounded-md text-[11px] px-2.5 py-1 border-none font-bold shadow-none tracking-wide">
                                                        {totalStock > 0 ? 'ມີໃນສາງ' : 'ສິນຄ້າໝົດແລ້ວ'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="pt-2">
                                            <Button
                                                className="w-full h-11 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-none tracking-wide"
                                                disabled={totalStock <= 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addToCart(product.product_id, 1);
                                                    toast.success(`ເພີ່ມ ${product.product_name} ລົງກະຕ່າຮຽບຮ້ອຍແລ້ວ! 🛒`);
                                                }}
                                            >
                                                {hasMultiplePrices ? 'ເລືອກ ແລະ ເພີ່ມໃສ່ກະຕ່າ' : 'ເພີ່ມໃສ່ກະຕ່າ'}
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* ກໍລະນີບໍ່ມີສິນຄ້າ */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-28 bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm font-normal mb-4">
                                    ບໍ່ພົບສິນຄ້າທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາຂອງທ່ານ.
                                </p>
                                {isFiltered && (
                                    <Button variant="outline" onClick={resetFilters}>
                                        ລ້າງເງື່ອນໄຂການກອງ
                                    </Button>
                                )}
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