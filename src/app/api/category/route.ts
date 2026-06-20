
import { categoryController } from "@/modules/category/category.controller"
import { NextRequest } from "next/server"

// export async function GET(req: NextRequest) {
//   return categoryController.getCategories(req)
// }
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // 1. ดึง Query Params ที่คิดว่าจะใช้ตรวจสอบออกมาดูตรงๆ
  const search = searchParams.get("search");
  const page = searchParams.get("page");

  // 2. เช็คเงื่อนไข: ถ้ามีการส่งฟิลเตอร์ ค้นหา หรือจำกัดหน้าเพจเข้ามา
  if ( search || page) {
    // ส่ง req ไปให้ getProducts จัดการแกะ params ด้านในต่อ
    return categoryController.getCategories(req);
  }
  return categoryController.getAllCategories(req);
}

export async function POST(req: Request) {
  return categoryController.createCategory(req)
}
