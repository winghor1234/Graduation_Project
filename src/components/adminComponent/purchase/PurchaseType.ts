// import { Employee } from "@/modules/employee/employee.type"
// import { Product } from "../products/ProductType"
// import { Supplier } from "../supplier/SuppilerType"
// import { Import } from "@/modules/import/import.type"

// export type PurchaseDetail = {
//     purchase_detail_id: string
//     quantity: number
//     price: number
//     received_qty: number
//     product_id: string
//     product_name: string
//     product_code: string
//     purchase_price: number
//     purchase_id: string
//     product?: Product
// }

// export type PurchaseOrder = {
//     purchase_id: string
//     purchase_code: string
//     purchase_date: string
//     total_amount: number
//     status: string
//     import?: Import
//     paid_amount: number
//     payment_status: string

//     supplier_id: string
//     employee_id: string


//     supplier?: Supplier
//     employee?: Employee

//     purchase_details?: PurchaseDetail[]

//     createdAt: string
//     updatedAt: string
// }

// export type CreatePurchaseDetailInput = {
//     product_id: string
//     product_name: string
//     product_code: string
//     product_price: number
//     quantity: number
//     price: number
// }

// export type CreatePurchaseOrderInput = {
//     supplier_id: string
//     purchase_code?: string
//     employee_id?: string
//     purchase_date?: Date
//     purchase_details: CreatePurchaseDetailInput[]
// }


// export type UpdatePurchaseOrderInput = {
//     supplier_id?: string
//     employee_id?: string
//     purchase_date?: Date
//     purchase_details?: CreatePurchaseDetailInput[]
// }


import { PurchaseOrderStatus, PurchasePaymentStatus } from "@prisma/client"
import { Employee } from "@/modules/employee/employee.type"
import { Supplier } from "../supplier/SuppilerType"
import { Import } from "@/modules/import/import.type"
import { Product, ProductVariant } from "../products/ProductType"

// ─── Detail ────────────────────────────────────────────────

export type PurchaseDetail = {
    purchase_detail_id: string
    quantity: number
    price: number
    received_qty: number
    purchase_id: string
    product_id: string
    variant_id: string       // ✅ ຕ້ອງມີ — Schema ຮຽກຮ້ອງ
    product?: Product
    variant?: ProductVariant  // ✅ ເພີ່ມ
    createdAt: string
    updatedAt: string
}

// ─── PurchaseOrder ─────────────────────────────────────────

export type PurchaseOrder = {
    purchase_id: string
    purchase_code: string
    purchase_date: string
    total_amount: number | null    // Schema: Int? (optional)
    paid_amount: number
    status: PurchaseOrderStatus   // ✅ enum: PENDING | ORDERED | COMPLETED | CANCELLED
    payment_status: PurchasePaymentStatus // ✅ enum: UNPAID | PAID

    supplier_id: string
    employee_id: string

    supplier?: Supplier
    employee?: Employee
    import?: Import

    purchase_details?: PurchaseDetail[]

    createdAt: string
    updatedAt: string
}

// ─── Input: Detail ─────────────────────────────────────────

export type PurchaseDetailInput = {
    product_id: string
    variant_id: string  // ✅ ຕ້ອງມີ
    quantity: number
    price: number
}

// ─── Input: Create ─────────────────────────────────────────

export type CreatePurchaseOrderInput = {
    supplier_id: string
    purchase_details: PurchaseDetailInput[]
    // ❌ ລຶບ purchase_code, employee_id, purchase_date ອອກ
    // ✅ ສ້າງໂດຍ server: code=auto-gen, employee=from token, date=now()
}

// ─── Input: Update ─────────────────────────────────────────

export type UpdatePurchaseOrderInput = {
    supplier_id: string              // ✅ required ໃນ service validation
    purchase_details: PurchaseDetailInput[] // ✅ required — ບໍ່ optional
}

// ─── Payment Summary ───────────────────────────────────────

export type PurchasePaymentSummaryItem = {
    product_id: string
    ordered_qty: number
    received_qty: number
    price: number
    ordered_cost: number
    received_cost: number
}

export type PurchasePaymentSummary = {
    purchase_id: string
    purchase_code: string
    ordered_total: number
    actual_total: number
    paid_amount: number
    remaining: number
    payment_status: PurchasePaymentStatus
    items: PurchasePaymentSummaryItem[]
}