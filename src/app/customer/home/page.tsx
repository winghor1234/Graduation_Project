"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { useGetAllProducts, useGetPriceRange } from "@/app/features/hooks/Product"
import { useGetAllCategories } from "@/app/features/hooks/Category"
import { useGetAllPromotions } from "@/app/features/hooks/promotion"
import { Promotion } from "@/modules/promotion/promotion.types"
import { CategoryItem, ProductListItem, SortBy } from "@/components/customerComponent/shop/shop.types"
import { FilterPanel } from "@/components/customerComponent/shop/FilterPanel"
import { MobileFilterDrawer } from "@/components/customerComponent/shop/MobileFilterDrawer"
import { VariantPickerDialog } from "@/components/customerComponent/shop/VariantPickerDialog"
import { ShopSearchBar } from "@/components/customerComponent/shop/ShopSearchBar"
import { ShopActiveFilters } from "@/components/customerComponent/shop/ShopActiveFilters"
import { ShopProductGrid } from "@/components/customerComponent/shop/ShopProductGrid"
import { useDebouncedValue } from "@/components/customerComponent/shop/useDebouncedValue"
import { BestSellersRail } from "@/components/customerComponent/home/BestSellersRail"
import { HeroSlider } from "@/components/customerComponent/home/HeroSlider"

