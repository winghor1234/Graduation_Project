import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"
import { NextRequest } from "next/server"
import { locationService } from "./location.service"
import { getPaginationMeta, getPaginationParams } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export const locationController = {

    async getProvinces(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.ProvinceWhereInput = search
                ? {
                    province_name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
                : {}
            const [provinces, total] = await Promise.all([
                locationService.getProvinces({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.province.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: provinces, meta }, "Get provinces successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async getAllProvinces(req: NextRequest) {
        try {
            const provinces = await locationService.getAllProvinces()
            return successResponse(provinces, "Get all provinces successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }

        }
    },

    async getDistricts(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.DistrictWhereInput = search
                ? {
                    district_name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
                : {}
            const [districts, total] = await Promise.all([
                locationService.getDistricts({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.district.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: districts, meta }, "Get districts successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },


    async getBranches(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.BranchWhereInput = search
                ? {
                    branch_name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
                : {}
            const [branches, total] = await Promise.all([
                locationService.getBranches({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.branch.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: branches, meta }, "Get branches successfully", 200)
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }

    },


    // async getDistrictByProvince(req: NextRequest) {
    //     try {
    //         const { page, limit, skip } = getPaginationParams(req)
    //         const search = getSearchParam(req)
    //         const orderBy = getSortingParams(req)
    //         const where: Prisma.DistrictWhereInput = search
    //             ? {
    //                 district_name: {
    //                     contains: search,
    //                     mode: "insensitive"
    //                 }
    //             }
    //             : {}
    //         const [districts, total] = await Promise.all([
    //             locationService.getDistrictByProvince({
    //                 where,
    //                 skip,
    //                 take: limit,
    //                 orderBy
    //             }),
    //             prisma.district.count({ where })
    //         ])
    //         const meta = getPaginationMeta(total, page, limit)
    //         return successResponse({ data: districts, meta }, "Get districts successfully", 200)
    //     } catch (error) {
    //         console.log(error)
    //         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
    //             return errorResponse(error.message, error.statusCode);
    //         }
    //         return errorResponse("Internal Server Error", 500)
    //     }
    // },


    // async getBranchByDistrict(req: NextRequest) {
    //     try {
    //         const { page, limit, skip } = getPaginationParams(req)
    //         const search = getSearchParam(req)
    //         const orderBy = getSortingParams(req)
    //         const where: Prisma.BranchWhereInput = search
    //             ? {
    //                 branch_name: {
    //                     contains: search,
    //                     mode: "insensitive"
    //                 }
    //             }
    //             : {}
    //         const [branches, total] = await Promise.all([
    //             locationService.getBranchByDistrict({
    //                 where,
    //                 skip,
    //                 take: limit,
    //                 orderBy
    //             }),
    //             prisma.branch.count({ where })
    //         ])
    //         const meta = getPaginationMeta(total, page, limit)
    //         return successResponse({ data: branches, meta }, "Get branches successfully", 200)
    //     } catch (error) {
    //         console.log(error)
    //         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
    //             return errorResponse(error.message, error.statusCode);
    //         }
    //         return errorResponse("Internal Server Error", 500)
    //     }

    // },


    async getProvince(id: string) {
        try {
            const province = await locationService.getProvince(id)
            return successResponse(province, "Get province successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async getDistrict(id: string) {
        try {
            const district = await locationService.getDistrict(id)
            return successResponse(district, "Get district successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async getBranch(id: string) {
        try {
            const branch = await locationService.getBranch(id)
            return successResponse(branch, "Get branch successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },




    async createProvince(req: NextRequest) {
        try {
            const body = await req.json()
            const province = await locationService.createProvince(body)
            return successResponse(province, "Province created successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async createDistrict(req: NextRequest) {
        try {
            const body = await req.json()
            const district = await locationService.createDistrict(body)
            return successResponse(district, "District created successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async createBranch(req: NextRequest) {
        try {
            const body = await req.json()
            const branch = await locationService.createBranch(body)
            return successResponse(branch, "Branch created successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);

            }
            return errorResponse("Internal Server Error", 500)
        }
    },




    async deleteProvince(id: string) {
        try {
            const province = await locationService.deleteProvince(id)
            return successResponse(province, "Province deleted successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async deleteDistrict(id: string) {
        try {
            const district = await locationService.deleteDistrict(id)
            return successResponse(district, "District deleted successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },

    async deleteBranch(id: string) {
        try {
            const branch = await locationService.deleteBranch(id)
            return successResponse(branch, "Branch deleted successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },





    async updateProvince(req: NextRequest, id: string) {
        try {
            const body = await req.json()
            const province = await locationService.updateProvince(id, body)
            return successResponse(province, "Province updated successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },


    async updateDistrict(req: NextRequest, id: string) {
        try {
            const body = await req.json()
            const district = await locationService.updateDistrict(id, body)
            return successResponse(district, "District updated successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },


    async updateBranch(req: NextRequest, id: string) {
        try {
            const body = await req.json()
            const branch = await locationService.updateBranch(id, body)
            return successResponse(branch, "Branch updated successfully")
        } catch (error) {
            console.log(error)
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500)
        }
    },
}