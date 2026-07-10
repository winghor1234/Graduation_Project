"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationApi } from "../api/Notification"

export const useGetNotifications = (options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey:        ["notifications"],
        queryFn:         notificationApi.getAll,
        enabled:         options?.enabled ?? true,
        refetchInterval: 30_000,
        staleTime:       20_000,
        retry:           false,
    })
}

export const useMarkNotificationRead = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => notificationApi.markRead(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
    })
}

export const useMarkAllNotificationsRead = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: notificationApi.markAllRead,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
    })
}
