import axiosInstance from "@/lib/axiosInstance"

export const settingApi = {
    getAll: async (): Promise<Record<string, string>> => {
        const res = await axiosInstance.get("/setting")
        return res.data.data
    },

    update: async (payload: { key: string; value: string }) => {
        const res = await axiosInstance.patch("/setting", payload)
        return res.data
    },
}
