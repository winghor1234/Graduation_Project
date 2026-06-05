import { CreateSupplierInput, Supplier, UpdateSupplierInput } from "@/modules/supplier/supplier.type"
import { UseGetParams } from "../types"
import axiosInstance from "@/lib/axiosInstance"

export const supplierApi = {

    // getAll: async (): Promise<Supplier[]> => {
    //   const res = await axiosInstance.get("/suppliers")
    //   return res.data.data.data
    // },

    getAll: async (params?: UseGetParams): Promise<{
        data: Supplier[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/supplier", {
            params
        })
        return res.data.data
    },

    getById: async (id: string): Promise<Supplier> => {
        const res = await axiosInstance.get(`/supplier/${id}`)
        return res.data.data.data
    },

    create: async (data: CreateSupplierInput): Promise<Supplier> => {
        const res = await axiosInstance.post("/supplier", data)
        return res.data.data.data
    },

    update: async (
        id: string,
        data: UpdateSupplierInput
    ): Promise<Supplier> => {
        const res = await axiosInstance.put(`/supplier/${id}`, data)
        return res.data.data.data
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/supplier/${id}`)
    }
}