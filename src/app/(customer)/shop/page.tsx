"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronLeft,
    ChevronRight,
    PackageSearch,
    AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useCustomer } from "@/components/customerComponent/CustomerContext";
import { useGetAllProducts, useGetPriceRange } from "@/app/features/hooks/Product";
import { useGetAllCategories } from "@/app/features/hooks/Category";
import { formatCurrency } from "@/utils/FormatCurrency";
import { Product } from "@/components/adminComponent/products/ProductType";

// ✏️ ປ່ຽນຕາມຄ່າຈິງ: ໝວດໝູ່ສິນຄ້າ + min_price/max_price/total_stock ມາຈາກ backend ແລ້ວ
type ProductListItem = Product & {
    min_price: number
    max_price: number
    total_stock: number
}

type CategoryItem = {
    category_id: string
    category_name: string
    _count?: { products: number }
}

const ALL_CATEGORY_ID = "all";
const PAGE_SIZE = 12;
const LOW_STOCK_THRESHOLD = 5;

function useDebouncedValue<T>(value: T, delay = 350): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export default function ShopPage() {
    const searchParams = useSearchParams();
    const { addToCart } = useCustomer();

    // ---------------- filter state ----------------
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebouncedValue(searchInput);

    const [categoryId, setCategoryId] = useState(searchParams.get("category") || ALL_CATEGORY_ID);
    const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name">("featured");
    const [page, setPage] = useState(1);

    const { data: priceBounds } = useGetPriceRange();
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    const [priceTouched, setPriceTouched] = useState(false);

    useEffect(() => {
        if (priceBounds && !priceTouched) {
            setPriceRange([priceBounds.min, priceBounds.max]);
        }
    }, [priceBounds, priceTouched]);

    // ປ່ຽນ filter ໃດກໍ່ຕາມ → ກັບໄປໜ້າ 1
    useEffect(() => {
        setPage(1);
    }, [categoryId, debouncedSearch, priceRange[0], priceRange[1], sortBy]);

    const filters = useMemo(
        () => ({
            category_id: categoryId === ALL_CATEGORY_ID ? undefined : categoryId,
            search: debouncedSearch || undefined,
            min_price: priceBounds && priceRange[0] > priceBounds.min ? priceRange[0] : undefined,
            max_price: priceBounds && priceRange[1] < priceBounds.max ? priceRange[1] : undefined,
            sort_by: sortBy,
            page,
            page_size: PAGE_SIZE,
        }),
        [categoryId, debouncedSearch, priceRange, priceBounds, sortBy, page]
    );

    const { data, isLoading, isFetching, isError, refetch } = useGetAllProducts(filters);
    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategories();

    const items = (data?.items ?? []) as ProductListItem[];
    const meta = data?.meta;

    const activeCategory = (categories as CategoryItem[] | undefined)?.find(
        (c) => c.category_id === categoryId
    );

    const isFiltered =
        categoryId !== ALL_CATEGORY_ID ||
        debouncedSearch !== "" ||
        (priceBounds && (priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max));

    const resetFilters = () => {
        setCategoryId(ALL_CATEGORY_ID);
        setSearchInput("");
        setSortBy("featured");
        if (priceBounds) setPriceRange([priceBounds.min, priceBounds.max]);
        setPriceTouched(false);
    };

    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans">
            <div className="container mx-auto px-6 max-w-7xl py-10">

                {/* ---------- Header row ---------- */}
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        ສິນຄ້າທັງໝົດ
                    </h1>
                    <p className="text-sm text-gray-400">
                        {meta ? `ພົບ ${meta.total} ລາຍການ` : "ກຳລັງໂຫຼດ..."}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-start">

                    {/* ---------- Sidebar (desktop) ---------- */}
                    <aside className="hidden md:block w-[260px] flex-shrink-0 sticky top-6">
                        <FilterPanel
                            categories={categories as CategoryItem[] | undefined}
                            isLoadingCategories={isLoadingCategories}
                            categoryId={categoryId}
                            setCategoryId={setCategoryId}
                            priceBounds={priceBounds}
                            priceRange={priceRange}
                            setPriceRange={(v) => {
                                setPriceRange(v);
                                setPriceTouched(true);
                            }}
                            isFiltered={!!isFiltered}
                            onReset={resetFilters}
                        />
                    </aside>

                    {/* ---------- Main column ---------- */}
                    <div className="flex-1 w-full space-y-6">

                        {/* Search + sort + mobile filter trigger */}
                        <div className="flex gap-3 items-center">
                            <Button
                                variant="outline"
                                onClick={() => setDrawerOpen(true)}
                                className="md:hidden h-11 px-4 rounded-xl flex items-center gap-2 shrink-0"
                            >
                                <SlidersHorizontal className="size-4" />
                                ກອງ
                                {isFiltered && (
                                    <span className="size-2 rounded-full bg-gray-900" />
                                )}
                            </Button>

                            <div className="flex-1 relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input
                                    placeholder="ຄົ້ນຫາສິນຄ້າ..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="pl-10 h-11 bg-[#f1f3f5] border-none rounded-xl focus-visible:ring-0 text-sm shadow-none text-gray-700"
                                />
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                className="h-11 px-4 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 font-medium focus:outline-none shadow-none cursor-pointer min-w-[150px]"
                            >
                                <option value="featured">ແນະນຳ</option>
                                <option value="price-low">ລາຄາ: ຕ່ຳ - ສູງ</option>
                                <option value="price-high">ລາຄາ: ສູງ - ຕ່ຳ</option>
                                <option value="name">ຊື່: ກ - ຮ</option>
                            </select>
                        </div>

                        {/* Active filter chips */}
                        {isFiltered && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {categoryId !== ALL_CATEGORY_ID && activeCategory && (
                                    <FilterChip
                                        label={activeCategory.category_name}
                                        onRemove={() => setCategoryId(ALL_CATEGORY_ID)}
                                    />
                                )}
                                {debouncedSearch && (
                                    <FilterChip
                                        label={`"${debouncedSearch}"`}
                                        onRemove={() => setSearchInput("")}
                                    />
                                )}
                                {priceBounds &&
                                    (priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max) && (
                                        <FilterChip
                                            label={`${formatCurrency(priceRange[0])} - ${formatCurrency(priceRange[1])}`}
                                            onRemove={() => {
                                                setPriceRange([priceBounds.min, priceBounds.max]);
                                                setPriceTouched(false);
                                            }}
                                        />
                                    )}
                                <button
                                    onClick={resetFilters}
                                    className="text-xs text-gray-400 hover:text-gray-900 underline underline-offset-2 ml-1"
                                >
                                    ລ້າງທັງໝົດ
                                </button>
                            </div>
                        )}

                        {/* ---------- Content states ---------- */}
                        {isLoading ? (
                            <ProductGridSkeleton />
                        ) : isError ? (
                            <ErrorState onRetry={() => refetch()} />
                        ) : items.length === 0 ? (
                            <EmptyState isFiltered={!!isFiltered} onReset={resetFilters} />
                        ) : (
                            <>
                                <div
                                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 transition-opacity ${
                                        isFetching ? "opacity-60" : "opacity-100"
                                    }`}
                                >
                                    {items.map((product) => (
                                        <ProductCard
                                            key={product.product_id}
                                            product={product}
                                            onAddToCart={() => {
                                                addToCart(product.product_id, 1);
                                                toast.success(`ເພີ່ມ ${product.product_name} ລົງກະຕ່າຮຽບຮ້ອຍແລ້ວ! 🛒`);
                                            }}
                                        />
                                    ))}
                                </div>

                                {meta && meta.total_pages > 1 && (
                                    <Pagination
                                        page={meta.page}
                                        totalPages={meta.total_pages}
                                        onChange={setPage}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ---------- Mobile filter drawer ---------- */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold">ກອງສິນຄ້າ</h3>
                            <button onClick={() => setDrawerOpen(false)}>
                                <X className="size-5 text-gray-500" />
                            </button>
                        </div>
                        <FilterPanel
                            categories={categories as CategoryItem[] | undefined}
                            isLoadingCategories={isLoadingCategories}
                            categoryId={categoryId}
                            setCategoryId={setCategoryId}
                            priceBounds={priceBounds}
                            priceRange={priceRange}
                            setPriceRange={(v) => {
                                setPriceRange(v);
                                setPriceTouched(true);
                            }}
                            isFiltered={!!isFiltered}
                            onReset={resetFilters}
                        />
                        <Button
                            className="w-full mt-6 h-11 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-white font-bold"
                            onClick={() => setDrawerOpen(false)}
                        >
                            ສະແດງຜົນລັບ
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// =====================================================================
// Sub-components
// =====================================================================

function FilterPanel({
    categories,
    isLoadingCategories,
    categoryId,
    setCategoryId,
    priceBounds,
    priceRange,
    setPriceRange,
    isFiltered,
    onReset,
}: {
    categories: CategoryItem[] | undefined
    isLoadingCategories: boolean
    categoryId: string
    setCategoryId: (id: string) => void
    priceBounds: { min: number; max: number } | undefined
    priceRange: [number, number]
    setPriceRange: (v: [number, number]) => void
    isFiltered: boolean
    onReset: () => void
}) {
    return (
        <div className="border border-gray-200/60 bg-white rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between text-gray-900">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4.5 stroke-[2.5]" />
                    <h3 className="text-xl font-bold tracking-tight">ການຕັ້ງຄ່າ</h3>
                </div>
                {isFiltered && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <X className="size-3" />
                        ລ້າງ
                    </button>
                )}
            </div>

            {/* Categories */}
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
                        [
                            { category_id: ALL_CATEGORY_ID, category_name: "ສິນຄ້າທັງໝົດ" },
                            ...(categories ?? []),
                        ].map((item) => {
                            const isActive = categoryId === item.category_id;
                            const count = (item as CategoryItem)._count?.products;
                            return (
                                <button
                                    key={item.category_id}
                                    type="button"
                                    onClick={() => setCategoryId(item.category_id)}
                                    className="flex items-center justify-between text-left transition-all duration-200 group"
                                >
                                    <span className="flex items-center">
                                        <span
                                            className={`text-xl leading-none mr-2 transition-all ${
                                                isActive
                                                    ? "text-black opacity-100 scale-100"
                                                    : "text-transparent opacity-0 scale-50"
                                            }`}
                                        >
                                            •
                                        </span>
                                        <span
                                            className={`text-sm font-semibold transition-colors ${
                                                isActive ? "text-black font-bold" : "text-gray-600 group-hover:text-black"
                                            }`}
                                        >
                                            {item.category_name}
                                        </span>
                                    </span>
                                    {typeof count === "number" && (
                                        <span className="text-xs text-gray-400">{count}</span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Price range */}
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-bold text-gray-900 block">ຊ່ວງລາຄາ</Label>
                {priceBounds ? (
                    <>
                        <p className="text-xs text-gray-500">
                            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                        </p>
                        <Slider
                            min={priceBounds.min}
                            max={priceBounds.max}
                            step={Math.max(1, Math.round((priceBounds.max - priceBounds.min) / 100))}
                            value={priceRange}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                            className="py-2 cursor-pointer [&_[role=slider]]:bg-white [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-black [&_[role=slider]]:shadow-none [&_.bg-primary]:bg-slate-900 [&_.bg-secondary]:bg-gray-200"
                        />
                    </>
                ) : (
                    <div className="h-6 bg-gray-100 rounded animate-pulse" />
                )}
            </div>
        </div>
    );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full pl-3 pr-2 py-1.5 text-xs font-medium text-gray-700">
            {label}
            <button onClick={onRemove} className="hover:text-gray-900">
                <X className="size-3" />
            </button>
        </span>
    );
}

function ProductCard({
    product,
    onAddToCart,
}: {
    product: ProductListItem
    onAddToCart: () => void
}) {
    const hasMultiplePrices = product.min_price !== product.max_price;
    const isOutOfStock = product.total_stock <= 0;
    const isLowStock = !isOutOfStock && product.total_stock <= LOW_STOCK_THRESHOLD;

    return (
        <div className="flex flex-col justify-between">
            <Link href={`/products/${product.product_id}`} className="block flex-1">
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-50 group">
                    <Image
                        src={product.images?.[0]?.image_url || "/placeholder.png"}
                        alt={product.product_name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <Badge className="bg-gray-900 text-white border-none">ສິນຄ້າໝົດແລ້ວ</Badge>
                        </div>
                    )}
                </div>

                <div className="pt-4 pb-2 space-y-1">
                    <h3 className="font-bold text-[19px] text-gray-900 leading-tight line-clamp-2 min-h-[52px]">
                        {product.product_name}
                    </h3>
                    <p className="text-sm text-gray-400 font-normal line-clamp-2 min-h-[40px] leading-relaxed">
                        {product.description ||
                            "ເຄື່ອງກີລາຊັ້ນສູງ ອອກແບບດ້ວຍວັດສະດຸທີ່ທັນສະໄໝ ເພື່ອປະສິດທິພາບສູງສຸດ."}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                        <span className="text-xl font-extrabold text-gray-900">
                            {hasMultiplePrices && "ເລີ່ມຕົ້ນ "}
                            {formatCurrency(product.min_price)}
                        </span>

                        {!isOutOfStock && (
                            <Badge
                                className={`rounded-md text-[11px] px-2.5 py-1 border-none font-bold shadow-none tracking-wide ${
                                    isLowStock
                                        ? "bg-amber-50 text-amber-700 hover:bg-amber-50"
                                        : "bg-[#eef1f6] text-gray-600 hover:bg-[#eef1f6]"
                                }`}
                            >
                                {isLowStock ? `ເຫຼືອອີກ ${product.total_stock} ອັນ` : "ມີໃນສາງ"}
                            </Badge>
                        )}
                    </div>
                </div>
            </Link>

            <div className="pt-2">
                <Button
                    className="w-full h-11 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-none tracking-wide"
                    disabled={isOutOfStock}
                    onClick={(e) => {
                        e.preventDefault();
                        onAddToCart();
                    }}
                >
                    {hasMultiplePrices ? "ເລືອກ ແລະ ເພີ່ມໃສ່ກະຕ່າ" : "ເພີ່ມໃສ່ກະຕ່າ"}
                </Button>
            </div>
        </div>
    );
}

function Pagination({
    page,
    totalPages,
    onChange,
}: {
    page: number
    totalPages: number
    onChange: (page: number) => void
}) {
    const pages = useMemo(() => {
        const window = 1;
        const list: (number | "...")[] = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - window && i <= page + window)) {
                list.push(i);
            } else if (list[list.length - 1] !== "...") {
                list.push("...");
            }
        }
        return list;
    }, [page, totalPages]);

    return (
        <div className="flex items-center justify-center gap-1.5 pt-6">
            <button
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className="size-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50"
            >
                <ChevronLeft className="size-4" />
            </button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-1.5 text-gray-400 text-sm">
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        className={`size-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            p === page
                                ? "bg-[#0a0f1d] text-white"
                                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                className="size-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50"
            >
                <ChevronRight className="size-4" />
            </button>
        </div>
    );
}

function EmptyState({ isFiltered, onReset }: { isFiltered: boolean; onReset: () => void }) {
    return (
        <div className="text-center py-28 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center gap-3">
            <PackageSearch className="size-8 text-gray-300" />
            <p className="text-gray-400 text-sm font-normal">
                ບໍ່ພົບສິນຄ້າທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາຂອງທ່ານ.
            </p>
            {isFiltered && (
                <Button variant="outline" onClick={onReset}>
                    ລ້າງເງື່ອນໄຂການກອງ
                </Button>
            )}
        </div>
    );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="text-center py-28 bg-white rounded-2xl border border-dashed border-red-200 flex flex-col items-center gap-3">
            <AlertTriangle className="size-8 text-red-300" />
            <p className="text-gray-500 text-sm">ໂຫຼດສິນຄ້າບໍ່ສຳເລັດ, ກະລຸນາລອງໃໝ່.</p>
            <Button variant="outline" onClick={onRetry}>
                ລອງໃໝ່
            </Button>
        </div>
    );
}

function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 animate-pulse">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-2xl w-full" />
                    <div className="h-5 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-11 bg-gray-100 rounded-xl w-full" />
                </div>
            ))}
        </div>
    );
}