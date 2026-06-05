import axiosInstance from "@/lib/axiosInstance"
import { CreateCustomerInput, Customer, UpdateCustomerInput } from "@/modules/customer/customer.type"
import { UseGetParams } from "../types"

export const customerApi = {
    getAll: async (params?: UseGetParams): Promise<{
        data: Customer[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/customer", {
            params
        })

        return res.data.data
    },

    getOne: async (id: string): Promise<Customer> => {
        const res = await axiosInstance.get(`/customer/${id}`)
        return res.data.data.data
    },

    create: async (data: CreateCustomerInput): Promise<Customer> => {
        const res = await axiosInstance.post("/customer", data)
        return res.data.data.data
    },

    update: async (id: string, data: UpdateCustomerInput): Promise<Customer> => {
        const res = await axiosInstance.put(`/customer/${id}`, data)
        return res.data.data.data
    },

    // delete: async (id: string): Promise<void> => {
    //   await axiosInstance.delete(`/customers/${id}`)
    // },

    updateStatus: async (id: string) => {
        const res = await axiosInstance.patch(`/customer/${id}`)
        return res.data.data
    }
}

