import { prisma } from "@/lib/prisma"

export type CreateExpenseInput = {
    amount: number
    reason: string
    note?: string
    expense_date?: string
}

export const expenseService = {
    async getAll() {
        return prisma.expense.findMany({
            orderBy: { expense_date: "desc" },
        })
    },

    async create(data: CreateExpenseInput) {
        return prisma.expense.create({
            data: {
                amount: data.amount,
                reason: data.reason,
                note: data.note,
                expense_date: data.expense_date ? new Date(data.expense_date) : new Date(),
            },
        })
    },

    async delete(expense_id: string) {
        return prisma.expense.delete({ where: { expense_id } })
    },
}
