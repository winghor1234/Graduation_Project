import { settingController } from "@/modules/setting/setting.controller"
import { NextRequest } from "next/server"

export async function GET() {
    return settingController.getAll()
}

export async function PATCH(req: NextRequest) {
    return settingController.update(req)
}
