
import { dashboardController } from "@/modules/dashboard/dashboard.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return dashboardController.dashboardReport()
}