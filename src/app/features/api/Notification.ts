import axiosInstance from "@/lib/axiosInstance"

export type Notification = {
    notification_id: string
    customer_id: string
    title: string
    message: string
    is_read: boolean
    order_id: string | null
    createdAt: string
}

export const notificationApi = {
    getAll: async (): Promise<{ data: Notification[]; unread: number }> => {
        const res = await axiosInstance.get("/notification")
        return res.data
    },

    markRead: async (id: string): Promise<void> => {
        await axiosInstance.patch(`/notification/${id}`)
    },

    markAllRead: async (): Promise<void> => {
        await axiosInstance.patch("/notification")
    },
}
