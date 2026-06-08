


export type Supplier = {
    supplier_id: string
    supplier_name: string
    phone: string
    address?: string

    createdAt: string
    updatedAt: string
}

export type CreateSupplierInput = {
    supplier_name: string
    phone: string
    address?: string
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>