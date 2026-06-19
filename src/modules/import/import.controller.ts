import { importService } from "./import.service"
import { prisma } from "@/lib/prisma"
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import {  successResponse } from "@/utils/response"
import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { CreateImportInput } from "./import.type"
import { getUserFromToken } from "@/utils/cookie"
import { handleError } from "@/utils/handleError"
export const importController = {

    async getImports(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.ImportWhereInput = search
                ? {
                    OR: [
                        {
                            purchase: {
                                supplier: {
                                    supplier_name: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                }
                            },
                        },
                        {
                            import_code: {
                                contains: search,
                                mode: "insensitive"
                            }
                        }
                    ],
                }
                : {}
            const [imports, total] = await Promise.all([
                importService.getImports({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.import.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: imports, meta }, "Get imports successfully", 200)
        } catch (error) {
            return handleError(error)
        }

    },

    async getImport(id: string) {
        try {
            const record = await importService.getImport(id)
            return successResponse(record, "Get import successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async createImport(req: NextRequest) {
        try {
            const body: CreateImportInput = await req.json()
            const payload = getUserFromToken(req)
            const employeeId = (await payload).id
            const record = await importService.createImport(body, employeeId)
            return successResponse(record, "Create import successfully", 201)
        } catch (error) {
             return handleError(error)
        }
    },



    async confirmImport(id: string) {
        try {
            const result = await importService.confirmImport(id)
            return successResponse(result, "Import confirmed", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async cancelImport(id: string) {
        try {
            const result = await importService.cancelImport(id)
            return successResponse(result, "Import cancelled", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async deleteImport(id: string) {
        try {
            await importService.deleteImport(id)
            return successResponse(null, "Import deleted", 200)
        } catch (error) {
            return handleError(error)
        }
    }

}