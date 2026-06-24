"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { useGetAllProducts, useGetPriceRange } from "@/app/features/hooks/Product"
import { useGetAllCategories } from "@/app/features/hooks/Category"
import { ALL_CATEGORY_ID, PAGE_SIZE } from "@/components/customerComponent/shop/constants"
import { CategoryItem, ProductListItem, SortBy } from "@/components/customerComponent/shop/shop.types"
import { FilterPanel } from "@/components/customerComponent/shop/FilterPanel"
import { MobileFilterDrawer } from "@/components/customerComponent/shop/MobileFilterDrawer"
import { VariantPickerDialog } from "@/components/customerComponent/shop/VariantPickerDialog"
import { ShopSearchBar } from "@/components/customerComponent/shop/ShopSearchBar"
import { ShopActiveFilters } from "@/components/customerComponent/shop/ShopActiveFilters"
import { ShopProductGrid } from "@/components/customerComponent/shop/ShopProductGrid"
import { useDebouncedValue } from "@/components/customerComponent/shop/useDebouncedValue"

export default function ShopPage() {
    const searchParams = useSearchParams()

    const [searchInput, setSearchInput] = useState("")
    const [categoryId, setCategoryId] = useState(searchParams.get("category") || ALL_CATEGORY_ID)
    const [sortBy, setSortBy] = useState<SortBy>("featured")
    const [page, setPage] = useState(1)
    const [userPriceRange, setUserPriceRange] = useState<[number, number] | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [pickerProduct, setPickerProduct] = useState<ProductListItem | null>(null)

    const debouncedSearch = useDebouncedValue(searchInput)
    const { data: priceBounds } = useGetPriceRange()
    const { data, isLoading, isFetching, isError, refetch } = useGetAllProducts(
        useMemo(() => ({
            category_id: categoryId === ALL_CATEGORY_ID ? undefined : categoryId,
            search: debouncedSearch || undefined,
            min_price: userPriceRange && priceBounds && userPriceRange[0] > priceBounds.min ? userPriceRange[0] : undefined,
            max_price: userPriceRange && priceBounds && userPriceRange[1] < priceBounds.max ? userPriceRange[1] : undefined,
            sort_by: sortBy,
            page,
            page_size: PAGE_SIZE,
        }), [categoryId, debouncedSearch, userPriceRange, priceBounds, sortBy, page])
    )
    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategories()

    // Derive effective price range — no useEffect needed
    const priceRange: [number, number] = userPriceRange ?? [priceBounds?.min ?? 0, priceBounds?.max ?? 0]

    const items = (data?.items ?? []) as ProductListItem[]
    const meta  = data?.meta

    const activeCategory = (categories as CategoryItem[] | undefined)
        ?.find(c => c.category_id === categoryId)

    const isFiltered =
        categoryId !== ALL_CATEGORY_ID ||
        debouncedSearch !== "" ||
        userPriceRange !== null

    // Handlers always reset page alongside the filter change
    const handleCategoryChange = (id: string) => { setCategoryId(id); setPage(1) }
    const handleSearchChange = (v: string) => { setSearchInput(v); setPage(1) }
    const handleSortChange = (v: SortBy) => { setSortBy(v); setPage(1) }
    const handlePriceChange = (v: [number, number]) => { setUserPriceRange(v); setPage(1) }
    const handleRemovePrice = () => { setUserPriceRange(null); setPage(1) }

    const resetFilters = () => {
        setCategoryId(ALL_CATEGORY_ID)
        setSearchInput("")
        setSortBy("featured")
        setUserPriceRange(null)
        setPage(1)
    }

    const panelProps = {
        categories: categories as CategoryItem[] | undefined,
        isLoadingCategories,
        categoryId,
        setCategoryId: handleCategoryChange,
        priceBounds,
        priceRange,
        setPriceRange: handlePriceChange,
        isFiltered: !!isFiltered,
        onReset: resetFilters,
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="container mx-auto px-6 max-w-7xl py-10">

                {/* Header */}
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">ສິນຄ້າທັງໝົດ</h1>
                    <p className="text-sm text-gray-400">
                        {meta ? `ພົບ ${meta.total} ລາຍການ` : "ກຳລັງໂຫຼດ..."}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-start">

                    {/* Sidebar Filter (desktop) */}
                    <aside className="hidden md:block w-[260px] flex-shrink-0 sticky top-6">
                        <FilterPanel {...panelProps} />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 w-full space-y-5">
                        <ShopSearchBar
                            searchInput={searchInput}
                            onSearchChange={handleSearchChange}
                            sortBy={sortBy}
                            onSortChange={handleSortChange}
                            isFiltered={!!isFiltered}
                            onOpenDrawer={() => setDrawerOpen(true)}
                        />

                        <ShopActiveFilters
                            isFiltered={!!isFiltered}
                            categoryId={categoryId}
                            activeCategory={activeCategory}
                            debouncedSearch={debouncedSearch}
                            priceBounds={priceBounds}
                            priceRange={priceRange}
                            onRemoveCategory={() => handleCategoryChange(ALL_CATEGORY_ID)}
                            onRemoveSearch={() => handleSearchChange("")}
                            onRemovePrice={handleRemovePrice}
                            onResetAll={resetFilters}
                        />

                        <ShopProductGrid
                            items={items}
                            meta={meta}
                            isLoading={isLoading}
                            isFetching={isFetching}
                            isError={isError}
                            isFiltered={!!isFiltered}
                            onRetry={() => refetch()}
                            onReset={resetFilters}
                            onPickVariant={setPickerProduct}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                panelProps={panelProps}
            />

            {/* Variant Picker Dialog */}
            <VariantPickerDialog
                product={pickerProduct}
                open={!!pickerProduct}
                onOpenChange={v => { if (!v) setPickerProduct(null) }}
            />
        </div>
    )
}
