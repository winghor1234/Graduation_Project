

// export const useGetRefunds = () => {
//     return useQuery({
//         queryKey: ["refunds"],
//         queryFn: refundApi.getAll
//     })
// }
"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UseGetParams } from "../types"
import { refundApi } from "../api/Refund"
import { CreateRefundInput } from "@/modules/refund/refund.type"

export const useGetRefunds = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["refunds", params],
        queryFn: () => refundApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetRefund = (id: string) => {
    return useQuery({
        queryKey: ["refund", id],
        queryFn: () => refundApi.getById(id),
        enabled: !!id
    })
}

export const useCreateRefund = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateRefundInput) =>
            refundApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["refunds"] })
            qc.invalidateQueries({ queryKey: ["sales"] })
            qc.invalidateQueries({ queryKey: ["products"] })
        }
    })
}

export const useDeleteRefund = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => refundApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["refunds"] })
        }
    })
}