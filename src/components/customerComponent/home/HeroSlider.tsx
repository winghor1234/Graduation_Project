"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    type CarouselApi,
} from "@/components/ui/carousel"
import { useGetAllProducts } from "@/app/features/hooks/Product"
import { formatCurrency } from "@/utils/FormatCurrency"
import { ProductListItem } from "@/components/customerComponent/shop/shop.types"

const AUTOPLAY_MS = 5000

function HeroSliderSkeleton() {
    return (
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] rounded-2xl bg-brand-card-dark animate-pulse mb-8" />
    )
}

export function HeroSlider() {
    // ✅ ໃຊ້ຂໍ້ມູນສິນຄ້າແນະນຳຈິງ — ບໍ່ໃຊ້ຮູບ placeholder ແຕ່ງຂຶ້ນ
    const { data, isLoading } = useGetAllProducts({ sort_by: "featured", page: 1, page_size: 5 })
    const items = (data?.items ?? []) as ProductListItem[]

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!api) return
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => setCurrent(api.selectedScrollSnap()))
    }, [api])

    // ✅ ຫຼິ້ນອັດຕະໂນມັດ — ຢຸດເອງຖ້າມີສະໄລ້ດຽວ
    useEffect(() => {
        if (!api || items.length <= 1) return
        const id = setInterval(() => api.scrollNext(), AUTOPLAY_MS)
        return () => clearInterval(id)
    }, [api, items.length])

    if (isLoading) return <HeroSliderSkeleton />
    if (!items.length) return null

    return (
        <div className="mb-8">
            <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
                <CarouselContent className="ml-0">
                    {items.map((product, index) => (
                        <CarouselItem key={product.product_id} className="pl-0">
                            <Link
                                href={`/customer/shop/${product.product_id}`}
                                className="group relative block w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden bg-brand-card-dark"
                            >
                                <Image
                                    src={product.images?.[0]?.image_url || "/placeholder.png"}
                                    alt={product.product_name}
                                    fill
                                    sizes="100vw"
                                    priority={index === 0}
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-5 sm:p-8 space-y-2 max-w-lg">
                                    <h2 className="text-xl sm:text-3xl font-extrabold text-white line-clamp-2">
                                        {product.product_name}
                                    </h2>
                                    <p className="text-lg sm:text-2xl font-bold text-brand-orange">
                                        {formatCurrency(product.min_price)}
                                    </p>
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover px-4 py-2 rounded-xl transition-colors">
                                        ຊື້ເລີຍ <ArrowRight className="size-4" />
                                    </span>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {items.length > 1 && (
                    <>
                        <CarouselPrevious className="left-3 bg-black/40 border-none text-white hover:bg-black/60 hover:text-white" />
                        <CarouselNext className="right-3 bg-black/40 border-none text-white hover:bg-black/60 hover:text-white" />
                    </>
                )}
            </Carousel>

            {items.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => api?.scrollTo(i)}
                            aria-label={`ໄປສະໄລ້ທີ ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all ${
                                i === current ? "w-6 bg-brand-orange" : "w-1.5 bg-brand-divider"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
