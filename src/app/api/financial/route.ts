import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ReportService } from "@/modules/report/report.service";
import { ReportPeriod } from "@/modules/report/report.type";
import { errorResponse, successResponse } from "@/utils/response";

const prisma = new PrismaClient();
const reportService = new ReportService(prisma);

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") as ReportPeriod | null;
        const startDate = searchParams.get("startDate") ?? undefined;
        const endDate = searchParams.get("endDate") ?? undefined;

        const data = await reportService.getFinancialReport(
            period ?? undefined,
            startDate,
            endDate
        );

        return successResponse(data, "Get financial report successfully", 200);
    } catch (error) {
        console.error(error);
        return errorResponse("Internal Server Error", 500);
    }
}
