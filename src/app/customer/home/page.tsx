"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { useGetAllProducts, useGetPriceRange } from "@/app/features/hooks/Product"
import { useGetAllCategories } from "@/app/features/hooks/Category"
import { useGetAllPromotions } from "@/app/features/hooks/promotion"
import { Promotion } from "@/modules/promotion/promotion.types"
import { PAGE_SIZE } from "@/components/customerComponent/shop/constants"
import { CategoryItem, ProductListItem, SortBy } from "@/components/customerComponent/shop/shop.types"
import { FilterPanel } from "@/components/customerComponent/shop/FilterPanel"
import { MobileFilterDrawer } from "@/components/customerComponent/shop/MobileFilterDrawer"
import { VariantPickerDialog } from "@/components/customerComponent/shop/VariantPickerDialog"
import { ShopSearchBar } from "@/components/customerComponent/shop/ShopSearchBar"
import { ShopActiveFilters } from "@/components/customerComponent/shop/ShopActiveFilters"
import { ShopProductGrid } from "@/components/customerComponent/shop/ShopProductGrid"
import { useDebouncedValue } from "@/components/customerComponent/shop/useDebouncedValue"

export default function HomePage() {
    const searchParams = useSearchParams()

    const [searchInput, setSearchInput] = useState("")
    const [categoryIds, setCategoryIds] = useState<string[]>(
        searchParams.get("category") ? [searchParams.get("category")!] : []
    )
    const [sortBy, setSortBy] = useState<SortBy>("featured")
    const [page, setPage] = useState(1)
    const [userPriceRange, setUserPriceRange] = useState<[number, number] | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [pickerProduct, setPickerProduct] = useState<ProductListItem | null>(null)
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])

    const debouncedSearch = useDebouncedValue(searchInput)
    const { data: priceBounds } = useGetPriceRange()

    const { data, isLoading, isFetching, isError, refetch } = useGetAllProducts(
        useMemo(() => ({
            category_ids: categoryIds.length > 0 ? categoryIds : undefined,
            search:       debouncedSearch || undefined,
            min_price:    userPriceRange && priceBounds && userPriceRange[0] > priceBounds.min ? userPriceRange[0] : undefined,
            max_price:    userPriceRange && priceBounds && userPriceRange[1] < priceBounds.max ? userPriceRange[1] : undefined,
            sort_by:      sortBy,
            page,
            page_size:    PAGE_SIZE,
        }), [categoryIds, debouncedSearch, userPriceRange, priceBounds, sortBy, page])
    )

    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategories()
    const { data: allPromotions = [] } = useGetAllPromotions()

    const priceRange: [number, number] = userPriceRange ?? [priceBounds?.min ?? 0, priceBounds?.max ?? 0]
    const rawItems = useMemo(() => (data?.items ?? []) as ProductListItem[], [data])
    const meta = data?.meta

    // Collect unique colors from current page for the swatch filter
    const availableColors = useMemo(() => {
        const seen = new Set<string>()
        rawItems.forEach(p => p.variants?.forEach(v => { if (v.color) seen.add(v.color) }))
        return Array.from(seen)
    }, [rawItems])

    // Client-side size + color filter
    const items = useMemo(() => {
        let result = rawItems
        if (selectedSizes.length > 0)
            result = result.filter(p => p.variants?.some(v => selectedSizes.includes(v.size)))
        if (selectedColors.length > 0)
            result = result.filter(p => p.variants?.some(v => v.color && selectedColors.includes(v.color)))
        return result
    }, [rawItems, selectedSizes, selectedColors])

    // Promotion map
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

    // Active categories (for chips + heading)
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

    // Toggle a category in/out of the selected set
    const handleCategoryToggle = (id: string) => {
        setCategoryIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
        setPage(1)
    }

    const handleSearchChange = (v: string) => { setSearchInput(v); setPage(1) }
    const handleSortChange   = (v: SortBy) => { setSortBy(v); setPage(1) }
    const handlePriceChange  = (v: [number, number]) => { setUserPriceRange(v); setPage(1) }
    const handleRemovePrice  = () => { setUserPriceRange(null); setPage(1) }

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
        categories:         allCategories,
        isLoadingCategories,
        categoryIds,
        onCategoryToggle:   handleCategoryToggle,
        priceBounds,
        priceRange,
        setPriceRange:      handlePriceChange,
        isFiltered:         !!isFiltered,
        onReset:            resetFilters,
        availableColors,
        selectedSizes,
        onSizesChange:      setSelectedSizes,
        selectedColors,
        onColorsChange:     setSelectedColors,
    }

    const headingLabel =
        activeCategories.length === 1
            ? activeCategories[0].category_name
            : activeCategories.length > 1
                ? `${activeCategories.length} ໝວດໝູ່`
                : "ສິນຄ້າທັງໝົດ"

    return (
        <div className="min-h-screen bg-brand-black">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8 md:py-12">

                {/* ── Page header ── */}
                <div className="flex items-end justify-between mb-8 gap-4">
                    <div>
                        <p className="text-[10px] tracking-[0.22em] uppercase text-brand-muted mb-1 font-medium">SportPro</p>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-brand-white leading-none">
                            {headingLabel}
                        </h1>
                        {meta && (
                            <p className="text-sm text-brand-muted mt-1">{meta.total} ລາຍການ</p>
                        )}
                    </div>

                    <ShopSearchBar
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                        isFiltered={!!isFiltered}
                        onOpenDrawer={() => setDrawerOpen(true)}
                    />
                </div>

                {/* ── Body: sidebar + grid ── */}
                <div className="flex gap-10 items-start">

                    {/* Sidebar desktop */}
                    <aside className="hidden md:block w-48 shrink-0 sticky top-6">
                        <FilterPanel {...panelProps} />
                    </aside>

                    {/* Main */}
                    <div className="flex-1 min-w-0 space-y-6">
                        <ShopActiveFilters
                            isFiltered={!!isFiltered}
                            activeCategories={activeCategories}
                            debouncedSearch={debouncedSearch}
                            priceBounds={priceBounds}
                            priceRange={priceRange}
                            onRemoveCategory={handleCategoryToggle}
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
