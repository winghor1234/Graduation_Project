"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationApi } from "../api/Notification"

export const useGetNotifications = (options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey:        ["notifications"],
        queryFn:         notificationApi.getAll,
        enabled:         options?.enabled ?? true,
        refetchInterval: 60_000,
        staleTime:       20_000,
        retry:           false,
    })
}

export const useNotificationStream = (enabled: boolean) => {
    const qc = useQueryClient()
    useEffect(() => {
        if (!enabled) return
        const url = `${process.env.NEXT_PUBLIC_API_URL}/notification/stream`
        const es = new EventSource(url, { withCredentials: true })
        es.onmessage = () => {
            qc.invalidateQueries({ queryKey: ["notifications"] })
        }
        return () => es.close()
    }, [enabled, qc])
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
