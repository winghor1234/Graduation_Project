"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateEmployeeInput, UpdateEmployeeInput } from "@/modules/employee/employee.type"
import { UseGetParams } from "../types"
import { employeeApi } from "../api/Employee"

export const useGetEmployees = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["employees", params],
        queryFn: () => employeeApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useCreateEmployee = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateEmployeeInput) => employeeApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
    })
}

export const useUpdateEmployee = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeInput }) =>
            employeeApi.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
    })
}

export const useUpdateEmployeeStatus = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => employeeApi.updateStatus(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
    })
}