import { exportReportController } from "@/modules/report/report.controller";
import { ReportPeriod, ReportQueryDto, ReportType } from "@/modules/report/report.type";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query: ReportQueryDto = {
        reportType: searchParams.get("reportType") as ReportType,
        period: searchParams.get("period") as ReportPeriod,
        startDate: searchParams.get("startDate") ?? undefined,
        endDate: searchParams.get("endDate") ?? undefined,
    };

    return exportReportController.ExportReport(query);
}