export default function HomePage() {
    const searchParams = useSearchParams()

    const [searchInput, setSearchInput] = useState("")
    const [categoryIds, setCategoryIds] = useState<string[]>(
        searchParams.get("category") ? [searchParams.get("category")!] : []
    )
    const [sortBy, setSortBy] = useState<SortBy>("featured")
    const [page, setPage] = useState(1)
    const [userPriceRange, setUserPriceRange] = useState<[number, number] | null>(null)
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [pickerProduct, setPickerProduct] = useState<ProductListItem | null>(null)

    const debouncedSearch = useDebouncedValue(searchInput)
    const { data: priceBounds } = useGetPriceRange()
    const { data, isLoading, isFetching, isError, refetch } = useGetAllProducts(
        useMemo(() => ({
            category_ids: categoryIds.length > 0 ? categoryIds : undefined,
            search: debouncedSearch || undefined,
            min_price: userPriceRange && priceBounds && userPriceRange[0] > priceBounds.min ? userPriceRange[0] : undefined,
            max_price: userPriceRange && priceBounds && userPriceRange[1] < priceBounds.max ? userPriceRange[1] : undefined,
            sort_by: sortBy,
            page,
            page_size: 12,
        }), [categoryIds, debouncedSearch, userPriceRange, priceBounds, sortBy, page])
    )

    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategories()
    const { data: allPromotions = [] } = useGetAllPromotions()

    const priceRange: [number, number] = userPriceRange ?? [priceBounds?.min ?? 0, priceBounds?.max ?? 0]
    const rawItems = useMemo(() => (data?.items ?? []) as ProductListItem[], [data])
    const meta = data?.meta

    // ✅ ສີທີ່ມີໃຫ້ເລືອກ — ອີງຈາກສິນຄ້າໜ້າປັດຈຸບັນ (ບໍ່ດຶງແຍກຕ່າງຫາກ)
    const availableColors = useMemo(() => {
        const seen = new Set<string>()
        rawItems.forEach(p => p.variants?.forEach(v => { if (v.color) seen.add(v.color) }))
        return Array.from(seen)
    }, [rawItems])

    // ✅ ກອງຂະໜາດ + ສີ ຝັ່ງ client (category/search/price ຖືກກອງຢູ່ server ແລ້ວ)
    const items = useMemo(() => {
        let result = rawItems
        if (selectedSizes.length > 0)
            result = result.filter(p => p.variants?.some(v => selectedSizes.includes(v.size)))
        if (selectedColors.length > 0)
            result = result.filter(p => p.variants?.some(v => v.color && selectedColors.includes(v.color)))
        return result
    }, [rawItems, selectedSizes, selectedColors])

    // Promotion map — product_id → active Promotion
    const promotionMap = useMemo(() => {
        const now = new Date()
        const map = new Map<string, Promotion>()
        const activePromos = allPromotions.filter(p =>
            p.status === "ACTIVE" && new Date(p.start_date) <= now && new Date(p.end_date) >= now
        )
        for (const p of activePromos) {
            if (p.promotion_products?.length) {
                for (const pp of p.promotion_products) {
                    if (!map.has(pp.product_id)) map.set(pp.product_id, p)
                }
            }
        }
        const storeWide = activePromos.find(p => !p.promotion_products?.length)
        if (storeWide) {
            for (const item of rawItems) {
                if (!map.has(item.product_id)) map.set(item.product_id, storeWide)
            }
        }
        return map
    }, [allPromotions, rawItems])

    const allCategories = categories as CategoryItem[] | undefined
    const activeCategories = useMemo(
        () => (allCategories ?? []).filter(c => categoryIds.includes(c.category_id)),
        [allCategories, categoryIds]
    )

    const isFiltered =
        categoryIds.length > 0 ||
        debouncedSearch !== "" ||
        userPriceRange !== null ||
        selectedSizes.length > 0 ||
        selectedColors.length > 0

    // Handlers always reset page alongside the filter change
    const handleCategoryToggle = (id: string) => {
        setCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
        setPage(1)
    }
    const handleSearchChange = (v: string) => { setSearchInput(v); setPage(1) }
    const handleSortChange = (v: SortBy) => { setSortBy(v); setPage(1) }
    const handlePriceChange = (v: [number, number]) => { setUserPriceRange(v); setPage(1) }
    const handleRemovePrice = () => { setUserPriceRange(null); setPage(1) }
    const handleSizesChange = (sizes: string[]) => { setSelectedSizes(sizes); setPage(1) }
    const handleColorsChange = (colors: string[]) => { setSelectedColors(colors); setPage(1) }
    const handleRemoveSize = (size: string) => {
        setSelectedSizes(prev => prev.filter(s => s !== size))
        setPage(1)
    }
    const handleRemoveColor = (color: string) => {
        setSelectedColors(prev => prev.filter(c => c !== color))
        setPage(1)
    }

    const resetFilters = () => {
        setCategoryIds([])
        setSearchInput("")
        setSortBy("featured")
        setUserPriceRange(null)
        setSelectedSizes([])
        setSelectedColors([])
        setPage(1)
    }

    const panelProps = {
        categories: allCategories,
        isLoadingCategories,
        categoryIds,
        onCategoryToggle: handleCategoryToggle,
        priceBounds,
        priceRange,
        setPriceRange: handlePriceChange,
        availableColors,
        selectedColors,
        onColorsChange: handleColorsChange,
        selectedSizes,
        onSizesChange: handleSizesChange,
        isFiltered: !!isFiltered,
        onReset: resetFilters,
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-white">
            {/* Ambient accents — subtle on white, purely decorative */}
            <div className="pointer-events-none absolute -top-32 -left-32 w-125 h-125 rounded-full bg-brand-orange/5 blur-[140px]" />
            <div className="pointer-events-none absolute top-1/2 -right-40 w-125 h-125 rounded-full bg-brand-orange/5 blur-[160px]" />

            <div className="container relative mx-auto px-4 md:px-8 max-w-7xl py-8 md:py-12">

                <div className="sticky top-0 z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-3 mb-6 bg-white/90 backdrop-blur-md border-b border-gray-100">
                    <ShopSearchBar
                        searchInput={searchInput}
                        onSearchChange={handleSearchChange}
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                        isFiltered={!!isFiltered}
                        onOpenDrawer={() => setDrawerOpen(true)}
                    />
                </div>
                {/* Hero image slider — real featured products */}
                <HeroSlider />

                {/* Header */}
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">ສິນຄ້າທັງໝົດ</h1>
                    <p className="text-sm text-gray-400">
                        {meta ? `ພົບ ${meta.total} ລາຍການ` : "ກຳລັງໂຫຼດ..."}
                    </p>
                </div>

                {/* Best sellers rail — real sales data, hidden entirely if none yet */}
                <BestSellersRail />


                {/* ── Body: sidebar + grid ── */}
                <div className="flex gap-10 items-start">

                    {/* Sidebar desktop */}
                    <aside className="hidden md:block w-56 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
                        <FilterPanel {...panelProps} />
                    </aside>

                    {/* Main */}
                    <div className="flex-1 min-w-0 space-y-6">
                        <div className="sticky top-24 z-20 bg-white/90 backdrop-blur-md py-2 -mx-1 px-1">
                            <ShopActiveFilters
                                isFiltered={!!isFiltered}
                                activeCategories={activeCategories}
                                debouncedSearch={debouncedSearch}
                                priceBounds={priceBounds}
                                priceRange={priceRange}
                                selectedSizes={selectedSizes}
                                selectedColors={selectedColors}
                                onRemoveCategory={handleCategoryToggle}
                                onRemoveSearch={() => handleSearchChange("")}
                                onRemovePrice={handleRemovePrice}
                                onRemoveSize={handleRemoveSize}
                                onRemoveColor={handleRemoveColor}
                                onResetAll={resetFilters}
                            />
                        </div>

                        <ShopProductGrid
                            items={items}
                            meta={meta}
                            isLoading={isLoading}
                            isFetching={isFetching}
                            isError={isError}
                            isFiltered={!!isFiltered}
                            promotionMap={promotionMap}
                            onRetry={() => refetch()}
                            onReset={resetFilters}
                            onPickVariant={setPickerProduct}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile filter drawer */}
            <MobileFilterDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                panelProps={panelProps}
            />

            {/* Variant picker */}
            <VariantPickerDialog
                product={pickerProduct}
                open={!!pickerProduct}
                onOpenChange={v => { if (!v) setPickerProduct(null) }}
            />
        </div>
    )
}
