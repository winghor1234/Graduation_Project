import axiosInstance from "@/lib/axiosInstance"
import { CreateEmployeeInput, Employee, UpdateEmployeeInput } from "@/modules/employee/employee.type"
import { UseGetParams } from "../types"

export const employeeApi = {

    getAll: async (params?: UseGetParams): Promise<{
        data: Employee[]
        meta: { total: number; page: number; limit: number; totalPages: number }
    }> => {
        const res = await axiosInstance.get("/employee", { params })
        return res.data.data
    },

    getById: async (id: string): Promise<Employee> => {
        const res = await axiosInstance.get(`/employee/${id}`)
        return res.data.data
    },

    create: async (data: CreateEmployeeInput): Promise<Employee> => {
        const res = await axiosInstance.post("/employee", data)
        return res.data.data
    },

    update: async (id: string, data: UpdateEmployeeInput): Promise<Employee> => {
        const res = await axiosInstance.put(`/employee/${id}`, data)
        return res.data.data
    },

    updateStatus: async (id: string): Promise<Employee> => {
        const res = await axiosInstance.patch(`/employee/${id}`)
        return res.data.data
    },
}