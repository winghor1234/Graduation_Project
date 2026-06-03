import { ExportController } from "@/modules/exportPdfExcel/export.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    return ExportController.ProductTopPdf(req);
}