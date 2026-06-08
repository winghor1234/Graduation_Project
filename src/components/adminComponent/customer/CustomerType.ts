export type Customers = {
    customer_id: string
    customer_name: string
    email: string
    phone: string
    gender?: string
    address?: string
    role: "CUSTOMER"
    isActive: boolean
    point: number
    lastLogin?: string

    createdAt: string
    updatedAt: string
}