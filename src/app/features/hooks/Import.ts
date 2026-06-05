"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { importApi } from "../api/Import"
import { CreateImportInput } from "@/modules/import/import.type"
import { UseGetParams } from "../types"


export const useGetImports = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["imports", params],
        queryFn: () => importApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useCreateImport = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateImportInput) =>
            importApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["imports"] })
            qc.invalidateQueries({ queryKey: ["products"] })
        }
    })
}


export const useDeleteImport = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => importApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["imports"] })
        }
    })
}