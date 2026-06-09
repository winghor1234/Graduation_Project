
import { locationController } from "@/modules/location/location.controller"
import { NextRequest } from "next/server"

// export async function GET(req: NextRequest) {
//     return locationController.getProvinces(req)
// }

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const page = searchParams.get("page");

    // 2. เช็คเงื่อนไข: ถ้ามีการส่งฟิลเตอร์ ค้นหา หรือจำกัดหน้าเพจเข้ามา
    if (search || page) {
        // ส่ง req ไปให้ getProducts จัดการแกะ params ด้านในต่อ
        return locationController.getProvinces(req)
    }
    
    // 3. ถ้ามาแบบ URL เปล่าๆ ไม่มีเงื่อนไขอะไรเลย ให้ดึงทั้งหมด
    // (เอา req ออกหาก getAllProducts ใน Controller ของคุณไม่ได้ประกาศรับไว้)
    return locationController.getAllProvinces(req)
}

export async function POST(req: NextRequest) {
    return locationController.createProvince(req)
}
