import axiosInstance from "@/lib/axiosInstance"
import { Order, CreateOrderInput, CreateOrderResult, UpdateOrderStatusInput } from "@/modules/order/order.type"
import { UseGetParams } from "../types"

export const orderApi = {

    getAll: async (params?: UseGetParams): Promise<{
        data: Order[]
        meta: {
            total:      number
            page:       number
            limit:      number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/order", { params })
        return res.data.data
    },

    getAlls: async (): Promise<Order[]> => {
        const res = await axiosInstance.get("/order")
        return res.data.data   // ✅ ແກ້ — ກົງກັບ successResponse wrapper
    },

    getById: async (id: string): Promise<Order> => {
        const res = await axiosInstance.get(`/order/${id}`)
        return res.data.data
    },

    create: async (data: FormData): Promise<CreateOrderResult> => {
        const res = await axiosInstance.post("/order", data)
        // ✅ ບໍ່ set headers ມືອດ – axios ຈະ auto-detect FormData ແລະ set boundary ເອງ
        return res.data.data   // ✅ ແກ້ — ລຶບ .data ຊ້ຳອອກ
    },

    updateStatus: async (
        id:   string,
        data: UpdateOrderStatusInput
    ): Promise<Order> => {
        const res = await axiosInstance.patch(`/order/${id}`, data)
        return res.data.data
    },

    // ✅ ໃໝ່ — ອັບໂຫຼດ/re-upload ສະລິບແຍກອອກຈາກ create
    uploadPaymentSlip: async (formData: FormData): Promise<Order> => {
        const orderId = formData.get("order_id") as string
        const res = await axiosInstance.patch(`/order/${orderId}/payment-slip`, formData)
        return res.data.data
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/order/${id}`)
    },
}