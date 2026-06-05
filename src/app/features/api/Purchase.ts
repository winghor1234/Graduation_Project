import { CreatePurchaseOrderInput, PurchaseOrder, UpdatePurchaseOrderInput } from "@/modules/purchase/purchase.type"
import { UseGetParams } from "../types"
import axiosInstance from "@/lib/axiosInstance"

export const purchaseApi = {

    // getAlls: async (): Promise<PurchaseOrder[]> => {
    //   const res = await axiosInstance.get("/purchase-orders")
    //   return res.data.data.data
    // },

    getAll: async (params?: UseGetParams): Promise<{
        data: PurchaseOrder[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/purchase", {
            params
        })
        return res.data.data
    },

    getById: async (id: string): Promise<PurchaseOrder> => {
        const res = await axiosInstance.get(`/purchase/${id}`)
        return res.data.data.data
    },

    create: async (data: CreatePurchaseOrderInput): Promise<PurchaseOrder> => {
        const res = await axiosInstance.post("/purchase", data)
        return res.data.data.data
    },

    update: async (
        id: string,
        data: UpdatePurchaseOrderInput
    ): Promise<PurchaseOrder> => {
        const res = await axiosInstance.put(`/purchase/${id}`, data)
        return res.data.data.data
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/purchase/${id}`)
    }
}
