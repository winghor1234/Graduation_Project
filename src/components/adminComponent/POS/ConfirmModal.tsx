// "use client"

// import { formatCurrency } from "@/utils/FormatCurrency"
// import { CartItemType } from "./type"

// type Props = {
//     cart: CartItemType[]
//     total: number
//     loading?: boolean
//     onConfirm: () => void
//     onClose: () => void
// }

// export default function ConfirmModal({
//     cart,
//     total,
//     loading = false,
//     onConfirm,
//     onClose,
// }: Props) {
//     const totalItems = cart.reduce(
//         (sum, item) => sum + item.quantity,
//         0
//     )

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

//             <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

//                 {/* Header */}
//                 <div className="border-b p-5">
//                     <h2 className="text-xl font-bold">
//                         ຢືນຢັນການຂາຍ
//                     </h2>

//                     <p className="mt-1 text-sm text-muted-foreground">
//                         ກວດສອບຂໍ້ມູນກ່ອນບັນທຶກການຂາຍ
//                     </p>
//                 </div>

//                 {/* Products */}
//                 <div className="max-h-[400px] overflow-y-auto p-5">

//                     <div className="mb-4 flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
//                         <span>ຈຳນວນລາຍການ</span>
//                         <span className="font-semibold">
//                             {cart.length}
//                         </span>
//                     </div>

//                     <div className="space-y-2">

//                         {cart.map((item, index) => (
//                             <div
//                                 key={item.product_id}
//                                 className="flex items-center justify-between rounded-lg border p-3"
//                             >
//                                 <div>
//                                     <p className="font-medium">
//                                         {index + 1}. {item.product_name}
//                                     </p>

//                                     <p className="text-xs text-muted-foreground">
//                                         {formatCurrency(item.sale_price)}
//                                         {" × "}
//                                         {item.quantity}
//                                     </p>
//                                 </div>

//                                 <div className="font-semibold">
//                                     {formatCurrency(
//                                         item.sale_price *
//                                         item.quantity
//                                     )}
//                                 </div>
//                             </div>
//                         ))}

//                     </div>

//                 </div>

//                 {/* Summary */}
//                 <div className="border-t p-5 space-y-2">

//                     <div className="flex justify-between text-sm">
//                         <span>ຈຳນວນສິນຄ້າ</span>
//                         <span>{totalItems}</span>
//                     </div>

//                     <div className="flex justify-between text-lg font-bold">
//                         <span>ລວມທັງໝົດ</span>
//                         <span>
//                             {formatCurrency(total)}
//                         </span>
//                     </div>

//                 </div>

//                 {/* Footer */}
//                 <div className="flex gap-3 border-t p-5">

//                     <button
//                         onClick={onClose}
//                         disabled={loading}
//                         className="flex-1 rounded-lg border py-2.5 font-medium transition hover:bg-gray-50 disabled:opacity-50"
//                     >
//                         ຍົກເລີກ
//                     </button>

//                     <button
//                         onClick={onConfirm}
//                         disabled={loading}
//                         className="flex-1 rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
//                     >
//                         {loading
//                             ? "ກຳລັງບັນທຶກ..."
//                             : "ຢືນຢັນການຂາຍ"}
//                     </button>

//                 </div>

//             </div>

//         </div>
//     )
// }


"use client"

import { formatCurrency } from "@/utils/FormatCurrency"
import { CartItemType } from "./type"
import { Loader2 } from "lucide-react"
import Image from "next/image"

type Props = {
    cart:      CartItemType[]
    total:     number
    loading?:  boolean
    onConfirm: () => void
    onClose:   () => void
}

export default function ConfirmModal({ cart, total, loading = false, onConfirm, onClose }: Props) {
    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="border-b p-5">
                    <h2 className="text-xl font-bold">ຢືນຢັນການຂາຍ</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        ກວດສອບຂໍ້ມູນກ່ອນບັນທຶກການຂາຍ
                    </p>
                </div>

                {/* Items */}
                <div className="max-h-[360px] overflow-y-auto p-5 space-y-2">
                    {cart.map((item, index) => (
                        <div
                            key={item.variant_id}
                            className="flex items-center gap-3 rounded-lg border p-3"
                        >
                            {/* Image */}
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                {item.image_url ? (
                                    <Image
                                        src={item.image_url}
                                        alt={item.product_name}
                                        width={40} height={40}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                                        ບໍ່ມີຮູບ
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {index + 1}. {item.product_name}
                                </p>
                                {/* ✅ variant info */}
                                <p className="text-xs text-muted-foreground">
                                    {item.color} / {item.size} · {formatCurrency(item.sale_price)} × {item.quantity}
                                </p>
                            </div>

                            <span className="text-sm font-semibold shrink-0">
                                {formatCurrency(item.sale_price * item.quantity)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="border-t p-5 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>ຈຳນວນສິນຄ້າ</span>
                        <span>{totalItems} ຊິ້ນ</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>ລວມທັງໝົດ</span>
                        <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t p-5">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-lg border py-2.5 font-medium transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        ຍົກເລີກ
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 rounded-lg bg-primary py-2.5 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "ກຳລັງບັນທຶກ..." : "ຢືນຢັນການຂາຍ"}
                    </button>
                </div>

            </div>
        </div>
    )
}