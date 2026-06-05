"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { purchaseApi } from "../api/Purchase"
import { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from "@/modules/purchase/purchase.type"
import { UseGetParams } from "../types"

export const useGetPurchaseOrders = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["purchase", params],
        queryFn: () => purchaseApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetPurchaseOrder = (id: string) => {
    return useQuery({
        queryKey: ["purchase", id],
        queryFn: () => purchaseApi.getById(id),
        enabled: !!id
    })
}

export const useCreatePurchaseOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreatePurchaseOrderInput) =>
            purchaseApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["purchase"] })
        }
    })
}

export const useUpdatePurchaseOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: UpdatePurchaseOrderInput
        }) => purchaseApi.update(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["purchase"] })
        }
    })
}

export const useDeletePurchaseOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => purchaseApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["purchase"] })
        }
    })
}


