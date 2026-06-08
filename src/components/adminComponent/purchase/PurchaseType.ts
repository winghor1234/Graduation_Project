import { Employee } from "../customer/EmployeeType"
import { Product } from "../products/ProductType"
import { Supplier } from "../supplier/SuppilerType"

export type PurchaseDetail = {
    purchase_detail_id: string
    quantity: number
    price: number
    received_qty: number
    product_id: string
    product_name: string
    product_code: string
    purchase_price: number
    purchase_id: string
    product?: Product
}

export type PurchaseOrder = {
    purchase_id: string
    purchase_code: string
    purchase_date: string
    total_amount?: number
    status: string

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
    product_name: string
    product_code: string
    product_price: number
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