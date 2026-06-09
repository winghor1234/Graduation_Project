import axiosInstance from "@/lib/axiosInstance"
import { Branch, CreateBranchInput, CreateDistrictInput, CreateProvinceInput, District, Province, updateBranchInput, updateDistrictInput, updateProvinceInput } from "@/modules/location/location.type"
import { UseGetParams } from "../types"

export const locationApi = {

    // getDistrictsByProvince: async (provinceId: string): Promise<{
    //   data: District[]
    //   meta: {
    //     total: number
    //     page: number
    //     limit: number
    //     totalPages: number
    //   }
    // }> => {
    //   const res = await axiosInstance.get(`/district/${provinceId}`)
    //   return res.data.data
    // },

    // getBranchesByDistrict: async (districtId: string): Promise<{
    //   data: Branch[]
    //   meta: {
    //     total: number
    //     page: number
    //     limit: number
    //     totalPages: number
    //   }
    // }> => {
    //   const res = await axiosInstance.get(`/branch/${districtId}`)
    //   return res.data.data
    // },
    // ----------------------------------------- Province start ---------------------------------------------------
    getProvinces: async (params?: UseGetParams): Promise<{
        data: Province[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/location/province", {
            params
        })

        return res.data.data
    },

    getAllProvince: async (): Promise<Province[]> => {
        const res = await axiosInstance.get("/location/province")
        return res.data?.data
    },

    getProvince: async (id: string): Promise<Province> => {
        const res = await axiosInstance.get(`/location/province/${id}`)
        return res.data.data
    },

    createProvince: async (data: CreateProvinceInput): Promise<Province> => {
        const res = await axiosInstance.post("/location/province", data)
        return res.data.data
    },

    updateProvince: async (id: string, data: updateProvinceInput) => {
        const res = await axiosInstance.put(
            `/location/province/${id}`,
            data
        )
        return res.data.data
    },

    deleteProvince: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/location/province/${id}`)
    },

    // ----------------------------------------- Province end ---------------------------------------------------

    // ----------------------------------------- District start ---------------------------------------------------


    getDistricts: async (params?: UseGetParams): Promise<{
        data: District[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/location/district", {
            params
        })

        return res.data.data
    },

    getDistrict: async (id: string): Promise<District> => {
        const res = await axiosInstance.get(`/location/district/${id}`)
        return res.data.data
    },

    createDistrict: async (data: CreateDistrictInput): Promise<District> => {
        const res = await axiosInstance.post("/location/district", data)
        return res.data.data
    },

    updateDistrict: async (
        id: string,
        data: updateDistrictInput
    ) => {
        const res = await axiosInstance.put(
            `/location/district/${id}`,
            data
        )
        return res.data.data
    },

    deleteDistrict: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/location/district/${id}`)
    },

    // ----------------------------------------- District end ---------------------------------------------------



    // ----------------------------------------- Branch start ---------------------------------------------------


    getBranches: async (params?: UseGetParams): Promise<{
        data: Branch[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }> => {
        const res = await axiosInstance.get("/location/branch", {
            params
        })

        return res.data.data
    },

    getBranch: async (id: string): Promise<Branch> => {
        const res = await axiosInstance.get(`/location/branch/${id}`)
        return res.data.data
    },

    createBranch: async (data: CreateBranchInput): Promise<Branch> => {
        const res = await axiosInstance.post("/location/branch", data)
        return res.data.data
    },

    updateBranch: async (id: string, data: updateBranchInput) => {
        const res = await axiosInstance.put(
            `/location/branch/${id}`,
            data
        )
        return res.data.data
    },

    deleteBranch: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/location/branch/${id}`)
    },

}

