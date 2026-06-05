import axiosInstance from "@/lib/axiosInstance"
import { CreateDeliveryInput, Delivery, UpdateDeliveryInput } from "@/modules/delivery/delivery.type"
import { UseGetParams } from "../types"

export const DeliveryApi = {

    getAll: async (params?: UseGetParams): Promise<{
        data: Delivery[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/delivery", {
            params
        })

        return res.data.data
    },

    getById: async (id: string): Promise<Delivery> => {
        const res = await axiosInstance.get(`/delivery/${id}`)
        return res.data.data
    },

    create: async (data: CreateDeliveryInput): Promise<Delivery> => {
        const res = await axiosInstance.post("/delivery", data)
        return res.data.data
    },

    update: async (
        id: string,
        data: UpdateDeliveryInput
    ) => {
        const res = await axiosInstance.put(
            `/delivery/${id}`,
            data
        )
        return res.data.data
    }
}
