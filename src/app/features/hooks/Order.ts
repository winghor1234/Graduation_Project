"use client"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { orderApi } from "../api/Order"
import { UpdateOrderStatusInput } from "@/modules/order/order.type"
import { UseGetParams } from "../types"

// ─── Queries ───────────────────────────────────────────────

export const useGetOrders = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["orders", params],
        queryFn:  () => orderApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetPendingOrderCount = (options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["orders-pending-count"],
        queryFn:  async () => {
            const res = await orderApi.getAll({ status: "WAITING_PAYMENT", page: 1, limit: 1 })
            return res.meta.total
        },
        enabled:         options?.enabled ?? true,
        retry:           false,
        refetchInterval: 30_000,
        staleTime:       20_000,
    })
}

// ✅ ໃໝ່ — badge ແຈ້ງເຕືອນ admin: ອໍເດີ້ ARRIVED ເກີນ 1 ມື້ ແຕ່ຍັງບໍ່ COMPLETED
export const useGetOverdueArrivedCount = (options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["orders-overdue-arrived-count"],
        queryFn:  orderApi.getOverdueArrivedCount,
        enabled:         options?.enabled ?? true,
        retry:           false,
        refetchInterval: 30_000,
        staleTime:       20_000,
    })
}

export const useGetAllOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn:  orderApi.getAlls,
        placeholderData: keepPreviousData,
    })
}

export const useGetOrder = (id: string) => {
    return useQuery({
        // ✅ ໃຊ້ namespace ດຽວກັນ "orders" — ໃຫ້ invalidateQueries(["orders"]) ກວາດໝົດ
        queryKey: ["orders", id],
        queryFn:  () => orderApi.getById(id),
        enabled:  !!id,
    })
}

// ─── Mutations ─────────────────────────────────────────────

export const useCreateOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: orderApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] })
        },
    })
}

export const useUpdateOrderStatus = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusInput }) =>
            orderApi.updateStatus(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] })
        },
    })
}

// ✅ ໃໝ່ — ແຍກອອກຈາກ useCreateOrder
export const useUploadPaymentSlip = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (formData: FormData) => orderApi.uploadPaymentSlip(formData),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] })
        },
    })
}

export const useDeleteOrder = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => orderApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] })
        },
    })
}