'use client'

import { formatCurrency } from "@/utils/FormatCurrency"
import { CartItemType } from './type';

type Props = {
    cart: CartItemType[]
    total: number
    onConfirm: () => void
    onClose: () => void
}
export default function ConfirmModal({ cart, total, onConfirm, onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

                <h2 className="font-semibold text-lg">ຢືນຢັນຄຳສັ່ງຊື້</h2>

                <div className="max-h-60 overflow-auto space-y-2">
                    {cart.map((i) => (
                        <div key={i.product_id} className="flex justify-between text-sm">
                            <span>{i.product_name} x {i.quantity}</span>
                            <span>{formatCurrency(i.sale_price * i.quantity)}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between font-bold">
                    <span>ລວມທັງໝົດ (Total)</span>
                    <span>{formatCurrency(total)}</span>
                </div>

                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 border py-2 rounded hover:bg-gray-50">
                        ຍົກເລີກ
                    </button>
                    <button onClick={onConfirm} className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        ຢືນຢັນ
                    </button>
                </div>

            </div>
        </div>
    )
}