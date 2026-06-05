import axiosInstance from "@/lib/axiosInstance"
import { Order, UpdateOrderStatusInput } from "@/modules/order/order.types"
import { UseGetParams } from "../types"

export const orderApi = {

    // getAll: async (): Promise<Order[]> => {
    //   const res = await axiosInstance.get("/order")
    //   return res.data.data
    // },

    getAll: async (params?: UseGetParams): Promise<{
        data: Order[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/order", {
            params
        })

        return res.data.data
    },

    getById: async (id: string): Promise<Order> => {
        const res = await axiosInstance.get(`/order/${id}`)
        return res.data.data
    },

    // create: async (data: OrderInput): Promise<Order> => {
    //   const res = await axiosInstance.post("/order", data)
    //   return res.data.data
    // },
    create: async (data: FormData): Promise<Order> => {
        const res = await axiosInstance.post("/order", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data.data.data
    },

    updateStatus: async (
        id: string,
        data: UpdateOrderStatusInput
    ): Promise<Order> => {
        const res = await axiosInstance.put(`/order/${id}`, data)
        return res.data.data
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/order/${id}`)
    }
}
