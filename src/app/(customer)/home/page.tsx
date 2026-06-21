

// "use client"

// import React, { useMemo, useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { ArrowRight, TrendingUp } from "lucide-react"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { useGetAllProducts } from "@/app/features/hooks/Product"
// import { formatCurrency } from "@/utils/FormatCurrency"
// import { Product } from "@/modules/product/product.types"
// import { VariantSelectDialog } from "@/components/customerComponent/home/VariantSelectDialog"

// export default function HomePage() {

//     const { data: products = [], isLoading, error } = useGetAllProducts()
//     const [pickerProduct, setPickerProduct] = useState<Product | null>(null)

//     // ✅ "Featured" — ບໍ່ມີ field ນີ້ໃນ Schema, ໃຊ້ 4 ລາຍການລ່າສຸດແທນ
//     const featuredProducts = useMemo(() => products.slice(0, 4), [products])

//     // ✅ Categories — unique ຈາກ products
//     const categories = useMemo(() => {
//         const map = new Map<string, { name: string; image: string; link: string }>()
//         products.forEach(p => {
//             if (p.category && !map.has(p.category.category_id)) {
//                 map.set(p.category.category_id, {
//                     name: p.category.category_name,
//                     image: p.images?.[0]?.image_url ?? "/placeholder.png",
//                     link: `/products?category=${p.category.category_id}`,
//                 })
//             }
//         })
//         return Array.from(map.values())
//     }, [products])

//     if (isLoading) {
//         return (
//             <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground animate-pulse">
//                 ກຳລັງດຶງຂໍ້ມູນສິນຄ້າ... 📦
//             </div>
//         )
//     }

//     if (error) {
//         return (
//             <div className="flex h-screen items-center justify-center text-lg font-medium text-destructive">
//                 ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ ❌
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-background">

//             {/* Hero Banner */}
//             <section className="relative h-[600px] bg-black text-white overflow-hidden">
//                 <div
//                     className="absolute inset-0 bg-cover bg-center opacity-60"
//                     style={{ backgroundImage: "url(https://images.unsplash.com/photo-1762709553300-342ab94e8b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)" }}
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
//                         <Link href="/shop">
//                             <Button size="lg" className="text-lg px-8 py-6">
//                                 Shop Now <ArrowRight className="ml-2 size-5" />
//                             </Button>
//                         </Link>
//                     </div>
//                 </div>
//             </section>

//             {/* Featured Products */}
//             <section className="py-20 bg-white">
//                 <div className="container mx-auto px-4">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
//                         <div>
//                             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
//                                 Featured Products
//                             </h2>
//                             <p className="text-gray-500 mt-1">Our best-selling items this season</p>
//                         </div>
//                         <Link href="/shop">
//                             <Button variant="outline" className="w-full sm:w-auto">
//                                 View All <ArrowRight className="ml-2 size-4" />
//                             </Button>
//                         </Link>
//                     </div>

//                     {featuredProducts.length === 0 ? (
//                         <p className="text-center text-muted-foreground py-12">
//                             ບໍ່ມີສິນຄ້າໃນຂະນະນີ້
//                         </p>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                             {featuredProducts.map(product => {

//                                 // ✅ ດຶງລາຄາ ແລະ ສາງຈາກ variants
//                                 const prices = product.variants?.map(v => v.sale_price) ?? []
//                                 const minPrice = prices.length ? Math.min(...prices) : 0
//                                 const maxPrice = prices.length ? Math.max(...prices) : 0
//                                 const priceLabel = prices.length === 0
//                                     ? "ບໍ່ມີຕົວເລືອກ"
//                                     : minPrice === maxPrice
//                                         ? formatCurrency(minPrice)
//                                         : `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`

//                                 const totalStock = product.variants?.reduce((s, v) => s + v.stock_qty, 0) ?? 0
//                                 const inStock = totalStock > 0

//                                 return (
//                                     <Card
//                                         key={product.product_id}
//                                         className="group border shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden bg-white flex flex-col justify-between"
//                                     >
//                                         <Link href={`/home/${product.product_id}`} className="flex-1">
//                                             <div className="aspect-square relative overflow-hidden bg-gray-50">
//                                                 <Image
//                                                     src={product.images?.[0]?.image_url ?? "/placeholder.png"}
//                                                     alt={product.product_name}
//                                                     fill
//                                                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//                                                     className="object-cover group-hover:scale-105 transition-transform duration-300"
//                                                 />
//                                                 {!inStock && (
//                                                     <div className="absolute inset-0 flex items-center justify-center bg-black/40">
//                                                         <span className="text-white text-xs font-medium px-3 py-1 bg-black/60 rounded-full">
//                                                             ໝົດສາງ
//                                                         </span>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <CardContent className="p-4">
//                                                 <h3 className="font-semibold mb-1 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
//                                                     {product.product_name}
//                                                 </h3>
//                                                 <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
//                                                     {product.description || "ບໍ່ມີລາຍລະອຽດສິນຄ້າ"}
//                                                 </p>
//                                                 <div className="flex items-center justify-between mt-2 gap-2">
//                                                     <span className="text-lg font-bold text-gray-900 truncate">
//                                                         {priceLabel}
//                                                     </span>
//                                                     <Badge variant={inStock ? "secondary" : "destructive"}>
//                                                         {inStock ? "In Stock" : "Out of Stock"}
//                                                     </Badge>
//                                                 </div>
//                                             </CardContent>
//                                         </Link>

