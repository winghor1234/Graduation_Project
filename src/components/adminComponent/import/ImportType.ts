import { Employee } from "@/modules/employee/employee.type"
import { PurchaseOrder } from "../purchase/PurchaseType"
import { Product } from "../products/ProductType"


export type ImportDetail = {
    import_detail_id: string
    quantity: number
    cost_price: number
    import_id: string
    product_id: string
    product?: Product
    createdAt?: string
    updatedAt?: string
}

export type Import = {
    import_id: string
    import_code?: string
    import_date: Date
    purchase_id: string
    employee_id?: string
    purchase?: PurchaseOrder
    employee?: Employee
    import_details?: ImportDetail[]
    createdAt?: string
    updatedAt?: string
}


