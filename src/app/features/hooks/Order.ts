
// export const useGetOrders = () => {
//     return useQuery({
//         queryKey: ["orders"],
//         queryFn: orderApi.getAll
//     })
"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { orderApi } from "../api/Order"
import { UpdateOrderStatusInput } from "@/modules/order/order.types"
import { UseGetParams } from "../types"

// }
export const useGetOrders = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["orders", params],
        queryFn: () => orderApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetAllOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: orderApi.getAlls,
        placeholderData: keepPreviousData,
    })
}

export const useGetOrder = (id: string) => {
    return useQuery({
        queryKey: ["order", id],
        queryFn: () => orderApi.getById(id),
        enabled: !!id
    })
}

export const useCreateOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: orderApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] })
        }
    })
}

export const useUpdateOrderStatus = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: UpdateOrderStatusInput
        }) => orderApi.updateStatus(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] })
        }
    })
}

export const useDeleteOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => orderApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] })
        }
    })
}

