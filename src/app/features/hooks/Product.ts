"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UseGetParams } from "../types"
import { productApi } from "../api/Product"
import { ProductListFilters } from "@/modules/product/product.service"

export const useGetProducts = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => productApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

// export const useGetAllProducts = () => {
//     return useQuery({
//         queryKey: ["product"],
//         queryFn: productApi.getAlls,
//         placeholderData: keepPreviousData,
//     })
// }

// export const useGetProduct = (id: string) => {
//     return useQuery({
//         queryKey: ["product", id],
//         queryFn: () => productApi.getOne(id),
//         placeholderData: keepPreviousData,
//     })
// }

export const useGetAllProducts = (filters: ProductListFilters = {}) => {
    return useQuery({
        queryKey: ["product", filters], // ✅ filters ຕ້ອງຢູ່ໃນ queryKey ບໍ່ດັ່ງນັ້ນຈະບໍ່ refetch ເມື່ອປ່ຽນ filter
        queryFn: () => productApi.getAlls(filters),
        placeholderData: keepPreviousData,
    })
}
 
export const useGetPriceRange = () => {
    return useQuery({
        queryKey: ["product", "price-range"],
        queryFn: productApi.getPriceRange,
        staleTime: 5 * 60 * 1000, // 5 ນາທີ — ບໍ່ປ່ຽນເລື້ອຍ, ບໍ່ຕ້ອງ fetch ໃໝ່ທຸກຄັ້ງ
    })
}

export const useGetAvailableColors = () => {
    return useQuery({
        queryKey: ["product", "colors"],
        queryFn: productApi.getAvailableColors,
        staleTime: 5 * 60 * 1000,
    })
}

export const useGetBestSellers = (limit?: number) => {
    return useQuery({
        queryKey: ["product", "bestsellers", limit],
        queryFn: () => productApi.getBestSellers(limit),
        staleTime: 60 * 1000,
    })
}
 

export function useGetProduct(id: string) {
    return useQuery({
        queryKey: ["product", id],
        queryFn:  () => productApi.getOne(id),
        enabled:  !!id,   // ✅ ບໍ່ fetch ຖ้າ id ຍັງບໍ່ມາ
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



export const useDeleteImage = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: productApi.deleteImage,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["image"] })
        },
    })
}