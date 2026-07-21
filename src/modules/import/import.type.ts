import { ImportStatus }   from "@prisma/client"
import { Employee }       from "@/modules/employee/employee.type"
import { Product, ProductVariant } from "@/modules/product/product.types"
import { PurchaseOrder } from "@/components/adminComponent/purchase/PurchaseType"

// ─── ImportDetail ──────────────────────────────────────────

export type ImportDetail = {
    import_detail_id: string
    quantity:         number
    cost_price:       number
    import_id:        string
    product_id:       string
    variant_id:       string         // ✅ Schema ຮຽກຮ້ອງ
    product?:         Product
    variant?:         ProductVariant // ✅ ເພີ່ມ
    createdAt:        string
    updatedAt:        string
}

// ─── Import ────────────────────────────────────────────────

export type Import = {
    import_id:       string
    import_code:     string          // ✅ required — auto-gen ໂດຍ server
    status:          ImportStatus    // ✅ enum: PENDING | COMPLETED | CANCELLED
    import_date:     string          // ✅ string (JSON serialize Date)
    purchase_id:     string
    employee_id:     string
    purchase?:       PurchaseOrder
    employee?:       Employee
    import_details?: ImportDetail[]
    createdAt:       string
    updatedAt:       string
}

// ─── Inputs ────────────────────────────────────────────────

export type CreateImportDetailInput = {
    product_id: string
    variant_id: string  // ✅ ຕ້ອງມີ — Schema ຮຽກຮ້ອງ
    quantity:   number
    cost_price: number
    // ❌ product_code ລຶບ — ບໍ່ມີໃນ Schema
}

export type CreateImportInput = {
    purchase_id:     string
    import_details:  CreateImportDetailInput[]
    // ❌ import_code ລຶບ — auto-gen ໂດຍ server
    // ❌ employee_id ລຶບ — ດຶງຈາກ token
    // ❌ import_date ລຶບ — server ໃຊ້ now()
}

export type UpdateImportInput = Partial<CreateImportInput>

// ✅ ຢືນຢັນນຳເຂົ້າ ພ້ອມແກ້ໄຂຈຳນວນທີ່ໄດ້ຮັບຕົວຈິງ (ຖ້າຕ່າງຈາກຕອນສ້າງ)
export type ConfirmImportDetailInput = {
    import_detail_id: string
    quantity:         number
}

export type ConfirmImportInput = {
    import_details?: ConfirmImportDetailInput[]
}