// "use client"

// import Image from "next/image"
// import { formatCurrency } from "@/utils/FormatCurrency"
// import { CartItemType } from "./type"

// type Props = {
//     products: CartItemType[]
//     onAdd: (product: CartItemType) => void
// }

// export default function ProductGrid({  products,  onAdd,}: Props) {
//     if (!products.length) {
//         return (
//             <div className="flex items-center justify-center h-64 rounded-xl border border-dashed bg-white">
//                 <p className="text-sm text-muted-foreground">
//                     ບໍ່ພົບສິນຄ້າ
//                 </p>
//             </div>
//         )
//     }

//     return (
//         <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 "  >
//             {products.map((p) => (
//                 <button
//                     key={p.product_id}
//                     type="button"
//                     onClick={() => onAdd(p)}
//                     className=" group overflow-hidden rounded-xl border border-gray-200  bg-white text-left transition-all duration-200 hover:border-primary/30 hover:shadow-md active:scale-[0.98]  " >
//                     {/* Product Image */}
//                     <div className="relative aspect-square overflow-hidden bg-gray-100">
//                         {p.images?.[0]?.image_url ? (
//                             <Image
//                                 src={p.images[0].image_url}
//                                 alt={p.product_name}
//                                 fill
//                                 sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 200px"
//                                 className="  object-cover transition-transform duration-300 group-hover:scale-105  "
//                             />
//                         ) : (
//                             <div className="flex h-full items-center justify-center text-xs text-gray-400">
//                                 ບໍ່ມີຮູບ
//                             </div>
//                         )}
//                     </div>

//                     {/* Product Info */}
//                     <div className="p-3">
//                         <h3
//                             className="
//                                 text-sm
//                                 font-medium
//                                 text-gray-900
//                                 line-clamp-2
//                                 min-h-[40px]
//                             "
//                         >
//                             {p.product_name}
//                         </h3>

//                         <div className="mt-2 flex items-center justify-between gap-2">
//                             <span
//                                 className="
//                                     text-sm
//                                     font-bold
//                                     text-primary
//                                     truncate
//                                 "
//                             >
//                                 {formatCurrency(p.sale_price)}
//                             </span>

//                             <span
//                                 className="
//                                     shrink-0
//                                     rounded-full
//                                     bg-primary/10
//                                     px-2
//                                     py-1
//                                     text-[11px]
//                                     font-medium
//                                     text-primary
//                                     ring-1
//                                     ring-inset
//                                     ring-primary/10
//                                     hover:bg-blue-500 hover:text-white
//                                 "
//                             >
//                                 + ເພີ່ມ
//                             </span>
//                         </div>
//                     </div>
//                 </button>
//             ))}
//         </div>
//     )
// }



"use client"

import { useState } from "react"
import Image from "next/image"
import { formatCurrency } from "@/utils/FormatCurrency"
import { Product } from "@/modules/product/product.types"
import { CartItemType } from "./type"
import { VariantPickerDialog } from "./VariantPickerDialog"

type Props = {
    products: Product[]
    onAdd: (item: CartItemType) => void
}

export default function ProductGrid({ products, onAdd }: Props) {

    const [pickerProduct, setPickerProduct] = useState<Product | null>(null)

    if (!products.length) {
        return (
            <div className="flex items-center justify-center h-64 rounded-xl border border-dashed bg-white">
                <p className="text-sm text-muted-foreground">ບໍ່ພົບສິນຄ້າ</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {products.map(p => {

                    // ✅ ລາຄາ min/max ຈາກ variants
                    const prices = p.variants?.map(v => v.sale_price) ?? []
                    const minPrice = prices.length ? Math.min(...prices) : 0
                    const maxPrice = prices.length ? Math.max(...prices) : 0
                    const priceLabel = prices.length === 0
                        ? "ບໍ່ມີ variant"
                        : minPrice === maxPrice
                            ? formatCurrency(minPrice)
                            : `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`

                    const totalStock = p.variants?.reduce((s, v) => s + v.stock_qty, 0) ?? 0
                    const outOfStock = totalStock === 0

                    return (
                        <button
                            key={p.product_id}
                            type="button"
                            disabled={outOfStock}
                            onClick={() => setPickerProduct(p)}
                            className={`group overflow-hidden rounded-xl border bg-white text-left transition-all duration-200
                                ${outOfStock
                                    ? "opacity-50 cursor-not-allowed border-dashed"
                                    : "hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
                                }`}
                        >
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                {p.images?.[0]?.image_url ? (
                                    <Image
                                        src={p.images[0].image_url}
                                        alt={p.product_name}
                                        fill
                                        sizes="200px"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                        ບໍ່ມີຮູບ
                                    </div>
                                )}
                                {outOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">
                                            ໝົດສາງ
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-3">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]">
                                    {p.product_name}
                                </h3>
                                <div className="mt-2 flex items-center justify-between gap-1">
                                    <span className="text-xs font-bold text-primary truncate">
                                        {priceLabel}
                                    </span>
                                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary ring-1 ring-inset ring-primary/10">
                                        + ເພີ່ມ
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                    {p.variants?.length ?? 0} variants · ສາງ {totalStock}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* ✅ Variant picker */}
            <VariantPickerDialog
                product={pickerProduct}
                open={!!pickerProduct}
                onOpenChange={(v) => { if (!v) setPickerProduct(null) }}
                onAdd={onAdd}
            />
        </>
    )
}