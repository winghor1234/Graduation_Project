import { reportController } from "@/modules/report/report.controller";
import { NextRequest } from "next/server";
export async function GET(req: NextRequest) {
    return reportController.Report()
}