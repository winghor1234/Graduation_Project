"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { settingApi } from "../api/Setting"

export const useGetSettings = () => {
    return useQuery({
        queryKey: ["settings"],
        queryFn:  settingApi.getAll,
        staleTime: 1000 * 60 * 5,
    })
}

export const useShippingCost = (fallback = 20000): number => {
    const { data } = useGetSettings()
    const raw = data?.shipping_cost
    const parsed = raw ? parseInt(raw, 10) : NaN
    return isNaN(parsed) ? fallback : parsed
}

export const useUpdateSetting = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: settingApi.update,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["settings"] })
        },
    })
}
