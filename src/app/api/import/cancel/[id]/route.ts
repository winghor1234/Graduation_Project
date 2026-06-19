
import { importController } from "@/modules/import/import.controller"
import { NextRequest } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return importController.cancelImport(id)

}
