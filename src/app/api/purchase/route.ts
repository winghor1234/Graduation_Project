import { purchaseController } from "@/modules/purchase/purchase.controller"
import { NextRequest } from "next/server"

// export async function GET(req: NextRequest) {
//     return purchaseController.getPurchases(req)
// }

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    // 1. ดึง Query Params ที่คิดว่าจะใช้ตรวจสอบออกมาดูตรงๆ
    const search = searchParams.get("search");
    const page = searchParams.get("page");

    // 2. เช็คเงื่อนไข: ถ้ามีการส่งฟิลเตอร์ ค้นหา หรือจำกัดหน้าเพจเข้ามา
    if (search || page) {
        // ส่ง req ไปให้ getProducts จัดการแกะ params ด้านในต่อ
        return purchaseController.getPurchases(req);
    }

    // 3. ถ้ามาแบบ URL เปล่าๆ ไม่มีเงื่อนไขอะไรเลย ให้ดึงทั้งหมด
    // (เอา req ออกหาก getAllProducts ใน Controller ของคุณไม่ได้ประกาศรับไว้)
    return purchaseController.getAllPurchases(req);
}

export async function POST(req: NextRequest) {
    return purchaseController.createPurchase(req)
}