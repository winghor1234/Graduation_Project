"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { expenseApi, CreateExpensePayload } from "../api/Expense"

export const useGetExpenses = () => {
    return useQuery({
        queryKey: ["expenses"],
        queryFn: expenseApi.getAll,
        staleTime: 1000 * 60,
    })
}

export const useCreateExpense = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateExpensePayload) => expenseApi.create(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["expenses"] })
        },
    })
}

export const useDeleteExpense = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => expenseApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["expenses"] })
        },
    })
}
