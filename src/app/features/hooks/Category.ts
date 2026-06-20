"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UseGetParams } from "../types"
import { UpdateCategoryInput } from "@/modules/category/category.type"
import { categoryApi } from "../api/Category"

export const useGetCategories = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => categoryApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetAllCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: categoryApi.getAlls,
        placeholderData: keepPreviousData,
    })
}

export const useGetCategory = (id: string) => {
    return useQuery({
        queryKey: ["category", id],
        queryFn: () => categoryApi.getOne(id),
    })
}

export const useCreateCategory = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: categoryApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] })
        },
    })
}

export const useUpdateCategory = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data, }: { id: string, data: UpdateCategoryInput }) => categoryApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] })
        },
    })
}

export const useDeleteCategory = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => categoryApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] })
        },
    })
}
