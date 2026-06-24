"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreatePromotionInput, UpdatePromotionInput } from "@/modules/promotion/promotion.types"
import { UseGetParams } from "../types"
import { promotionApi } from "../api/promotion"

export const useGetPromotions = (params?: UseGetParams) =>
    useQuery({ queryKey: ["promotions", params], queryFn: () => promotionApi.getAll(params), placeholderData: keepPreviousData })

export const useGetAllPromotions = () =>
    useQuery({ queryKey: ["promotions", id ], queryFn: promotionApi.getAllActive })

export const useGetPromotion = (id: string) =>
    useQuery({ queryKey: ["promotions", id], queryFn: () => promotionApi.getOne(id), enabled: !!id })

export const useGetPromotionByCode = () => {
    const qc = useQueryClient()
    return useMutation({ mutationFn: (code: string) => promotionApi.getByCode(code) })
}

export const useCreatePromotion = () => {
    const qc = useQueryClient()
    return useMutation({ mutationFn: promotionApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }) })
}

export const useUpdatePromotion = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePromotionInput }) => promotionApi.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] })
    })
}

export const useTogglePromotionStatus = () => {
    const qc = useQueryClient()
    return useMutation({ mutationFn: (id: string) => promotionApi.toggleStatus(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }) })
}

export const useDeletePromotion = () => {
    const qc = useQueryClient()
    return useMutation({ mutationFn: (id: string) => promotionApi.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }) })
}