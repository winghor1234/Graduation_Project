
// import { PurchaseOrderStatus } from "@prisma/client"
// import { Employee } from "../employee/employee.type"
// import { Product } from "../product/product.types"
// import { Supplier } from "../supplier/supplier.type"


// export type PurchaseDetail = {
//   purchase_detail_id: string
//   quantity: number
//   price: number
//   received_qty: number
//   product_id: string
//   purchase_id: string
//   product?: Product
// }

// export type PurchaseOrder = {
//   purchase_id: string
//   purchase_code: string
//   purchase_date: string
//   total_amount?: number
//   status: string
//   payment_status: string
//   paid_amount: number
//   import?: string


//   supplier_id: string
//   employee_id: string

//   supplier?: Supplier
//   employee?: Employee

//   purchase_details?: PurchaseDetail[]

//   createdAt: string
//   updatedAt: string
// }

// export type CreatePurchaseDetailInput = {
//   product_id: string
//   quantity: number
//   price: number
// }

// export type CreatePurchaseOrderInput = {
//   supplier_id: string
//   purchase_code?: string
//   employee_id?: string
//   purchase_date?: Date
//   purchase_details: CreatePurchaseDetailInput[]
// }


// export type UpdatePurchaseOrderInput = {
//   supplier_id?: string
//   employee_id?: string
//   purchase_date?: Date
//   purchase_details?: CreatePurchaseDetailInput[]
// }


// export type CreatePurchasePaymentInput = {
//     amount: number;   // จำนวนเงินที่จ่าย
//     note?: string;
// };

// export type PurchasePaymentSummary = {
//     purchase_id:     string;
//     purchase_code:   string;
//     ordered_total:   number;   // ราคาตามที่สั่ง  (quantity * price)
//     actual_total:    number;   // ราคาตามรับจริง (received_qty * price)
//     paid_amount:     number;
//     remaining:       number;
//     payment_status:  PurchaseOrderStatus;
//     items: {
//         product_id:    string;
//         ordered_qty:   number;
//         received_qty:  number;
//         price:         number;
//         ordered_cost:  number;
//         received_cost: number;
//     }[];
// };

import { PurchasePaymentStatus } from "@prisma/client"

export type PurchaseDetailInput = {
  product_id: string
  variant_id: string  
  quantity: number
  price: number
}

export type CreatePurchaseOrderInput = {
  supplier_id: string
  purchase_details: PurchaseDetailInput[]
}

export type UpdatePurchaseOrderInput = {
  supplier_id: string
  purchase_details: PurchaseDetailInput[]
}

export type PurchasePaymentSummary = {
  purchase_id: string
  purchase_code: string
  ordered_total: number
  actual_total: number
  paid_amount: number
  remaining: number
  payment_status: PurchasePaymentStatus // ✅ enum ຖືກ
  items: {
    product_id: string
    ordered_qty: number
    received_qty: number
    price: number
    ordered_cost: number
    received_cost: number
  }[]
}