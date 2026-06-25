"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, Plus, RotateCcw, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { useGetRefunds, useCreateRefund, useDeleteRefund } from "@/app/features/hooks/Refund"
import { useGetSales } from "@/app/features/hooks/Sale"
import { useDataTable } from "@/hooks/useDataTable"
import { Refund } from "@/modules/refund/refund.type"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"
import { RefundFormDialog } from "@/components/adminComponent/refund/RefundFormDialog"

// ────────────────────────────────────────────────────────────
// Skeleton
// ────────────────────────────────────────────────────────────

function TableSkeleton() {
    return (
        <div className="animate-pulse space-y-0">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                    <div className="h-4 w-6 bg-gray-100 rounded" />
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                    <div className="h-4 w-28 bg-gray-100 rounded flex-1" />
                    <div className="h-4 w-20 bg-gray-100 rounded" />
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                    <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                </div>
            ))}
        </div>
    )
}

// ────────────────────────────────────────────────────────────
// Refund Detail Dialog
// ────────────────────────────────────────────────────────────

function RefundDetailDialog({
    refund,
    open,
    onOpenChange,
}: {
    refund: Refund | null
    open: boolean
    onOpenChange: (v: boolean) => void
}) {
    if (!refund) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold">
                        ລາຍລະອຽດ Refund
                    </DialogTitle>
                </DialogHeader>

                {/* Header info */}
                <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                        <p className="text-sm text-gray-400">ລະຫັດ Refund</p>
                        <p className="font-bold font-mono tracking-wide text-gray-900">
                            {refund.refund_code}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(refund.createdAt)}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-sm text-gray-400">ໃບຂາຍ</p>
                        <p className="font-mono text-sm font-semibold text-gray-700">
                            {refund.sale?.sale_id?.slice(0, 8) ?? "—"}
                        </p>
                        {refund.sale?.customer?.customer_name && (
                            <p className="text-xs text-gray-400">{refund.sale.customer.customer_name}</p>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-2 max-h-72 overflow-y-auto">
                    {refund.refund_details?.length ? (
                        refund.refund_details.map(detail => (
                            <div
                                key={detail.refund_detail_id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-admin-bg border border-admin-border"
                            >
                                <div className="size-12 bg-white rounded-lg overflow-hidden shrink-0 relative border border-gray-100">
                                    <Image
                                        src={detail.product?.images?.[0]?.image_url ?? "/placeholder.png"}
                                        alt={detail.product?.product_name ?? ""}
                                        fill sizes="48px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {detail.product?.product_name ?? "ສິນຄ້າ"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {detail.quantity} ຊິ້ນ × {formatCurrency(detail.price)}
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-red-600 shrink-0">
                                    -{formatCurrency(detail.quantity * detail.price)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-6">ບໍ່ມີລາຍການ</p>
                    )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700">ຍອດ Refund ທັງໝົດ</span>
                    <span className="text-xl font-extrabold text-red-600">
                        -{formatCurrency(refund.total_amount)}
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ────────────────────────────────────────────────────────────
// Refund Table
// ────────────────────────────────────────────────────────────

const TABLE_HEADERS = [
    { label: "#",              width: "w-10"  },
    { label: "ລະຫັດ Refund",   width: "w-36"  },
    { label: "ໃບຂາຍ",          width: "w-28"  },
    { label: "ລູກຄ້າ",          width: ""      },
    { label: "ລາຍການ",         width: "w-20 text-center"  },
    { label: "ຍອດ Refund",     width: "w-32 text-right"  },
    { label: "ວັນທີ",           width: "w-28"  },
    { label: "",               width: "w-24"  },
]

function RefundTable({
    refunds,
    isLoading,
    onView,
    onDelete,
}: {
    refunds: Refund[]
    isLoading: boolean
    onView: (r: Refund) => void
    onDelete: (id: string) => void
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2.5rem_1fr_1fr_2fr_5rem_8rem_7rem_6rem] gap-0 border-b border-admin-border bg-admin-bg">
                {TABLE_HEADERS.map((h, i) => (
                    <div key={i} className={`px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide ${h.width}`}>
                        {h.label}
                    </div>
                ))}
            </div>

            {isLoading ? (
                <TableSkeleton />
            ) : refunds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <RotateCcw className="size-10 text-gray-200" />
                    <p className="text-sm font-medium">ຍັງບໍ່ມີລາຍການ Refund</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {refunds.map((r, idx) => (
                        <div
                            key={r.refund_id}
                            className="grid grid-cols-[2.5rem_1fr_1fr_2fr_5rem_8rem_7rem_6rem] items-center hover:bg-brand-blue-soft/30 transition-colors"
                        >
                            <div className="px-4 py-3.5 text-xs text-gray-400 font-medium">{idx + 1}</div>

                            <div className="px-4 py-3.5">
                                <span className="font-mono text-sm font-semibold text-gray-900 tracking-wide">
                                    {r.refund_code}
                                </span>
                            </div>

                            <div className="px-4 py-3.5">
                                <span className="font-mono text-xs text-gray-500">
                                    {r.sale?.sale_id?.slice(0, 8) ?? "—"}
                                </span>
                            </div>

                            <div className="px-4 py-3.5 min-w-0">
                                <p className="text-sm text-gray-700 truncate">
                                    {r.sale?.customer?.customer_name ?? (
                                        <span className="text-gray-400 italic">Walk-in</span>
                                    )}
                                </p>
                            </div>

                            <div className="px-4 py-3.5 text-center">
                                <Badge variant="secondary" className="text-xs font-semibold">
                                    {r.refund_details?.length ?? 0}
                                </Badge>
                            </div>

                            <div className="px-4 py-3.5 text-right">
                                <span className="text-sm font-bold text-red-600">
                                    -{formatCurrency(r.total_amount)}
                                </span>
                            </div>

                            <div className="px-4 py-3.5">
                                <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                            </div>

                            <div className="px-4 py-3.5 flex items-center gap-1.5">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-lg text-gray-500 hover:text-gray-900"
                                    onClick={() => onView(r)}
                                >
                                    <Eye className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => onDelete(r.refund_id)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────

export default function RefundPage() {
    const table = useDataTable()
    const { data, isLoading } = useGetRefunds(table.params)
    const { data: salesData } = useGetSales({ limit: 999 })

    const create = useCreateRefund()
    const remove = useDeleteRefund()

    const [openForm,   setOpenForm]   = useState(false)
    const [openDetail, setOpenDetail] = useState(false)
    const [selected,   setSelected]   = useState<Refund | null>(null)

    const refunds  = data?.data ?? []
    const sales    = salesData?.data ?? []
    const meta     = data?.meta

    const handleDelete = (id: string) => {
        if (!window.confirm("ຕ້ອງການລຶບລາຍການ Refund ນີ້ ແລະ rollback stock ແທ້ບໍ່?")) return
        remove.mutate(id, {
            onSuccess: () => toast.success("ລຶບສຳເລັດ — stock ຖືກ rollback ແລ້ວ"),
            onError:   () => toast.error("ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່"),
        })
    }

    const handleView = (r: Refund) => {
        setSelected(r)
        setOpenDetail(true)
    }

    // Stats
    const totalRefundAmount = refunds.reduce((s, r) => s + (r.total_amount ?? 0), 0)

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                        ຈັດການການຄືນສິນຄ້າ
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        ສ້າງ ແລະ ຈັດການລາຍການ Refund — rollback stock ອັດຕະໂນມັດ
                    </p>
                </div>
                <Button
                    className="gap-2 h-10 rounded-xl bg-gray-900 hover:bg-gray-700 text-white font-semibold shrink-0"
                    onClick={() => setOpenForm(true)}
                >
                    <Plus className="size-4" />
                    ສ້າງ Refund
                </Button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Refund ທັງໝົດ</p>
                    <p className="text-2xl font-extrabold text-gray-900">{meta?.total ?? refunds.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">ຍອດ Refund ລວມ</p>
                    <p className="text-2xl font-extrabold text-red-600">-{formatCurrency(totalRefundAmount)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-1 hidden sm:block">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">ໃບຂາຍທີ່ refund ໄດ້</p>
                    <p className="text-2xl font-extrabold text-gray-900">{sales.length}</p>
                </div>
            </div>

            {/* Table */}
            <RefundTable
                refunds={refunds}
                isLoading={isLoading}
                onView={handleView}
                onDelete={handleDelete}
            />

            {/* Pagination info */}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <p>ສະແດງ {refunds.length} ຈາກ {meta.total} ລາຍການ</p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg"
                            disabled={table.page <= 1}
                            onClick={() => table.setPage(table.page - 1)}
                        >
                            ກ່ອນ
                        </Button>
                        <span className="px-3 py-1 text-xs text-gray-700 font-medium">
                            {table.page} / {meta.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg"
                            disabled={table.page >= meta.totalPages}
                            onClick={() => table.setPage(table.page + 1)}
                        >
                            ຕໍ່ໄປ
                        </Button>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            <RefundFormDialog
                open={openForm}
                onOpenChange={setOpenForm}
                sales={sales}
                create={create}
            />

            <RefundDetailDialog
                refund={selected}
                open={openDetail}
                onOpenChange={setOpenDetail}
            />
        </div>
    )
}