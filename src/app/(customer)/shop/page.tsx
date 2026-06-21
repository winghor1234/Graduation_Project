"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useGetAllProducts, useGetPriceRange } from "@/app/features/hooks/Product"
import { useGetAllCategories } from "@/app/features/hooks/Category"
import { formatCurrency } from "@/utils/FormatCurrency"
import { ALL_CATEGORY_ID, PAGE_SIZE } from "@/components/customerComponent/shop/constants"
import { CategoryItem, ProductListItem, SortBy } from "@/components/customerComponent/shop/shop.types"
import { FilterPanel } from "@/components/customerComponent/shop/FilterPanel"
import { FilterChip } from "@/components/customerComponent/shop/FilterChip"
import { ProductGridSkeleton } from "@/components/customerComponent/shop/ProductGridSkeleton"
import { ErrorState } from "@/components/customerComponent/shop/ErrorState"
import { EmptyState } from "@/components/customerComponent/shop/EmptyState"
import { ProductCard } from "@/components/customerComponent/shop/ProductCard"
import { Pagination } from "@/components/customerComponent/shop/Pagination"
import { MobileFilterDrawer } from "@/components/customerComponent/shop/MobileFilterDrawer"
import { VariantPickerDialog } from "@/components/customerComponent/shop/VariantPickerDialog"
import { useDebouncedValue } from "@/components/customerComponent/shop/useDebouncedValue"



export default function ShopPage() {
    const searchParams = useSearchParams()

    const [searchInput, setSearchInput] = useState("")
    const debouncedSearch = useDebouncedValue(searchInput)

    const [categoryId, setCategoryId] = useState(searchParams.get("category") || ALL_CATEGORY_ID)
    const [sortBy, setSortBy] = useState<SortBy>("featured")
    const [page, setPage] = useState(1)

    const { data: priceBounds } = useGetPriceRange()
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
    const [priceTouched, setPriceTouched] = useState(false)

    useEffect(() => {
        if (priceBounds && !priceTouched) setPriceRange([priceBounds.min, priceBounds.max])
    }, [priceBounds, priceTouched])

    useEffect(() => { setPage(1) }, [categoryId, debouncedSearch, priceRange[0], priceRange[1], sortBy])

    const filters = useMemo(() => ({
        category_id: categoryId === ALL_CATEGORY_ID ? undefined : categoryId,
        search:      debouncedSearch || undefined,
        min_price:   priceBounds && priceRange[0] > priceBounds.min ? priceRange[0] : undefined,
        max_price:   priceBounds && priceRange[1] < priceBounds.max ? priceRange[1] : undefined,
        sort_by:     sortBy,
        page,
        page_size:   PAGE_SIZE,
    }), [categoryId, debouncedSearch, priceRange, priceBounds, sortBy, page])

    const { data, isLoading, isFetching, isError, refetch } = useGetAllProducts(filters)
    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategories()

    console.log("product : ", data)
    
    // ✅ backend ສົ່ງ { items, meta } — ບໍ່ແມ່ນ { data, meta }
    const items = (data?.data ?? []) as ProductListItem[]
    const meta  = data?.meta
    console.log("item : ", items)

    const activeCategory = (categories as CategoryItem[] | undefined)?.find(c => c.category_id === categoryId)

    const isFiltered =
        categoryId !== ALL_CATEGORY_ID ||
        debouncedSearch !== "" ||
        (!!priceBounds && (priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max))

    const resetFilters = () => {
        setCategoryId(ALL_CATEGORY_ID)
        setSearchInput("")
        setSortBy("featured")
        if (priceBounds) setPriceRange([priceBounds.min, priceBounds.max])
        setPriceTouched(false)
    }

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [pickerProduct, setPickerProduct] = useState<ProductListItem | null>(null)

    const panelProps = {
        categories: categories as CategoryItem[] | undefined,
        isLoadingCategories,
        categoryId,
        setCategoryId,
        priceBounds,
        priceRange,
        setPriceRange: (v: [number, number]) => { setPriceRange(v); setPriceTouched(true) },
        isFiltered: !!isFiltered,
        onReset: resetFilters,
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans">
            <div className="container mx-auto px-6 max-w-7xl py-10">

                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">ສິນຄ້າທັງໝົດ</h1>
                    <p className="text-sm text-gray-400">
                        {meta ? `ພົບ ${meta.total} ລາຍການ` : "ກຳລັງໂຫຼດ..."}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-start">

                    <aside className="hidden md:block w-[260px] flex-shrink-0 sticky top-6">
                        <FilterPanel {...panelProps} />
                    </aside>

                    <div className="flex-1 w-full space-y-6">

                        <div className="flex gap-3 items-center">
                            <Button
                                variant="outline"
                                onClick={() => setDrawerOpen(true)}
                                className="md:hidden h-11 px-4 rounded-xl flex items-center gap-2 shrink-0"
                            >
                                <SlidersHorizontal className="size-4" />
                                ກອງ
                                {isFiltered && <span className="size-2 rounded-full bg-gray-900" />}
                            </Button>

                            <div className="flex-1 relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input
                                    placeholder="ຄົ້ນຫາສິນຄ້າ..."
                                    value={searchInput}
                                    onChange={e => setSearchInput(e.target.value)}
                                    className="pl-10 h-11 bg-[#f1f3f5] border-none rounded-xl focus-visible:ring-0 text-sm shadow-none text-gray-700"
                                />
                            </div>

                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as SortBy)}
                                className="h-11 px-4 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 font-medium focus:outline-none shadow-none cursor-pointer min-w-[150px]"
                            >
                                <option value="featured">ແນະນຳ</option>
                                <option value="price-low">ລາຄາ: ຕ່ຳ - ສູງ</option>
                                <option value="price-high">ລາຄາ: ສູງ - ຕ່ຳ</option>
                                <option value="name">ຊື່: ກ - ຮ</option>
                            </select>
                        </div>

                        {isFiltered && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {categoryId !== ALL_CATEGORY_ID && activeCategory && (
                                    <FilterChip label={activeCategory.category_name} onRemove={() => setCategoryId(ALL_CATEGORY_ID)} />
                                )}
                                {debouncedSearch && (
                                    <FilterChip label={`"${debouncedSearch}"`} onRemove={() => setSearchInput("")} />
                                )}
                                {priceBounds && (priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max) && (
                                    <FilterChip
                                        label={`${formatCurrency(priceRange[0])} - ${formatCurrency(priceRange[1])}`}
                                        onRemove={() => { setPriceRange([priceBounds.min, priceBounds.max]); setPriceTouched(false) }}
                                    />
                                )}
                                <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-gray-900 underline underline-offset-2 ml-1">
                                    ລ້າງທັງໝົດ
                                </button>
                            </div>
                        )}

                        {isLoading ? (
                            <ProductGridSkeleton />
                        ) : isError ? (
                            <ErrorState onRetry={() => refetch()} />
                        ) : items.length === 0 ? (
                            <EmptyState isFiltered={!!isFiltered} onReset={resetFilters} />
                        ) : (
                            <>
                                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
                                    {items.map(product => (
                                        <ProductCard
                                            key={product.product_id}
                                            product={product}
                                            onPickVariant={setPickerProduct}
                                        />
                                    ))}
                                </div>

                                {meta && meta.total_pages > 1 && (
                                    <Pagination page={meta.page} totalPages={meta.total_pages} onChange={setPage} />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <MobileFilterDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                panelProps={panelProps}
            />

            <VariantPickerDialog
                product={pickerProduct}
                open={!!pickerProduct}
                onOpenChange={v => { if (!v) setPickerProduct(null) }}
            />
        </div>
    )
}