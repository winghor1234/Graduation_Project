"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UseGetParams } from "../types"
import { CreateCustomerInput, UpdateCustomerInput } from "@/modules/customer/customer.type"
import { customerApi } from "../api/Customer"


export const useGetCustomers = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["customers", params],
        queryFn: () => customerApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetCustomer = (id: string) => {
    return useQuery({
        queryKey: ["customer", id],
        queryFn: () => customerApi.getOne(id),
    })
}

export const useCreateCustomer = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateCustomerInput) =>
            customerApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["customers"] })
        },
    })
}

export const useUpdateCustomer = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCustomerInput }) =>
            customerApi.update(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["customers"] })
        },
    })
}

// export const useDeleteCustomer = () => {
//     const qc = useQueryClient()

//     return useMutation({
//         mutationFn: (id: string) => customerApi.delete(id),

//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["customers"] })
//         },
//     })
// }

export const useUpdateCustomerStatus = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => customerApi.updateStatus(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["customers"] })
        }
    })

}

