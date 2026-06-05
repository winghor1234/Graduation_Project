

// export const useGetDistrictsByProvince = (provinceId: string) => {
//     return useQuery({
//         queryKey: ["districts", provinceId],
//         queryFn: () => locationApi.getDistrictsByProvince(provinceId),
//         placeholderData: keepPreviousData,
//     })
// }
"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { locationApi } from "../api/Location"
import { CreateBranchInput, CreateDistrictInput, CreateProvinceInput, updateBranchInput, updateDistrictInput, updateProvinceInput } from "@/modules/location/location.type"
import { UseGetParams } from "../types"

// export const useGetBranchesByDistrict = (districtId: string) => {
//     return useQuery({
//         queryKey: ["branches", districtId],
//         queryFn: () => locationApi.getBranchesByDistrict(districtId),
//         placeholderData: keepPreviousData,
//     })
// }


// ----------------------------------------- Province start ---------------------------------------------------


export const useGetProvinces = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["provinces", params],
        queryFn: () => locationApi.getProvinces(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetProvince = (id: string) => {
    return useQuery({
        queryKey: ["province", id],
        queryFn: () => locationApi.getProvince(id),
        enabled: !!id
    })
}

export const useCreateProvince = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateProvinceInput) => locationApi.createProvince(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["provinces"] })
        }
    })
}


export const useUpdateProvince = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: updateProvinceInput
        }) => locationApi.updateProvince(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["provinces"] })
        }
    })
}


export const useDeleteProvince = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => locationApi.deleteProvince(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["provinces"] })
        },
        onError: () => {
            qc.invalidateQueries({ queryKey: ["provinces"] })
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["provinces"] })
        }
    }
    )
}


// ----------------------------------------- Province end ---------------------------------------------------


// ----------------------------------------- District start ---------------------------------------------------


export const useGetDistricts = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["districts", params],
        queryFn: () => locationApi.getDistricts(params),
        placeholderData: keepPreviousData,
    })
}

export const useGetDistrict = (id: string) => {
    return useQuery({
        queryKey: ["district", id],
        queryFn: () => locationApi.getDistrict(id),
        enabled: !!id
    })
}

export const useCreateDistrict = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateDistrictInput) => locationApi.createDistrict(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["districts"] })
        }
    })
}


export const useUpdateDistrict = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: updateDistrictInput
        }) => locationApi.updateDistrict(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["districts"] })
        }
    })
}


export const useDeleteDistrict = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => locationApi.deleteDistrict(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["districts"] })
        },
        onError: () => {
            qc.invalidateQueries({ queryKey: ["districts"] })
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["districts"] })
        }
    })

}
// ----------------------------------------- District end ---------------------------------------------------


// ----------------------------------------- Branch start ---------------------------------------------------

export const useGetBranches = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["branches", params],
        queryFn: () => locationApi.getBranches(params),
        placeholderData: keepPreviousData,
    })
}


export const useGetBranch = (id: string) => {
    return useQuery({
        queryKey: ["branch", id],
        queryFn: () => locationApi.getBranch(id),
        enabled: !!id
    })
}


export const useCreateBranch = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateBranchInput) => locationApi.createBranch(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["branches"] })
        }
    })
}



export const useUpdateBranch = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: updateBranchInput
        }) => locationApi.updateBranch(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["branches"] })
        }
    })
}


export const useDeleteBranch = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => locationApi.deleteBranch(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["branches"] })
        },
        onError: () => {
            qc.invalidateQueries({ queryKey: ["branches"] })
        }, onSettled: () => {
            qc.invalidateQueries({ queryKey: ["branches"] })
        }
    }
    )


    // ----------------------------------------- Branch end ---------------------------------------------------



}
