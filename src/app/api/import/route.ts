
import { importController } from "@/modules/import/import.controller"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    return importController.getImports(req)
}

export async function POST(req: NextRequest) {
    return importController.createImport(req)
}