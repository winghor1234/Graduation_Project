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

    if (isLoading) return <p className="text-center p-4">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>

    return (
        <table className="w-full text-sm border">
            <thead>
                <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left">ຜູ້ສະໜອງ (Supplier)</th>
                    <th className="p-3 text-left">ຍອດລວມ (Total)</th>
                    <th className="p-3 text-left">ສະຖານະ (Status)</th>
                    <th className="p-3 text-left">ການຈັດການ (Actions)</th>
                </tr>
            </thead>

            <tbody>
                {purchases.map((p) => (
                    <tr key={p.purchase_id} className="border-b hover:bg-gray-50/50">
                        <td className="p-3">{p.supplier?.supplier_name}</td>
                        <td className="p-3">{p.total_amount}</td>
                        <td className="p-3">{p.status}</td>

                        <td className="p-3 flex gap-2">
                            <Button size="sm" onClick={() => onEdit(p)}>
                                ແກ້ໄຂ
                            </Button>

                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onDelete(p.purchase_id)}
                            >
                                ລຶບ
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}