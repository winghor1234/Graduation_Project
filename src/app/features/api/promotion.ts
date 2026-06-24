// import axiosInstance from "@/lib/axiosInstance"
// import { UseGetParams } from "../types"
// import { Promotion } from "@/modules/promotion/promotion.types"

// export const promotionApi = {
//     getAll: async (params?: UseGetParams): Promise<Promotion[]> => {
//         const res = await axiosInstance.get("/promotion", { params })
//         return res.data.data
//     },

//     getAllActive: async (params?: UseGetParams): Promise<Promotion[]> => {
//         const res = await axiosInstance.get("/promotion/active", { params })
//         return res.data.data
//     },

//     getOne: async (id: string): Promise<Promotion> => {
//         const res = await axiosInstance.get(`/promotion/${id}`)
//         return res.data.data
//     },

//     create: async (data: Promotion): Promise<Promotion> => {
//         const res = await axiosInstance.post("/promotion", data)
//         return res.data.data
//     },

//     update: async (id: string, data: Promotion): Promise<Promotion> => {
//         const res = await axiosInstance.put(`/promotion/${id}`, data)
//         return res.data.data
//     },

//     delete: async (id: string): Promise<Promotion> => {
//         const res = await axiosInstance.delete(`/promotion/${id}`)
//         return res.data.data
//     },
//     toggleStatus: async (id: string): Promise<Promotion> => {
//         const res = await axiosInstance.patch(`/promotion/toggle-status/${id}`)
//         return res.data.data
//     },

//     getByCode: async (code: string): Promise<Promotion> => {
//         const res = await axiosInstance.get(`/promotion/code/${code}`)
//         return res.data.data
//     },

// }

import axiosInstance from "@/lib/axiosInstance"
import {  Promotion,  CreatePromotionInput,  UpdatePromotionInput,} from "@/modules/promotion/promotion.types"
import { UseGetParams } from "../types"

export const promotionApi = {

    getAll: async (params?: UseGetParams): Promise<{
        data: Promotion[]
        meta: { total: number; page: number; limit: number; totalPages: number }
    }> => {
        const res = await axiosInstance.get("/promotion", { params })
        return res.data.data
    },

    // ✅ ສະເພາະ ACTIVE ທີ່ຢູ່ໃນຊ່ວງເວລາ — ສຳລັບ customer side
    getAllActive: async (): Promise<Promotion[]> => {
        const res = await axiosInstance.get("/promotion/active")
        return res.data.data
    },

    getOne: async (id: string): Promise<Promotion> => {
        const res = await axiosInstance.get(`/promotion/${id}`)
        return res.data.data
    },

    // ✅ ໃຊ້ query string: GET /promotion/code?code=PROMO123
    getByCode: async (code: string): Promise<Promotion> => {
        const res = await axiosInstance.get("/promotion/code", { params: { code } })
        return res.data.data
    },

    create: async (data: CreatePromotionInput): Promise<Promotion> => {
        const res = await axiosInstance.post("/promotion", data)
        return res.data.data
    },

    update: async (id: string, data: UpdatePromotionInput): Promise<Promotion> => {
        const res = await axiosInstance.put(`/promotion/${id}`, data)
        return res.data.data
    },

    toggleStatus: async (id: string): Promise<Promotion> => {
        const res = await axiosInstance.patch(`/promotion/${id}/toggle`)
        return res.data.data
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/promotion/${id}`)
    },
}