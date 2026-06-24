import axiosInstance from "@/lib/axiosInstance"
import { UseGetParams } from "../types"
import { Promotion } from "@/modules/promotion/promotion.types"

export const promotionApi = {
    getAll: async (params?: UseGetParams): Promise<Promotion[]> => {
        const res = await axiosInstance.get("/promotion", { params })
        return res.data.data
    },

    getAllActive: async (params?: UseGetParams): Promise<Promotion[]> => {
        const res = await axiosInstance.get("/promotion/active", { params })
        return res.data.data
    },

    getOne: async (id: string): Promise<Promotion> => {
        const res = await axiosInstance.get(`/promotion/${id}`)
        return res.data.data
    },

    create: async (data: Promotion): Promise<Promotion> => {
        const res = await axiosInstance.post("/promotion", data)
        return res.data.data
    },

    update: async (id: string, data: Promotion): Promise<Promotion> => {
        const res = await axiosInstance.put(`/promotion/${id}`, data)
        return res.data.data
    },

    delete: async (id: string): Promise<Promotion> => {
        const res = await axiosInstance.delete(`/promotion/${id}`)
        return res.data.data
    },
    toggleStatus: async (id: string): Promise<Promotion> => {
        const res = await axiosInstance.patch(`/promotion/toggle-status/${id}`)
        return res.data.data
    },

    getByCode: async (code: string): Promise<Promotion> => {
        const res = await axiosInstance.get(`/promotion/code/${code}`)
        return res.data.data
    },

}