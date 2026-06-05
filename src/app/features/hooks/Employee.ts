"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateEmployeeInput, UpdateEmployeeInput } from "@/modules/employee/employee.type"
import { employeeApi } from "../api/Employee"



export const useGetEmployee = () => {
    return useQuery({
        queryKey: ["employee"],
        queryFn: employeeApi.getAll,
    })
}

export const useCreateAdmin = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateEmployeeInput) =>
            employeeApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin"] })
        },
    })
}

export const useUpdateEmployee = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data, }: { id: string, data: UpdateEmployeeInput }) => employeeApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["employee"] })
        },
    })
}

// export const useDeleteEmployee = () => {
//     const qc = useQueryClient()

//     return useMutation({
//         mutationFn: (id: string) => employeeApi.delete(id),
//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["employees"] })
//         },
//     })
// }


