import { reportController } from "@/modules/report/report.controller";
import { ReportQueryDto } from "@/modules/report/report.type";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const query: ReportQueryDto = {
        reportType: searchParams.get("reportType") as any,
        period: searchParams.get("period") as any,
        startDate: searchParams.get("startDate") ?? undefined,
        endDate: searchParams.get("endDate") ?? undefined,
    };

    return reportController.Report(query);
}