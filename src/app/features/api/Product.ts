import { Product } from "@/modules/product/product.types"
import { UseGetParams } from "../types"
import axiosInstance from "@/lib/axiosInstance"
import { ProductListFilters } from "@/modules/product/product.service"

export type ProductListResponse = {
    items: Product[] // ✏️ Product type ຄວນເພີ່ມ min_price / max_price / total_stock
    meta: {
        total: number
        page: number
        page_size: number
        total_pages: number
    }
}

export const productApi = {

    getAll: async (params?: UseGetParams): Promise<{
        data: Product[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/product", {
            params
        })
        return res.data.data
    },

    // getAlls: async (): Promise<Product[]> => {
    //     const res = await axiosInstance.get("/product")
    //     return res?.data?.data
    // },


    getAlls: async (filters?: ProductListFilters): Promise<ProductListResponse> => {
        const res = await axiosInstance.get("/product", { params: filters })
        return res?.data?.data
    },

    getPriceRange: async (): Promise<{ min: number; max: number }> => {
        const res = await axiosInstance.get("/product/price-range")
        return res?.data?.data
    },



    getOne: async (id: string): Promise<Product> => {
        const res = await axiosInstance.get(`/product/${id}`)
        return res.data.data
    },

    create: async (data: FormData): Promise<Product> => {
        const res = await axiosInstance.post("/product", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data.data.data
    },

    update: async (id: string, data: FormData): Promise<Product> => {
        const res = await axiosInstance.put(`/product/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data.data.data
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/product/${id}`)
    },

    deleteImage: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/product/image/${id}`)
    },
}
