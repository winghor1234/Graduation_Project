
// export const useGetSales = () => {
//     return useQuery({
//         queryKey: ["sales"],
//         queryFn: saleApi.getAll
//     })
// }
// "use client"
// import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import { UseGetParams } from "../types"
// import { saleApi } from "../api/Sale"
// import { CreateSaleInput } from "@/modules/sale/sale.type"


// export const useGetSales = (params?: UseGetParams) => {
//     return useQuery({
//         queryKey: ["sales", params],
//         queryFn: () => saleApi.getAll(params),
//         placeholderData: keepPreviousData,
//     })
// }
// export const useGetSale = (id: string) => {
//     return useQuery({
//         queryKey: ["sale", id],
//         queryFn: () => saleApi.getById(id),
//         enabled: !!id
//     })
// }

// export const useCreateSale = () => {
//     const qc = useQueryClient()

//     return useMutation({
//         mutationFn: (data: CreateSaleInput) =>
//             saleApi.create(data),

//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["sales"] })
//             qc.invalidateQueries({ queryKey: ["products"] })
//         }
//     })
// }

// export const useDeleteSale = () => {
//     const qc = useQueryClient()

//     return useMutation({
//         mutationFn: (id: string) => saleApi.delete(id),

//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["sales"] })
//         }
//     })
// }


"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UseGetParams } from "../types"

export const useGetRefunds = (params?: UseGetParams) =>
    useQuery({ queryKey: ["refunds", params], queryFn: () => refundApi.getAll(params), placeholderData: keepPreviousData })

export const useGetRefund = (id: string) =>
    useQuery({ queryKey: ["refunds", id], queryFn: () => refundApi.getById(id), enabled: !!id })

export const useCreateRefund = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: refundApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["refunds"] })
            qc.invalidateQueries({ queryKey: ["sales"] })   // ✅ update sale list ດ້ວຍ
        }
    })
}

export const useDeleteRefund = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => refundApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["refunds"] })
            qc.invalidateQueries({ queryKey: ["sales"] })
        }
    })
}