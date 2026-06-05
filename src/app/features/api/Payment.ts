import axiosInstance from "@/lib/axiosInstance"
import { Payment, VerifyPaymentInput } from "@/modules/payment/payment.type"
import { UseGetParams } from "../types"


export const paymentApi = {

    // getAll: async (): Promise<Export[]> => {
    //   const res = await axiosInstance.get("/export")
    //   return res.data.data
    // },

    getAll: async (params?: UseGetParams): Promise<{
        data: Payment[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/payment", {
            params
        })

        return res.data.data
    },

    getById: async (id: string): Promise<Payment> => {
        const res = await axiosInstance.get(`/payment/${id}`)
        return res.data.data
    },

    // create: async (data: CreatePaymentInput): Promise<Payment> => {
    //   const res = await axiosInstance.post("/payment", FormData)
    //   return res.data.data
    // },
    create: async (data: FormData): Promise<Payment> => {
        const res = await axiosInstance.post("/payment", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data.data.data
    },

    verifyPayment: async (id: string, data: VerifyPaymentInput): Promise<Payment> => {
        const res = await axiosInstance.patch(`/payment/${id}`, data)
        return res.data.data
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/payment/${id}`)
    }

}

