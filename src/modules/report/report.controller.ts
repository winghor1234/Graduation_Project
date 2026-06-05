// async productReport() {
//     try {
//         const data = await reportService.getProductReport()
//         return successResponse(data, "Get product report successfully", 200)
//     } catch (error) {
//         console.log(error)
//         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//             return errorResponse(error.message, error.statusCode);
//         }
//         return errorResponse("Internal Server Error", 500)
//     }
// },

// async purchaseReport() {
//     try {
//         const data = await reportService.getPurchaseReport()
//         return successResponse(data, "Get purchase report successfully", 200)
//     } catch (error) {
//         console.log(error)
//         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//             return errorResponse(error.message, error.statusCode);
//         }
//         return errorResponse("Internal Server Error", 500)
//     }
// },

// async importReport() {
//     try {
//         const data = await reportService.getImportReport()
//         return successResponse(data, "Get import report successfully", 200)
//     } catch (error) {
//         console.log(error)
//         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//             return errorResponse(error.message, error.statusCode);
//         }
//         return errorResponse("Internal Server Error", 500)
//     }
// },

// async customerReport() {
//     try {
//         const data = await reportService.getCustomerReport()
//         return successResponse(data, "Get customer report successfully", 200)
//     } catch (error) {
//         console.log(error)
//         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//             return errorResponse(error.message, error.statusCode);
//         }
//         return errorResponse("Internal Server Error", 500)
//     }
// },

// async salesQuantityReport() {
//     try {
//         const data = await reportService.getSalesQuantityReport()
//         return successResponse(data, "Get sales quantity report successfully", 200)
//     } catch (error) {
//         console.log(error)
//         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//             return errorResponse(error.message, error.statusCode);
//         }
//         return errorResponse("Internal Server Error", 500)
//     }
// },

// async revenueReport() {
//     try {
//         const data = await reportService.getRevenueReport()
//         return successResponse(data, "Get revenue report successfully", 200)
//     } catch (error) {
//         console.log(error)
//         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//             return errorResponse(error.message, error.statusCode);
//         }
//         return errorResponse("Internal Server Error", 500)
//     }
// },

// async topProductsReport() {
//     try {
//         const data = await reportService.getTopSellingProducts()
//         return successResponse(data, "Get top products report successfully", 200)
//     } catch (error) {
//         console.log(error)
//         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//             return errorResponse(error.message, error.statusCode);
//         }
//         return errorResponse("Internal Server Error", 500)
//     }
// },

// async lowStockReport() {
//     try {
//         const data = await reportService.getLowStockProducts()
//         return successResponse(data, "Get low stock report successfully", 200)
//     } catch (error) {
//         console.log(error)
//         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//             return errorResponse(error.message, error.statusCode);
//         }
//         return errorResponse("Internal Server Error", 500)
//     }
// },
// async monthlyRevenueReport() {
//     try {
//         const data = await reportService.getMonthlyRevenue()
//         return successResponse(data, "Get monthly revenue report successfully", 200)
//     } catch (error) {
//         console.log(error)
//         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//             return errorResponse(error.message, error.statusCode);
//         }
//         return errorResponse("Internal Server Error", 500)
//     }
// },
// async dashboardReport() {
//     try {
//         const data = await reportService.getDashboardSummary()
//         return successResponse(data, "Get dashboard report successfully", 200)
//     } catch (error) {
//         console.log(error)
//         if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
//             return errorResponse(error.message, error.statusCode);
//         }

//     }

// }




// import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response"

// export const reportController = {
//     async Report() {
//         try {
//             const data = await reportService.getReport()

//             return successResponse(
//                 data,
//                 "Get full dashboard report successfully",
//                 200
//             )
//         } catch (error) {
//             console.log(error)

//             if (
//                 error instanceof BadRequestError ||
//                 error instanceof NotFoundError ||
//                 error instanceof ForbiddenError ||
//                 error instanceof UnauthorizedError
//             ) {
//                 return errorResponse(error.message, error.statusCode)
//             }

//             return errorResponse("Internal Server Error", 500)
//         }
//     }



// }

import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, successResponse, UnauthorizedError } from "@/utils/response";
import { ReportQueryDto } from "./report.type";
import { ReportService } from "./report.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const exportreportService = new ReportService(prisma);

export const exportReportController = {
    async ExportReport(query: ReportQueryDto) {
        try {
            const data = await exportreportService.getExportReport(query);
            return successResponse(data, "Get export report successfully", 200);
        } catch (error) {
            console.log(error);
            if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof UnauthorizedError) {
                return errorResponse(error.message, error.statusCode);
            }
            return errorResponse("Internal Server Error", 500);
        }
    }
};