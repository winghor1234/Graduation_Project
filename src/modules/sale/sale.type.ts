import { Customer } from "../customer/customer.type"
import { Employee } from "../employee/employee.type"
import { Product, ProductVariant } from "../product/product.types"

export type SaleDetail = {
    sale_detail_id: string
    quantity: number
    price: number

    sale_id: string
    product_id: string
    variant_id: string

    product?: Product
    variant?: ProductVariant

    createdAt: string
    updatedAt: string
}

export type Sale = {
    sale_id: string
    sale_date: string
    total_amount: number | null

    employee_id: string
    customer_id: string | null

    employee?: Employee
    customer?: Customer

    sale_details?: SaleDetail[]

    createdAt: string
    updatedAt: string
}

// ❗ ບໍ່ມີ price — ລາຄາຕ້ອງດຶງຈາກ ProductVariant.sale_price ໃນ server ເທົ່ານັ້ນ
// ❗ ບໍ່ມີ product_id — server ຈະ derive ເອົາຈາກ variant_id (variant.product_id)
export type CreateSaleDetailInput = {
    variant_id: string
    quantity: number
}

export type CreateSaleInput = {
    employee_id?: string
    customer_id?: string
    sale_details: CreateSaleDetailInput[]
}