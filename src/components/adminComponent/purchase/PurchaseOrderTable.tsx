"use client"

import { Button } from "@/components/ui/button"
import { PurchaseOrder } from "@/modules/purchase/purchase.type"

type Props = {
    purchases: PurchaseOrder[]
    isLoading: boolean
    onEdit: (p: PurchaseOrder) => void
    onDelete: (id: string) => void
}

export function PurchaseOrderTable({ purchases, isLoading, onEdit, onDelete }: Props) {

    if (isLoading) return <p>Loading...</p>

    return (
        <table className="w-full text-sm border">
            <thead>
                <tr className="border-b">
                    <th className="p-3">Supplier</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>

            <tbody>
                {purchases.map((p) => (
                    <tr key={p.purchase_id} className="border-b">
                        <td className="p-3">{p.supplier?.supplier_name}</td>
                        <td className="p-3">{p.total_amount}</td>
                        <td className="p-3">{p.status}</td>

                        <td className="p-3 flex gap-2">
                            <Button size="sm" onClick={() => onEdit(p)}>
                                Edit
                            </Button>

                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onDelete(p.purchase_id)}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}