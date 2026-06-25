
"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Trash2 } from "lucide-react"
import { Import } from "@/modules/import/import.type"
import { formatDate } from "@/utils/FormatDate"
import { BadgeComponent } from "../StatusComponent"
import { ImportViewDialog } from "./ImportViewDialog"
import { FaCheckSquare, FaTimesCircle } from "react-icons/fa"
import { CiImport } from "react-icons/ci";
import { UseMutationResult } from "@tanstack/react-query"

type Props = {
    imports: Import[]
    isLoading: boolean
    onDelete: (id: string) => void
    onView: (i: Import) => void
     confirm: UseMutationResult<void, Error, string>;
    cancel: UseMutationResult<void, Error, string>;
}

export function ImportTable({ imports, isLoading, onView, onDelete, confirm, cancel }: Props) {

    const [selected, setSelected] = useState<Import | null>(null)
    const [viewOpen, setViewOpen] = useState(false)

    if (isLoading) {
        return <Card className="p-12 text-center text-sm text-admin-muted rounded-2xl border border-admin-border bg-admin-card"><div className="animate-pulse">ກຳລັງໂຫຼດ...</div></Card>
    }
    if (!imports?.length) {
        return <Card className="p-12 text-center text-sm text-admin-muted rounded-2xl border border-admin-border bg-admin-card"><p>ຍັງບໍ່ມີຂໍ້ມູນການນຳເຂົ້າ</p></Card>
    }

    return (
        <>
            <Card className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-sm">
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-[760px]">

                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-10">#</TableHead>
                                <TableHead>ລະຫັດນຳເຂົ້າ</TableHead>
                                <TableHead>ລະຫັດສັ່ງຊື້</TableHead>
                                <TableHead>ຜູ້ສະໜອງ</TableHead>
                                <TableHead>ພະນັກງານ</TableHead>
                                <TableHead className="text-center">ສະຖານະ</TableHead>
                                <TableHead className="text-center">ວັນທີນຳເຂົ້າ</TableHead>
                                <TableHead className="text-center">ການຈັດການ</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {imports.map((item, index) => {

                                const canDelete = item.status === "CANCELLED"

                                return (
                                    <TableRow key={item.import_id}>

                                        <TableCell className="text-muted-foreground text-xs">
                                            {index + 1}
                                        </TableCell>

                                        <TableCell className="font-mono text-sm">
                                            {item.import_code}
                                        </TableCell>

                                        <TableCell className="font-mono text-sm">
                                            {item.purchase?.purchase_code ?? "—"}
                                        </TableCell>

                                        <TableCell>
                                            {item.purchase?.supplier?.supplier_name ?? "—"}
                                        </TableCell>

                                        <TableCell>
                                            {item.employee?.employee_name ?? "—"}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <BadgeComponent status={item.status} />
                                        </TableCell>

                                        <TableCell className="text-center text-sm">
                                            {formatDate(item.import_date)}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex justify-center gap-1">

                                                {/* View detail */}
                                                <Button
                                                    size="icon" variant="ghost"
                                                    className="hover:bg-brand-blue-soft"
                                                    onClick={() => onView(item)}
                                                    title="ລາຍລະອຽດ (PDF)"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-500 hover:text-brand-blue" />
                                                </Button>

                                                {/* ✅ ປຸ່ມ view+action dialog */}
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
                                                    <Trash2 className={`w-4 h-4 ${canDelete ? "text-red-500" : "text-gray-300"
                                                        }`} />
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
        </>
    )
}