//                                         <div className="p-4 pt-0">
//                                             <Button
//                                                 onClick={(e) => {
//                                                     e.preventDefault()
//                                                     setPickerProduct(product)
//                                                 }}
//                                                 disabled={!inStock}
//                                                 className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
//                                             >
//                                                 ຢິບໃສ່ກະຕ່າ
//                                             </Button>
//                                         </div>
//                                     </Card>
//                                 )
//                             })}
//                         </div>
//                     )}
//                 </div>
//             </section>

//             {/* Categories */}
//             {categories.length > 0 && (
//                 <section className="py-20 bg-gray-50">
//                     <div className="container mx-auto px-4">
//                         <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 tracking-tight">
//                             Shop by Category
//                         </h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             {categories.map(category => (
//                                 <Link
//                                     key={category.link}
//                                     href={category.link}
//                                     className="group relative h-80 overflow-hidden rounded-xl block shadow-sm hover:shadow-md transition-all duration-200"
//                                 >
//                                     <Image
//                                         src={category.image}
//                                         alt={category.name}
//                                         fill
//                                         sizes="(max-width: 768px) 100vw, 33vw"
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

//             {/* Promo Banner */}
//             <section className="py-20 bg-black text-white relative overflow-hidden">
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

//             {/* ✅ Variant picker dialog */}
//             <VariantSelectDialog
//                 product={pickerProduct}
//                 open={!!pickerProduct}
//                 onOpenChange={(v) => { if (!v) setPickerProduct(null) }}
//             />
//         </div>
//     )
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
import { useGetAllCategories } from "@/app/features/hooks/Category"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Product } from "@/components/adminComponent/products/ProductType"
import { VariantSelectDialog } from "@/components/customerComponent/home/VariantSelectDialog"

// ✏️ ໃຊ້ palette ໝວດໝູ່ ໝູນອ້ອມ — Category ບໍ່ມີ field ຮູບພາບໃນ schema,
// ສະນັ້ນແທນທີ່ຈະ "ຂູດ" ຮູບຈາກ product ທຳອິດ (ບໍ່ໜ້າເຊື່ອຖືຖ້າສິນຄ້າຍັງບໍ່ໂຫຼດມາ),
// ໃຊ້ gradient card + ຊື່ + ຈຳນວນສິນຄ້າແທນ → ສະແດງໝົດທຸກໝວດໝູ່ສະເໝີ
const CATEGORY_GRADIENTS = [
    "from-slate-900 to-slate-700",
    "from-blue-900 to-blue-700",
    "from-emerald-900 to-emerald-700",
    "from-amber-900 to-amber-700",
    "from-rose-900 to-rose-700",
    "from-purple-900 to-purple-700",
]

export default function HomePage() {

    // ✅ ດຶງສະເພາະ 4 ລາຍການລ່າສຸດຈາກ backend ໂດຍກົງ (ບໍ່ overfetch ແລ້ວ slice ໃນ client)
    const {
        data: featuredData,
        isLoading: isLoadingProducts,
        error: productsError,
    } = useGetAllProducts({ sort_by: "featured", page: 1, page_size: 4 })

    const {
        data: categoriesData,
        isLoading: isLoadingCategories,
    } = useGetAllCategories()

    const [pickerProduct, setPickerProduct] = useState<Product | null>(null)

    // ✅ data shape ຈາກ backend ແມ່ນ { items, meta } — ບໍ່ແມ່ນ array ກົງໆ
    const featuredProducts = useMemo(() => featuredData?.items ?? [], [featuredData])

    // ✅ ໝວດໝູ່ດຶງມາຈາກ category endpoint ຈິງ (ບໍ່ derive ຈາກ products) → ມາຄົບທຸກໝວດ
    const categories = useMemo(() => categoriesData ?? [], [categoriesData])

    const isLoading = isLoadingProducts || isLoadingCategories

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground animate-pulse">
                ກຳລັງດຶງຂໍ້ມູນສິນຄ້າ... 📦
            </div>
        )
    }

    if (productsError) {
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
                            {categories.map((category, index) => (
                                <Link
                                    key={category.category_id}
                                    href={`/shop?category=${category.category_id}`}
                                    className={`group relative h-80 overflow-hidden rounded-xl block shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br ${CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length]}`}
                                >
                                    <div className="absolute inset-0 flex flex-col items-start justify-end p-8 transition-colors group-hover:bg-black/10">
                                        <h3 className="text-2xl font-bold text-white tracking-wide">
                                            {category.category_name}
                                        </h3>
                                        {typeof category._count?.products === "number" && (
                                            <p className="text-sm text-white/70 mt-1">
                                                {category._count.products} ລາຍການ
                                            </p>
                                        )}
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