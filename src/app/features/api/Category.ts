import axiosInstance from "@/lib/axiosInstance"
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/modules/category/category.type"
import { UseGetParams } from "../types"

export const categoryApi = {
    
    getAll: async (params?: UseGetParams): Promise<{
        data: Category[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/category", {
            params
        })
        return res.data.data
    },
      getAlls: async (): Promise<Category[]> => {
        const res = await axiosInstance.get("/category")
        return res.data.data
      },

    getOne: async (id: string): Promise<Category> => {
        const res = await axiosInstance.get(`/category/${id}`)
        return res.data.data.data
    },

    create: async (data: CreateCategoryInput): Promise<Category> => {
        const res = await axiosInstance.post("/category", data)
        return res.data.data.data
    },

    update: async (id: string, data: UpdateCategoryInput): Promise<Category> => {
        const res = await axiosInstance.put(`/category/${id}`, data)
        return res.data.data.data
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/category/${id}`)
    },
}