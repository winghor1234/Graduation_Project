import axiosInstance from "@/lib/axiosInstance"
import { CreateRefundInput, Refund } from "@/modules/refund/refund.type"
import { UseGetParams } from "../types"

export const refundApi = {

    // getAll: async (): Promise<Refund[]> => {
    //   const res = await axiosInstance.get("/refund")
    //   return res.data.data
    // },
    getAll: async (params?: UseGetParams): Promise<{
        data: Refund[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/refund", {
            params
        })

        return res.data.data
    },


    getById: async (id: string): Promise<Refund> => {
        const res = await axiosInstance.get(`/refund/${id}`)
        return res.data.data
    },

    create: async (data: CreateRefundInput): Promise<Refund> => {
        const res = await axiosInstance.post("/refund", data)
        return res.data.data
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/refund/${id}`)
    }
}

