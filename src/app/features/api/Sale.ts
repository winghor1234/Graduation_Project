import axiosInstance from "@/lib/axiosInstance"
import { CreateSaleInput, Sale } from "@/modules/sale/sale.type"
import { UseGetParams } from "../types"

export const saleApi = {

    // getAll: async (): Promise<Sale[]> => {
    //   const res = await axiosInstance.get("/sale")
    //   return res.data.data
    // },
    getAll: async (params?: UseGetParams): Promise<{
        data: Sale[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/sale", {
            params
        })

        return res.data.data
    },

    getById: async (id: string): Promise<Sale> => {
        const res = await axiosInstance.get(`/sale/${id}`)
        return res.data.data
    },

    create: async (data: CreateSaleInput): Promise<Sale> => {
        const res = await axiosInstance.post("/sale", data)
        return res.data.data
    },

    // delete: async (id: string): Promise<void> => {
    //   await axiosInstance.delete(`/sales/${id}`)
    // }
}
