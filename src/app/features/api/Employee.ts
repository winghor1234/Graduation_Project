import axiosInstance from "@/lib/axiosInstance"
import { CreateEmployeeInput, Employee, UpdateEmployeeInput } from "@/modules/employee/employee.type"

export const employeeApi = {

    getAll: async (): Promise<Employee[]> => {
        const res = await axiosInstance.get("/employee")
        return res.data.data.data
    },

    getById: async (id: string): Promise<Employee> => {
        const res = await axiosInstance.get(`/employee/${id}`)
        return res.data.data.data
    },

    create: async (data: CreateEmployeeInput): Promise<Employee> => {
        const res = await axiosInstance.post("/employee", data)
        return res.data.data.data
    },

    update: async (
        id: string,
        data: UpdateEmployeeInput
    ): Promise<Employee> => {
        const res = await axiosInstance.put(`/employee/${id}`, data)
        return res.data.data.data
    },

    // delete: async (id: string): Promise<void> => {
    //   await axiosInstance.delete(`/employees/${id}`)
    // },
    updateStatus: async (id: string) => {
        const res = await axiosInstance.patch(`/employee/${id}`)
        return res.data.data
    }
}
