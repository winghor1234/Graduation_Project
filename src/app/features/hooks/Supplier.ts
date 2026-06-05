"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UseGetParams } from "../types"
import { supplierApi } from "../api/Supplier"
import { CreateSupplierInput, UpdateSupplierInput } from "@/modules/supplier/supplier.type"



export const useGetSuppliers = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["suppliers", params],
        queryFn: () => supplierApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useCreateSupplier = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateSupplierInput) =>
            supplierApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["suppliers"] })
        }
    })
}

export const useUpdateSupplier = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: UpdateSupplierInput
        }) => supplierApi.update(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["suppliers"] })
        }
    })
}

export const useDeleteSupplier = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => supplierApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["suppliers"] })
        }
    })
}

