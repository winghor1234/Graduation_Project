'use client'
import { Product } from "@/modules/product/product.types"
import Image from "next/image"
import { formatCurrency } from "@/utils/FormatCurrency"
import { CartItemType } from "./type"

type Props = {
    products: CartItemType[]
    onAdd: (product: CartItemType) => void
}

export default function ProductGrid({ products, onAdd }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

            {products.map((p) => (
                <div
                    key={p.product_id}
                    onClick={() => onAdd(p)}
                    className=" bg-white border rounded-xl p-2 cursor-pointer hover:shadow-md active:scale-95 transition"
                >
                    {/* IMAGE */}
                    <div className="w-full h-24 bg-gray-100 rounded-md overflow-hidden">
                        {p.images?.[0]?.image_url ? (
                            <Image
                                src={p.images[0].image_url}
                                alt={p.product_name}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                ບໍ່ມີຮູບພາບ
                            </div>
                        )}
                    </div>

                    {/* INFO */}
                    <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium truncate">
                            {p.product_name}
                        </p>

                        <p className="text-blue-500 font-semibold text-sm">
                            {formatCurrency(p.sale_price)}
                        </p>
                    </div>
                </div>
            ))}

            {/* EMPTY STATE */}
            {!products.length && (
                <div className="col-span-full text-center text-gray-400 py-10">
                    ບໍ່ພົບສິນຄ້າ
                </div>
            )}

        </div>
    )
}