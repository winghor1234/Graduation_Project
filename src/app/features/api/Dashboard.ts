import axiosInstance from "@/lib/axiosInstance"


export const dashboardApi = {
  getDashboard: async () => {
    const res = await axiosInstance.get("/dashboard")
    return res.data
  }
}