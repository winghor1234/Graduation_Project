import axiosInstance from "@/lib/axiosInstance"

export type Expense = {
    expense_id: string
    amount: number
    reason: string
    note: string | null
    expense_date: string
    createdAt: string
}

export type CreateExpensePayload = {
    amount: number
    reason: string
    note?: string
    expense_date?: string
}

export const expenseApi = {
    getAll: async (): Promise<Expense[]> => {
        const res = await axiosInstance.get("/expense")
        return res.data.data
    },

    create: async (payload: CreateExpensePayload): Promise<Expense> => {
        const res = await axiosInstance.post("/expense", payload)
        return res.data.data
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/expense/${id}`)
    },
}
