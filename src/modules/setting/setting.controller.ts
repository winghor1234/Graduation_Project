import { NextRequest } from "next/server"
import { settingService } from "./setting.service"
import { errorResponse, successResponse } from "@/utils/response"

export const settingController = {

    async getAll() {
        try {
            const settings = await settingService.getAll()
            return successResponse(settings, "OK", 200)
        } catch (e) {
            console.error(e)
            return errorResponse("Internal Server Error", 500)
        }
    },

    async update(req: NextRequest) {
        try {
            const body = await req.json() as { key: string; value: string }
            if (!body.key || body.value === undefined) {
                return errorResponse("key and value are required", 400)
            }
            const updated = await settingService.set(body.key, String(body.value))
            return successResponse(updated, "Setting updated", 200)
        } catch (e) {
            console.error(e)
            return errorResponse("Internal Server Error", 500)
        }
    },
}
