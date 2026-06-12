
import { Employee } from "../employee/employee.type"
import { Product } from "../product/product.types"
import { Supplier } from "../supplier/supplier.type"


export type PurchaseDetail = {
  purchase_detail_id: string
  quantity: number
  price: number
  received_qty: number
  product_id: string
  purchase_id: string
  product?: Product
}

export type PurchaseOrder = {
  purchase_id: string
  purchase_code: string
  purchase_date: string
  total_amount?: number
  status: string
  payment_status: string
  paid_amount: number


  supplier_id: string
  employee_id: string

  supplier?: Supplier
  employee?: Employee

  purchase_details?: PurchaseDetail[]

  createdAt: string
  updatedAt: string
}

export type CreatePurchaseDetailInput = {
  product_id: string
  quantity: number
  price: number
}

export type CreatePurchaseOrderInput = {
  supplier_id: string
  purchase_code?: string
  employee_id?: string
  purchase_date?: Date
  purchase_details: CreatePurchaseDetailInput[]
}


export type UpdatePurchaseOrderInput = {
  supplier_id?: string
  employee_id?: string
  purchase_date?: Date
  purchase_details?: CreatePurchaseDetailInput[]
}