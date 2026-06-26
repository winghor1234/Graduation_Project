"use client"
import { CreateDeliveryInput, UpdateDeliveryInput } from "@/modules/delivery/delivery.type"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DeliveryApi } from "../api/Delivery"
import { UseGetParams } from "../types"

export const useGetDeliveries = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["deliveries", params],
        queryFn: () => DeliveryApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}


export const useGetDelivery = (id: string) => {
    return useQuery({
        queryKey: ["delivery", id],
        queryFn: () => DeliveryApi.getById(id),
        enabled: !!id
    })
}


export const useCreateDelivery = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateDeliveryInput) => DeliveryApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["deliveries"] })
        }
    })
}



export const useUpdateDelivery = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: UpdateDeliveryInput
        }) => DeliveryApi.update(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["deliveries"] })
            qc.invalidateQueries({ queryKey: ["orders"] })
        }
    })
}
