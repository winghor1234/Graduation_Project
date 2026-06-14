"use client"

import { formatCurrency } from "@/utils/FormatCurrency"
import { CartItemType } from "./type"

type Props = {
    cart: CartItemType[]
    total: number
    loading?: boolean
    onConfirm: () => void
    onClose: () => void
}

export default function ConfirmModal({
    cart,
    total,
    loading = false,
    onConfirm,
    onClose,
}: Props) {
    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="border-b p-5">
                    <h2 className="text-xl font-bold">
                        ຢືນຢັນການຂາຍ
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        ກວດສອບຂໍ້ມູນກ່ອນບັນທຶກການຂາຍ
                    </p>
                </div>

                {/* Products */}
                <div className="max-h-[400px] overflow-y-auto p-5">

                    <div className="mb-4 flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
                        <span>ຈຳນວນລາຍການ</span>
                        <span className="font-semibold">
                            {cart.length}
                        </span>
                    </div>

                    <div className="space-y-2">

                        {cart.map((item, index) => (
                            <div
                                key={item.product_id}
                                className="flex items-center justify-between rounded-lg border p-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        {index + 1}. {item.product_name}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {formatCurrency(item.sale_price)}
                                        {" × "}
                                        {item.quantity}
                                    </p>
                                </div>

                                <div className="font-semibold">
                                    {formatCurrency(
                                        item.sale_price *
                                        item.quantity
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>

                </div>

                {/* Summary */}
                <div className="border-t p-5 space-y-2">

                    <div className="flex justify-between text-sm">
                        <span>ຈຳນວນສິນຄ້າ</span>
                        <span>{totalItems}</span>
                    </div>

                    <div className="flex justify-between text-lg font-bold">
                        <span>ລວມທັງໝົດ</span>
                        <span>
                            {formatCurrency(total)}
                        </span>
                    </div>

                </div>

                {/* Footer */}
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
                        className="flex-1 rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "ກຳລັງບັນທຶກ..."
                            : "ຢືນຢັນການຂາຍ"}
                    </button>

                </div>

            </div>

        </div>
    )
}