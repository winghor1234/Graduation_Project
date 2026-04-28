import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"
import { dashboardService } from "./dashboard.service"

export const dashboardController = {
    async dashboardReport() {
        try {
            const data = await dashboardService.getDashboardData()
            return successResponse(data, "Get dashboard report successfully", 200)
        } catch (error) {
            console.log(error)

            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode)
            }
            return errorResponse("Internal Server Error", 500)
        }
    }

}