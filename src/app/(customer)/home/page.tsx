"use client"

import { useMemo, useState } from "react"
import { useGetAllProducts } from "@/app/features/hooks/Product"
import { useGetAllCategories } from "@/app/features/hooks/Category"
import { CategoryItem, ProductListItem } from "@/components/customerComponent/shop/shop.types"
import { VariantPickerDialog } from "@/components/customerComponent/shop/VariantPickerDialog"
import { HomeHero } from "@/components/customerComponent/home/HomeHero"
import { HomeFeaturedProducts } from "@/components/customerComponent/home/HomeFeaturedProducts"
import { HomeCategories } from "@/components/customerComponent/home/HomeCategories"
import { HomePromoBanner } from "@/components/customerComponent/home/HomePromoBanner"

export default function HomePage() {

    const { data: featuredData, isLoading: isLoadingProducts } = useGetAllProducts({
        sort_by: "featured",
        page: 1,
        page_size: 4,
    })

    const { data: categoriesData, isLoading: isLoadingCategories } = useGetAllCategories()

    const [pickerProduct, setPickerProduct] = useState<ProductListItem | null>(null)

    const featuredProducts = useMemo(
        () => (featuredData?.items ?? []) as ProductListItem[],
        [featuredData]
    )
    const categories = useMemo(
        () => (categoriesData ?? []) as CategoryItem[],
        [categoriesData]
    )

    return (
        <div className="min-h-screen bg-white">
            <HomeHero />

            <HomeFeaturedProducts
                products={featuredProducts}
                isLoading={isLoadingProducts}
                onPickVariant={setPickerProduct}
            />

            <HomeCategories
                categories={categories}
                isLoading={isLoadingCategories}
            />

            <HomePromoBanner />

            <VariantPickerDialog
                product={pickerProduct}
                open={!!pickerProduct}
                onOpenChange={v => { if (!v) setPickerProduct(null) }}
            />
        </div>
    )
}
