"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, PackagePlus } from "lucide-react"
import { Import, CreateImportInput, ConfirmImportInput } from "@/modules/import/import.type"
import { PurchaseOrder } from "../purchase/PurchaseType"
import { formatDate } from "@/utils/FormatDate"
import { formatCurrency } from "@/utils/FormatCurrency"
import { BadgeComponent } from "../StatusComponent"
import { ImportViewDialog } from "./ImportViewDialog"
import { FaCheckSquare, FaTimesCircle } from "react-icons/fa"
import { CiImport } from "react-icons/ci";
import { UseMutationResult } from "@tanstack/react-query"

type Props = {
    imports: Import[]
    isLoading: boolean
    onDelete: (id: string) => void
    confirm: UseMutationResult<void, Error, { id: string; data?: ConfirmImportInput }>
    cancel: UseMutationResult<void, Error, string>
    purchases: PurchaseOrder[]
    create: UseMutationResult<Import, Error, CreateImportInput>
}

// ✅ ແຖວດຽວກັນ — ບໍ່ວ່າຈະເປັນໃບສັ່ງຊື້ທີ່ຍັງບໍ່ນຳເຂົ້າ ຫຼື import ທີ່ສ້າງແລ້ວ
type UnifiedRow =
    | { kind: "pending"; purchase: PurchaseOrder }
    | { kind: "import"; item: Import }

