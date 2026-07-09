"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"
import { useGetExpenses, useCreateExpense, useDeleteExpense } from "@/app/features/hooks/Expense"
import { formatCurrency } from "@/utils/FormatCurrency"

function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString("lo-LA", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export default function SettingPage() {
    const { data: expenses = [], isLoading } = useGetExpenses()
    const { mutate: createExpense, isPending: isCreating } = useCreateExpense()
    const { mutate: deleteExpense } = useDeleteExpense()

    const [amount, setAmount] = useState("")
    const [reason, setReason] = useState("")
    const [note, setNote] = useState("")
    const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10))

    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)

    const handleAdd = () => {
        const amt = parseInt(amount, 10)
        if (isNaN(amt) || amt <= 0) {
            toast.error("ກະລຸນາໃສ່ຈຳນວນເງິນທີ່ຖືກຕ້ອງ")
            return
        }
        if (!reason.trim()) {
            toast.error("ກະລຸນາໃສ່ເຫດຜົນ")
            return
        }
        createExpense(
            { amount: amt, reason: reason.trim(), note: note.trim() || undefined, expense_date: expenseDate },
            {
                onSuccess: () => {
                    toast.success("ບັນທຶກລາຍຈ່າຍສຳເລັດ")
                    setAmount("")
                    setReason("")
                    setNote("")
                    setExpenseDate(new Date().toISOString().slice(0, 10))
                },
                onError: () => toast.error("ເກີດຂໍ້ຜິດພາດ"),
            }
        )
    }

    const handleDelete = (id: string) => {
        if (!confirm("ຢືນຢັນລຶບລາຍຈ່າຍນີ້?")) return
        deleteExpense(id, {
            onSuccess: () => toast.success("ລຶບສຳເລັດ"),
            onError: () => toast.error("ເກີດຂໍ້ຜິດພາດ"),
        })
    }

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-xl font-bold text-admin-text">ບັນທຶກລາຍຈ່າຍ</h1>
                <p className="text-sm text-admin-muted mt-1">ບັນທຶກລາຍຈ່າຍອື່ນໆ ເຊັ່ນ: ຄ່າຂົນສົ່ງເຄື່ອງຕີກັບ ແລະ ອື່ນໆ</p>
            </div>

            {/* Summary */}
            <div className="bg-admin-card border border-admin-border rounded-xl px-5 py-4 flex items-center justify-between">
                <span className="text-sm text-admin-muted">ລາຍຈ່າຍລວມ ({expenses.length} ລາຍການ)</span>
                <span className="text-lg font-bold text-red-500">{formatCurrency(totalExpenses)}</span>
            </div>

            {/* Add form */}
            <div className="bg-admin-card border border-admin-border rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-semibold text-admin-text">ເພີ່ມລາຍຈ່າຍໃໝ່</h2>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs text-admin-muted font-medium">ຈຳນວນເງິນ (ກີບ) *</label>
                        <input
                            type="number"
                            min={0}
                            step={1000}
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="50000"
                            className="w-full h-9 px-3 text-sm border border-admin-border rounded-lg bg-admin-bg text-admin-text focus:outline-none focus:border-brand-blue"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-admin-muted font-medium">ວັນທີ</label>
                        <input
                            type="date"
                            value={expenseDate}
                            onChange={e => setExpenseDate(e.target.value)}
                            className="w-full h-9 px-3 text-sm border border-admin-border rounded-lg bg-admin-bg text-admin-text focus:outline-none focus:border-brand-blue"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-admin-muted font-medium">ເຫດຜົນ / ລາຍລະອຽດ *</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="ເຊັ່ນ: ຄ່າຂົນສົ່ງເຄື່ອງຕີກັບ, ຄ່າສ້ອມແປງ..."
                        className="w-full h-9 px-3 text-sm border border-admin-border rounded-lg bg-admin-bg text-admin-text focus:outline-none focus:border-brand-blue"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-admin-muted font-medium">ໝາຍເຫດ (ຖ້າມີ)</label>
                    <input
                        type="text"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="ຂໍ້ມູນເພີ່ມເຕີມ..."
                        className="w-full h-9 px-3 text-sm border border-admin-border rounded-lg bg-admin-bg text-admin-text focus:outline-none focus:border-brand-blue"
                    />
                </div>

                <button
                    onClick={handleAdd}
                    disabled={isCreating}
                    className="flex items-center gap-2 h-9 px-5 bg-brand-blue hover:bg-brand-blue/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                    <Plus className="size-4" />
                    {isCreating ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກລາຍຈ່າຍ"}
                </button>
            </div>

            {/* Expense list */}
            <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-admin-border">
                    <h2 className="text-sm font-semibold text-admin-text">ປະຫວັດລາຍຈ່າຍ</h2>
                </div>

                {isLoading ? (
                    <div className="px-5 py-8 text-center text-sm text-admin-muted">ກຳລັງໂຫລດ...</div>
                ) : expenses.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-admin-muted">ຍັງບໍ່ມີລາຍຈ່າຍ</div>
                ) : (
                    <div className="divide-y divide-admin-border">
                        {expenses.map(exp => (
                            <div key={exp.expense_id} className="px-5 py-3.5 flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-admin-text truncate">{exp.reason}</p>
                                    {exp.note && (
                                        <p className="text-xs text-admin-muted mt-0.5 truncate">{exp.note}</p>
                                    )}
                                    <p className="text-xs text-admin-muted mt-0.5">{formatDate(exp.expense_date)}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-sm font-semibold text-red-500">
                                        -{formatCurrency(exp.amount)}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(exp.expense_id)}
                                        className="text-admin-muted hover:text-red-500 transition-colors"
                                        title="ລຶບ"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
