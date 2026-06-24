
// export const useGetSales = () => {
//     return useQuery({
//         queryKey: ["sales"],
//         queryFn: saleApi.getAll
//     })
// }
"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UseGetParams } from "../types"
import { saleApi } from "../api/Sale"
import { CreateSaleInput } from "@/modules/sale/sale.type"


export const useGetSales = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["sales", params],
        queryFn: () => saleApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}
export const useGetSale = (id: string) => {
    return useQuery({
        queryKey: ["sale", id],
        queryFn: () => saleApi.getById(id),
        enabled: !!id
    })
}

export const useCreateSale = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateSaleInput) =>
            saleApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["sales"] })
            qc.invalidateQueries({ queryKey: ["products"] })
        }
    })
}

// export const useDeleteSale = () => {
//     const qc = useQueryClient()

//     return useMutation({
//         mutationFn: (id: string) => saleApi.delete(id),

//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["sales"] })
//         }
//     })
// }

