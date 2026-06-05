"use client"
import { VerifyPaymentInput } from "@/modules/payment/payment.type"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { paymentApi } from "../api/Payment"
import { UseGetParams } from "../types"

export const useGetPayment = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["payments", params],
        queryFn: () => paymentApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}


export const useGetPaymentById = (id: string) => {
    return useQuery({
        queryKey: ["payment", id],
        queryFn: () => paymentApi.getById(id),
        enabled: !!id
    })
}


export const useCreatePayment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: paymentApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payments"] })
        }
    })
}



export const useVerifyPayment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: VerifyPaymentInput
        }) =>
            paymentApi.verifyPayment(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payments"] })
        }
    })
}


