import { productController } from "@/modules/product/product.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // 1. ดึง Query Params ที่คิดว่าจะใช้ตรวจสอบออกมาดูตรงๆ
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = searchParams.get("page");

  // 2. เช็คเงื่อนไข: ถ้ามีการส่งฟิลเตอร์ ค้นหา หรือจำกัดหน้าเพจเข้ามา
  if (category || search || page) {
    // ส่ง req ไปให้ getProducts จัดการแกะ params ด้านในต่อ
    return productController.getProducts(req);
  } 
  
  // 3. ถ้ามาแบบ URL เปล่าๆ ไม่มีเงื่อนไขอะไรเลย ให้ดึงทั้งหมด
  // (เอา req ออกหาก getAllProducts ใน Controller ของคุณไม่ได้ประกาศรับไว้)
  return productController.getAllProducts(req); 
}

export async function POST(req: NextRequest) {
  return productController.createProduct(req);
}