"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UseGetParams } from "../types"
import { productApi } from "../api/Product"

export const useGetProducts = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => productApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetAllProducts = () => {
    return useQuery({
        queryKey: ["product"],
        queryFn: productApi.getAlls,
        placeholderData: keepPreviousData,
    })
}

export const useGetProduct = (id: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => productApi.getOne(id),
        placeholderData: keepPreviousData,
    })
}

export const useCreateProduct = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: productApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] })
        },
    })
}

export const useUpdateProduct = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => productApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] })
        },
    })
}

export const useDeleteProduct = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: productApi.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] })
        },
    })
}