export function ImportTable({ imports, isLoading, onDelete, confirm, cancel, purchases, create }: Props) {

    const [selected, setSelected] = useState<Import | null>(null)
    const [viewOpen, setViewOpen] = useState(false)

    const [createOpen, setCreateOpen] = useState(false)
    const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | undefined>()

    // ✅ ໃບສັ່ງຊື້ທີ່ PENDING ແລະ ຍັງບໍ່ທັນມີ import — ລໍຖ້ານຳເຂົ້າ
    const pendingPurchases = purchases.filter(p => p.status === "PENDING" && !p.import)

    // ✅ ລວມທັງ 2 ຊະນິດເຂົ້າໃນຕາຕະລາງດຽວ — ໃບສັ່ງຊື້ທີ່ລໍຖ້ານຳເຂົ້າສະແດງກ່ອນ, ຕາມດ້ວຍ import ທີ່ສ້າງແລ້ວ
    const rows: UnifiedRow[] = [
        ...pendingPurchases.map((purchase): UnifiedRow => ({ kind: "pending", purchase })),
        ...imports.map((item): UnifiedRow => ({ kind: "import", item })),
    ]

    const handleInsertImport = (purchaseId: string) => {
        setSelectedPurchaseId(purchaseId)
        setCreateOpen(true)
    }

    if (isLoading) {
        return <Card className="p-12 text-center text-sm text-admin-muted rounded-2xl border border-admin-border bg-admin-card"><div className="animate-pulse">ກຳລັງໂຫຼດ...</div></Card>
    }

    if (!rows.length) {
        return <Card className="p-12 text-center text-sm text-admin-muted rounded-2xl border border-admin-border bg-admin-card"><p>ຍັງບໍ່ມີຂໍ້ມູນການນຳເຂົ້າ</p></Card>
    }

    return (
        <>
            <Card className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-sm">
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-205">
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-10">#</TableHead>
                                <TableHead>ລະຫັດນຳເຂົ້າ</TableHead>
                                <TableHead>ລະຫັດສັ່ງຊື້</TableHead>
                                <TableHead>ຜູ້ສະໜອງ</TableHead>
                                <TableHead>ພະນັກງານ</TableHead>
                                <TableHead className="text-center">ສະຖານະ</TableHead>
                                <TableHead className="text-center">ວັນທີ</TableHead>
                                <TableHead className="text-right">ຍອດລວມ</TableHead>
                                <TableHead className="text-center">ການຈັດການ</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {rows.map((row, index) => {
                                if (row.kind === "pending") {
                                    const p = row.purchase
                                    return (
                                        <TableRow key={`pending-${p.purchase_id}`} className="bg-amber-50/60 hover:bg-amber-50">
                                            <TableCell className="text-muted-foreground text-xs">{index + 1}</TableCell>
                                            <TableCell className="font-mono text-sm text-muted-foreground">—</TableCell>
                                            <TableCell className="font-mono text-sm">{p.purchase_code}</TableCell>
                                            <TableCell>{p.supplier?.supplier_name ?? "—"}</TableCell>
                                            <TableCell className="text-muted-foreground">—</TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                                                    ລໍຖ້ານຳເຂົ້າ
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center text-sm">{formatDate(p.purchase_date)}</TableCell>
                                            <TableCell className="text-right text-sm">{formatCurrency(p.total_amount ?? 0)}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1.5 hover:bg-brand-blue-soft hover:text-brand-blue"
                                                        onClick={() => handleInsertImport(p.purchase_id)}
                                                    >
                                                        <PackagePlus className="w-4 h-4" />
                                                        ນຳເຂົ້າ
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                                const item = row.item
                                const canDelete = item.status === "CANCELLED"

                                return (
                                    <TableRow key={item.import_id}>
                                        <TableCell className="text-muted-foreground text-xs">{index + 1}</TableCell>
                                        <TableCell className="font-mono text-sm">{item.import_code}</TableCell>
                                        <TableCell className="font-mono text-sm">{item.purchase?.purchase_code ?? "—"}</TableCell>
                                        <TableCell>{item.purchase?.supplier?.supplier_name ?? "—"}</TableCell>
                                        <TableCell>{item.employee?.employee_name ?? "—"}</TableCell>
                                        <TableCell className="text-center">
                                            <BadgeComponent status={item.status} />
                                        </TableCell>
                                        <TableCell className="text-center text-sm">{formatDate(item.import_date)}</TableCell>
                                        <TableCell className="text-right text-sm">{formatCurrency(item.purchase?.total_amount ?? 0)}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-1">

                                                {/* ✅ ປຸ່ມ view+action dialog (ລວມ PDF export ໄວ້ນຳກັນແລ້ວ) */}
                                                <Button
                                                    size="icon" variant="ghost"
                                                    className="hover:bg-amber-50"
                                                    onClick={() => {
                                                        setSelected(item)
                                                        setViewOpen(true)
                                                    }}
                                                    title={
                                                        item.status === "PENDING" ? "ລໍຖ້າຢືນຢັນນຳເຂົ້າ" : "ຢືນຢັນນຳເຂົ້າແລ້ວ"
                                                    }
                                                >
                                                    {
                                                        item.status === "PENDING" ? (
                                                            <CiImport className="w-5 h-5 bg-amber-400 hover:bg-amber-500 rounded-2xl" />
                                                        ) : item.status === "COMPLETED" ? (
                                                            <FaCheckSquare className="w-4 h-4 text-green-500 hover:text-green-600 bg-green-100 hover:bg-green-500 rounded" />
                                                        ) : (
                                                            <FaTimesCircle className="w-4 h-4 text-red-500 hover:text-red-600 bg-red-100 hover:bg-red-500 rounded" />
                                                        )
                                                    }
                                                </Button>

                                                {/* Delete — CANCELLED only */}
                                                <Button
                                                    size="icon" variant="ghost"
                                                    className="hover:bg-red-50"
                                                    onClick={() => onDelete(item.import_id)}
                                                    disabled={!canDelete}
                                                    title={!canDelete ? "ລຶບໄດ້ສະເພາະ CANCELLED" : "ລຶບ"}
                                                >
                                                    <Trash2 className={`w-4 h-4 ${canDelete ? "text-red-500" : "text-gray-300"}`} />
                                                </Button>

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* ✅ View + action dialog */}
            <ImportViewDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                data={selected ?? undefined}
                confirm={confirm}
                cancel={cancel}
            />

            {/* ✅ Create dialog — ເປີດຈາກແຖວໃບສັ່ງຊື້ລໍຖ້ານຳເຂົ້າ, ເລືອກໃບສັ່ງຊື້ໄວ້ລ່ວງໜ້າ */}
            <ImportViewDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                confirm={confirm}
                cancel={cancel}
                create={create}
                purchases={purchases}
                initialPurchaseId={selectedPurchaseId}
            />
        </>
    )
}
