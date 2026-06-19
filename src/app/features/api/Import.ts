import axiosInstance from "@/lib/axiosInstance"
import { CreateImportInput, Import } from "@/modules/import/import.type"
import { UseGetParams } from "../types"

export const importApi = {

    // getAll: async (): Promise<Import[]> => {
    //   const res = await axiosInstance.get("/import")
    //   return res.data.data
    // },

    getAll: async (params?: UseGetParams): Promise<{
        data: Import[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/import", {
            params
        })

        return res.data.data
    },

    getById: async (id: string): Promise<Import> => {
        const res = await axiosInstance.get(`/import/${id}`)
        return res.data.data
    },

    create: async (data: CreateImportInput): Promise<Import> => {
        const res = await axiosInstance.post("/import", data)
        return res.data.data.data
    },
    cancel: async (id: string): Promise<void> => {
        await axiosInstance.put(`/import/cancel/${id}`)
    },
    confirm: async (id: string): Promise<void> => {
        await axiosInstance.put(`/import/confirm/${id}`)
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/import/${id}`)
    }
}

